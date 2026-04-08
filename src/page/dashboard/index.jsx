import React, { useState, useMemo } from 'react';
import { 
    BookOpen, 
    Layers, 
    ShieldCheck, 
    X, 
    Search, 
    ArrowRight,
    LayoutGrid
} from 'lucide-react';

const Dashboard = ({ allCourses = [] }) => {
    // State Internal untuk Modal Detail
    const [detailModal, setDetailModal] = useState({
        isOpen: false,
        title: "",
        data: []
    });

    // 1. LOGIC INDEPENDEN: Menghitung Statistik
    const stats = useMemo(() => {
        const total = allCourses.length;
        const kelompokCount = allCourses.reduce((acc, curr) => {
            acc[curr.kelompok_mata_kuliah] = (acc[curr.kelompok_mata_kuliah] || 0) + 1;
            return acc;
        }, {});
        const sifatCount = allCourses.reduce((acc, curr) => {
            acc[curr.sifat_mata_kuliah] = (acc[curr.sifat_mata_kuliah] || 0) + 1;
            return acc;
        }, {});

        return { total, kelompokCount, sifatCount };
    }, [allCourses]);

    // 2. ACTION: Buka Popup Tabel
    const openDetail = (type, value) => {
        let filtered = [];
        let title = "";

        if (type === 'all') {
            filtered = allCourses;
            title = "Semua Mata Kuliah";
        } else if (type === 'kelompok') {
            filtered = allCourses.filter(c => c.kelompok_mata_kuliah === value);
            title = `Kelompok: ${value}`;
        } else if (type === 'sifat') {
            filtered = allCourses.filter(c => c.sifat_mata_kuliah === value);
            title = `Sifat: ${value}`;
        }

        setDetailModal({ isOpen: true, title, data: filtered });
    };

    return (
        <div className="space-y-6 mb-10 p-4">
            {/* GRID KARTU UTAMA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Total Card */}
                <div 
                    onClick={() => openDetail('all')}
                    className="bg-white border border-slate-200 p-7 rounded-[2.5rem] cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all group"
                >
                    {/* Baris Atas: Ikon dan Label Aksi */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 rounded-2xl bg-blue-100 text-blue-600">
                            <BookOpen size={24} />
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">
                            Klik Detail
                        </span>
                    </div>

                    {/* Konten Utama */}
                    <h3 className="text-4xl font-bold text-slate-800 mb-1">
                        {stats.total}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        Total <span className="text-slate-600">Mata Kuliah</span>
                    </p>
                </div>

                {/* Sifat Cards */}
                {Object.entries(stats.sifatCount).map(([key, value]) => (
                    <div 
                        key={key}
                        onClick={() => openDetail('sifat', key)}
                        className="bg-white border border-slate-200 p-7 rounded-[2.5rem] cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all group"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-3 rounded-2xl ${key === 'Wajib' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                <ShieldCheck size={24} />
                            </div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-blue-600">Klik Detail</span>
                        </div>
                        <h3 className="text-4xl font-bold text-slate-800 mb-1">{value}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Mata Kuliah <span className="text-slate-600">{key}</span></p>
                    </div>
                ))}
            </div>

            {/* KELOMPOK MK ROW */}
            <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8">
                <div className="flex items-center gap-2 mb-6 opacity-60">
                    <Layers size={14} />
                    <h4 className="text-[10px] font-bold uppercase tracking-widest">Berdasarkan Kelompok</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                    {Object.entries(stats.kelompokCount).map(([key, value]) => (
                        <button
                            key={key}
                            onClick={() => openDetail('kelompok', key)}
                            className="bg-white border border-slate-200 p-4 rounded-2xl hover:border-blue-400 hover:shadow-md transition-all text-left"
                        >
                            <span className="block text-[9px] font-bold text-blue-600 uppercase mb-1">{key}</span>
                            <span className="text-xl font-bold text-slate-800">{value}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* POPUP MODAL DETAIL (TABLE) */}
            {detailModal.isOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">{detailModal.title}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ditemukan {detailModal.data.length} Mata Kuliah</p>
                            </div>
                            <button 
                                onClick={() => setDetailModal({ ...detailModal, isOpen: false })}
                                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Table Content */}
                        <div className="flex-1 overflow-auto p-8">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-slate-100">
                                        <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kode</th>
                                        <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nama Mata Kuliah</th>
                                        <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">SKS</th>
                                        <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Sem</th>
                                        <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sifat</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {detailModal.data.map((course) => (
                                        <tr key={course.kode} className="group hover:bg-blue-50/30 transition-colors">
                                            <td className="py-4 text-xs font-bold text-blue-600">{course.kode}</td>
                                            <td className="py-4">
                                                <div className="text-xs font-bold text-slate-700 uppercase">{course.nama_mata_kuliah}</div>
                                                <div className="text-[9px] text-slate-400 font-medium">{course.kelompok_mata_kuliah}</div>
                                            </td>
                                            <td className="py-4 text-xs font-bold text-slate-600 text-center">{course.sks}</td>
                                            <td className="py-4 text-xs font-bold text-slate-600 text-center">{course.semester}</td>
                                            <td className="py-4">
                                                <span className={`text-[9px] font-bold px-2 py-1 rounded-md uppercase ${
                                                    course.sifat_mata_kuliah === 'Wajib' 
                                                    ? 'bg-orange-100 text-orange-600' 
                                                    : 'bg-emerald-100 text-emerald-600'
                                                }`}>
                                                    {course.sifat_mata_kuliah}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Modal Footer */}
                        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button 
                                onClick={() => setDetailModal({ ...detailModal, isOpen: false })}
                                className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-colors shadow-sm"
                            >
                                Tutup Panel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;