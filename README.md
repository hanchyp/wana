# WANA

Peta bersama untuk melaporkan dan mengikuti indikasi kebakaran hutan dan lahan di Indonesia. Prototipe untuk TECHNOVERSARY 2. **Seluruh data adalah simulasi.**

Arah visual: **Hutan Riang**. Ceria di halaman cerita (Beranda), tenang dan jernih di halaman alat (Pantau, Detail, Lapor, Status).

## Menjalankan

```bash
npm install
npm run dev
```

Buka http://localhost:3000.

## Halaman

| Rute | Isi |
|---|---|
| `/` | Beranda: hero foto, kemampuan, contoh pengamatan, kejadian terbaru, tiga langkah |
| `/pantau` | Peta nasional + daftar kejadian, popover, toggle peta/daftar; mobile memakai bottom sheet |
| `/kejadian/[id]` | Detail kejadian: galeri, ringkasan, hasil pemeriksaan AI, linimasa, Tangga Bukti |
| `/lapor` | Form 3 langkah: Pengamatan → Lokasi → Tinjau (`?kejadian=<id>` untuk menambah pengamatan) |
| `/laporan-saya/[id]` | Status laporan; otomatis berubah dari "diperiksa" ke "terbit" untuk demo. `?status=perlu-dilengkapi` atau `?status=terbit` untuk state tertentu |
| `/masuk` | Masuk (prototipe) |

## Struktur

- `lib/incidents.ts`: data simulasi dan proyeksi koordinat ke peta
- `components/`: ikon, logo, Tangga Bukti, penanda peta, bar navigasi, footer
- `public/maps/`: peta Indonesia dan Kalimantan bertekstur (SVG)
- `public/photos/`: foto hutan dari Wikimedia Commons

## Kredit foto (Wikimedia Commons)

| File | Fotografer | Lisensi |
|---|---|---|
| rawa-gambut-udara.jpg | Ruanda Agung Sugardiman/AusAID | CC BY 2.0 |
| sebangau-rawa.jpg, sebangau-peat-dome.jpg | Mankdhay rahman | CC BY-SA 4.0 |
| sebangau-panorama.jpg | Ariesandy0812 | CC BY-SA 4.0 |
| kapuas.jpg | Achmad Rabin Taim | CC BY 2.0 |
| hutan-lestari.jpg | Arbasbarong | CC BY-SA 4.0 |

WANA bukan layanan darurat. Untuk bahaya langsung, hubungi 112 atau pemadam kebakaran 113.
