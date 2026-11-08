"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppBar, MobileTabBar } from "@/components/Chrome";
import { Icon } from "@/components/Icon";
import { EvidenceLadder } from "@/components/Status";

export type ReportState = "diperiksa" | "terbit" | "perlu-dilengkapi";

export function StatusView({ reportId, initial, autoAdvance }: { reportId: string; initial: ReportState; autoAdvance: boolean }) {
  const [state, setState] = useState<ReportState>(initial);

  // Simulasi demo: pemeriksaan AI selesai beberapa detik setelah halaman dibuka.
  useEffect(() => {
    if (!autoAdvance || state !== "diperiksa") return;
    const t = setTimeout(() => setState("terbit"), 4500);
    return () => clearTimeout(t);
  }, [autoAdvance, state]);

  return (
    <div className="flex min-h-[100svh] flex-col bg-tint">
      <AppBar search={false} />
      {state === "terbit" ? <Published /> : <Checking reportId={reportId} state={state} />}
      <MobileTabBar active="laporan" />
    </div>
  );
}

function Checking({ reportId, state }: { reportId: string; state: Exclude<ReportState, "terbit"> }) {
  const needsFix = state === "perlu-dilengkapi";
  const checks = needsFix
    ? [
        { done: true, text: "Kelengkapan data" },
        { done: true, text: "Waktu dan lokasi wajar" },
        { done: false, warn: true, text: "Foto terlalu gelap untuk dinilai" },
      ]
    : [
        { done: true, text: "Kelengkapan data" },
        { done: true, text: "Waktu dan lokasi wajar" },
        { done: false, text: "Indikasi visual pada foto…" },
        { done: false, text: "Mencari kejadian serupa di sekitar titik" },
      ];

  return (
    <main className="relative flex flex-1 justify-center overflow-hidden px-4 pb-32 pt-6 md:pb-48 md:pt-14">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/maps/canopy-band.svg" alt="" className="pointer-events-none absolute bottom-0 left-0 hidden w-full opacity-90 md:block" />
      <section className="relative w-full max-w-[800px] rounded-[28px] border border-line bg-white p-5 shadow-soft md:p-9">
        <header className="flex items-center gap-4">
          <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl md:h-[72px] md:w-[72px]">
            <Image src="/photos/sebangau-rawa.jpg" alt="" fill sizes="72px" className="object-cover" />
          </span>
          <div>
            <h1 className="text-xl font-extrabold tracking-[-0.02em] md:text-[28px]">Status laporan</h1>
            <p className="mt-1 font-mono text-xs font-medium text-ink-2 md:text-[13px]">
              No. {reportId} · Indikasi asap · Pulang Pisau · dikirim 14:32 WIB
            </p>
          </div>
        </header>

        <ol className="mt-7 flex flex-col gap-0 md:mt-9 md:flex-row md:items-start">
          <Step state="done" title="Terkirim" note="2 foto terunggah · 14:32 WIB" />
          <Connector done />
          <Step
            state={needsFix ? "warn" : "active"}
            title={needsFix ? "Perlu dilengkapi" : "Diperiksa AI"}
            note={needsFix ? "Diperiksa 14:33 WIB" : "Biasanya kurang dari 1 menit"}
          />
          <Connector />
          <Step state="todo" title="Tampil di peta" note="Setelah lolos pemeriksaan awal" />
        </ol>

        <div className="mt-6 rounded-[20px] bg-[#f7faf5] p-5 md:mt-8 md:p-6">
          <div className="flex items-center justify-between">
            <p className={`text-lg font-extrabold ${needsFix ? "text-[#8a5a00]" : "text-ai-ink"}`}>
              {needsFix ? "Pemeriksaan butuh bantuanmu" : "Sedang diperiksa…"}
            </p>
            {!needsFix && <span className="font-mono text-xs text-ink-2">biasanya &lt; 1 menit</span>}
          </div>
          <ul className="mt-3 space-y-2">
            {checks.map((c) => (
              <li key={c.text} className="flex items-center gap-2.5 text-[15px] font-semibold">
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${
                    c.done ? "bg-leaf text-white" : c.warn ? "bg-pending text-white" : "border-2 border-dashed border-ai"
                  }`}
                >
                  {c.done && <Icon name="check" size={14} strokeWidth={3} />}
                  {c.warn && <span className="text-xs font-extrabold">!</span>}
                </span>
                {c.text}
              </li>
            ))}
          </ul>
        </div>

        <p className={`mt-5 flex gap-2.5 rounded-2xl p-4 text-sm font-semibold leading-relaxed ${needsFix ? "bg-pending-soft text-[#6b4a00]" : "bg-ai-soft text-[#1f4e73]"}`}>
          <Icon name="info" size={19} className="shrink-0" />
          {needsFix
            ? "Ini bukan berarti pengamatanmu salah. Coba ambil foto yang lebih terang, atau kirim ke moderator untuk ditinjau manual."
            : "Laporanmu belum tampil di peta sampai pemeriksaan selesai. Kamu boleh menutup halaman ini; statusnya tersimpan di Laporan Saya."}
        </p>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center">
          {needsFix ? (
            <>
              <Link href="/lapor" className="btn-report px-6 py-3.5 text-base font-extrabold">
                <Icon name="camera" size={20} />
                Perbaiki foto
              </Link>
              <button type="button" className="px-4 py-3 text-[15px] font-bold text-leaf underline">
                Kirim ke moderator saja
              </button>
            </>
          ) : (
            <>
              <Link href="/pantau" className="btn-outline px-6 py-3.5 text-[15px]">
                Kembali ke peta
              </Link>
              <Link href="?status=perlu-dilengkapi" className="px-4 py-3 text-[15px] font-bold text-leaf underline">
                Lihat contoh “perlu dilengkapi”
              </Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function Step({ state, title, note }: { state: "done" | "active" | "warn" | "todo"; title: string; note: string }) {
  const circle = {
    done: "bg-leaf text-white",
    active: "border-[3px] border-ai bg-ai-soft animate-pulse-ring",
    warn: "border-[3px] border-pending bg-pending-soft",
    todo: "border-2 border-[#c9d6c3] bg-white text-[#9aa79e]",
  }[state];
  const titleColor = { done: "text-ink", active: "text-ai-ink", warn: "text-[#8a5a00]", todo: "text-stale" }[state];
  return (
    <li className="flex gap-4 md:w-36 md:shrink-0 md:flex-col md:items-center md:gap-2 md:text-center">
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full md:h-11 md:w-11 ${circle}`}>
        {state === "done" && <Icon name="check" size={18} strokeWidth={3} />}
        {state === "active" && <span className="h-3 w-3 rounded-full bg-ai" />}
        {state === "warn" && <span className="h-3 w-3 rounded-full bg-pending" />}
        {state === "todo" && <Icon name="map" size={18} />}
      </span>
      <span className="pb-1 pt-1.5 md:pt-0">
        <span className={`block text-base font-extrabold ${titleColor}`}>{title}</span>
        <span className="block text-[13px] font-medium text-ink-2">{note}</span>
      </span>
    </li>
  );
}

function Connector({ done = false }: { done?: boolean }) {
  return (
    <li aria-hidden="true" className="ml-[17px] h-7 w-[3px] md:ml-0 md:mt-[21px] md:h-[3px] md:w-auto md:flex-1">
      <span className={`block h-full w-full rounded-full ${done ? "bg-leaf" : "bg-line"}`} />
    </li>
  );
}

function Published() {
  return (
    <main className="flex flex-1 justify-center px-4 pb-32 pt-6 md:pt-12">
      <section className="w-full max-w-[560px] overflow-hidden rounded-[32px] border-2 border-forest bg-white shadow-sticker">
        <div className="relative h-64 overflow-hidden bg-sprout md:h-72">
          <span className="absolute -bottom-24 -left-16 h-56 w-80 rounded-full bg-moss" />
          <span className="absolute -bottom-28 -right-20 h-56 w-80 rounded-full bg-[#7fc56b]" />
          <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[56%] animate-[spin_40s_linear_infinite]" width="220" height="220" viewBox="0 0 220 220" aria-hidden="true">
            <polygon
              fill="#ffe08a"
              points={Array.from({ length: 24 }, (_, i) => {
                const a = (i * Math.PI) / 12;
                const r = i % 2 === 0 ? 110 : 80;
                return `${110 + r * Math.cos(a)},${110 + r * Math.sin(a)}`;
              }).join(" ")}
            />
          </svg>
          <span className="absolute left-1/2 top-1/2 grid h-32 w-32 -translate-x-1/2 -translate-y-[56%] place-items-center rounded-full border-[3px] border-forest bg-sun text-forest shadow-sticker">
            <Icon name="check" size={60} strokeWidth={2.6} />
          </span>
          <span className="absolute right-10 top-8 rotate-6 rounded-full border-2 border-forest bg-white px-3 py-1 text-sm font-extrabold text-forest">
            Terbit!
          </span>
        </div>
        <div className="flex flex-col items-center px-6 pb-7 pt-7 text-center">
          <h1 className="max-w-[380px] text-[26px] font-extrabold leading-tight tracking-[-0.02em]">
            Terima kasih! Pengamatanmu sudah tampil di peta.
          </h1>
          <p className="mt-2 max-w-[340px] text-[15px] font-medium text-ink-2">
            Warga sekitar kini bisa melihat dan melengkapi pengamatanmu.
          </p>
          <div className="mt-5 w-full rounded-[18px] border border-line p-4 text-left">
            <p className="text-[15px] font-extrabold">Indikasi asap di sekitar Pulang Pisau</p>
            <EvidenceLadder incident={{ review: "lolos-ai", supportCount: 0 }} labels="none" className="mt-3" />
            <p className="mt-2 text-[13px] font-semibold text-ai-ink">Lolos pemeriksaan awal AI. Kejadian belum terverifikasi.</p>
          </div>
          <div className="mt-6 flex w-full flex-col gap-2.5">
            <Link href="/kejadian/pulang-pisau" className="btn border-2 border-forest bg-leaf py-3.5 text-base font-extrabold text-white shadow-sticker">
              Lihat kejadian di peta
            </Link>
            <button type="button" className="btn-outline py-3.5 text-[15px]">
              <Icon name="share" size={18} />
              Bagikan ke warga sekitar
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
