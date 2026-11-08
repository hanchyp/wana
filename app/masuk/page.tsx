import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/Brand";

export const metadata: Metadata = { title: "Masuk" };

export default function MasukPage() {
  return (
    <main className="grid min-h-[100svh] md:grid-cols-2">
      <div className="relative hidden md:block">
        <Image src="/photos/hutan-lestari.jpg" alt="Hutan tropis Indonesia" fill sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/85 to-transparent" />
        <p className="absolute bottom-12 left-12 max-w-[420px] text-4xl font-extrabold leading-tight tracking-[-0.03em] text-white">
          Satu foto darimu bisa bantu banyak orang bersiap.
        </p>
      </div>
      <div className="flex flex-col justify-center px-6 py-10 md:px-16">
        <Logo />
        <h1 className="mt-10 text-3xl font-extrabold tracking-[-0.02em]">Masuk untuk melapor</h1>
        <p className="mt-2 text-base font-medium text-ink-2">
          Melihat peta tidak perlu akun. Untuk mengirim laporan, masuk dulu, lalu kami kembalikan ke form.
        </p>
        <form className="mt-8 max-w-[420px] space-y-4" action="/lapor">
          <label className="block">
            <span className="text-sm font-bold">Email</span>
            <input type="email" name="email" placeholder="nama@contoh.id" className="mt-1.5 w-full rounded-2xl border-[1.5px] border-control bg-white px-4 py-3.5 text-base outline-none focus:border-leaf" />
          </label>
          <button type="submit" className="btn-primary w-full py-3.5 text-base">
            Kirim tautan masuk
          </button>
          <p className="text-[13px] font-medium text-ink-2">
            Prototipe: tombol ini langsung membuka form laporan. Email, nomor telepon, dan lokasi rumah tidak pernah ditampilkan ke publik.
          </p>
        </form>
        <Link href="/" className="mt-10 text-[15px] font-bold text-leaf">
          ← Kembali ke beranda
        </Link>
      </div>
    </main>
  );
}
