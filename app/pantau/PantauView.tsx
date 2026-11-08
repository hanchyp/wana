"use client";

import Link from "next/link";
import { useState } from "react";
import { SimBadge } from "@/components/Brand";
import { AppBar, MobileTabBar } from "@/components/Chrome";
import { Icon } from "@/components/Icon";
import { NationalMap } from "@/components/Map";
import { EvidenceLadder, IncidentTags, IndicationGlyph, ladderText } from "@/components/Status";
import { NATIONAL, featuredId, incidents, projectNational, type Incident } from "@/lib/incidents";

const sumatraCluster = ["pelalawan", "muaro-jambi", "ogan-komering-ilir"];
const filters = ["Jenis", "Pemeriksaan", "Kondisi"];

export function PantauView() {
  const [selectedId, setSelectedId] = useState<string | undefined>(featuredId);
  const [view, setView] = useState<"peta" | "daftar">("peta");
  const selected = incidents.find((i) => i.id === selectedId);

  return (
    <div className="flex h-[100svh] flex-col overflow-hidden">
      <AppBar active="pantau" />
      <div className="relative flex min-h-0 flex-1">
        {/* Panel kiri (desktop) */}
        <aside className="hidden w-[420px] shrink-0 flex-col border-r border-line bg-white lg:flex">
          <div className="space-y-3.5 px-5 pb-4 pt-5">
            <div className="flex items-center justify-between">
              <h1 className="text-[26px] font-extrabold tracking-[-0.02em]">Pantau Wilayah</h1>
              <SimBadge />
            </div>
            <FilterChips />
          </div>
          <div className="flex items-center justify-between bg-tint px-5 py-2.5">
            <p className="text-[15px] font-extrabold">{incidents.length} kejadian sesuai filter</p>
            <ViewToggle view={view} onChange={setView} />
          </div>
          <p className="flex gap-2 px-5 pb-1 pt-3 text-[13px] font-medium leading-snug text-ink-2">
            <Icon name="info" size={16} className="mt-0.5 shrink-0" />
            Hanya laporan yang lolos pemeriksaan publikasi. Peta kosong bukan berarti aman.
          </p>
          <ul className="flex-1 space-y-2.5 overflow-y-auto px-3.5 pb-4 pt-3">
            {incidents.map((i) => (
              <li key={i.id}>
                <IncidentRow incident={i} selected={i.id === selectedId} onSelect={setSelectedId} />
              </li>
            ))}
          </ul>
        </aside>

        {/* Peta */}
        <main className="relative min-w-0 flex-1 overflow-hidden bg-water">
          <div className="hidden lg:block">
            <div className="absolute left-1/2 top-[46%] w-[108%] min-w-[900px] -translate-x-1/2 -translate-y-1/2">
              <NationalMap
                items={incidents}
                selectedId={selectedId}
                onSelect={setSelectedId}
                cluster={{ ids: sumatraCluster, onClick: () => setSelectedId("pelalawan") }}
              >
              </NationalMap>
            </div>
            {selected && <Popover incident={selected} onClose={() => setSelectedId(undefined)} />}
          </div>
          <MobileMap selected={selected} onSelect={setSelectedId} />

          <div className="pointer-events-none absolute inset-x-0 top-0 hidden items-start justify-between p-4 lg:flex">
            <span className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-[13px] font-semibold shadow-soft">
              <span className="h-2 w-2 rounded-full bg-leaf" />
              Diperbarui 3 mnt lalu · hanya laporan yang lolos pemeriksaan
            </span>
            <MapControls />
          </div>
          <Legend />
          <div className="absolute bottom-4 right-4 hidden rounded-lg bg-white/90 px-2.5 py-1.5 font-mono text-[11px] lg:block">
            <span className="block h-1 w-24 border-x-[1.5px] border-b-[1.5px] border-ink" />0 · · · · 200 km
          </div>

          <MobileSheet view={view} onViewChange={setView} selected={selected} onSelect={setSelectedId} />
        </main>
      </div>
      <MobileTabBar active="pantau" />
    </div>
  );
}

function FilterChips({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex gap-2 ${compact ? "" : "flex-wrap"}`}>
      <button type="button" className={`chip-active shrink-0 ${compact ? "shadow-soft" : ""}`} aria-pressed="true">
        {!compact && <Icon name="clock" size={16} />}
        24 jam
      </button>
      {filters.map((f) => (
        <button key={f} type="button" className={`chip shrink-0 ${compact ? "border-transparent shadow-soft" : ""}`}>
          {f}
        </button>
      ))}
    </div>
  );
}

function ViewToggle({ view, onChange }: { view: "peta" | "daftar"; onChange: (v: "peta" | "daftar") => void }) {
  return (
    <div className="flex rounded-full bg-line p-[3px]" role="tablist" aria-label="Tampilan">
      {(["peta", "daftar"] as const).map((v) => (
        <button
          key={v}
          type="button"
          role="tab"
          aria-selected={view === v}
          onClick={() => onChange(v)}
          className={`rounded-full px-3.5 py-1.5 text-[13px] capitalize ${view === v ? "bg-white font-bold text-ink shadow-sm" : "font-semibold text-ink-2"}`}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

function IncidentRow({ incident, selected, onSelect }: { incident: Incident; selected: boolean; onSelect: (id: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(incident.id)}
      className={`flex w-full gap-3 rounded-[18px] p-3.5 text-left transition ${
        selected ? "border-2 border-leaf bg-tint" : "border border-line bg-white hover:bg-tint/60"
      } ${incident.stale ? "border-dashed opacity-80" : ""}`}
      aria-pressed={selected}
    >
      <IndicationGlyph incident={incident} />
      <span className="flex min-w-0 flex-col gap-1.5">
        <span className="text-base font-extrabold leading-snug">{incident.title}</span>
        <span className="eyebrow">
          {incident.region} · {incident.updatedAgo}
        </span>
        <IncidentTags incident={incident} />
      </span>
    </button>
  );
}

/** Kartu kejadian terpilih, ditempel di sisi kanan peta agar tidak keluar layar di lebar mana pun. */
function Popover({ incident, onClose }: { incident: Incident; onClose: () => void }) {
  return (
    <div
      className="absolute bottom-14 right-4 z-30 w-[360px] rounded-[22px] border border-line bg-white p-5 shadow-float"
      role="dialog"
      aria-label={incident.title}
    >
      <div className="flex items-center justify-between">
        <p className="eyebrow">
          {incident.region} · {incident.updatedAgo}
        </p>
        <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-tint text-ink-2" aria-label="Tutup">
          <Icon name="x" size={16} />
        </button>
      </div>
      <h2 className="mt-2 text-[19px] font-extrabold leading-snug">{incident.title}</h2>
      <EvidenceLadder incident={incident} labels="summary" className="mt-3" />
      <div className="mt-3">
        <IncidentTags incident={incident} />
      </div>
      <div className="mt-4 flex gap-2">
        <Link href={`/kejadian/${incident.id}`} className="btn-primary flex-1 py-3 text-sm">
          Lihat detail
          <Icon name="arrowRight" size={17} />
        </Link>
        <Link href={`/lapor?kejadian=${incident.id}`} className="btn-outline flex-1 py-3 text-sm">
          Tambah pengamatan
        </Link>
      </div>
    </div>
  );
}

function MapControls() {
  return (
    <div className="pointer-events-auto flex flex-col gap-2.5">
      <div className="flex w-12 flex-col items-center rounded-full bg-white shadow-soft">
        <button type="button" className="grid h-12 w-12 place-items-center" aria-label="Perbesar">
          <Icon name="plus" size={20} />
        </button>
        <span className="h-px w-6 bg-line" />
        <button type="button" className="grid h-12 w-12 place-items-center" aria-label="Perkecil">
          <Icon name="minus" size={20} />
        </button>
      </div>
      <button type="button" className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-soft" aria-label="Gunakan lokasi saya">
        <Icon name="locate" size={20} />
      </button>
      <button type="button" className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-soft" aria-label="Lapisan peta">
        <Icon name="layers" size={20} />
      </button>
    </div>
  );
}

function Legend() {
  const rows = [
    { dot: "bg-fire ring-2 ring-white", label: "Indikasi api" },
    { dot: "bg-smoke ring-2 ring-white", label: "Indikasi asap" },
    { dot: "border-[1.5px] border-dashed border-smoke bg-smoke/15", label: "Area perkiraan / arah" },
    { dot: "border-[1.5px] border-dashed border-[#9aa79e] bg-white", label: "Informasi lama (> 48 jam)" },
    { dot: "bg-support ring-2 ring-white", label: "Angka = pengamatan pendukung" },
    { dot: "border-2 border-forest bg-white", label: "Kumpulan kejadian (bukan bahaya)" },
  ];
  return (
    <details className="absolute bottom-4 left-4 hidden w-[300px] rounded-[20px] bg-white p-4 shadow-soft lg:block">
      <summary className="cursor-pointer text-[15px] font-extrabold">Legenda</summary>
      <ul className="mt-2.5 space-y-2">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center gap-2.5 text-[13px] font-medium">
            <span className={`h-4 w-4 shrink-0 rounded-full ${r.dot}`} />
            {r.label}
          </li>
        ))}
      </ul>
    </details>
  );
}

/** Peta mobile: potongan peta nasional berskala asli, berpusat pada kejadian terpilih. */
function MobileMap({ selected, onSelect }: { selected?: Incident; onSelect: (id: string) => void }) {
  const focus = projectNational((selected ?? incidents[0]).lon, (selected ?? incidents[0]).lat);
  return (
    <div className="absolute inset-0 lg:hidden">
      <div
        className="absolute transition-[left,top] duration-500"
        style={{ width: NATIONAL.width * 1.6, left: `calc(50% - ${focus.x * 1.6}px)`, top: `calc(32% - ${focus.y * 1.6}px)` }}
      >
        <NationalMap items={incidents} selectedId={selected?.id} onSelect={onSelect} />
      </div>
      <div className="absolute inset-x-4 top-3 space-y-2.5">
        <label className="flex h-[54px] items-center gap-2.5 rounded-full bg-white pl-[18px] pr-1.5 shadow-float">
          <Icon name="search" size={20} className="text-ink-2" />
          <input
            type="search"
            defaultValue={selected?.region ?? ""}
            placeholder="Cari wilayah"
            className="min-w-0 flex-1 bg-transparent text-base font-bold outline-none"
          />
          <span className="grid h-[42px] w-[42px] place-items-center rounded-full bg-sprout text-forest">
            <Icon name="sliders" size={20} />
          </span>
        </label>
        <div className="-mx-4 overflow-x-auto px-4">
          <FilterChips compact />
        </div>
        <SimBadge />
      </div>
    </div>
  );
}

function MobileSheet({
  view,
  onViewChange,
  selected,
  onSelect,
}: {
  view: "peta" | "daftar";
  onViewChange: (v: "peta" | "daftar") => void;
  selected?: Incident;
  onSelect: (id: string) => void;
}) {
  const expanded = view === "daftar";
  return (
    <section
      className={`absolute inset-x-0 bottom-20 z-30 flex flex-col rounded-t-[28px] bg-white px-4 pb-4 pt-2.5 shadow-[0_-6px_28px_rgb(19_38_27/0.18)] transition-[height] duration-300 lg:hidden ${
        expanded ? "h-[72%]" : ""
      }`}
      aria-label="Daftar kejadian"
    >
      <button
        type="button"
        onClick={() => onViewChange(expanded ? "peta" : "daftar")}
        className="mx-auto mb-3 h-[5px] w-11 rounded-full bg-[#c9d6c3]"
        aria-label={expanded ? "Kecilkan daftar" : "Perbesar daftar"}
      />
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold">{incidents.length} kejadian di Indonesia</h2>
        <button type="button" onClick={() => onViewChange(expanded ? "peta" : "daftar")} className="text-sm font-bold text-leaf">
          {expanded ? "Lihat peta" : "Lihat daftar"}
        </button>
      </div>
      {expanded ? (
        <ul className="mt-3 flex-1 space-y-2.5 overflow-y-auto">
          {incidents.map((i) => (
            <li key={i.id}>
              <IncidentRow
                incident={i}
                selected={i.id === selected?.id}
                onSelect={(id) => {
                  onSelect(id);
                  onViewChange("peta");
                }}
              />
            </li>
          ))}
        </ul>
      ) : (
        selected && (
          <div className="mt-3 rounded-[20px] border-2 border-leaf bg-tint p-3.5">
            <div className="flex gap-3">
              <IndicationGlyph incident={selected} />
              <div className="min-w-0">
                <h3 className="text-base font-extrabold leading-snug">{selected.title}</h3>
                <p className="eyebrow mt-1">
                  {selected.updatedAgo} · {selected.updatedAt}
                </p>
              </div>
            </div>
            <EvidenceLadder incident={selected} labels="none" className="mt-3" />
            <p className="mt-2 text-[13px] font-semibold text-ink-2">{ladderText(selected)}</p>
            <div className="mt-3 flex gap-2">
              <Link href={`/kejadian/${selected.id}`} className="btn-primary flex-1 py-3 text-sm">
                Lihat detail
              </Link>
              <Link href={`/lapor?kejadian=${selected.id}`} className="btn-outline flex-1 py-3 text-sm">
                Tambah pengamatan
              </Link>
            </div>
          </div>
        )
      )}
    </section>
  );
}
