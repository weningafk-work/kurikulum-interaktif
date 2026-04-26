import { initialCourses } from "../data/courses";

// Memindahkan data ke variabel lokal yang bisa dimutasi
let localCourses = [...initialCourses];

export const CourseService = {
    /**
     * Mengambil semua data dari variabel lokal
     */
    async getAllCourses() {
        // Melakukan normalisasi data agar tetap konsisten
        return localCourses.map(course => ({
            ...course,
            kode_mata_kuliah: String(course.kode_mata_kuliah),
            semester: Number(course.semester) || 1,
            is_pilihan: course.is_pilihan ?? false,
            catatan_perubahan: Array.isArray(course.catatan_perubahan) ? course.catatan_perubahan : [],
            kode_mata_kuliah_prasyarat: Array.isArray(course.kode_mata_kuliah_prasyarat)
                ? course.kode_mata_kuliah_prasyarat.map(String)
                : [],
            sks: Number(course.sks ?? 0)
        })).sort((a, b) => a.semester - b.semester);
    },

    /**
     * Simulasi Tambah Data
     */
    async createCourse(newCourse) {
        // Cek jika kode sudah ada
        const exists = localCourses.find(c => c.kode_mata_kuliah === newCourse.kode_mata_kuliah);
        if (exists) throw new Error("Kode mata kuliah sudah terdaftar!");

        localCourses.push(newCourse);
        return newCourse;
    },

    /**
     * Simulasi Update Data
     */
    async updateCourse(updatedCourse) {
        const index = localCourses.findIndex(
            c => c.kode_mata_kuliah === updatedCourse.kode_mata_kuliah
        );

        if (index === -1) throw new Error("Mata kuliah tidak ditemukan!");

        // Update data di dalam array
        localCourses[index] = { ...localCourses[index], ...updatedCourse };
        return localCourses[index];
    },

    /**
     * Simulasi Hapus Data
     */
    async deleteCourse(kode) {
        const initialLength = localCourses.length;
        localCourses = localCourses.filter(c => c.kode_mata_kuliah !== kode);
        
        if (localCourses.length === initialLength) {
            throw new Error("Mata kuliah tidak ditemukan!");
        }
        return true;
    },

    /**
     * Helper: Reset data ke awal (opsional)
     */
    resetData() {
        localCourses = [...initialCourses];
        return true;
    }
};