import type { Metadata } from "next";
import { Suspense } from "react";
import { StatusView, type ReportState } from "./StatusView";

export const metadata: Metadata = { title: "Status laporan" };

const states: ReportState[] = ["diperiksa", "terbit", "perlu-dilengkapi"];

export default function StatusPage(props: PageProps<"/laporan-saya/[id]">) {
  return (
    <Suspense fallback={<div className="min-h-[100svh] bg-tint" />}>
      <StatusWithParams {...props} />
    </Suspense>
  );
}

async function StatusWithParams({ params, searchParams }: PageProps<"/laporan-saya/[id]">) {
  const { id } = await params;
  const { status } = await searchParams;
  const initial = states.find((s) => s === status);
  return <StatusView reportId={id} initial={initial ?? "diperiksa"} autoAdvance={!initial} />;
}
