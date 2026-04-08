import React from 'react';
import { X, FileText, Printer } from 'lucide-react';

/**
 * Komponen PrintKrsModal
 * @param {boolean} isOpen - Status buka/tutup modal
 * @param {function} onClose - Fungsi untuk menutup modal
 * @param {Object} studentData - Object berisi {nama, nim}
 * @param {function} setStudentData - Fungsi untuk mengupdate data mahasiswa
 * @param {function} onExport - Fungsi eksekusi export (ExportService.toPDF)
 */
const PrintKrsModal = ({ 
    isOpen, 
    onClose, 
    studentData, 
    setStudentData,
    selectedCourses,
    totalSks, 
    onExport 
}) => {
    if (!isOpen) return null;

    const handleInputChange = (field, value) => {
        setStudentData({
            ...studentData,
            [field]: value,
        });
    };

    const isFormValid = studentData.nama && studentData.nim;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div 
                className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                        <FileText size={14} className="text-red-600" />
                        Pengaturan Cetak PDF
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Nama Mahasiswa
                        </label>
                        <input
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none transition-all"
                            placeholder="Masukkan nama lengkap..."
                            value={studentData.nama}
                            onChange={(e) => handleInputChange('nama', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            NIM
                        </label>
                        <input
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none transition-all"
                            placeholder="Masukkan nomor identitas..."
                            value={studentData.nim}
                            onChange={(e) => handleInputChange('nim', e.target.value)}
                        />
                    </div>

                    <button
                        onClick={() => onExport(selectedCourses, totalSks, studentData)}
                        disabled={!isFormValid}
                        className="w-full py-3 bg-red-600 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2 hover:bg-red-700 active:scale-95 disabled:opacity-50 disabled:shadow-none disabled:active:scale-100"
                    >
                        <Printer size={14} /> Cetak Sekarang
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrintKrsModal;