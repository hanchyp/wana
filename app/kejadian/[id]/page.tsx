import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SimBadge } from "@/components/Brand";
import { AppBar } from "@/components/Chrome";
import { Icon } from "@/components/Icon";
import { LiveMap } from "@/components/LiveMap";
import { EvidenceLadder, Tag } from "@/components/Status";
import { conditionLabel, getIncident, incidents, type TimelineEntry } from "@/lib/incidents";

export function generateStaticParams() {
  return incidents.map((i) => ({ id: i.id }));
}

export async function generateMetadata({ params }: PageProps<"/kejadian/[id]">): Promise<Metadata> {
  const { id } = await params;
  const incident = getIncident(id);
  return { title: incident?.title ?? "Kejadian tidak ditemukan" };
}

const dot: Record<TimelineEntry["kind"], string> = {
  pengamatan: "bg-support",
  dukungan: "border-[3px] border-support bg-white",
  ai: "bg-ai",
  pertama: "bg-[#9aa79e]",
};

const checks = [
  "Kemungkinan asap terlihat jelas pada 3 dari 4 foto",
  "Waktu pengamatan dan perkiraan lokasi masuk akal",
  "Tidak ditemukan unggahan ulang foto yang sama",
];

// Semua id sudah diketahui saat build; halaman boleh menunggu params tanpa shell instan.
export const instant = false;

export default async function KejadianPage({ params }: PageProps<"/kejadian/[id]">) {
  const { id } = await params;
  const incident = getIncident(id);
  if (!incident) notFound();

  const conditionTone =
    incident.condition === "berlangsung" ? "fire" : incident.condition === "mereda" ? "smoke" : "neutral";

  return (
    <>
      <AppBar active="pantau" />
      <main className="mx-auto w-full max-w-[1312px] px-4 pb-32 pt-5 md:px-8 md:pb-24 md:pt-7">
        <Link href="/pantau" className="inline-flex items-center gap-1.5 text-[15px] font-bold text-leaf">
          <Icon name="chevronLeft" size={20} />
          Kembali ke peta
          <span className="hidden font-semibold text-ink-2 sm:inline">· {incident.region} · {incident.place}</span>
        </Link>

        <header className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[880px]">
            <div className="flex flex-wrap items-center gap-2.5">
              <SimBadge />
              <span className="font-mono text-xs font-medium text-ink-2">ID kejadian WN-0{incidents.indexOf(incident) + 241}</span>
            </div>
            <h1 className="mt-3 text-[28px] font-extrabold leading-[1.15] tracking-[-0.03em] md:text-[44px]">{incident.title}</h1>
            <p className="mt-3 font-mono text-[13px] font-medium text-ink-2">
              Diamati pertama {incident.firstSeen} · diperbarui {incident.updatedAt} ({incident.updatedAgo})
            </p>
          </div>
          <div className="flex gap-2">
            <button type="button" className="btn-outline px-4 py-2.5 text-[15px]">
              <Icon name="share" size={18} />
              Bagikan
            </button>
            <button type="button" className="btn px-3 py-2.5 text-[15px] text-ink-2 hover:bg-tint">
              <Icon name="flag" size={18} />
              Laporkan masalah
            </button>
          </div>
        </header>

        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-8">
          <div className="flex min-w-0 flex-col gap-5">
            {/* Galeri */}
            <div className="grid h-[260px] grid-cols-[1fr_auto] gap-3 md:h-[400px]">
              <div className="relative overflow-hidden rounded-3xl">
                <Image src="/photos/sebangau-rawa.jpg" alt="Foto pelapor (simulasi): asap di atas rawa gambut" fill priority sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
                <span className="absolute left-[50%] top-[10%] h-44 w-52 rounded-full bg-[#ece9e3]/80 blur-3xl" aria-hidden="true" />
                <span className="absolute bottom-3 left-3 rounded-full bg-ink/85 px-3.5 py-1.5 text-xs font-semibold text-white md:text-[13px]">
                  Foto pelapor · simulasi · {incident.firstSeen} · EXIF lokasi dihapus
                </span>
              </div>
              <div className="grid w-[110px] grid-rows-2 gap-3 md:w-[270px]">
                <div className="relative overflow-hidden rounded-3xl">
                  <Image src="/photos/sebangau-peat-dome.jpg" alt="Foto pengamatan tambahan (simulasi)" fill sizes="270px" className="object-cover" />
                </div>
                <div className="relative grid place-items-center overflow-hidden rounded-3xl">
                  <Image src="/photos/kapuas.jpg" alt="" fill sizes="270px" className="object-cover" />
                  <span className="absolute inset-0 bg-ink/50" />
                  <span className="relative text-lg font-extrabold text-white md:text-xl">+1 foto</span>
                </div>
              </div>
            </div>

            {/* Status (mobile di atas, desktop di samping) */}
            <StatusCard className="lg:hidden" />

            <section className="card p-5 md:p-7">
              <h2 className="text-xl font-extrabold md:text-[22px]">Ringkasan pengamatan</h2>
              <p className="mt-3 text-base font-medium leading-relaxed md:text-[17px]">{incident.summary}</p>
              <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-ai-soft px-3.5 py-1.5 text-[13px] font-bold text-ai-ink">
                <Icon name="aiCheck" size={16} />
                Diringkas AI dari laporan warga, tanpa menambah fakta baru
              </span>
            </section>

            <section className="card p-5 md:p-7">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-extrabold md:text-[22px]">Hasil pemeriksaan awal AI</h2>
                <span className="font-mono text-xs font-medium text-ink-2">Pemeriksaan simulasi</span>
              </div>
              <ul className="mt-4 space-y-3">
                {checks.map((c) => (
                  <li key={c} className="flex items-center gap-3 text-[15px] font-medium md:text-base">
                    <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full bg-ai-soft text-ai-ink">
                      <Icon name="check" size={16} />
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex gap-3 rounded-2xl bg-earth-soft p-4 text-sm font-semibold leading-relaxed text-[#6b4a2e] md:text-[15px]">
                <Icon name="info" size={20} className="shrink-0 text-earth" />
                Keterbatasan: AI tidak dapat memastikan lokasi dari koordinat yang diketik pelapor, dan tidak menilai besar
                atau arah api. Hasil ini syarat tampil, bukan verifikasi.
              </p>
            </section>

            <section className="card p-5 md:p-7">
              <h2 className="text-xl font-extrabold md:text-[22px]">Linimasa pengamatan</h2>
              <ol className="mt-5">
                {incident.timeline.map((t, idx) => (
                  <li key={t.time + t.title} className="flex gap-4">
                    <span className="w-12 shrink-0 pt-0.5 font-mono text-[13px] font-medium text-ink-2">{t.time}</span>
                    <span className="flex flex-col items-center pt-1">
                      <span className={`h-3.5 w-3.5 shrink-0 rounded-full ${dot[t.kind]}`} />
                      {idx < incident.timeline.length - 1 && <span className="mt-1 w-0.5 flex-1 bg-line" />}
                    </span>
                    <span className="pb-6">
                      <span className="block text-base font-extrabold">{t.title}</span>
                      <span className="mt-0.5 block text-[15px] font-medium text-ink-2">{t.note}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <aside className="flex flex-col gap-5">
            <section className="card hidden p-5 lg:block">
              <StatusBody />
            </section>
            <section className="card overflow-hidden">
              <LiveMap
                center={[incident.lon, incident.lat]}
                zoom={incident.precision === "area" ? 10 : 11}
                incidents={[incident]}
                selectedId={incident.id}
                area={incident.precision === "area" ? { lon: incident.lon, lat: incident.lat, radiusKm: incident.radiusKm } : undefined}
                cooperative
                controls="zoom"
                controlsClassName="absolute right-3 top-3"
                className="h-60 w-full"
              />
              <div className="p-5">
                <p className="text-base font-extrabold">
                  {incident.precision === "area" ? `Area perkiraan sumber · ±${incident.radiusKm.toLocaleString("id")} km` : "Titik perkiraan pelapor"}
                </p>
                <p className="mt-1 text-sm font-medium text-ink-2">Disusun dari pengamatan dan arah pandang warga. Bukan titik pasti.</p>
                <p className="mt-2 font-mono text-xs text-ink-2">
                  {Math.abs(incident.lat).toFixed(2)}° {incident.lat < 0 ? "LS" : "LU"} · {incident.lon.toFixed(2)}° BT
                </p>
              </div>
            </section>
            <section className="hidden rounded-3xl bg-forest p-6 text-white lg:block">
              <h2 className="text-[21px] font-extrabold">Melihat kejadian yang sama?</h2>
              <p className="mt-2 text-[15px] font-medium text-[#cfe8c6]">
                Tambahkan pengamatanmu agar informasinya lebih lengkap. Ambil foto dari tempat aman.
              </p>
              <Link href={`/lapor?kejadian=${incident.id}`} className="btn mt-4 w-full bg-sun py-3.5 font-extrabold text-forest">
                <Icon name="plus" size={20} />
                Tambahkan pengamatan
              </Link>
            </section>
            <p className="flex gap-3 rounded-[18px] bg-fire-soft p-4 text-sm font-bold text-[#7e1f14]">
              <Icon name="phone" size={20} className="shrink-0 text-fire" />
              Api dekat permukiman? Hubungi 112 lebih dulu. WANA bukan layanan darurat.
            </p>
          </aside>
        </div>
      </main>

      {/* Aksi menempel di mobile */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white px-4 pb-6 pt-3 shadow-[0_-4px_14px_rgb(19_38_27/0.08)] lg:hidden">
        <Link href={`/lapor?kejadian=${incident.id}`} className="btn-report w-full py-3.5 text-base font-extrabold">
          <Icon name="plus" size={20} />
          Tambahkan pengamatan
        </Link>
      </div>
    </>
  );

  function StatusBody() {
    return (
      <>
        <p className="text-sm font-extrabold text-ink-2">Tingkat pemeriksaan</p>
        <EvidenceLadder incident={incident!} className="mt-3" />
        <hr className="my-4 border-line" />
        <p className="text-sm font-extrabold text-ink-2">Kondisi terbaru</p>
        <div className="mt-2.5">
          <Tag kind={incident!.stale ? "stale" : conditionTone}>
            {incident!.stale ? `Belum diperbarui ${incident!.updatedAgo.replace(" lalu", "")}` : conditionLabel[incident!.condition]}
          </Tag>
        </div>
        <p className="mt-2.5 text-sm font-medium text-ink-2">
          {incident!.stale
            ? "Kondisi saat ini belum diketahui. Informasi lama bukan berarti sudah selesai."
            : `Menurut pengamatan warga ${incident!.updatedAt}. Bukan keputusan petugas.`}
        </p>
      </>
    );
  }

  function StatusCard({ className = "" }: { className?: string }) {
    return (
      <section className={`card p-5 ${className}`}>
        <StatusBody />
      </section>
    );
  }
}
