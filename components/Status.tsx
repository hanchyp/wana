import type { Incident } from "@/lib/incidents";
import { conditionLabel } from "@/lib/incidents";
import { Icon } from "./Icon";

/** Tangga Bukti: seberapa jauh sebuah kejadian sudah diperiksa. */
export function EvidenceLadder({
  incident,
  labels = "full",
  className = "",
}: {
  incident: Pick<Incident, "review" | "supportCount">;
  labels?: "full" | "summary" | "none";
  className?: string;
}) {
  const supported = incident.review !== "lolos-ai";
  const verified = incident.review === "terverifikasi";
  return (
    <div className={className}>
      <div className="flex gap-1.5" role="img" aria-label={ladderText(incident)}>
        <span className="h-2 flex-1 rounded-full bg-ai" />
        <span className={`h-2 flex-1 rounded-full ${supported ? "bg-support" : "bg-[#e3e8e0]"}`} />
        <span
          className={`h-2 flex-1 rounded-full ${verified ? "bg-verified" : "border-[1.5px] border-dashed border-[#9aa79e]"}`}
        />
      </div>
      {labels === "full" && (
        <div className="mt-2 grid grid-cols-3 gap-1.5 text-[13px] font-bold">
          <span className="text-ai-ink">Lolos AI</span>
          <span className={supported ? "text-support-ink" : "text-stale"}>
            {supported ? `Didukung · ${incident.supportCount}` : "Belum didukung"}
          </span>
          <span className="text-stale">{verified ? "Petugas" : "Petugas (belum)"}</span>
        </div>
      )}
      {labels === "summary" && <p className="mt-2 text-[13px] font-semibold text-ink-2">{ladderText(incident)}</p>}
    </div>
  );
}

export function ladderText(incident: Pick<Incident, "review" | "supportCount">) {
  const parts = ["Lolos AI"];
  parts.push(incident.review === "lolos-ai" ? "belum didukung warga" : `didukung ${incident.supportCount} warga`);
  parts.push(incident.review === "terverifikasi" ? "terverifikasi petugas" : "petugas belum");
  return parts.join(" · ");
}

const tone = {
  support: "bg-support-soft text-support-ink",
  fire: "bg-fire-soft text-fire-ink",
  ai: "bg-ai-soft text-ai-ink",
  smoke: "bg-smoke-soft text-[#57524c]",
  neutral: "border border-line bg-white text-ink-2",
  stale: "border border-dashed border-stale bg-white text-stale",
} as const;

export function Tag({ kind, children }: { kind: keyof typeof tone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold ${tone[kind]}`}>
      {children}
    </span>
  );
}

export function IncidentTags({ incident }: { incident: Incident }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {incident.review === "lolos-ai" ? (
        <Tag kind="ai">Lolos AI</Tag>
      ) : (
        <Tag kind="support">Didukung {incident.supportCount} warga</Tag>
      )}
      {incident.stale ? (
        <Tag kind="stale">Belum diperbarui {incident.updatedAgo.replace(" lalu", "")}</Tag>
      ) : incident.condition === "berlangsung" ? (
        <Tag kind="fire">{conditionLabel.berlangsung}</Tag>
      ) : incident.condition === "mereda" ? (
        <Tag kind="smoke">{conditionLabel.mereda}</Tag>
      ) : (
        <Tag kind="neutral">{conditionLabel[incident.condition]}</Tag>
      )}
    </div>
  );
}

export function IndicationGlyph({ incident, size = 40 }: { incident: Incident; size?: number }) {
  const fire = incident.indication !== "asap";
  if (incident.stale) {
    return (
      <span
        className="grid shrink-0 place-items-center rounded-full border-[1.5px] border-dashed border-smoke bg-white text-smoke"
        style={{ width: size, height: size }}
      >
        <Icon name="smoke" size={size * 0.5} />
      </span>
    );
  }
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full text-white ${fire ? "bg-fire" : "bg-smoke"}`}
      style={{ width: size, height: size }}
    >
      <Icon name={fire ? "flame" : "smoke"} size={size * 0.5} />
    </span>
  );
}
