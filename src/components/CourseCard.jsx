import React from 'react';
import { Lock, AlertCircle } from 'lucide-react';

/**
 * CourseCard Component
 * @param {Object} course - Data objek mata kuliah
 * @param {boolean} isSelected - Status apakah kartu sedang dipilih
 * @param {boolean} isRelated - Status apakah kartu berhubungan (prasyarat)
 * @param {boolean} isActive - Status apakah kartu sedang aktif fokus
 * @param {boolean} isLocked - Status apakah kartu terkunci
 * @param {function} onSelect - Handler saat kartu diklik
 * @param {function} onDetail - Handler saat kartu di-double click
 */
const CourseCard = ({
    course,
    isSelected,
    isRelated,
    isActive,
    isLocked,
    onSelect,
    onDetail,
}) => {
    // Mapping warna berdasarkan Kelompok MK (Refactored dari switch ke Object agar lebih clean)
    const groupStyles = {
        "Umum": "bg-slate-100 text-slate-600 border-slate-200",
        "Sains Dasar": "bg-amber-100 text-amber-700 border-amber-200",
        "Inti Teknik Geomatika": "bg-blue-100 text-blue-700 border-blue-200",
        "Pendukung Rekayasa": "bg-green-100 text-green-700 border-green-200",
    };

    const groupTextColors = {
        "Umum": "text-slate-400",
        "Sains Dasar": "text-amber-600",
        "Inti Teknik Geomatika": "text-blue-600",
        "Pendukung Rekayasa": "text-green-600",
    };

    const currentGroupStyle = groupStyles[course.kelompok_mata_kuliah] || "bg-gray-100 text-gray-500 border-gray-200";
    const currentGroupTextColor = groupTextColors[course.kelompok_mata_kuliah] || "text-gray-400";

    return (
        <div
            onClick={isLocked ? null : () => onSelect(course)}
            onDoubleClick={() => onDetail(course)}
            className={`group relative p-3 rounded-xl border transition-all select-none text-left shadow-sm
                ${
                    isLocked
                        ? "bg-gray-100 border-gray-300 cursor-not-allowed opacity-70"
                        : isSelected
                            ? "bg-green-50 border-green-400 cursor-pointer shadow-md"
                            : "bg-white border-gray-200 hover:border-blue-400 hover:shadow-md cursor-pointer"
                }
                ${isActive && !isLocked ? "ring-2 ring-blue-600 z-20" : ""}
                ${isRelated && !isLocked ? "bg-yellow-300 border-yellow-500 ring-1 ring-yellow-400 z-10" : ""}
            `}
        >
            <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-1">
                    <span
                        className={`text-[10px] font-bold tracking-tighter uppercase leading-none 
                        ${isLocked ? "text-gray-400" : isRelated ? "text-yellow-900" : "text-slate-400"}`}
                    >
                        {course.kode_mata_kuliah}
                    </span>

                    {isLocked ? (
                        <Lock size={12} className="text-gray-400" />
                    ) : (
                        course.kode_mata_kuliah_prasyarat?.length > 0 && (
                            <AlertCircle
                                size={10}
                                className={isRelated ? "text-yellow-800" : "text-yellow-500"}
                            />
                        )
                    )}
                </div>

                {/* BADGE SKS */}
                <span
                    className={`text-[9px] font-bold px-1.5 py-1 rounded italic leading-none border transition-all
                    ${
                        isLocked
                            ? "bg-gray-200 text-gray-500 border-gray-300"
                            : isRelated
                                ? "bg-yellow-400 text-yellow-900 border-yellow-500 shadow-sm"
                                : currentGroupStyle
                    }`}
                >
                    {course.sks} SKS
                </span>
            </div>

            <h4
                className={`font-bold text-[11px] truncate leading-tight mb-1.5 
                ${isLocked ? "text-gray-500" : isRelated ? "text-yellow-900" : "text-slate-800"}`}
                title={course.nama_mata_kuliah}
            >
                {course.nama_mata_kuliah}
            </h4>

            {/* TEKS KATEGORI */}
            <div
                className={`text-[8px] uppercase tracking-[0.1em] font-bold leading-none truncate 
                ${
                    isLocked
                        ? "text-gray-400"
                        : isRelated
                            ? "text-yellow-800"
                            : currentGroupTextColor
                }`}
            >
                {course.kelompok_mata_kuliah}
            </div>
        </div>
    );
};

export default CourseCard;