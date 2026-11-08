import Link from "next/link";

export function Logo({ tone = "dark", size = "md", decorative = false }: { tone?: "dark" | "light"; size?: "sm" | "md"; decorative?: boolean }) {
  const box = size === "sm" ? "h-9 w-9 rounded-xl" : "h-10 w-10 rounded-[13px]";
  const mark = (
    <>
      <span
        className={`${box} grid place-items-center border-2 bg-leaf ${tone === "light" ? "border-white" : "border-forest"}`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M3 21C3 10.5 10.5 3 21 3C21 13.5 13.5 21 3 21Z"
            fill="#ffc83d"
            stroke="#0e4d2c"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M3 21L13 11" stroke="#0e4d2c" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
      <span
        className={`text-[27px] font-extrabold leading-none tracking-[-0.03em] ${tone === "light" ? "text-white" : "text-forest"}`}
      >
        wana
      </span>
    </>
  );
  return decorative ? (
    <span aria-hidden="true" className="inline-flex items-center gap-2.5">{mark}</span>
  ) : (
    <Link href="/" className="inline-flex items-center gap-2.5" aria-label="WANA, ke beranda">{mark}</Link>
  );
}

export function SimBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 font-mono text-[11px] font-medium text-white ${className}`}
    >
      <span className="h-[7px] w-[7px] rounded-full bg-sun" />
      Data simulasi
    </span>
  );
}
