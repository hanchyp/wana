import Link from "next/link";
import { Logo } from "@/components/Brand";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-5 bg-tint px-6 text-center">
      <Logo />
      <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.02em]">Informasi ini tidak ditemukan</h1>
      <p className="max-w-[420px] text-base font-medium text-ink-2">
        Kejadian mungkin sudah digabung, disembunyikan, atau tautannya salah. Coba cari wilayahnya di peta.
      </p>
      <Link href="/pantau" className="btn-primary px-6 py-3.5 text-base">
        Buka peta
      </Link>
    </main>
  );
}
