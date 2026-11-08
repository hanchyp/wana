import type { CSSProperties, ReactNode } from "react";
import type { Incident } from "@/lib/incidents";
import { REGIONAL, projectRegional, regionalTowns } from "@/lib/incidents";
import { Icon } from "./Icon";

type MarkerProps = {
  incident: Incident;
  selected?: boolean;
  onSelect?: (id: string) => void;
  style?: CSSProperties;
};

/** Bentuk = jenis indikasi, badge ungu = pengamatan pendukung, garis putus = informasi lama. */
export function IncidentMarker({ incident, selected, onSelect, style }: MarkerProps) {
  const fire = incident.indication !== "asap";
  const body = incident.stale ? (
    <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-dashed border-smoke bg-white/90 text-smoke opacity-70">
      <Icon name="smoke" size={16} />
    </span>
  ) : (
    <span
      className={`relative grid h-8 w-8 place-items-center rounded-full text-white shadow-[0_2px_6px_rgb(19_38_27/0.35)] ring-[2.5px] ring-white ${fire ? "bg-fire" : "bg-smoke"}`}
    >
      <Icon name={fire ? "flame" : "smoke"} size={17} />
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
  );
  const ring = selected ? (
    <span className="absolute inset-[-9px] rounded-full border-2 border-leaf bg-leaf/20" aria-hidden="true" />
  ) : null;

  const className = "absolute -translate-x-1/2 -translate-y-1/2 grid place-items-center";
  if (!onSelect) {
    return (
      <span className={className} style={style}>
        {ring}
        {body}
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={() => onSelect(incident.id)}
      className={`${className} rounded-full focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sun ${selected ? "z-20" : "z-10 hover:scale-110"} transition`}
      style={style}
      aria-label={`${incident.title}, ${incident.updatedAgo}`}
      aria-pressed={selected}
    >
      {ring}
      {body}
    </button>
  );
}

/** Peta Kalimantan bertekstur (statis), berpusat pada satu titik. Dipakai untuk cuplikan ringan di kartu. */
export function RegionalMap({
  focus,
  items = [],
  selectedId,
  onSelect,
  area,
  showTowns = true,
  className = "",
  children,
}: {
  focus: { lon: number; lat: number };
  items?: Incident[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  area?: { lon: number; lat: number; radius: number };
  showTowns?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const f = projectRegional(focus.lon, focus.lat);
  return (
    <div className={`relative overflow-hidden bg-water ${className}`}>
      <div
        className="absolute"
        style={{ width: REGIONAL.width, height: REGIONAL.height, left: `calc(50% - ${f.x}px)`, top: `calc(50% - ${f.y}px)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/maps/map-kalteng-rich.svg" alt="" className="absolute inset-0 select-none" draggable={false} />
        {showTowns &&
          regionalTowns.map((t) => {
            const p = projectRegional(t.lon, t.lat);
            return (
              <span
                key={t.name}
                className="absolute flex -translate-y-1/2 items-center gap-1.5 text-xs font-semibold text-ink-2"
                style={{ left: p.x - 4, top: p.y }}
              >
                <span className="h-2 w-2 rounded-full border-[1.5px] border-white bg-ink-2" />
                {t.name}
              </span>
            );
          })}
        {area && (
          <span
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-smoke bg-smoke/10"
            style={{
              left: projectRegional(area.lon, area.lat).x,
              top: projectRegional(area.lon, area.lat).y,
              width: area.radius * 2,
              height: area.radius * 2,
            }}
            aria-hidden="true"
          />
        )}
        {items.map((i) => {
          const p = projectRegional(i.lon, i.lat);
          return (
            <IncidentMarker
              key={i.id}
              incident={i}
              selected={i.id === selectedId}
              onSelect={onSelect}
              style={{ left: p.x, top: p.y }}
            />
          );
        })}
      </div>
      {children}
    </div>
  );
}
