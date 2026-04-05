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

                {/* Sisi Kanan: Menu Links (Uncomment jika ingin digunakan) */}
                {/* <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-6">
                        {menuItems.map((menu) => (
                            <button
                                key={menu}
                                onClick={() => setActiveMenu && setActiveMenu(menu)}
                                className={`text-[11px] font-black uppercase tracking-widest transition-all pb-1 border-b-2 ${
                                    activeMenu === menu
                                        ? "text-yellow-400 border-yellow-400"
                                        : "text-white border-transparent hover:text-yellow-400"
                                }`}
                            >
                                {menu}
                            </button>
                        ))}
                    </div>
                </div> */}

            </div>
        </nav>
    );
};

export default Navbar;