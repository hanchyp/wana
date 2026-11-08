import type { Metadata } from "next";
import { PantauView } from "./PantauView";

export const metadata: Metadata = {
  title: "Pantau Wilayah",
  description: "Peta laporan indikasi asap dan api dari warga. Data simulasi.",
};

export default function PantauPage() {
  return <PantauView />;
}
