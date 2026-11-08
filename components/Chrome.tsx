import Image from "next/image";
import Link from "next/link";
import { Logo } from "./Brand";
import { Icon } from "./Icon";

const navLinks = [
  { href: "/pantau", label: "Pantau Wilayah" },
  { href: "/#cara-kerja", label: "Cara kerja" },
  { href: "/#edukasi", label: "Edukasi" },
];

/** Bar atas halaman alat (Pantau, Detail, Lapor, Status). */
export function AppBar({ active, search = true }: { active?: "pantau"; search?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-4 md:h-[72px] md:gap-7 md:px-7">
        <Logo size="sm" />
        {search && (
          <label className="hidden h-11 w-[380px] items-center gap-2.5 rounded-full border border-line bg-tint px-4 text-ink-2 xl:flex">
            <Icon name="search" size={19} />
            <input
              type="search"
              placeholder="Cari wilayah, misal Pulang Pisau"
              className="w-full bg-transparent text-[15px] font-medium text-ink outline-none placeholder:text-[#6b7d70]"
            />
          </label>
        )}
        <div className="flex-1" />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Utama">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`whitespace-nowrap rounded-full px-3.5 py-2 text-[15px] font-semibold ${
                active === "pantau" && l.href === "/pantau" ? "bg-sprout font-bold text-forest" : "text-ink hover:bg-tint"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/masuk" className="px-3.5 py-2 text-[15px] font-bold text-leaf">
            Masuk
          </Link>
        </nav>
        <Link href="/lapor" className="btn-report shrink-0 whitespace-nowrap px-4 py-2.5 text-[15px] shadow-sticker-sm">
          <Icon name="plus" size={18} />
          <span className="hidden sm:inline">Laporkan pengamatan</span>
          <span className="sm:hidden">Lapor</span>
        </Link>
      </div>
    </header>
  );
}

/** Navigasi bawah mobile, dengan aksi Laporkan di tengah. */
export function MobileTabBar({ active }: { active: "pantau" | "laporan" }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex h-20 items-start justify-around border-t border-line bg-white px-3 pt-2.5 lg:hidden"
      aria-label="Navigasi bawah"
    >
      <Link href="/pantau" className={`flex w-24 flex-col items-center gap-1 text-xs ${active === "pantau" ? "font-extrabold text-leaf" : "font-semibold text-ink-2"}`}>
        <Icon name="map" size={24} />
        Pantau
      </Link>
      <Link href="/lapor" className="flex w-24 flex-col items-center gap-1 text-xs font-bold text-ink">
        <span className="grid h-[38px] w-14 place-items-center rounded-full border-2 border-forest bg-sun text-forest shadow-sticker-sm">
          <Icon name="plus" size={22} />
        </span>
        Laporkan
      </Link>
      <Link href="/laporan-saya/WR-1029" className={`flex w-24 flex-col items-center gap-1 text-xs ${active === "laporan" ? "font-extrabold text-leaf" : "font-semibold text-ink-2"}`}>
        <Icon name="inbox" size={24} />
        Laporan Saya
      </Link>
    </nav>
  );
}

export function EmergencyStrip() {
  return (
    <section className="border-t-2 border-forest bg-fire-soft">
      <div className="mx-auto flex max-w-[1312px] flex-col gap-4 px-5 py-7 md:flex-row md:items-center md:gap-5 md:px-8">
        <div className="flex items-start gap-4 md:flex-1 md:items-center">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-forest bg-fire text-white md:h-14 md:w-14">
            <Icon name="phone" size={24} />
          </span>
          <div>
            <p className="text-lg font-extrabold text-[#7e1f14] md:text-[21px]">Ada api dekat permukiman atau orang?</p>
            <p className="text-[15px] font-medium text-[#7e1f14] md:text-base">
              Hubungi 112 atau pemadam kebakaran 113 lebih dulu. WANA bukan layanan darurat.
            </p>
          </div>
        </div>
        <a href="tel:112" className="btn border-2 border-forest bg-fire px-6 py-3.5 text-[17px] font-extrabold text-white shadow-sticker">
          <Icon name="phone" size={20} />
          Hubungi 112
        </a>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden text-white">
      <Image src="/photos/sebangau-panorama.jpg" alt="" fill loading="eager" sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest/80 via-forest/95 to-forest-deep" />
      <div className="mx-auto max-w-[1312px] px-5 pb-8 pt-14 md:px-8 md:pt-20">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-[720px]">
            <p className="text-3xl font-extrabold leading-tight tracking-[-0.03em] md:text-5xl md:leading-[1.15]">
              Hutan terjaga, mulai dari satu pengamatan kecil.
            </p>
            <Link href="/lapor" className="btn-report mt-7 border-white px-6 py-3.5 text-[17px] shadow-none">
              <Icon name="plus" size={20} />
              Laporkan pengamatan
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-[15px] font-semibold leading-8 text-[#e3f4da] md:grid-cols-3">
            <ul>
              <li className="text-white/60">Jelajahi</li>
              <li><Link href="/pantau">Pantau Wilayah</Link></li>
              <li><Link href="/lapor">Laporkan</Link></li>
              <li><Link href="/#edukasi">Edukasi</Link></li>
            </ul>
            <ul>
              <li className="text-white/60">WANA</li>
              <li><Link href="/#cara-kerja">Cara kerja</Link></li>
              <li>Tentang kami</li>
              <li>Kontak</li>
            </ul>
            <ul>
              <li className="text-white/60">Kebijakan</li>
              <li>Privasi</li>
              <li>Ketentuan</li>
              <li>Aduan informasi</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
