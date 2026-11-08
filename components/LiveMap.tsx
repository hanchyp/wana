"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import type { Map as MapLibreMap, Marker } from "maplibre-gl";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Supercluster from "supercluster";
import type { Incident } from "@/lib/incidents";
import { Icon } from "./Icon";

// Basemap vektor OpenStreetMap dari OpenFreeMap: gratis, tanpa API key.
const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";
export const INDONESIA_VIEW = { center: [118, -2.5] as [number, number], zoom: 4.2 };

type LngLat = [number, number];
type Padding = { top?: number; bottom?: number; left?: number; right?: number };

type Props = {
  center: LngLat;
  zoom: number;
  incidents?: Incident[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  /** Terbang ke kejadian terpilih saat berubah. */
  followSelected?: boolean;
  selectedZoom?: number;
  padding?: Padding;
  area?: { lon: number; lat: number; radiusKm: number };
  /** Peta di dalam halaman yang di-scroll: butuh Ctrl/dua jari untuk zoom. */
  cooperative?: boolean;
  controls?: "full" | "zoom" | "locate" | "none";
  controlsClassName?: string;
  onCenterChange?: (center: LngLat) => void;
  className?: string;
  children?: ReactNode;
};

type ClusterItem =
  | { kind: "point"; key: string; coords: LngLat; incident: Incident }
  | { kind: "cluster"; key: string; coords: LngLat; count: number; clusterId: number };

export function LiveMap({
  center,
  zoom,
  incidents = [],
  selectedId,
  onSelect,
  followSelected = false,
  selectedZoom = 7.5,
  padding,
  area,
  cooperative = false,
  controls = "none",
  controlsClassName = "absolute right-4 top-4",
  onCenterChange,
  className = "",
  children,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerLib = useRef<typeof Marker | null>(null);
  const markers = useRef(new Map<string, { marker: Marker; el: HTMLDivElement }>());
  const userMarker = useRef<Marker | null>(null);
  const onCenterChangeRef = useRef(onCenterChange);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [items, setItems] = useState<ClusterItem[]>([]);
  const [elements, setElements] = useState<Record<string, HTMLDivElement>>({});

  useEffect(() => {
    onCenterChangeRef.current = onCenterChange;
  }, [onCenterChange]);

  // Prop array dari server bisa berganti referensi tiap render; kunci berdasarkan id agar efek tidak berulang.
  const incidentsKey = incidents.map((i) => i.id).join(",");
  const incidentsRef = useRef(incidents);
  useEffect(() => {
    incidentsRef.current = incidents;
  }, [incidents]);

  const index = useMemo(() => {
    const sc = new Supercluster<{ id: string }>({ radius: 56, maxZoom: 8 });
    sc.load(
      incidents.map((i) => ({
        type: "Feature" as const,
        properties: { id: i.id },
        geometry: { type: "Point" as const, coordinates: [i.lon, i.lat] },
      })),
    );
    return sc;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incidentsKey]);

  const recompute = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const b = map.getBounds();
    const clusters = index.getClusters([b.getWest() - 5, b.getSouth() - 5, b.getEast() + 5, b.getNorth() + 5], Math.floor(map.getZoom()));
    setItems(
      clusters.map((c) => {
        const coords = c.geometry.coordinates as LngLat;
        if ("cluster" in c.properties && c.properties.cluster) {
          return { kind: "cluster", key: `c${c.properties.cluster_id}`, coords, count: c.properties.point_count, clusterId: c.properties.cluster_id };
        }
        const incident = incidentsRef.current.find((i) => i.id === (c.properties as { id: string }).id)!;
        return { kind: "point", key: incident.id, coords, incident };
      }),
    );
  }, [index]);

  // Inisialisasi peta sekali; maplibre hanya dimuat di browser.
  useEffect(() => {
    let cancelled = false;
    let map: MapLibreMap | undefined;
    const placed = markers.current;
    (async () => {
      const lib = await import("maplibre-gl");
      if (cancelled || !containerRef.current) return;
      // Worker disajikan dari public/ (disalin saat postinstall) karena bundler tidak menyertakannya.
      lib.setWorkerUrl("/maplibre-gl-worker.mjs");
      markerLib.current = lib.Marker;
      try {
        map = new lib.Map({
          container: containerRef.current,
          style: STYLE_URL,
          center,
          zoom,
          attributionControl: { compact: true },
          cooperativeGestures: cooperative,
          dragRotate: false,
          pitchWithRotate: false,
          minZoom: 3,
          maxZoom: 16,
        });
      } catch {
        setFailed(true);
        return;
      }
      map.touchZoomRotate.disableRotation();
      mapRef.current = map;
      map.on("style.load", () => applyHutanRiangTheme(map!));
      map.on("load", () => setReady(true));
      map.on("error", (e) => {
        if (!map?.loaded() && e.error?.message?.includes("Failed to fetch")) setFailed(true);
      });
      map.on("moveend", () => {
        const c = map!.getCenter();
        onCenterChangeRef.current?.([c.lng, c.lat]);
      });
    })();
    return () => {
      cancelled = true;
      placed.forEach(({ marker }) => marker.remove());
      placed.clear();
      map?.remove();
      mapRef.current = null;
    };
    // Pusat dan zoom awal sengaja hanya dipakai saat pembuatan.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hitung ulang cluster saat peta bergerak.
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    recompute();
    map.on("moveend", recompute);
    return () => {
      map.off("moveend", recompute);
    };
  }, [ready, recompute]);

  // Sinkronkan elemen marker maplibre dengan daftar item; isi elemen dirender lewat portal.
  useEffect(() => {
    const map = mapRef.current;
    const MarkerCls = markerLib.current;
    if (!ready || !map || !MarkerCls) return;
    const keep = new Set(items.map((i) => i.key));
    markers.current.forEach((m, key) => {
      if (!keep.has(key)) {
        m.marker.remove();
        markers.current.delete(key);
      }
    });
    for (const item of items) {
      const existing = markers.current.get(item.key);
      if (existing) {
        existing.marker.setLngLat(item.coords);
        continue;
      }
      const el = document.createElement("div");
      const marker = new MarkerCls({ element: el }).setLngLat(item.coords).addTo(map);
      markers.current.set(item.key, { marker, el });
    }
    // Elemen DOM milik marker maplibre; isinya dirender React lewat portal. Hanya diperbarui bila daftarnya berubah.
    setElements((prev) => {
      const next = Object.fromEntries([...markers.current].map(([key, m]) => [key, m.el]));
      const same = Object.keys(prev).length === Object.keys(next).length && Object.keys(next).every((k) => prev[k] === next[k]);
      return same ? prev : next;
    });
  }, [items, ready]);

  // Terbang ke kejadian terpilih.
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map || !followSelected || !selectedId) return;
    const i = incidents.find((x) => x.id === selectedId);
    if (!i) return;
    map.flyTo({ center: [i.lon, i.lat], zoom: Math.max(map.getZoom(), selectedZoom), padding: { top: 0, bottom: 0, left: 0, right: 0, ...padding }, speed: 1.4, essential: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, ready, followSelected]);

  // Pusat yang diubah dari luar (misalnya tombol reset) menggeser peta; pusat hasil geseran pengguna diabaikan.
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    const c = map.getCenter();
    if (Math.abs(c.lng - center[0]) > 1e-5 || Math.abs(c.lat - center[1]) > 1e-5) map.easeTo({ center });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center[0], center[1], ready]);

  // Lingkaran area perkiraan.
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    const data = area ? circle(area.lon, area.lat, area.radiusKm) : { type: "FeatureCollection" as const, features: [] };
    const src = map.getSource("wana-area") as { setData?: (d: unknown) => void } | undefined;
    if (src?.setData) {
      src.setData(data);
      return;
    }
    map.addSource("wana-area", { type: "geojson", data });
    map.addLayer({ id: "wana-area-fill", type: "fill", source: "wana-area", paint: { "fill-color": "#6f6a63", "fill-opacity": 0.14 } });
    map.addLayer({
      id: "wana-area-line",
      type: "line",
      source: "wana-area",
      paint: { "line-color": "#6f6a63", "line-width": 2, "line-dasharray": [2, 1.5] },
    });
  }, [area, ready]);

  const zoomBy = (d: number) => mapRef.current?.easeTo({ zoom: (mapRef.current?.getZoom() ?? zoom) + d });

  const locate = () => {
    if (!navigator.geolocation || !mapRef.current || !markerLib.current) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const map = mapRef.current;
        if (!map || !markerLib.current) return;
        const ll: LngLat = [pos.coords.longitude, pos.coords.latitude];
        if (!userMarker.current) {
          const el = document.createElement("div");
          el.className = "h-4 w-4 rounded-full border-[3px] border-white bg-ai shadow-[0_0_0_6px_rgb(47_116_168/0.25)]";
          el.setAttribute("aria-label", "Lokasimu");
          userMarker.current = new markerLib.current({ element: el });
        }
        userMarker.current.setLngLat(ll).addTo(map);
        map.flyTo({ center: ll, zoom: 12, essential: true });
      },
      () => alert("Izin lokasi ditolak. Kamu tetap bisa mencari wilayah secara manual."),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className={`relative overflow-hidden bg-water ${className}`}>
      {/* maplibre memberi class .maplibregl-map (position: relative), jadi ukurannya harus lewat h/w, bukan inset. */}
      <div ref={containerRef} className="h-full w-full" />
      {!ready && !failed && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-ink-2 shadow-soft">Memuat peta…</span>
        </div>
      )}
      {failed && (
        <div className="absolute inset-0 grid place-items-center p-6 text-center">
          <p className="max-w-[320px] rounded-2xl bg-white p-4 text-sm font-semibold text-ink-2 shadow-soft">
            Peta gagal dimuat. Periksa koneksi internet; daftar kejadian tetap bisa dibaca.
          </p>
        </div>
      )}

      {items.map((item) => {
        const el = elements[item.key];
        if (!el) return null;
        return createPortal(
          item.kind === "cluster" ? (
            <button
              type="button"
              onClick={() => {
                const map = mapRef.current;
                if (!map) return;
                map.easeTo({ center: item.coords, zoom: Math.min(index.getClusterExpansionZoom(item.clusterId) + 0.5, 12) });
              }}
              className="relative grid h-12 w-12 place-items-center rounded-full border-2 border-forest bg-white text-lg font-extrabold text-forest shadow-soft transition hover:scale-105"
              aria-label={`${item.count} kejadian di area ini, perbesar`}
            >
              <span className="absolute inset-1 rounded-full border border-forest/30" aria-hidden="true" />
              {item.count}
            </button>
          ) : (
            <PinButton incident={item.incident} selected={item.incident.id === selectedId} onSelect={onSelect} />
          ),
          el,
          item.key,
        );
      })}

      {controls !== "none" && ready && (
        <div className={`${controlsClassName} z-10 flex flex-col gap-2.5`}>
          {(controls === "full" || controls === "zoom") && (
            <div className="flex w-12 flex-col items-center rounded-full bg-white shadow-soft">
              <button type="button" onClick={() => zoomBy(1)} className="grid h-12 w-12 place-items-center" aria-label="Perbesar">
                <Icon name="plus" size={20} />
              </button>
              <span className="h-px w-6 bg-line" />
              <button type="button" onClick={() => zoomBy(-1)} className="grid h-12 w-12 place-items-center" aria-label="Perkecil">
                <Icon name="minus" size={20} />
              </button>
            </div>
          )}
          {(controls === "full" || controls === "locate") && (
            <button type="button" onClick={locate} className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-soft" aria-label="Gunakan lokasi saya">
              <Icon name="locate" size={20} />
            </button>
          )}
          {controls === "full" && (
            <button
              type="button"
              onClick={() => mapRef.current?.flyTo({ ...INDONESIA_VIEW, essential: true })}
              className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-soft"
              aria-label="Lihat seluruh Indonesia"
            >
              <Icon name="map" size={20} />
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

function PinButton({ incident, selected, onSelect }: { incident: Incident; selected: boolean; onSelect?: (id: string) => void }) {
  const fire = incident.indication !== "asap";
  return (
    <button
      type="button"
      onClick={() => onSelect?.(incident.id)}
      className={`relative grid place-items-center rounded-full transition ${selected ? "z-20" : "hover:scale-110"}`}
      aria-label={`${incident.title}, ${incident.updatedAgo}`}
      aria-pressed={selected}
    >
      {selected && <span className="absolute -inset-[9px] rounded-full border-2 border-leaf bg-leaf/20" aria-hidden="true" />}
      {incident.stale ? (
        <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-dashed border-smoke bg-white/90 text-smoke opacity-75">
          <Icon name="smoke" size={16} />
        </span>
      ) : (
        <span
          className={`relative grid h-9 w-9 place-items-center rounded-full text-white shadow-[0_2px_6px_rgb(19_38_27/0.35)] ring-[2.5px] ring-white ${fire ? "bg-fire" : "bg-smoke"}`}
        >
          <Icon name={fire ? "flame" : "smoke"} size={18} />
          {incident.indication === "keduanya" && (
            <span className="absolute -bottom-1.5 -right-1.5 grid h-[18px] w-[18px] place-items-center rounded-full bg-smoke ring-2 ring-white">
              <Icon name="smoke" size={11} />
            </span>
          )}
          {incident.supportCount > 0 && (
            <span className="absolute -right-2 -top-2 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-support px-1 text-[11px] font-extrabold ring-2 ring-white">
              {incident.supportCount}
            </span>
          )}
        </span>
      )}
    </button>
  );
}

/** Mewarnai ulang basemap Liberty ke palet Hutan Riang dan menyembunyikan detail yang tidak relevan. */
function applyHutanRiangTheme(map: MapLibreMap) {
  type SetPaint = MapLibreMap["setPaintProperty"];
  const paint = (id: string, prop: Parameters<SetPaint>[1], value: Parameters<SetPaint>[2]) => {
    if (map.getLayer(id)) map.setPaintProperty(id, prop, value);
  };
  const hide = (id: string) => {
    if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", "none");
  };
  paint("background", "background-color", "#eef2e8");
  paint("natural_earth", "raster-opacity", 0.35);
  paint("water", "fill-color", "#cfe0e6");
  paint("waterway_river", "line-color", "#b5d2de");
  paint("waterway_other", "line-color", "#b5d2de");
  paint("landcover_wood", "fill-color", "#cfe3c4");
  paint("landcover_wood", "fill-opacity", 0.75);
  paint("landcover_grass", "fill-color", "#dfecd5");
  paint("landcover_wetland", "fill-color", "#d3e6d6");
  paint("park", "fill-color", "#d4f0c4");
  paint("landuse_residential", "fill-color", "#e9e7df");
  paint("building", "fill-color", "#e2e0d8");
  ["poi_r20", "poi_r7", "poi_r1", "poi_transit", "building-3d", "road_one_way_arrow", "road_one_way_arrow_opposite"].forEach(hide);
}

function circle(lon: number, lat: number, radiusKm: number) {
  const pts: LngLat[] = [];
  const dLat = radiusKm / 110.574;
  const dLon = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180));
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * 2 * Math.PI;
    pts.push([lon + dLon * Math.cos(a), lat + dLat * Math.sin(a)]);
  }
  return {
    type: "FeatureCollection" as const,
    features: [{ type: "Feature" as const, properties: {}, geometry: { type: "Polygon" as const, coordinates: [pts] } }],
  };
}
