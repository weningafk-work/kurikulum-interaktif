import React, { useState, useEffect } from "react";
import Select from "react-select";
import { X, History } from "lucide-react";

/**
 * AddLogForm Component
 * Komponen modal untuk menambah atau mengedit catatan perubahan (log) mata kuliah.
 */
const AddLogForm = ({ allCourses, onUpdate, onClose, editData, isOpen }) => {
    if (!isOpen) return null;
    // --- STATE DATA ARSIP ---
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [logData, setLogData] = useState({
        nama_kurikulum: "",
        tahun_ajaran: "",
        nama_lama: "",
        sks_lama: 2,
        semester_lama: 1,
        kelompok_lama: "MKK",
        sifat_lama: "Wajib",
        keterangan: "",
    });

    // Handle Edit Mode
    useEffect(() => {
        if (editData) {
            const { course, log } = editData;
            setSelectedCourse({
                value: course.kode_mata_kuliah,
                label: `${course.kode_mata_kuliah} - ${course.nama_mata_kuliah}`,
            });
            setLogData({
                id: log.id,
                nama_kurikulum: log.nama_kurikulum,
                tahun_ajaran: log.tahun_ajaran,
                nama_lama: log.data_lama.nama,
                sks_lama: log.data_lama.sks,
                semester_lama: log.data_lama.semester,
                kelompok_lama: log.data_lama.kelompok,
                sifat_lama: log.data_lama.sifat,
                keterangan: log.keterangan,
            });
        }
    }, [editData]);

    // --- OPTIONS ---
    const kelompokOptions = [
		{ value: "Umum", label: "Umum" },
		{ value: "Sains Dasar", label: "Sains Dasar" },
		{ value: "Inti Teknik Geomatika", label: "Inti Teknik Geomatika" },
		{ value: "Pendukung Rekayasa", label: "Pendukung Rekayasa" },
	];

	const sifatOptions = [
		{ "label": "Kognitif", "value": "Kognitif" },
		{ "label": "Case Based", "value": "Case Based" },
		{ "label": "Project Based", "value": "Project Based" }
	]

    const courseOptions = allCourses.map((c) => ({
        value: c.kode_mata_kuliah,
        label: `${c.kode_mata_kuliah} - ${c.nama_mata_kuliah}`,
    }));

    // --- STYLES ---
    const compactSelectStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: "rgb(249 250 251)",
            borderColor: state.isFocused ? "rgb(59 130 246)" : "rgb(209 213 219)",
            borderRadius: "0.5rem",
            minHeight: "35px",
            fontSize: "0.75rem",
            boxShadow: state.isFocused ? "0 0 0 1px rgb(59 130 246)" : "none",
            "&:hover": { borderColor: "rgb(59 130 246)" },
        }),
        menu: (base) => ({
            ...base,
            fontSize: "0.75rem",
            borderRadius: "0.5rem",
            zIndex: 100,
        }),
        option: (base, state) => ({
            ...base,
            padding: "6px 12px",
            backgroundColor: state.isSelected
                ? "rgb(59 130 246)"
                : state.isFocused
                    ? "rgb(239 246 255)"
                    : "white",
            color: state.isSelected ? "white" : "rgb(55 65 81)",
            cursor: "pointer",
        }),
    };

    const inputClass =
        "bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none transition-all";
    const labelClass =
        "block mb-1.5 text-[10px] font-bold text-gray-700 uppercase tracking-wider text-left";

    // --- HANDLER ---
    const handleSave = (e) => {
        e.preventDefault();
        if (!selectedCourse) return;

        const currentCourse = allCourses.find(
            (c) => c.kode_mata_kuliah === selectedCourse.value
        );

        const logPayload = {
            id: logData.id || Date.now(),
            nama_kurikulum: logData.nama_kurikulum,
            tahun_ajaran: logData.tahun_ajaran,
            data_lama: {
                nama: logData.nama_lama,
                sks: Number(logData.sks_lama),
                semester: Number(logData.semester_lama),
                kelompok: logData.kelompok_lama,
                sifat: logData.sifat_lama,
            },
            keterangan: logData.keterangan,
        };

        let updatedLogs;
        if (logData.id) {
            updatedLogs = (currentCourse.catatan_perubahan || []).map((l) =>
                l.id === logData.id ? logPayload : l
            );
        } else {
            updatedLogs = [
                ...(currentCourse.catatan_perubahan || []),
                logPayload,
            ];
        }

        onUpdate({ ...currentCourse, catatan_perubahan: updatedLogs });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
                {/* Header */}
                <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-tight flex items-center gap-2 text-blue-600">
                        <History size={14} />
                        {logData.id ? "Edit Log Perubahan" : "Tambah Log Perubahan"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    {/* Target Selector */}
                    <div className="pb-4 border-b border-dashed border-slate-200">
                        <label className="block mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Target Mata Kuliah
                        </label>
                        <Select
                            options={courseOptions}
                            value={selectedCourse}
                            styles={compactSelectStyles}
                            placeholder="Pilih MK..."
                            onChange={setSelectedCourse}
                        />
                    </div>

                    <form
                        onSubmit={handleSave}
                        className={`space-y-4 transition-all duration-300 ${
                            !selectedCourse ? "opacity-30 pointer-events-none" : "opacity-100"
                        }`}
                    >
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass}>Nama Kurikulum</label>
                                <input
                                    required
                                    className={inputClass}
                                    placeholder="Contoh: Kurikulum 2016"
                                    value={logData.nama_kurikulum}
                                    onChange={(e) => setLogData({ ...logData, nama_kurikulum: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Tahun Ajaran</label>
                                <input
                                    required
                                    className={inputClass}
                                    placeholder="Contoh: 2016/2017"
                                    value={logData.tahun_ajaran}
                                    onChange={(e) => setLogData({ ...logData, tahun_ajaran: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Nama MK (Saat Itu)</label>
                            <input
                                required
                                className={inputClass}
                                placeholder="Nama mata kuliah lama..."
                                value={logData.nama_lama}
                                onChange={(e) => setLogData({ ...logData, nama_lama: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className={labelClass}>SKS</label>
                                <input
                                    type="number"
                                    className={inputClass}
                                    value={logData.sks_lama}
                                    onChange={(e) => setLogData({ ...logData, sks_lama: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Semester</label>
                                <input
                                    type="number"
                                    className={inputClass}
                                    value={logData.semester_lama}
                                    onChange={(e) => setLogData({ ...logData, semester_lama: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Sifat MK</label>
                                <Select
                                    options={sifatOptions}
                                    value={sifatOptions.find((opt) => opt.value === logData.sifat_lama)}
                                    styles={compactSelectStyles}
                                    onChange={(opt) => setLogData({ ...logData, sifat_lama: opt.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Kelompok MK (Saat Itu)</label>
                            <Select
                                options={kelompokOptions}
                                value={kelompokOptions.find((opt) => opt.value === logData.kelompok_lama)}
                                styles={compactSelectStyles}
                                onChange={(opt) => setLogData({ ...logData, kelompok_lama: opt.value })}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Keterangan Perubahan</label>
                            <textarea
                                className={`${inputClass} h-20 resize-none`}
                                placeholder="Jelaskan alasan perubahan..."
                                value={logData.keterangan}
                                onChange={(e) => setLogData({ ...logData, keterangan: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                        >
                            <History size={14} /> Simpan Log Perubahan
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddLogForm;