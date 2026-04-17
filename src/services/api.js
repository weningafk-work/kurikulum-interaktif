
import { eq, asc } from "drizzle-orm";
import { db } from "./connection_neon";
import { kurikulum } from "./api_neon";

export const CourseService = {
    /**
     * Mengambil semua data mata kuliah dari Neon
     */
    async getAllCourses() {
        try {
            // Menggunakan Drizzle untuk query
            const results = await db.query.kurikulum.findMany({
                orderBy: [asc(kurikulum.semester)],
            });

            console.log('LOG DATAAA', results);

            return results.map(course => ({
                ...course,
                // Logika transformasi tetap dipertahankan
                kode_mata_kuliah: String(course.kode_mata_kuliah),
                semester: !isNaN(Number(course.semester)) && course.semester !== '' 
                    ? Number(course.semester) 
                    : course.semester,
                is_pilihan: !!course.is_pilihan, // Konversi 0/1 atau null ke boolean
                catatan_perubahan: Array.isArray(course.catatan_perubahan) 
                    ? course.catatan_perubahan.filter(log => log.nama_kurikulum !== "") 
                    : [],
                kode_mata_kuliah_prasyarat: Array.isArray(course.kode_mata_kuliah_prasyarat)
                    ? course.kode_mata_kuliah_prasyarat
                        .filter(kode => kode !== null && kode !== "")
                        .map(String)
                    : [],
                sks: Number(course.sks ?? 0)
            }));
        } catch (error) {
            console.error('Error fetching data from Neon:', error);
            throw error;
        }
    },

    /**
     * Menambahkan mata kuliah baru
     */
    async createCourse(newCourse) {
        try {
            const data = await db.insert(kurikulum).values(newCourse).returning();
            return data[0];
        } catch (error) {
            console.error('Error creating course:', error);
            throw error;
        }
    },

    /**
     * Memperbarui data mata kuliah
     */
    async updateCourse(updatedCourse) {
        try {
            const data = await db.update(kurikulum)
                .set(updatedCourse)
                .where(eq(kurikulum.kode_mata_kuliah, updatedCourse.kode_mata_kuliah))
                .returning();
            return data[0];
        } catch (error) {
            console.error('Error updating course:', error);
            throw error;
        }
    },

    /**
     * Menghapus mata kuliah
     */
    async deleteCourse(kode) {
        try {
            await db.delete(kurikulum)
                .where(eq(kurikulum.kode_mata_kuliah, kode));
            return true;
        } catch (error) {
            console.error('Error deleting course:', error);
            throw error;
        }
    }
};

export default CourseService;