import React, { useState, useMemo } from "react";
import { 
    X, 
    History, 
    Filter, 
    Search, 
    BookOpen, 
    Calendar, 
    Edit2, 
    Trash2 
} from "lucide-react";
import Swal from "sweetalert2";
import Select from "react-select";

const LogModal = ({ allCourses, onUpdate, onEditLog, onClose, isAdmin = true, isOpen }) => {
    if (!isOpen) return null;
    // Default filter null (Menampilkan semua riwayat)
    const [selectedFilter, setSelectedFilter] = useState(null);

    // Ambil daftar Mata Kuliah yang memiliki catatan perubahan
    const coursesWithLogs = useMemo(
        () =>
            allCourses.filter(
                (course) =>
                    course.catatan_perubahan &&
                    course.catatan_perubahan.length > 0,
            ),
        [allCourses],
    );

    // Opsi untuk Dropdown Filter
    const filterOptions = coursesWithLogs.map((c) => ({
        value: c.kode_mata_kuliah,
        label: `[${c.kode_mata_kuliah}] ${c.nama_mata_kuliah}`,
    }));

    // Logic Filtering berdasarkan pilihan user
    const filteredDisplay = useMemo(() => {
        if (!selectedFilter) return coursesWithLogs;
        return coursesWithLogs.filter((c) => c.kode_mata_kuliah === selectedFilter.value);
    }, [selectedFilter, coursesWithLogs]);

    // Action: Hapus Log
    const handleDeleteLog = (course, logId) => {
        Swal.fire({
            title: "Hapus Catatan?",
            text: "Data riwayat kurikulum yang dihapus tidak dapat dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444", 
            cancelButtonColor: "#64748b",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
            borderRadius: "1.5rem",
            customClass: {
                popup: "rounded-3xl font-sans",
                title: "text-slate-800 font-black uppercase tracking-tight text-lg",
                confirmButton:
                    "rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-widest focus:ring-0",
                cancelButton:
                    "rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-widest focus:ring-0",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedLogs = course.catatan_perubahan.filter(
                    (l) => l.id !== logId,
                );
                onUpdate({ ...course, catatan_perubahan: updatedLogs });

                Swal.fire({
                    title: "Terhapus!",
                    text: "Catatan perubahan telah dihapus.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                    borderRadius: "1.5rem",
                    customClass: {
                        popup: "rounded-3xl font-sans",
                        title: "text-slate-800 font-black uppercase tracking-tight text-lg",
                    },
                });
            }
        });
    };

    // Style Select
    const compactSelectStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: "white",
            borderColor: state.isFocused
                ? "rgb(59 130 246)"
                : "rgb(226 232 240)",
            borderRadius: "0.75rem",
            minHeight: "40px",
            fontSize: "0.75rem",
            boxShadow: "none",
            "&:hover": { borderColor: "rgb(59 130 246)" },
        }),
        option: (base, state) => ({
            ...base,
            fontSize: "0.75rem",
            backgroundColor: state.isSelected
                ? "rgb(59 130 246)"
                : state.isFocused
                    ? "rgb(239 246 255)"
                    : "white",
            color: state.isSelected ? "white" : "rgb(55 65 81)",
            cursor: "pointer",
        }),
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
                {/* HEADER */}
                <div className="bg-slate-50 px-8 py-5 border-b border-slate-200 flex justify-between items-center text-left">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg text-white">
                            <History size={20} />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider leading-none">
                                Log Perubahan Kurikulum
                            </h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-1">
                                Riwayat Pembaruan Struktur Mata Kuliah
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 rounded-full transition-all text-slate-400 hover:text-slate-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* FILTER SECTION */}
                <div className="px-8 py-4 bg-white border-b border-slate-100 flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center gap-2 text-slate-400 min-w-fit">
                        <Filter size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            Cari Riwayat:
                        </span>
                    </div>
                    <div className="w-full">
                        <Select
                            options={filterOptions}
                            styles={compactSelectStyles}
                            placeholder="Pilih Mata Kuliah tertentu..."
                            isClearable
                            onChange={setSelectedFilter}
                            value={selectedFilter}
                        />
                    </div>
                </div>

                {/* CONTENT AREA */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/30">
                    {filteredDisplay.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center">
                            <Search
                                size={48}
                                strokeWidth={1}
                                className="mb-4 opacity-20"
                            />
                            <p className="text-sm font-medium">
                                Data riwayat tidak ditemukan.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {filteredDisplay.map((course) => (
                                <div key={course.kode_mata_kuliah} className="text-left">
                                    {/* Judul Mata Kuliah Group */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-px flex-1 bg-slate-200"></div>
                                        <div className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                                            <span className="text-[10px] font-black text-blue-600">
                                                {course.kode_mata_kuliah}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-700 uppercase">
                                                {course.nama_mata_kuliah}
                                            </span>
                                        </div>
                                        <div className="h-px flex-1 bg-slate-200"></div>
                                    </div>

                                    {/* Daftar Log Per MK */}
                                    <div className="space-y-5">
                                        {course.catatan_perubahan.map(
                                            (log, index) => (
                                                <div
                                                    key={log.id || index}
                                                    className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                                                >
                                                    {/* ACTION BUTTONS */}
                                                    {isAdmin && (
                                                        <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => {
                                                                    onEditLog(course, log);
                                                                    onClose(); 
                                                                }}
                                                                className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                                                                title="Edit Log"
                                                            >
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteLog(course, log.id)}
                                                                className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                                                                title="Hapus Log"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* Meta: Kurikulum & Tahun Ajaran */}
                                                    <div className="flex flex-wrap gap-2 mb-3 pr-16">
                                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800 text-white rounded-md">
                                                            <BookOpen size={10} />
                                                            <span className="text-[9px] font-black uppercase tracking-widest">
                                                                {log.nama_kurikulum}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-md">
                                                            <Calendar size={10} />
                                                            <span className="text-[9px] font-black uppercase tracking-widest">
                                                                TA {log.tahun_ajaran}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Keterangan */}
                                                    <p className="text-xs text-slate-600 leading-relaxed mb-5 font-medium italic">
                                                        "{log.keterangan}"
                                                    </p>

                                                    {/* Snapshot Data Lama */}
                                                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                                        <span className="text-[8px] font-black text-slate-400 uppercase mb-3 block tracking-widest">
                                                            Snapshot Data Sebelum Perubahan
                                                        </span>
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-2">
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] font-bold text-slate-700 truncate">
                                                                    {log.data_lama.nama}
                                                                </span>
                                                                <span className="text-[9px] text-slate-400 font-medium uppercase mt-1 tracking-tighter">
                                                                    Nama MK
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-col border-l border-slate-200 pl-3">
                                                                <span className="text-[10px] font-bold text-slate-700">
                                                                    {log.data_lama.sks} SKS / Sem {log.data_lama.semester}
                                                                </span>
                                                                <span className="text-[9px] text-slate-400 font-medium uppercase mt-1 tracking-tighter">
                                                                    Beban
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-col border-l border-slate-200 pl-3">
                                                                <span className="text-[10px] font-bold text-slate-700 uppercase">
                                                                    {log.data_lama.kelompok || "-"}
                                                                </span>
                                                                <span className="text-[9px] text-slate-400 font-medium uppercase mt-1 tracking-tighter">
                                                                    Kelompok
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-col border-l border-slate-200 pl-3">
                                                                <span
                                                                    className={`text-[8px] font-black px-2 py-0.5 rounded-md self-start uppercase ${log.data_lama.sifat === "Wajib" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}
                                                                >
                                                                    {log.data_lama.sifat}
                                                                </span>
                                                                <span className="text-[9px] text-slate-400 font-medium uppercase mt-1 tracking-tighter">
                                                                    Sifat
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="bg-white px-8 py-4 border-t border-slate-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 transition-all"
                    >
                        Tutup Panel Riwayat
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogModal;