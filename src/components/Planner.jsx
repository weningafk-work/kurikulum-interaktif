import React, { useMemo } from "react";
import {
    Plus,
    ChevronDown,
    Edit3,
    Trash2,
    ClipboardPenLine,
    View,
    File,
    ClipboardList,
    HelpCircle,
    FileText,
    BookCheck
} from "lucide-react";
import CourseCard from "../components/CourseCard";
import LoadingSpinner from "./LoadingSpinner";

const Planner = ({
    isLoading,
    isAdmin,
    allCourses,
    selectedIds,
    totalSks,
    activeHighlight,
    isCourseLocked,
    toggleCourse,
    setModalCourse,
    setIsFormOpen,
    setFormMode,
    setIsAddLogOpen,
    setIsImageModalOpen,
    setIsDocModalOpen,
    setIsLogModalOpen,
    setIsFaqModalOpen,
    setIsPrintModalOpen
}) => {
    if (isLoading) {
        return <LoadingSpinner message="Sinkronisasi dengan Database..." />;
    }

    const activeObj = useMemo(
        () => allCourses.find((c) => c.kode_mata_kuliah === activeHighlight),
        [activeHighlight, allCourses]
    );

    return (
        <main className="flex-1 flex flex-col min-h-0 px-4 py-2">
            <div className="space-y-1 mb-3">
                <div className="flex items-center gap-2">
                    <h1 className="text-lg font-bold text-slate-800">
                        Perencanaan Studi
                    </h1>
                </div>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                    Visualisasi struktur kurikulum interaktif yang dapat dicoba untuk
                    <a
                        href="https://www.youtube.com/watch?v=RnbqVremDo8"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-bold hover:underline hover:text-blue-700 transition-colors ml-1"
                    >
                        simulasi pengambilan mata kuliah
                    </a> sebelum mengambil KRS pada setiap awal semester.
                </p>
            </div>

            {/* Toolbar */}
            <div className="flex-none flex flex-wrap items-center justify-between gap-3 mb-4 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-2">
                    {isAdmin && (
                        <div className="relative group">
                            <button className="text-white bg-blue-700 hover:bg-blue-800 font-bold rounded-lg text-[10px] px-3 py-2 uppercase tracking-wide transition-all flex items-center gap-1.5 shadow-sm active:scale-95">
                                <Plus size={14} strokeWidth={3} /> Kelola MK <ChevronDown size={12} />
                            </button>
                            <div className="absolute left-0 mt-1 w-55 bg-white border border-slate-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                                <button onClick={() => { setFormMode("add"); setIsFormOpen(true); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold text-slate-700 hover:bg-slate-50 border-b border-slate-100 transition-colors">
                                    <Plus size={14} className="text-blue-600" /> TAMBAH BARU
                                </button>
                                <button onClick={() => { setFormMode("edit"); setIsFormOpen(true); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                                    <Edit3 size={14} className="text-orange-500" /> EDIT DATA
                                </button>
                                <button onClick={() => { setFormMode("delete"); setIsFormOpen(true); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold text-red-600 hover:bg-red-50 transition-colors">
                                    <Trash2 size={14} /> HAPUS DATA
                                </button>
                                <button onClick={() => setIsAddLogOpen(true)} className="w-full flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold text-blue-600 hover:bg-blue-50 border-t border-slate-100 transition-colors">
                                    <ClipboardPenLine size={14} /> TAMBAH CATATAN PERUBAHAN
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="h-6 w-[1px] bg-slate-200 mx-1" />
                    <div className="inline-flex rounded-md shadow-sm bg-white">
                        <button onClick={() => setIsImageModalOpen(true)} className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold text-slate-600 border border-slate-200 rounded-l-lg hover:bg-slate-50 hover:text-blue-600 transition-colors">
                            <View size={14} /> <span className="hidden lg:inline">View Diagram Kurikulum</span>
                        </button>
                        <button onClick={() => setIsDocModalOpen(true)} className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold text-slate-600 border-t border-b border-r border-slate-200 hover:bg-slate-50 hover:text-amber-600 transition-colors">
                            <File size={14} /> <span className="hidden lg:inline">Dokumen</span>
                        </button>
                        <button onClick={() => setIsLogModalOpen(true)} className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold text-slate-600 border-t border-b border-r border-slate-200 hover:bg-slate-50 hover:text-amber-600 transition-colors">
                            <ClipboardList size={14} /> <span className="hidden lg:inline">Log</span>
                        </button>
                        <button onClick={() => setIsFaqModalOpen(true)} className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold text-slate-600 border-t border-b border-r border-slate-200 rounded-r-lg hover:bg-slate-50 hover:text-amber-600 transition-colors">
                            <HelpCircle size={14} /> <span className="hidden lg:inline">FAQ</span>
                        </button>
                    </div>
                </div>

                <div className="inline-flex rounded-md">
                    <button onClick={() => setIsPrintModalOpen(true)} className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-red-600 transition-colors">
                        <FileText size={14} /> PDF
                    </button>
                    <div className="flex items-center gap-2.5 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 ml-4">
                        <div className="p-1 bg-blue-600 rounded text-white">
                            <BookCheck size={14} />
                        </div>
                        <div className="text-left">
                            <p className="text-[9px] uppercase font-bold text-blue-400 leading-none mb-0.5">Total</p>
                            <p className="font-black text-sm text-blue-900 leading-none">
                                {totalSks} <span className="text-[10px] font-medium opacity-70">SKS</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Container */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar pb-2">
                <div className="flex gap-4 h-full min-w-max">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((sem) => {
                        const steps = allCourses.filter((c) => sem === 9 ? c.is_pilihan : (c.semester === sem && !c.is_pilihan));
                        const SksTerambil = steps.filter((step) => selectedIds.includes(step.kode_mata_kuliah)).reduce((sum, step) => sum + (step.sks || 0), 0);

                        return (
                            <section key={sem} className="w-60 flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="flex-none p-3 flex flex-col gap-1 transition-all bg-white border-b border-slate-100 shadow-sm text-slate-800">
                                    <div className="font-black text-[14px] leading-none text-slate-500">
                                        {sem === 9 ? "Pilihan" : `Semester ${sem}`}
                                        <div className="w-1/2 mt-2">
                                            <span className={`text-[9pt] font-semibold ${SksTerambil > 0 ? "text-green-600" : "text-slate-400"}`}>
                                                Diambil: {SksTerambil} SKS
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 p-2.5 space-y-2 overflow-y-auto bg-slate-50/50 min-h-0">
                                    {steps.length > 0 ? steps.map((course) => (
                                        <CourseCard
                                            key={course.kode_mata_kuliah}
                                            course={course}
                                            isSelected={selectedIds.includes(course.kode_mata_kuliah)}
                                            isActive={activeHighlight === course.kode_mata_kuliah}
                                            isLocked={isCourseLocked(course)}
                                            isRelated={activeObj?.kode_mata_kuliah_prasyarat.includes(course.kode_mata_kuliah) || course.kode_mata_kuliah_prasyarat.includes(activeHighlight)}
                                            onSelect={toggleCourse}
                                            onDetail={setModalCourse}
                                        />
                                    )) : (
                                        <div className="flex flex-col items-center justify-center h-full opacity-30 py-10">
                                            <span className="text-[10px] font-black uppercase">Belum ada data</span>
                                        </div>
                                    )}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>
        </main>
    );
};

export default Planner;