import { z } from 'zod';

export const CourseSchema = z.object({
  kode: z.string().min(3, "Kode minimal 3 karakter").uppercase(),
  nama_mata_kuliah: z.string().min(3, "Nama minimal 3 karakter"),
  sks: z.number().min(1).max(6),
  semester: z.number().min(1).max(9),
  kelompok_mata_kuliah: z.string().min(2, "Kelompok harus diisi"),
  sifat_mata_kuliah: z.enum(["Wajib", "Pilihan"]),
  deskripsi: z.string().optional(),
  kode_mata_kuliah_prasyarat: z.array(z.string()).default([]),
  minimal_sks_prasyarat: z.number().default(0),
  rps_link: z.string().url("Link RPS harus URL valid").or(z.literal("")),
});