import React, { useState } from 'react';
import { X, User, GraduationCap, UserCheck, Phone, Send } from 'lucide-react';

const WhatsAppForm = ({ selectedCourses, onClose, isOpen }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        namaMahasiswa: "",
        nim: "",
        namaDosen: "",
        nomorHp: "",
    });

    const handleSend = (e) => {
        e.preventDefault();
        const { namaMahasiswa, nim, namaDosen, nomorHp } = formData;

        // 1. Format Daftar Mata Kuliah
        const daftarMK = selectedCourses
            .map(
                (mk, i) =>
                    `${i + 1}. *${mk.nama_mata_kuliah}* (${mk.sks} SKS, Sem ${mk.semester})`,
            )
            .join("\n");

        // 2. Susun Template Pesan
        const pesan =
            `Assalamu'alaikum Wr. Wb. Yth. Bapak/Ibu *${namaDosen}*,\n\n` +
            `Saya mahasiswa bimbingan Anda:\n` +
            `Nama: *${namaMahasiswa}*\n` +
            `NIK/NIM: *${nim}*\n\n` +
            `Izin untuk berkonsultasi mengenai rencana bimbingan untuk daftar mata kuliah berikut:\n\n` +
            `${daftarMK}\n\n` +
            `Mohon arahan dan kesediaan waktunya. Terima kasih.`;

        // 3. Bersihkan Nomor HP (Hapus karakter non-digit)
        let cleanPhone = nomorHp.replace(/\D/g, "");
        if (cleanPhone.startsWith("0")) {
            cleanPhone = "62" + cleanPhone.slice(1);
        }

        // 4. Redirect ke WA
        const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(pesan)}`;
        window.open(waUrl, "_blank");
        onClose();
    };

    const inputClass =
        "w-full bg-slate-50 border border-slate-200 rounded-xl px-10 py-3 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all";
    const labelClass =
        "text-[9px] font-black text-slate-400 uppercase mb-1.5 ml-1 block tracking-widest";

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[300] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in duration-300">
                {/* Header */}
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-tight text-slate-800">
                            Kirim Ke Pembimbing
                        </h4>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">
                            WhatsApp Integration
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSend} className="p-8 space-y-5">
                    {/* Data Mahasiswa Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <label className={labelClass}>Nama Mahasiswa</label>
                            <User
                                className="absolute left-3 bottom-3.5 text-slate-400"
                                size={16}
                            />
                            <input
                                required
                                className={inputClass}
                                placeholder="Andi..."
                                value={formData.namaMahasiswa}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        namaMahasiswa: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="relative">
                            <label className={labelClass}>NIM</label>
                            <GraduationCap
                                className="absolute left-3 bottom-3.5 text-slate-400"
                                size={16}
                            />
                            <input
                                required
                                className={inputClass}
                                placeholder="2021001"
                                value={formData.nim}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        nim: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    {/* Data Dosen */}
                    <div className="relative">
                        <label className={labelClass}>
                            Nama Dosen Pembimbing
                        </label>
                        <UserCheck
                            className="absolute left-3 bottom-3.5 text-slate-400"
                            size={16}
                        />
                        <input
                            required
                            className={inputClass}
                            placeholder="Dr. Budi Santoso, M.T."
                            value={formData.namaDosen}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    namaDosen: e.target.value,
                                })
                            }
                        />
                    </div>

                    {/* Nomor HP */}
                    <div className="relative">
                        <label className={labelClass}>
                            Nomor WhatsApp Dosen
                        </label>
                        <Phone
                            className="absolute left-3 bottom-3.5 text-emerald-500"
                            size={16}
                        />
                        <input
                            required
                            type="tel"
                            className={inputClass}
                            placeholder="08123456789"
                            value={formData.nomorHp}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    nomorHp: e.target.value,
                                })
                            }
                        />
                    </div>

                    {/* Info Ringkasan */}
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                        <p className="text-[10px] text-emerald-700 font-bold leading-relaxed">
                            ⚠️ Pesan akan otomatis menyertakan{" "}
                            {selectedCourses.length} mata kuliah yang telah
                            dipilih dalam format teks tebal.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 group"
                        >
                            <span>Kirim WhatsApp</span>
                            <Send
                                size={14}
                                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                            />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WhatsAppForm;