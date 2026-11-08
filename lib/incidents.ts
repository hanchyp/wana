// DATA SIMULASI. Semua kejadian di sini fiktif dan wajib ditampilkan dengan label "Data simulasi".

export type Indication = "asap" | "api" | "keduanya";
export type Review = "lolos-ai" | "didukung" | "terverifikasi";
export type Condition = "belum-diketahui" | "berlangsung" | "mereda" | "selesai";

export type TimelineEntry = {
  time: string;
  title: string;
  note: string;
  kind: "pertama" | "ai" | "dukungan" | "pengamatan";
};

export type Incident = {
  id: string;
  title: string;
  place: string;
  region: string;
  regionShort: string;
  lon: number;
  lat: number;
  indication: Indication;
  review: Review;
  supportCount: number;
  condition: Condition;
  /** Tidak ada pembaruan melewati ambang informasi lama (48 jam). */
  stale: boolean;
  updatedAgo: string;
  firstSeen: string;
  updatedAt: string;
  summary: string;
  precision: "titik" | "area";
  radiusKm: number;
  timeline: TimelineEntry[];
};

export const incidents: Incident[] = [
  {
    id: "pulang-pisau",
    title: "Indikasi asap dan api di sekitar Pulang Pisau",
    place: "Pulang Pisau",
    region: "Kalimantan Tengah",
    regionShort: "Kalteng",
    lon: 114.05,
    lat: -2.85,
    indication: "keduanya",
    review: "didukung",
    supportCount: 3,
    condition: "berlangsung",
    stale: false,
    updatedAgo: "12 mnt lalu",
    firstSeen: "13:58 WIB",
    updatedAt: "14:20 WIB",
    summary:
      "Asap putih keabuan terlihat naik dari arah lahan gambut di timur laut Pulang Pisau sejak sekitar 13:50 WIB. Dua pelapor menyebut titik api kecil di tepi kanal. Asap terbawa angin ke barat daya.",
    precision: "area",
    radiusKm: 1.5,
    timeline: [
      {
        time: "14:20",
        title: "Pengamatan tambahan dari warga",
        note: "Asap masih terlihat dari Jl. Trans Kalimantan km 12. Foto lolos pemeriksaan.",
        kind: "pengamatan",
      },
      {
        time: "14:01",
        title: "Status naik: didukung pengamatan lain",
        note: "Ada pengamatan mandiri dari akun berbeda. Oleh sistem, bukan verifikasi petugas.",
        kind: "dukungan",
      },
      {
        time: "13:59",
        title: "Lolos pemeriksaan awal AI, kejadian terbit",
        note: "Tampil di peta sebagai titik perkiraan menurut pelapor.",
        kind: "ai",
      },
      {
        time: "13:58",
        title: "Laporan pertama diterima",
        note: "Identitas pelapor dan lokasi pengamat tidak ditampilkan ke publik.",
        kind: "pertama",
      },
    ],
  },
  {
    id: "pelalawan",
    title: "Indikasi api di sekitar Pelalawan",
    place: "Pelalawan",
    region: "Riau",
    regionShort: "Riau",
    lon: 102.1,
    lat: 0.15,
    indication: "api",
    review: "didukung",
    supportCount: 2,
    condition: "berlangsung",
    stale: false,
    updatedAgo: "45 mnt lalu",
    firstSeen: "12:40 WIB",
    updatedAt: "13:47 WIB",
    summary:
      "Api kecil terlihat di tepi lahan bekas tebangan dekat jalan perkebunan. Asap tipis bergerak ke utara.",
    precision: "titik",
    radiusKm: 0.5,
    timeline: [
      { time: "13:47", title: "Pengamatan tambahan dari warga", note: "Api masih terlihat dari jalan perkebunan.", kind: "pengamatan" },
      { time: "13:05", title: "Status naik: didukung pengamatan lain", note: "Pengamatan mandiri dari akun berbeda.", kind: "dukungan" },
      { time: "12:41", title: "Lolos pemeriksaan awal AI, kejadian terbit", note: "Tampil sebagai titik perkiraan.", kind: "ai" },
      { time: "12:40", title: "Laporan pertama diterima", note: "Identitas pelapor dilindungi.", kind: "pertama" },
    ],
  },
  {
    id: "ogan-komering-ilir",
    title: "Indikasi api di sekitar Ogan Komering Ilir",
    place: "Ogan Komering Ilir",
    region: "Sumatera Selatan",
    regionShort: "Sumsel",
    lon: 105.45,
    lat: -3.35,
    indication: "api",
    review: "lolos-ai",
    supportCount: 0,
    condition: "berlangsung",
    stale: false,
    updatedAgo: "1 jam lalu",
    firstSeen: "13:30 WIB",
    updatedAt: "13:30 WIB",
    summary: "Nyala api terlihat di kejauhan dari tanggul kanal, sekitar dua kilometer ke arah timur.",
    precision: "area",
    radiusKm: 2,
    timeline: [
      { time: "13:31", title: "Lolos pemeriksaan awal AI, kejadian terbit", note: "Tampil sebagai area perkiraan.", kind: "ai" },
      { time: "13:30", title: "Laporan pertama diterima", note: "Identitas pelapor dilindungi.", kind: "pertama" },
    ],
  },
  {
    id: "muaro-jambi",
    title: "Indikasi asap di sekitar Muaro Jambi",
    place: "Muaro Jambi",
    region: "Jambi",
    regionShort: "Jambi",
    lon: 103.75,
    lat: -1.55,
    indication: "asap",
    review: "lolos-ai",
    supportCount: 0,
    condition: "belum-diketahui",
    stale: false,
    updatedAgo: "2 jam lalu",
    firstSeen: "12:32 WIB",
    updatedAt: "12:32 WIB",
    summary: "Kepulan asap abu-abu terlihat di atas kebun warga, sumber belum diketahui.",
    precision: "area",
    radiusKm: 3,
    timeline: [
      { time: "12:33", title: "Lolos pemeriksaan awal AI, kejadian terbit", note: "Tampil sebagai area perkiraan.", kind: "ai" },
      { time: "12:32", title: "Laporan pertama diterima", note: "Identitas pelapor dilindungi.", kind: "pertama" },
    ],
  },
  {
    id: "ketapang",
    title: "Indikasi asap di sekitar Ketapang",
    place: "Ketapang",
    region: "Kalimantan Barat",
    regionShort: "Kalbar",
    lon: 110.35,
    lat: -1.75,
    indication: "asap",
    review: "didukung",
    supportCount: 1,
    condition: "mereda",
    stale: false,
    updatedAgo: "3 jam lalu",
    firstSeen: "09:10 WIB",
    updatedAt: "11:30 WIB",
    summary: "Asap terlihat sejak pagi, pengamatan terbaru menyebut asap mulai menipis.",
    precision: "area",
    radiusKm: 2,
    timeline: [
      { time: "11:30", title: "Pengamatan tambahan: dilaporkan mereda", note: "Asap terlihat menipis dari dermaga.", kind: "pengamatan" },
      { time: "09:40", title: "Status naik: didukung pengamatan lain", note: "Pengamatan mandiri dari akun berbeda.", kind: "dukungan" },
      { time: "09:11", title: "Lolos pemeriksaan awal AI, kejadian terbit", note: "Tampil sebagai area perkiraan.", kind: "ai" },
      { time: "09:10", title: "Laporan pertama diterima", note: "Identitas pelapor dilindungi.", kind: "pertama" },
    ],
  },
  {
    id: "merauke",
    title: "Indikasi api di sekitar Merauke",
    place: "Merauke",
    region: "Papua Selatan",
    regionShort: "Papua Sel.",
    lon: 140.3,
    lat: -8.2,
    indication: "api",
    review: "lolos-ai",
    supportCount: 0,
    condition: "berlangsung",
    stale: false,
    updatedAgo: "5 jam lalu",
    firstSeen: "11:15 WIT",
    updatedAt: "11:15 WIT",
    summary: "Garis api terlihat di padang rumput savana dekat jalan trans.",
    precision: "titik",
    radiusKm: 1,
    timeline: [
      { time: "11:16", title: "Lolos pemeriksaan awal AI, kejadian terbit", note: "Tampil sebagai titik perkiraan.", kind: "ai" },
      { time: "11:15", title: "Laporan pertama diterima", note: "Identitas pelapor dilindungi.", kind: "pertama" },
    ],
  },
  {
    id: "banjar",
    title: "Indikasi asap di sekitar Banjar",
    place: "Banjar",
    region: "Kalimantan Selatan",
    regionShort: "Kalsel",
    lon: 115.0,
    lat: -3.45,
    indication: "asap",
    review: "lolos-ai",
    supportCount: 0,
    condition: "belum-diketahui",
    stale: true,
    updatedAgo: "2 hari lalu",
    firstSeen: "6 Nov · 15:20 WITA",
    updatedAt: "6 Nov · 15:20 WITA",
    summary: "Asap tipis terlihat di kejauhan. Belum ada pembaruan sejak itu.",
    precision: "area",
    radiusKm: 3,
    timeline: [
      { time: "15:21", title: "Lolos pemeriksaan awal AI, kejadian terbit", note: "Tampil sebagai area perkiraan.", kind: "ai" },
      { time: "15:20", title: "Laporan pertama diterima", note: "Identitas pelapor dilindungi.", kind: "pertama" },
    ],
  },
  {
    id: "sumba-timur",
    title: "Indikasi asap di sekitar Sumba Timur",
    place: "Sumba Timur",
    region: "Nusa Tenggara Timur",
    regionShort: "NTT",
    lon: 120.25,
    lat: -9.75,
    indication: "asap",
    review: "lolos-ai",
    supportCount: 0,
    condition: "mereda",
    stale: true,
    updatedAgo: "3 hari lalu",
    firstSeen: "5 Nov · 10:02 WITA",
    updatedAt: "5 Nov · 10:02 WITA",
    summary: "Asap dari arah padang savana, dilaporkan mereda pada sore hari.",
    precision: "area",
    radiusKm: 4,
    timeline: [
      { time: "10:03", title: "Lolos pemeriksaan awal AI, kejadian terbit", note: "Tampil sebagai area perkiraan.", kind: "ai" },
      { time: "10:02", title: "Laporan pertama diterima", note: "Identitas pelapor dilindungi.", kind: "pertama" },
    ],
  },
];

export const featuredId = "pulang-pisau";

export function getIncident(id: string) {
  return incidents.find((i) => i.id === id);
}

export const conditionLabel: Record<Condition, string> = {
  "belum-diketahui": "Kondisi belum diketahui",
  berlangsung: "Masih berlangsung",
  mereda: "Dilaporkan mereda",
  selesai: "Selesai berdasarkan peninjauan",
};

export const indicationLabel: Record<Indication, string> = {
  asap: "Asap",
  api: "Api",
  keduanya: "Asap dan api",
};

// Proyeksi peta nasional (public/maps/nat-desktop.svg, 1100 x 435).
export const NATIONAL = { width: 1100, height: 435 };
export function projectNational(lon: number, lat: number) {
  const k = 20.833333 * 1.1;
  return { x: (lon - 94) * k, y: (7.5 - lat) * k };
}

// Proyeksi peta Kalimantan (public/maps/map-kalteng-rich.svg, 1100 x 800).
export const REGIONAL = { width: 1100, height: 800 };
export function projectRegional(lon: number, lat: number) {
  const k = 144.73;
  return { x: (lon - 110) * k, y: (1 - lat) * k };
}

export const regionalTowns = [
  { name: "Palangka Raya", lon: 113.92, lat: -2.21 },
  { name: "Sampit", lon: 112.95, lat: -2.53 },
  { name: "Banjarmasin", lon: 114.59, lat: -3.32 },
];
