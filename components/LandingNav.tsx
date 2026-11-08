"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Brand";
import { Icon } from "./Icon";

const links = [
  { href: "/pantau", label: "Pantau Wilayah" },
  { href: "#edukasi", label: "Edukasi" },
  { href: "#cara-kerja", label: "Cara kerja" },
  { href: "#cerita", label: "Tentang" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex h-20 max-w-[1312px] items-center justify-between px-5 md:h-24 md:px-8">
        <Logo tone="light" />
        <nav className="hidden items-center gap-9 md:flex" aria-label="Utama">
          {links.map((l) => (
            <Link key={l.label} href={l.href} className="text-base font-semibold text-white/95 hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-5 md:flex">
          <Link href="/masuk" className="text-base font-bold text-white">
            Masuk
          </Link>
          <Link href="/daftar" className="rounded-full bg-white px-5 py-2.5 text-base font-bold text-forest hover:bg-sprout">
            Daftar
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/40 bg-white/15 text-white md:hidden"
          aria-expanded={open}
          aria-label={open ? "Tutup menu" : "Buka menu"}
        >
          <Icon name={open ? "x" : "menu"} size={22} />
        </button>
      </div>
      {open && (
        <div className="mx-4 rounded-3xl bg-white p-3 shadow-float md:hidden">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-2xl px-4 py-3 text-base font-bold text-ink hover:bg-tint"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Link href="/masuk" className="btn-outline py-3">Masuk</Link>
            <Link href="/daftar" className="btn-primary py-3">Daftar</Link>
          </div>
        </div>
      )}
    </header>
  );
}
