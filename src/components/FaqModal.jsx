import React from 'react';

/**
 * Komponen FaqModal Reusable
 * @param {boolean} isOpen - Status apakah modal terbuka
 * @param {function} onClose - Fungsi untuk menutup modal
 * @param {Array} faqData - Array objek berisi { q: "Pertanyaan", a: "Jawaban" }
 */
const FaqModal = ({ isOpen, onClose, faqData = [] }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[500] flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
            <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[80vh]">
                
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                            Frequently Asked Questions
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            Pusat bantuan & panduan sistem
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
                        aria-label="Close Modal"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5"
                        >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>

                {/* List FAQ Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                    {faqData.length > 0 ? (
                        faqData.map((item, index) => (
                            <details
                                key={index}
                                className="group border border-slate-100 bg-slate-50/50 rounded-2xl overflow-hidden transition-all hover:border-blue-200 open:bg-white open:shadow-md"
                            >
                                <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight leading-tight pr-4">
                                        {item.q}
                                    </span>
                                    <div className="text-slate-400 group-open:rotate-180 transition-transform">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="w-4 h-4"
                                        >
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </div>
                                </summary>
                                <div className="px-4 pb-4">
                                    <div className="pt-2 border-t border-slate-100">
                                        <p className="text-xs text-slate-500 leading-relaxed font-medium italic">
                                            {item.a}
                                        </p>
                                    </div>
                                </div>
                            </details>
                        ))
                    ) : (
                        <p className="text-center text-slate-400 text-xs py-10">
                            Belum ada data FAQ tersedia.
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all shadow-sm"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FaqModal;