import type { Metadata } from "next";
import { Suspense } from "react";
import { getIncident } from "@/lib/incidents";
import { LaporForm } from "./LaporForm";

export const metadata: Metadata = { title: "Laporkan pengamatan" };

export default function LaporPage({ searchParams }: PageProps<"/lapor">) {
  return (
    <Suspense fallback={<LaporForm />}>
      <LaporWithContext searchParams={searchParams} />
    </Suspense>
  );
}

async function LaporWithContext({ searchParams }: Pick<PageProps<"/lapor">, "searchParams">) {
  const { kejadian } = await searchParams;
  const related = typeof kejadian === "string" ? getIncident(kejadian) : undefined;
  return <LaporForm relatedId={related?.id} relatedTitle={related?.title} />;
}
