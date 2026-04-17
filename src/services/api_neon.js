import { pgTable, integer, text, jsonb } from 'drizzle-orm/pg-core';

export const kurikulum = pgTable('kurikulum', {
  // Primary Key
  kode_mata_kuliah: integer('kode_mata_kuliah').primaryKey(),
  
  // Data Dasar
  nama_mata_kuliah: text('nama_mata_kuliah').notNull(),
  sks: integer('sks').notNull(),
  semester: text('semester'),
  kelompok_mata_kuliah: text('kelompok_mata_kuliah'),
  sifat_mata_kuliah: text('sifat_mata_kuliah'), // Misal: Wajib/Pilihan
  deskripsi: text('deskripsi'),
  rps_link: text('rps_link'),
  
  // Data Prasyarat
  // Menggunakan jsonb agar bisa menyimpan array kode prasyarat
  kode_mata_kuliah_prasyarat: jsonb('kode_mata_kuliah_prasyarat'), 
  mata_kuliah_prasyarat: text('mata_kuliah_prasyarat'),
  minimal_sks_prasyarat: integer('minimal_sks_prasyarat'),
  
  // Status & Metadata
  is_pilihan: integer('is_pilihan').default(0), // 0: False, 1: True
  catatan_perubahan: jsonb('catatan_perubahan'), // Menyimpan riwayat perubahan dalam bentuk JSON
});