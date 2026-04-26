import React from 'react';

/**
 * Komponen ImagePreviewModal
 * @param {boolean} isOpen - Mengontrol tampilan modal
 * @param {function} onClose - Fungsi untuk menutup modal
 * @param {string} imageUrl - URL gambar yang akan ditampilkan
 * @param {string} title - Judul preview (optional)
 */
const ImagePreviewModal = ({ 
    isOpen, 
    onClose, 
    imageUrl, 
    title = "Preview Gambar Kurikulum" 
}) => {
    if (!isOpen || !imageUrl) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[500] flex flex-col animate-in fade-in duration-300">
            {/* Top Navigation Bar */}
            <div className="flex justify-between items-center px-8 py-6 text-white border-b border-white/10 bg-slate-900/50">
                <div>
                    <h4 className="text-xs font-black uppercase tracking-[0.2em]">
                        {title}
                    </h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-widest italic">
                        Zoom & Pan Mode Active
                    </p>
                </div>
                
                <div className="flex items-center gap-4">
                    {/* Tombol Download */}
                    <a
                        href={imageUrl}
                        download
                        className="p-3 hover:bg-white/10 rounded-full transition-all text-slate-400 hover:text-white"
                        title="Unduh Gambar"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5"
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" x2="12" y1="15" y2="3" />
                        </svg>
                    </a>

                    {/* Tombol Close */}
                    <button
                        onClick={onClose}
                        className="p-3 bg-white/10 hover:bg-red-500 rounded-full transition-all text-white group"
                        aria-label="Close preview"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-6 h-6"
                        >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Image Container */}
            <div className="flex-1 overflow-auto p-4 flex justify-center items-center custom-scrollbar bg-black/20">
                <img
                    src={imageUrl}
                    alt="Full Preview"
                    className="w-full shadow-2xl rounded-lg cursor-zoom-in transition-transform duration-300 hover:scale-[1.01]"
                    onClick={() => window.open(imageUrl, "_blank")}
                    title="Klik untuk melihat resolusi penuh"
                />
            </div>

            {/* Footer Hint */}
            <div className="py-4 text-center text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] bg-slate-900/50">
                Gunakan Scroll Mouse untuk navigasi • Klik gambar untuk resolusi asli
            </div>
        </div>
    );
};

export default ImagePreviewModal;