import { supabase } from "../utils/supabaseClient";

const TABLE_NAME = "kurikulum-geomatika-2025";

export const CourseService = {
    /**
     * Mengambil semua data mata kuliah dari Supabase
     */
    async getAllCourses() {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select("*")
            .order("semester", { ascending: true });

        if (error) throw error;

        return data.map(course => ({
            ...course,
            kode_mata_kuliah: String(course.kode_mata_kuliah),
            semester: !isNaN(Number(course.semester)) && course.semester !== '' 
                ? Number(course.semester) 
                : course.semester,
            is_pilihan: course.is_pilihan ?? false,
            catatan_perubahan: Array.isArray(course.catatan_perubahan) 
                ? course.catatan_perubahan.filter(log => log.nama_kurikulum !== "") 
                : [],
            kode_mata_kuliah_prasyarat: Array.isArray(course.kode_mata_kuliah_prasyarat)
                ? course.kode_mata_kuliah_prasyarat
                .filter(kode => kode !== null && kode !== "") // Buang data kosong
                .map(String) // Paksa setiap elemen menjadi String
                : [],
            sks: Number(course.sks ?? 0)
        }));
    },

    /**
     * Menambahkan mata kuliah baru
     * @param {Object} newCourse - Data mata kuliah baru
     */
    async createCourse(newCourse) {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert([newCourse])
            .select();

        if (error) throw error;
        return data[0];
    },

    /**
     * Memperbarui data mata kuliah berdasarkan kode
     * @param {Object} updatedCourse - Data mata kuliah yang sudah diubah
     */
    async updateCourse(updatedCourse) {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update(updatedCourse)
            .eq("kode_mata_kuliah", updatedCourse.kode_mata_kuliah) // Pastikan primary key tepat
            .select();

        if (error) throw error;
        return data[0];
    },

    /**
     * Menghapus mata kuliah (Opsional, untuk fitur Admin)
     * @param {string} kode - Kode mata kuliah yang akan dihapus
     */
    async deleteCourse(kode) {
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq("kode_mata_kuliah", kode);

        if (error) throw error;
        return true;
    }
};