import React from 'react';

/**
 * Komponen DocumentModal
 * @param {boolean} isOpen - State untuk mengontrol visibilitas modal
 * @param {function} onClose - Fungsi untuk mengubah state menjadi false
 * @param {Array} documents - Array objek dokumen [{ name: "Judul", url: "link_download" }]
 */
const DocumentModal = ({ isOpen, onClose, documents = [] }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[500] flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200">
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200">
                
                {/* Header Modal */}
                <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                            Dokumen Kurikulum
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            Daftar unduhan berkas resmi
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
                        aria-label="Close modal"
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

                {/* List Dokumen */}
                <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {documents.length > 0 ? (
                        documents.map((doc, index) => (
                            <div
                                key={index}
                                className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white border border-slate-200 rounded-xl text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="w-5 h-5"
                                        >
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                            <line x1="10" y1="9" x2="8" y2="9" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-tight leading-tight">
                                            {doc.name}
                                        </h4>
                                    </div>
                                </div>

                                <a
                                    href={doc.url}
                                    target="_blank"
                                    支撑
                                    rel="noopener noreferrer"
                                    className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:shadow-sm transition-all shadow-sm"
                                    title="Unduh Dokumen"
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
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" x2="12" y1="15" y2="3" />
                                    </svg>
                                </a>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-slate-400 text-xs italic font-medium">
                            Tidak ada dokumen tersedia.
                        </div>
                    )}
                </div>

                {/* Footer Modal */}
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

export default DocumentModal;