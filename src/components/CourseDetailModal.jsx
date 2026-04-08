import React from 'react';
import { X, AlertCircle, CircleCheck, CircleX, ExternalLink } from 'lucide-react';

/**
 * Komponen CourseDetailModal
 * @param {Object} course - Data mata kuliah yang dipilih (modalCourse)
 * @param {Array} allCourses - List semua mata kuliah untuk mencari silsilah prasyarat
 * @param {Array} selectedIds - List ID mata kuliah yang sudah diambil/dipilih user
 * @param {function} onClose - Fungsi untuk menutup modal
 */
const CourseDetailModal = ({ course, allCourses = [], selectedIds = [], onClose }) => {
    if (!course) return null;

    // Fungsi rekursif untuk mencari silsilah prasyarat
    const getPrerequisiteChain = (targetCourse) => {
        const chain = [];
        const visited = new Set();

        const findChain = (kode_mata_kuliah) => {
            const current = allCourses.find((c) => c.kode_mata_kuliah === kode_mata_kuliah);
            if (
                current &&
                current.kode_mata_kuliah_prasyarat &&
                !visited.has(kode_mata_kuliah)
            ) {
                visited.add(kode_mata_kuliah);
                current.kode_mata_kuliah_prasyarat.forEach((pKode) => {
                    const prereq = allCourses.find((c) => c.kode_mata_kuliah === pKode);
                    if (prereq) {
                        chain.push(prereq);
                        findChain(pKode);
                    }
                });
            }
        };

        findChain(targetCourse.kode_mata_kuliah);
        return chain;
    };

    const prerequisiteChain = getPrerequisiteChain(course);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col h-full">
                    <div className="p-6 w-full border-b border-slate-100">
                        {/* Header Info */}
                        <div className="mb-6">
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-1">
                                {course.kode_mata_kuliah} • Semester {course.semester}
                            </span>
                            <h2 className="text-xl font-black text-slate-800 leading-tight">
                                {course.nama_mata_kuliah}
                                <span className="font-medium text-gray-500 ml-2 text-lg">
                                    ({course.sks} SKS)
                                </span>
                            </h2>
                        </div>

                        {/* Section: Prasyarat */}
                        <div className="mb-6">
                            <p className="text-[9px] text-slate-400 font-bold uppercase mb-4 flex items-center gap-2">
                                <AlertCircle size={12} /> Alur Prasyarat
                            </p>

                            <div className="space-y-3 relative">
                                {prerequisiteChain.length === 0 ? (
                                    <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                        <p className="text-[10px] text-slate-400 font-medium">
                                            Mata kuliah ini tidak memiliki prasyarat dari mata kuliah lainnya. Jika masih terkunci berarti Anda belum memenuhi minimal 100 SKS (Kuliah Kerja Nyata) atau 120 SKS (Seminar Proposal, Kolokium, Tugas Akhir).
                                        </p>
                                    </div>
                                ) : (
                                    prerequisiteChain.map((step, index) => (
                                        <div key={step.kode_mata_kuliah} className="flex items-start gap-3 relative">
                                            {/* Garis Alur Vertikal */}
                                            {index !== prerequisiteChain.length - 1 && (
                                                <div className="absolute left-[11px] top-6 w-[2px] h-6 bg-slate-200" />
                                            )}

                                            <div className={`z-10 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                                selectedIds.includes(step.kode_mata_kuliah)
                                                    ? "bg-green-500 text-white"
                                                    : "bg-slate-200 text-slate-500"
                                            }`}>
                                                {index + 1}
                                            </div>

                                            <div className="flex-1 bg-white p-2.5 rounded-lg border border-slate-200 flex justify-between items-center shadow-sm">
                                                <div>
                                                    <span className="text-[9px] font-black text-blue-500 block">
                                                        {step.kode_mata_kuliah}
                                                    </span>
                                                    <p className="text-[11px] font-bold text-slate-700">
                                                        {step.nama_mata_kuliah}
                                                    </p>
                                                </div>

                                                {/* Status Badge */}
                                                {selectedIds.includes(step.kode_mata_kuliah) ? (
                                                    <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md">
                                                        <span className="text-[10px] font-black text-green-600 uppercase tracking-tighter">
                                                            Lulus
                                                        </span>
                                                        <CircleCheck size={14} className="text-green-500 fill-green-50" />
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1 bg-red-50 px-2 py-1 rounded-md">
                                                        <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter">
                                                            Belum
                                                        </span>
                                                        <CircleX size={14} className="text-red-500 fill-red-50" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Section: Deskripsi */}
                        <div className="space-y-4">
                            <div>
                                <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">
                                    Deskripsi Mata Kuliah
                                </p>
                                <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    "{course.deskripsi || "Tidak ada deskripsi tersedia untuk mata kuliah ini."}"
                                </p>
                            </div>
                        </div>

                        {/* Action Button */}
                        <a
                            href={course.rps_link}
                            target="_blank" // Membuka di tab baru agar aplikasi tidak tertutup
                            rel="noopener noreferrer" // Keamanan tambahan
                            className="w-full mt-8 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                            >
                            Unduh Dokumen Terkait <ExternalLink size={14} />
                        </a>

                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default CourseDetailModal;