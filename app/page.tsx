import Image from "next/image";
import Link from "next/link";
import { SimBadge } from "@/components/Brand";
import { EmergencyStrip, SiteFooter } from "@/components/Chrome";
import { Icon, type IconName } from "@/components/Icon";
import { LandingNav } from "@/components/LandingNav";
import { LiveMap } from "@/components/LiveMap";
import { RegionalMap } from "@/components/Map";
import { EvidenceLadder, IncidentTags } from "@/components/Status";
import { getIncident } from "@/lib/incidents";

const abilities: { icon: IconName; title: string; text: string; bg: string }[] = [
  { icon: "map", title: "Melihat", text: "laporan asap dan api di sekitarmu", bg: "bg-white" },
  { icon: "camera", title: "Melaporkan", text: "indikasi yang kamu lihat, dari tempat aman", bg: "bg-sun" },
  { icon: "users", title: "Melengkapi", text: "pengamatan warga lain di kejadian yang sama", bg: "bg-sprout" },
  { icon: "aiCheck", title: "Memahami", text: "seberapa kuat bukti tiap kejadian", bg: "bg-sky-soft" },
];

const steps = [
  { n: "1", title: "Amati", text: "Lihat asap atau api? Potret dari tempat aman dan tandai lokasi atau arahnya.", bg: "bg-sun" },
  { n: "2", title: "Diperiksa", text: "AI memeriksa foto, waktu, dan lokasi. Lolos berarti layak tampil, belum berarti terverifikasi.", bg: "bg-sky" },
  { n: "3", title: "Dilengkapi", text: "Laporanmu tampil di peta dan warga lain bisa menambah pengamatan di kejadian yang sama.", bg: "bg-moss" },
];

export default function Home() {
  const featured = getIncident("pulang-pisau")!;
  const recent = ["pulang-pisau", "ketapang", "banjar"].map((id) => getIncident(id)!);

  return (
    <>
      {/* Hero foto full-bleed; nanti latar ini diganti video drone. */}
      <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden md:min-h-[780px]">
        <Image
          src="/photos/rawa-gambut-udara.jpg"
          alt="Foto udara hutan rawa gambut dan sungai berwarna teh di Kalimantan"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover saturate-[1.2]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0a1c12]/65 via-[#0a1c12]/45 to-[#0a1c12]/75" />
        <LandingNav />
        <div className="mx-auto flex w-full max-w-[900px] flex-col items-center px-6 pb-16 pt-28 text-center">
          <h1 className="mt-6 text-[40px] font-extrabold leading-[1.12] tracking-[-0.03em] text-white sm:text-6xl md:text-[72px] md:leading-[1.1]">
            Pantau hutan.
            <br />
            Bagikan <span className="text-sun">pengamatan.</span>
          </h1>
          <p className="mt-5 max-w-[640px] text-[17px] font-medium leading-[1.6] text-[#e6f0e2] md:text-[21px]">
            Laporkan indikasi asap atau api, lihat perkembangan wilayah, dan bantu lengkapi informasi dari pengamatanmu.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/lapor" className="btn bg-sun px-7 py-4 text-lg font-extrabold text-forest hover:bg-[#ffd666]">
              <Icon name="plus" size={22} />
              Laporkan pengamatan
            </Link>
            <Link href="/pantau" className="btn-ghost-light px-7 py-4 text-lg font-extrabold">
              <Icon name="map" size={22} />
              Buka peta
            </Link>
          </div>
        </div>
      </section>

      {/* Kemampuan */}
      <section id="cara-kerja" className="bg-tint px-5 py-14 md:py-20">
        <div className="mx-auto max-w-[1312px]">
          <h2 className="text-[26px] font-extrabold tracking-[-0.02em] md:text-center md:text-4xl">Dengan WANA, kamu bisa:</h2>
          <ul className="mt-8 grid gap-5 md:mt-11 md:grid-cols-4 md:gap-8">
            {abilities.map((a) => (
              <li key={a.title} className="flex items-center gap-4 md:flex-col md:text-center">
                <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-full border-2 border-forest ${a.bg} text-forest shadow-sticker-sm md:h-[100px] md:w-[100px]`}>
                  <Icon name={a.icon} size={32} className="md:h-11 md:w-11" />
                </span>
                <div>
                  <h3 className="text-xl font-extrabold md:text-2xl">{a.title}</h3>
                  <p className="mt-0.5 text-[15px] font-medium text-ink-2 md:mx-auto md:mt-2 md:max-w-[240px] md:text-base">{a.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contoh satu pengamatan */}
      <section id="cerita" className="px-5 py-14 md:py-24">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="text-[28px] font-extrabold leading-tight tracking-[-0.025em] md:text-center md:text-[40px]">
            Setiap pengamatan punya cerita
          </h2>
          <article className="sticker-card mt-8 grid gap-6 bg-tint p-5 md:mt-10 md:grid-cols-2 md:gap-10 md:p-9">
            <div className="flex flex-col gap-4">
              <p className="text-[13px] font-extrabold text-earth">Siapa</p>
              <p className="flex items-center gap-3 text-[15px] font-bold md:text-[17px]">
                <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-forest bg-sun font-extrabold text-forest">R</span>
                Warga Pulang Pisau · identitas dilindungi
              </p>
              <p className="text-[13px] font-extrabold text-earth">Apa</p>
              <div className="relative h-52 overflow-hidden rounded-2xl border-2 border-forest md:h-72">
                <Image src="/photos/sebangau-rawa.jpg" alt="Foto simulasi pengamatan asap di lahan gambut" fill sizes="(min-width: 768px) 540px, 100vw" className="object-cover" />
                <span className="absolute left-[55%] top-[12%] h-36 w-40 rounded-full bg-[#e9e6e0]/80 blur-2xl" aria-hidden="true" />
                <span className="absolute bottom-3 left-3 rounded-full bg-ink/85 px-3 py-1.5 font-mono text-xs text-white">
                  Foto simulasi · EXIF lokasi dihapus
                </span>
              </div>
              <p className="flex items-center gap-2.5 text-lg font-extrabold md:text-xl">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-smoke text-white">
                  <Icon name="smoke" size={18} />
                </span>
                Indikasi asap dari arah kanal
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-[13px] font-extrabold text-earth">Di mana</p>
              <LiveMap
                center={[featured.lon, featured.lat]}
                zoom={9.5}
                incidents={[featured]}
                area={{ lon: featured.lon, lat: featured.lat, radiusKm: featured.radiusKm }}
                cooperative
                controls="zoom"
                controlsClassName="absolute right-3 top-3"
                className="h-48 w-full rounded-2xl border-2 border-forest md:h-64"
              />
              <p className="text-[15px] font-bold md:text-base">Area perkiraan di sekitar Pulang Pisau, Kalimantan Tengah</p>
              <p className="text-[13px] font-extrabold text-earth">Kapan</p>
              <p className="font-mono text-[15px]">8 Nov 2026 · 13:58 WIB</p>
              <p className="text-[13px] font-extrabold text-earth">Seberapa kuat?</p>
              <EvidenceLadder incident={featured} labels="summary" />
            </div>
          </article>
        </div>
      </section>

      {/* Kejadian terbaru */}
      <section className="bg-tint py-14 md:py-24">
        <div className="mx-auto max-w-[1312px]">
          <div className="flex items-end justify-between px-5 md:px-8">
            <div>
              <SimBadge />
              <h2 className="mt-3 text-[26px] font-extrabold tracking-[-0.03em] md:text-[46px]">Kejadian terbaru</h2>
            </div>
            <Link href="/pantau" className="btn border-2 border-forest bg-white px-5 py-3 text-[15px] text-forest">
              <span className="hidden sm:inline">Buka peta lengkap</span>
              <span className="sm:hidden">Peta</span>
              <Icon name="arrowRight" size={18} />
            </Link>
          </div>
          <div className="mt-7 flex snap-x gap-4 overflow-x-auto px-5 pb-3 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-8">
            {recent.map((i) => (
              <Link
                key={i.id}
                href={`/kejadian/${i.id}`}
                className="sticker-card w-[280px] shrink-0 snap-start overflow-hidden transition hover:-translate-y-1 md:w-auto"
              >
                <RegionalMap focus={i} items={[i]} showTowns={false} className="h-36 border-b-2 border-forest md:h-48" />
                <div className="flex flex-col gap-2.5 p-4 md:p-5">
                  <p className="eyebrow">
                    {i.region} · {i.updatedAgo}
                  </p>
                  <h3 className="text-base font-extrabold leading-snug md:text-xl">{i.title}</h3>
                  <IncidentTags incident={i} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tiga langkah */}
      <section id="edukasi" className="bg-sky-soft px-5 py-14 md:py-24">
        <div className="mx-auto max-w-[1200px] text-center">
          <h2 className="text-[28px] font-extrabold tracking-[-0.025em] md:text-[40px]">Semudah tiga langkah</h2>
          <ol className="mt-9 grid gap-9 md:grid-cols-3 md:gap-10">
            {steps.map((s) => (
              <li key={s.n} className="flex flex-col items-center gap-3">
                <span className={`grid h-14 w-14 place-items-center rounded-full border-2 border-forest ${s.bg} text-2xl font-extrabold text-forest md:h-16 md:w-16 md:text-[28px]`}>
                  {s.n}
                </span>
                <h3 className="text-[22px] font-extrabold md:text-[26px]">{s.title}</h3>
                <p className="max-w-[340px] text-base font-medium leading-relaxed text-ink-2 md:text-[17px]">{s.text}</p>
              </li>
            ))}
          </ol>
          <Link href="/pantau" className="btn mt-10 w-full border-2 border-forest bg-leaf px-8 py-4 text-lg font-extrabold text-white shadow-sticker sm:w-auto">
            Mulai pantau wilayahmu
          </Link>
        </div>
      </section>

      <EmergencyStrip />
      <SiteFooter />
    </>
  );
}
