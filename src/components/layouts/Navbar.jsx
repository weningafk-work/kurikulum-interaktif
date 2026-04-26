import React from 'react';

/**
 * Komponen Navbar
 * @param {string} activeMenu - Menu yang sedang aktif
 * @param {function} setActiveMenu - Fungsi untuk mengubah menu aktif
 * @param {string} logoPath - Path menuju file logo UPN
 */
const Navbar = ({ activeMenu, setActiveMenu, logoPath = "/assets/upn_logo.png" }) => {
    // Daftar menu yang ingin ditampilkan
    const menuItems = ["Dashboard", "Course", "Menu 2"];

    return (
        <nav className="flex-none bg-[#375C62] border-b border-slate-200 px-6 py-3 z-30 shadow-sm">
            <div className="max-w-[1600px] mx-auto flex justify-between items-center">
                
                {/* Sisi Kiri: Logo, Brand & Deskripsi */}
                <div className="flex items-center gap-4">
                    {/* Logo UPN */}
                    <div className="flex items-center gap-3">
                        <img
                            src={logoPath}
                            alt="Logo UPN"
                            className="h-12 md:h-15 w-auto object-contain"
                        />
                        {/* Divider Visual */}
                        <div className="h-12 w-[1.5px] bg-white/20 hidden md:block" />
                    </div>

                    {/* Brand & Teks Kurikulum */}
                    <div className="flex flex-col">
                        <span className="text-sm md:text-xl font-bold text-white tracking-tight leading-tight">
                            Kurikulum Teknik Geomatika
                        </span>
                        <span className="text-sm md:text-xl font-bold text-white tracking-tight leading-tight">
                            UPN "Veteran" Yogyakarta
                        </span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;