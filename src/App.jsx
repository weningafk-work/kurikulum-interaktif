import React, { useState, useEffect, useMemo } from "react";
import {
	FileText,
	TableProperties,
	BookCheck,
	AlertCircle,
	ExternalLink,
	Plus,
	X,
	Lock,
	ChevronDown,
	Edit3,
	Trash2,
	Printer,
	HelpCircle,
	ClipboardList,
	ClipboardPenLine,
	Calendar,
	BookOpen,
	ArrowRight,
	Book,
	History,
	Type,
	Hash,
	Layers,
	Info,
	Filter,
	Edit2,
	Check,
	RotateCcw,
	MessageSquareShareIcon,
	GraduationCap,
	UserCheck,
	Phone,
	Send,
	User,
	View,
	CircleCheck,
	CircleX,
	File,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import Select from "react-select";
import { initialCourses } from "./data/courses";
import Dashboard from "./page/dashboard";
import DummyPage2 from "./page/about";
import Swal from "sweetalert2";

// --- 1. UTILS: LOGIKA EXPORT ---
const ExportService = {
	toPDF: (data, totalSks, info) => {
		const doc = new jsPDF();
		const pageWidth = doc.internal.pageSize.getWidth();

		// --- 1. HEADER TITLE ---
		doc.setFont("helvetica", "bold");
		doc.setFontSize(16);
		doc.text("KARTU RENCANA STUDI (KRS)", pageWidth / 2, 20, {
			align: "center",
		});

		// Garis Pemisah Header
		doc.setLineWidth(0.5);
		doc.line(14, 25, pageWidth - 14, 25);

		// --- 2. IDENTITAS MAHASISWA ---
		doc.setFont("helvetica", "normal");
		doc.setFontSize(10);
		doc.text("Nama Mahasiswa", 14, 35);
		doc.text(`: ${info.nama.toUpperCase()}`, 45, 35);
		doc.text("NIK / NIM", 14, 40);
		doc.text(`: ${info.nik}`, 45, 40);
		doc.text("Tanggal Cetak", 14, 45);
		doc.text(`: ${new Date().toLocaleDateString("id-ID")}`, 45, 45);

		// --- 3. PROSES GROUPING DATA (Berdasarkan Semester) ---
		const groupedData = [];
		// Urutkan data berdasarkan semester terlebih dahulu
		const sortedData = [...data].sort((a, b) => a.semester - b.semester);

		let currentSemester = null;

		sortedData.forEach((c) => {
			// Jika semester berubah, tambahkan baris header grup
			if (c.semester !== currentSemester) {
				currentSemester = c.semester;
				groupedData.push([
					{
						content: `SEMESTER ${currentSemester}`,
						colSpan: 6,
						styles: {
							fillColor: [241, 245, 249], // Slate-100
							textColor: [71, 85, 105], // Slate-600
							fontStyle: "bold",
							halign: "left",
						},
					},
				]);
			}
			// Tambahkan baris data mata kuliah
			groupedData.push([
				c.kode,
				c.nama_mata_kuliah,
				c.sks,
				`Sem ${c.semester}`,
				c.kelompok_mata_kuliah,
				c.sifat_mata_kuliah || "-",
			]);
		});

		autoTable(doc, {
			startY: 55,
			head: [["Kode", "Mata Kuliah", "SKS", "Sem", "Kelompok", "Sifat"]],
			body: groupedData,
			theme: "grid",
			headStyles: {
				fillColor: [37, 99, 235], // Blue-600
				textColor: [255, 255, 255],
				fontStyle: "bold",
				halign: "center",
			},
			columnStyles: {
				0: { cellWidth: 25 },
				2: { halign: "center" },
				3: { halign: "center" },
			},
			styles: {
				fontSize: 9,
				cellPadding: 3,
			},
			// Mencegah baris grup terpisah dari baris data pertamanya di ganti halaman
			rowPageBreak: "avoid",
			didDrawPage: (d) => {
				// Footer Total SKS (Hanya tampil di halaman terakhir tabel)
				const isLastPage =
					d.pageNumber === doc.internal.getNumberOfPages();
				if (isLastPage) {
					const finalY = d.cursor.y;
					doc.setFont("helvetica", "bold");
					doc.text(
						`TOTAL SKS DIAMBIL: ${totalSks}`,
						pageWidth - 14,
						finalY + 10,
						{ align: "right" },
					);
				}
			},
		});

		// --- 4. SIGNATURE AREA (Perbaikan Logika Halaman) ---
		let finalY = doc.lastAutoTable.finalY + 20;
		const pageHeight = doc.internal.pageSize.getHeight();

		// Cek apakah sisa ruang cukup untuk tanda tangan (butuh sekitar 40-50 unit)
		if (finalY > pageHeight - 50) {
			doc.addPage();
			finalY = 30; // Reset Y ke atas di halaman baru
		}

		doc.setFontSize(10);
		doc.setFont("helvetica", "normal");
		doc.text(
			"Yogyakarta, " + new Date().toLocaleDateString("id-ID"),
			pageWidth - 65,
			finalY - 5,
		);
		doc.text("Mengetahui,", pageWidth - 65, finalY);
		doc.text("Pembimbing Akademik,", pageWidth - 65, finalY + 5);

		doc.setFont("helvetica", "bold");
		// Baris nama pembimbing (bisa dikosongkan dengan garis bawah)
		doc.text("( __________________________ )", pageWidth - 65, finalY + 35);
		doc.setFontSize(9);
		doc.text(
			"NIP/NIK. ...........................",
			pageWidth - 65,
			finalY + 40,
		);

		// Simpan file
		doc.save(`KRS_${info.nik}_${info.nama.replace(/\s+/g, "_")}.pdf`);
	},
	toExcel: (data) => {
		const ws = XLSX.utils.json_to_sheet(data);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "KRS");
		XLSX.writeFile(wb, "krs.xlsx");
	},
};

// --- 2. SUB-COMPONENT: FORM INPUT ---
const AddCourseForm = ({ onAdd, onUpdate, onClose, allCourses, mode }) => {
	const [formData, setFormData] = useState({
		kode: "",
		nama_mata_kuliah: "",
		sks: 2,
		semester: 1,
		kelompok_mata_kuliah: "MKK",
		sifat_mata_kuliah: "Wajib",
		deskripsi: "",
		kode_mata_kuliah_prasyarat: [],
		minimal_sks_prasyarat: 0,
	});

	// 1. Opsi-opsi untuk Dropdown
	const kelompokOptions = [
		{ value: "Umum", label: "Umum" },
		{ value: "Sains Dasar", label: "Sains Dasar" },
		{ value: "Inti Teknik Geomatika", label: "Inti Teknik Geomatika" },
		{ value: "Pendukung Rekayasa", label: "Pendukung Rekayasa" },
	];

	const sifatOptions = [
		{ value: "Wajib", label: "Wajib" },
		{ value: "Pilihan", label: "Pilihan" },
	];

	const courseOptions = allCourses.map((c) => ({
		value: c.kode,
		label: `${c.kode} - ${c.nama_mata_kuliah}`,
	}));

	// 2. Custom Style yang Compact (Mengecilkan ukuran dropdown)
	const compactSelectStyles = {
		control: (base, state) => ({
			...base,
			backgroundColor: "rgb(249 250 251)", // gray-50
			borderColor: state.isFocused
				? "rgb(59 130 246)"
				: "rgb(209 213 219)",
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
		multiValue: (base) => ({
			...base,
			backgroundColor: "rgb(219 234 254)",
			borderRadius: "4px",
		}),
		multiValueLabel: (base) => ({
			...base,
			color: "rgb(30 64 175)",
			fontWeight: "bold",
			fontSize: "0.7rem",
			padding: "1px 6px",
		}),
	};

	const [selectedToEdit, setSelectedToEdit] = useState(null);
	const isDisabled = mode === "edit" && !selectedToEdit;

	const handleSelectCourseToEdit = (opt) => {
		const course = allCourses.find((c) => c.kode === opt.value);
		if (course) {
			setSelectedToEdit(course);
			setFormData({ ...course });
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onAdd({ ...formData });
	};

	const inputClass =
		"bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none transition-all";
	const labelClass =
		"block mb-1.5 text-[10px] font-bold text-gray-700 uppercase tracking-wider text-left";

	// Logic Header & Warna berdasarkan Mode
	const isDeleteMode = mode === "delete";
	const headerTitle = isDeleteMode
		? "Hapus Mata Kuliah"
		: mode === "edit"
			? "Edit Mata Kuliah"
			: "Tambah Mata Kuliah";
	const themeColor = isDeleteMode
		? "text-red-600"
		: mode === "edit"
			? "text-orange-500"
			: "text-blue-600";

	return (
		<div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
			<div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
				{/* Header Modal */}
				<div className="p-4 bg-slate-50 border-b flex justify-between items-center">
					<h3
						className={`text-xs font-bold uppercase tracking-tight flex items-center gap-2 ${themeColor}`}
					>
						{isDeleteMode ? (
							<Trash2 size={14} />
						) : mode === "edit" ? (
							<Edit3 size={14} />
						) : (
							<Plus size={14} />
						)}
						{headerTitle}
					</h3>
					<button
						onClick={onClose}
						className="text-slate-400 hover:text-slate-600"
					>
						<X size={18} />
					</button>
				</div>

				<div className="p-5 space-y-4">
					{(mode === "edit" || isDeleteMode) && (
						<div
							className={`${isDeleteMode ? "" : "pb-4 border-b border-dashed border-slate-200"}`}
						>
							<label className="block mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
								Cari Mata Kuliah
							</label>
							<Select
								options={courseOptions}
								styles={compactSelectStyles}
								placeholder="Ketik kode atau nama MK..."
								onChange={handleSelectCourseToEdit}
							/>
						</div>
					)}

					{isDeleteMode ? (
						<div
							className={`pt-2 transition-all duration-300 ${!selectedToEdit ? "opacity-30 pointer-events-none" : "opacity-100"}`}
						>
							{selectedToEdit && (
								<div className="bg-red-50 border border-red-100 p-3 rounded-lg mb-4">
									<p className="text-[10px] text-red-400 font-bold uppercase">
										Akan Dihapus:
									</p>
									<p className="text-sm font-bold text-red-900">
										{formData.kode} -{" "}
										{formData.nama_mata_kuliah}
									</p>
								</div>
							)}
							<button
								onClick={() => onDelete(formData.kode)}
								disabled={!selectedToEdit}
								className="w-full py-3 bg-red-600 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2"
							>
								<Trash2 size={14} /> Konfirmasi Hapus Mata
								Kuliah
							</button>
						</div>
					) : (
						<form
							onSubmit={(e) => {
								e.preventDefault();
								mode === "edit"
									? onUpdate(formData)
									: onAdd(formData);
								onClose();
							}}
							className={`space-y-4 transition-all duration-300 ${mode === "edit" && !selectedToEdit ? "opacity-30 pointer-events-none" : "opacity-100"}`}
						>
							<div
								className={`${isDisabled ? "opacity-40 pointer-events-none" : "opacity-100"} space-y-4 transition-all duration-300`}
							>
								{/* Field: Kode & Nama */}
								<div className="grid grid-cols-3 gap-3">
									<div className="col-span-1">
										<label className={labelClass}>
											Kode MK
										</label>
										<input
											required
											className={inputClass}
											value={formData.kode}
											readOnly={mode === "edit"}
											onChange={(e) =>
												setFormData({
													...formData,
													kode: e.target.value.toUpperCase(),
												})
											}
										/>
									</div>
									<div className="col-span-2">
										<label className={labelClass}>
											Nama Mata Kuliah
										</label>
										<input
											required
											className={inputClass}
											value={formData.nama_mata_kuliah}
											onChange={(e) =>
												setFormData({
													...formData,
													nama_mata_kuliah:
														e.target.value,
												})
											}
										/>
									</div>
								</div>

								{/* Field: SKS, Semester, Sifat */}
								<div className="grid grid-cols-3 gap-3">
									<div>
										<label className={labelClass}>
											SKS
										</label>
										<input
											type="number"
											className={inputClass}
											value={formData.sks}
											onChange={(e) =>
												setFormData({
													...formData,
													sks: Number(e.target.value),
												})
											}
										/>
									</div>
									<div>
										<label className={labelClass}>
											Semester
										</label>
										<input
											type="number"
											className={inputClass}
											value={formData.semester}
											onChange={(e) =>
												setFormData({
													...formData,
													semester: Number(
														e.target.value,
													),
												})
											}
										/>
									</div>
									<div>
										<label className={labelClass}>
											Sifat MK
										</label>
										<Select
											options={sifatOptions}
											value={sifatOptions.find(
												(opt) =>
													opt.value ===
													formData.sifat_mata_kuliah,
											)}
											styles={compactSelectStyles}
											onChange={(opt) =>
												setFormData({
													...formData,
													sifat_mata_kuliah:
														opt.value,
												})
											}
										/>
									</div>
								</div>

								{/* Field: Kelompok MK */}
								<div>
									<label className={labelClass}>
										Kelompok MK
									</label>
									<Select
										options={kelompokOptions}
										value={kelompokOptions.find(
											(opt) =>
												opt.value ===
												formData.kelompok_mata_kuliah,
										)}
										styles={compactSelectStyles}
										onChange={(opt) =>
											setFormData({
												...formData,
												kelompok_mata_kuliah: opt.value,
											})
										}
									/>
								</div>

								{/* Field: Prasyarat */}
								<div>
									<label className={labelClass}>
										Mata Kuliah Prasyarat
									</label>
									<Select
										isMulti
										options={courseOptions.filter(
											(o) => o.value !== formData.kode,
										)}
										value={courseOptions.filter((opt) =>
											formData.kode_mata_kuliah_prasyarat.includes(
												opt.value,
											),
										)}
										styles={compactSelectStyles}
										placeholder="Pilih prasyarat..."
										onChange={(selected) =>
											setFormData({
												...formData,
												kode_mata_kuliah_prasyarat:
													selected
														? selected.map(
																(o) => o.value,
															)
														: [],
											})
										}
									/>
								</div>

								{/* Field: Deskripsi */}
								<div>
									<label className={labelClass}>
										Deskripsi Singkat
									</label>
									<textarea
										className={`${inputClass} h-20 resize-none`}
										value={formData.deskripsi}
										placeholder="Masukkan deskripsi mata kuliah..."
										onChange={(e) =>
											setFormData({
												...formData,
												deskripsi: e.target.value,
											})
										}
									/>
								</div>

								<button
									type="submit"
									className={`w-full py-3 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all shadow-lg 
						${mode === "edit" ? "bg-orange-600 hover:bg-orange-700 shadow-orange-100" : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"}`}
								>
									{mode === "edit"
										? "Update Data Mata Kuliah"
										: "Simpan Mata Kuliah"}
								</button>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	);
};

// --- 3. CUSTOM HOOK ---
const useCoursePlanner = (allCourses) => {
	const [selectedIds, setSelectedIds] = useState([]);
	const [activeHighlight, setActiveHighlight] = useState(null);

	useEffect(() => {
		const saved = localStorage.getItem("krs_data");
		if (saved) setSelectedIds(JSON.parse(saved));
	}, []);

	useEffect(() => {
		localStorage.setItem("krs_data", JSON.stringify(selectedIds));
	}, [selectedIds]);

	const selectedCourses = useMemo(
		() => allCourses.filter((c) => selectedIds.includes(c.kode)),
		[selectedIds, allCourses],
	);
	const totalSks = useMemo(
		() => selectedCourses.reduce((sum, c) => sum + c.sks, 0),
		[selectedCourses],
	);

	// --- LOGIKA BARU: CEK APAKAH MK TERKUNCI ---
	const isCourseLocked = useMemo(
		() => (course) => {
			// Jika tidak ada prasyarat, tidak terkunci
			if (
				!course.kode_mata_kuliah_prasyarat ||
				course.kode_mata_kuliah_prasyarat.length === 0
			) {
				return false;
			}

			// Cek apakah SEMUA kode prasyarat ada di dalam selectedIds
			return !course.kode_mata_kuliah_prasyarat.every((prereqKode) =>
				selectedIds.includes(prereqKode),
			);
		},
		[selectedIds],
	); // Re-calculate setiap kali seleksi berubah

	const toggleCourse = (course) => {
		// --- PROTEKSI BARU: JIKA TERKUNCI, JANGAN LAKUKAN APA-APA ---
		if (isCourseLocked(course)) return;

		const isSelected = selectedIds.includes(course.kode);
		setActiveHighlight(
			course.kode === activeHighlight ? null : course.kode,
		);

		if (!isSelected) {
			// Logika auto-select prasyarat sebenarnya opsional sekarang karena MK tingkat lanjut terkunci,
			// tapi kita biarkan saja untuk keamanan ganda.
			let newSelection = new Set([...selectedIds]);
			const addWithPrereqs = (target) => {
				target.kode_mata_kuliah_prasyarat.forEach((pId) => {
					if (!newSelection.has(pId)) {
						const prereq = allCourses.find((c) => c.kode === pId);
						if (prereq) {
							newSelection.add(pId);
							addWithPrereqs(prereq);
						}
					}
				});
			};
			addWithPrereqs(course);
			newSelection.add(course.kode);
			setSelectedIds(Array.from(newSelection));
		} else {
			const isRequired = allCourses.some(
				(c) =>
					selectedIds.includes(c.kode) &&
					c.kode_mata_kuliah_prasyarat.includes(course.kode),
			);
			if (isRequired) {
				alert("MK ini prasyarat MK lain.");
				return;
			}
			setSelectedIds(selectedIds.filter((id) => id !== course.kode));
		}
	};

	// Tambahkan isCourseLocked ke return
	return {
		selectedIds,
		selectedCourses,
		totalSks,
		toggleCourse,
		activeHighlight,
		isCourseLocked,
	};
};

// --- 4. MINIMALIST COURSE CARD ---
const CourseCard = ({
	course,
	isSelected,
	isRelated,
	isActive,
	isLocked,
	onSelect,
	onDetail,
}) => {
	// 1. Fungsi Helper untuk menentukan warna berdasarkan Kelompok MK
	const getGroupStyles = (group) => {
		switch (group) {
			case "Umum":
				return "bg-slate-100 text-slate-600 border-slate-200";
			case "Sains Dasar":
				return "bg-amber-100 text-amber-700 border-amber-200";
			case "Inti Teknik Geomatika":
				return "bg-blue-100 text-blue-700 border-blue-200";
			case "Pendukung Rekayasa":
				return "bg-green-100 text-green-700 border-green-200";
			default:
				return "bg-gray-100 text-gray-500 border-gray-200";
		}
	};

	// 2. Fungsi Helper untuk teks kategori bawah
	const getGroupTextColor = (group) => {
		switch (group) {
			case "Umum":
				return "text-slate-400";
			case "Sains Dasar":
				return "text-amber-600";
			case "Inti Teknik Geomatika":
				return "text-blue-600";
			case "Pendukung Rekayasa":
				return "text-green-600";
			default:
				return "text-gray-400";
		}
	};

	return (
		<div
			onClick={isLocked ? null : () => onSelect(course)}
			onDoubleClick={() => onDetail(course)}
			className={`group relative p-3 rounded-xl border transition-all select-none text-left shadow-sm
                ${
					isLocked
						? "bg-gray-100 border-gray-300 cursor-not-allowed opacity-70"
						: isSelected
							? "bg-green-50 border-green-400 cursor-pointer shadow-md"
							: "bg-white border-gray-200 hover:border-blue-400 hover:shadow-md cursor-pointer"
				}
                ${isActive && !isLocked ? "ring-2 ring-blue-600 z-20" : ""}
                ${isRelated && !isLocked ? "bg-yellow-300 border-yellow-500 ring-1 ring-yellow-400 z-10" : ""}
            `}
		>
			<div className="flex justify-between items-center mb-1.5">
				<div className="flex items-center gap-1">
					<span
						className={`text-[10px] font-black tracking-tighter uppercase leading-none 
                        ${isLocked ? "text-gray-400" : isRelated ? "text-yellow-900" : "text-slate-400"}`}
					>
						{course.kode}
					</span>

					{isLocked ? (
						<Lock size={12} className="text-gray-400" />
					) : (
						course.kode_mata_kuliah_prasyarat?.length > 0 && (
							<AlertCircle
								size={10}
								className={
									isRelated
										? "text-yellow-800"
										: "text-yellow-500"
								}
							/>
						)
					)}
				</div>

				{/* BADGE SKS DENGAN WARNA KELOMPOK */}
				<span
					className={`text-[9px] font-black px-1.5 py-1 rounded italic leading-none border transition-all
                    ${
						isLocked
							? "bg-gray-200 text-gray-500 border-gray-300"
							: isRelated
								? "bg-yellow-400 text-yellow-900 border-yellow-500 shadow-sm"
								: getGroupStyles(course.kelompok_mata_kuliah)
					}`}
				>
					{course.sks} SKS
				</span>
			</div>

			<h4
				className={`font-bold text-[11px] truncate leading-tight mb-1.5 
                ${isLocked ? "text-gray-500" : isRelated ? "text-yellow-900" : "text-slate-800"}`}
				title={course.nama_mata_kuliah}
			>
				{course.nama_mata_kuliah}
			</h4>

			{/* TEKS KATEGORI DENGAN WARNA KELOMPOK */}
			<div
				className={`text-[8px] uppercase tracking-[0.1em] font-black leading-none truncate 
                ${
					isLocked
						? "text-gray-400"
						: isRelated
							? "text-yellow-800"
							: getGroupTextColor(course.kelompok_mata_kuliah)
				}`}
			>
				{course.kelompok_mata_kuliah}
			</div>
		</div>
	);
};

const AddLogForm = ({ allCourses, onUpdate, onClose, editData }) => {
	// --- STATE DATA ARSIP (Masa Lalu) ---
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

	useEffect(() => {
		if (editData) {
			const { course, log } = editData;
			setSelectedCourse({
				value: course.kode,
				label: `${course.kode} - ${course.nama_mata_kuliah}`,
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

	// --- OPTIONS (Identik dengan AddCourseForm) ---
	const kelompokOptions = [
		{ value: "MPK", label: "MPK - Pengembangan Kepribadian" },
		{ value: "MKK", label: "MKK - Keilmuan & Keterampilan" },
		{ value: "MKB", label: "MKB - Keahlian Berkarya" },
		{ value: "MPB", label: "MPB - Perilaku Berkarya" },
		{ value: "MBB", label: "MBB - Berkehidupan Bermasyarakat" },
		{ value: "MKWU", label: "MKWU - Wajib Umum" },
	];

	const sifatOptions = [
		{ value: "Wajib", label: "Wajib" },
		{ value: "Pilihan", label: "Pilihan" },
	];

	const courseOptions = allCourses.map((c) => ({
		value: c.kode,
		label: `${c.kode} - ${c.nama_mata_kuliah}`,
	}));

	// --- STYLE SYNC (Menggunakan compactSelectStyles dari AddCourseForm) ---
	const compactSelectStyles = {
		control: (base, state) => ({
			...base,
			backgroundColor: "rgb(249 250 251)", // gray-50
			borderColor: state.isFocused
				? "rgb(59 130 246)"
				: "rgb(209 213 219)",
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

	const handleSave = (e) => {
		e.preventDefault();
		const currentCourse = allCourses.find(
			(c) => c.kode === selectedCourse.value,
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
			// Mode Update: Ganti log yang lama
			updatedLogs = currentCourse.catatan_perubahan.map((l) =>
				l.id === logData.id ? logPayload : l,
			);
		} else {
			// Mode Tambah Baru
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
				{/* Header Modal - Style Sync */}
				<div className="p-4 bg-slate-50 border-b flex justify-between items-center">
					<h3 className="text-xs font-bold uppercase tracking-tight flex items-center gap-2 text-blue-600">
						<History size={14} />
						{logData.id
							? "Edit Log Perubahan"
							: "Tambah Log Perubahan"}
					</h3>
					<button
						onClick={onClose}
						className="text-slate-400 hover:text-slate-600"
					>
						<X size={18} />
					</button>
				</div>

				<div className="p-5 space-y-4">
					{/* Pilih Mata Kuliah Target */}
					<div className="pb-4 border-b border-dashed border-slate-200">
						<label className="block mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
							Target Mata Kuliah
						</label>
						<Select
							options={courseOptions}
							value={selectedCourse}
							styles={compactSelectStyles}
							placeholder="Pilih MK yang akan ditambah log..."
							onChange={setSelectedCourse}
						/>
					</div>

					<form
						onSubmit={handleSave}
						className={`space-y-4 transition-all duration-300 ${!selectedCourse ? "opacity-30 pointer-events-none" : "opacity-100"}`}
					>
						{/* Info Kurikulum & Tahun */}
						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className={labelClass}>
									Nama Kurikulum
								</label>
								<input
									required
									className={inputClass}
									placeholder="Kurikulum 2016"
									value={logData.nama_kurikulum}
									onChange={(e) =>
										setLogData({
											...logData,
											nama_kurikulum: e.target.value,
										})
									}
								/>
							</div>
							<div>
								<label className={labelClass}>
									Tahun Ajaran
								</label>
								<input
									required
									className={inputClass}
									placeholder="2016/2017"
									value={logData.tahun_ajaran}
									onChange={(e) =>
										setLogData({
											...logData,
											tahun_ajaran: e.target.value,
										})
									}
								/>
							</div>
						</div>

						{/* Nama MK Saat Itu */}
						<div>
							<label className={labelClass}>
								Nama MK (Saat Itu)
							</label>
							<input
								required
								className={inputClass}
								placeholder="Nama MK di kurikulum lama..."
								value={logData.nama_lama}
								onChange={(e) =>
									setLogData({
										...logData,
										nama_lama: e.target.value,
									})
								}
							/>
						</div>

						{/* SKS, Semester, Sifat */}
						<div className="grid grid-cols-3 gap-3">
							<div>
								<label className={labelClass}>SKS</label>
								<input
									type="number"
									className={inputClass}
									value={logData.sks_lama}
									onChange={(e) =>
										setLogData({
											...logData,
											sks_lama: e.target.value,
										})
									}
								/>
							</div>
							<div>
								<label className={labelClass}>Semester</label>
								<input
									type="number"
									className={inputClass}
									value={logData.semester_lama}
									onChange={(e) =>
										setLogData({
											...logData,
											semester_lama: e.target.value,
										})
									}
								/>
							</div>
							<div>
								<label className={labelClass}>Sifat MK</label>
								<Select
									options={sifatOptions}
									value={sifatOptions.find(
										(opt) =>
											opt.value === logData.sifat_lama,
									)}
									styles={compactSelectStyles}
									onChange={(opt) =>
										setLogData({
											...logData,
											sifat_lama: opt.value,
										})
									}
								/>
							</div>
						</div>

						{/* Kelompok MK */}
						<div>
							<label className={labelClass}>
								Kelompok MK (Saat Itu)
							</label>
							<Select
								options={kelompokOptions}
								value={kelompokOptions.find(
									(opt) =>
										opt.value === logData.kelompok_lama,
								)}
								styles={compactSelectStyles}
								onChange={(opt) =>
									setLogData({
										...logData,
										kelompok_lama: opt.value,
									})
								}
							/>
						</div>

						{/* Deskripsi/Keterangan */}
						<div>
							<label className={labelClass}>
								Keterangan Perubahan
							</label>
							<textarea
								className={`${inputClass} h-20 resize-none`}
								placeholder="Jelaskan alasan atau detail perubahan..."
								value={logData.keterangan}
								onChange={(e) =>
									setLogData({
										...logData,
										keterangan: e.target.value,
									})
								}
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

const LogModal = ({ allCourses, onUpdate, onEditLog, onClose }) => {
	// Default filter null (Menampilkan semua riwayat)
	const [selectedFilter, setSelectedFilter] = useState(null);

	// 1. Ambil daftar Mata Kuliah yang memiliki catatan perubahan
	const coursesWithLogs = useMemo(
		() =>
			allCourses.filter(
				(course) =>
					course.catatan_perubahan &&
					course.catatan_perubahan.length > 0,
			),
		[allCourses],
	);

	// 2. Opsi untuk Dropdown Filter
	const filterOptions = coursesWithLogs.map((c) => ({
		value: c.kode,
		label: `[${c.kode}] ${c.nama_mata_kuliah}`,
	}));

	// 3. Logic Filtering berdasarkan pilihan user
	const filteredDisplay = useMemo(() => {
		if (!selectedFilter) return coursesWithLogs;
		return coursesWithLogs.filter((c) => c.kode === selectedFilter.value);
	}, [selectedFilter, coursesWithLogs]);

	// 4. Action: Hapus Log
	const handleDeleteLog = (course, logId) => {
		Swal.fire({
			title: "Hapus Catatan?",
			text: "Data riwayat kurikulum yang dihapus tidak dapat dikembalikan!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#ef4444", // warna merah tailwind (slate-500)
			cancelButtonColor: "#64748b", // warna slate tailwind
			confirmButtonText: "Ya, Hapus!",
			cancelButtonText: "Batal",
			borderRadius: "1.5rem",
			customClass: {
				popup: "rounded-3xl font-sans",
				title: "text-slate-800 font-black uppercase tracking-tight text-lg",
				confirmButton:
					"rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-widest",
				cancelButton:
					"rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-widest",
			},
		}).then((result) => {
			if (result.isConfirmed) {
				// Logika Hapus Data
				const updatedLogs = course.catatan_perubahan.filter(
					(l) => l.id !== logId,
				);
				onUpdate({ ...course, catatan_perubahan: updatedLogs });

				// Notifikasi Berhasil
				Swal.fire({
					title: "Terhapus!",
					text: "Catatan perubahan telah dihapus.",
					icon: "success",
					timer: 1500,
					showConfirmButton: false,
					borderRadius: "1.5rem",
					customClass: {
						popup: "rounded-3xl font-sans",
						title: "text-slate-800 font-black uppercase tracking-tight text-lg",
					},
				});
			}
		});
	};

	// Style Select (Konsisten dengan AddCourseForm)
	const compactSelectStyles = {
		control: (base, state) => ({
			...base,
			backgroundColor: "white",
			borderColor: state.isFocused
				? "rgb(59 130 246)"
				: "rgb(226 232 240)",
			borderRadius: "0.75rem",
			minHeight: "40px",
			fontSize: "0.75rem",
			boxShadow: "none",
			"&:hover": { borderColor: "rgb(59 130 246)" },
		}),
		option: (base, state) => ({
			...base,
			fontSize: "0.75rem",
			backgroundColor: state.isSelected
				? "rgb(59 130 246)"
				: state.isFocused
					? "rgb(239 246 255)"
					: "white",
			color: state.isSelected ? "white" : "rgb(55 65 81)",
			cursor: "pointer",
		}),
	};

	return (
		<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
			<div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
				{/* HEADER */}
				<div className="bg-slate-50 px-8 py-5 border-b border-slate-200 flex justify-between items-center text-left">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-blue-600 rounded-lg text-white">
							<History size={20} />
						</div>
						<div>
							<h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">
								Log Perubahan Kurikulum
							</h3>
							<p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
								Riwayat Pembaruan Struktur Mata Kuliah
							</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-slate-200 rounded-full transition-all text-slate-400 hover:text-slate-600"
					>
						<X size={20} />
					</button>
				</div>

				{/* FILTER SECTION */}
				<div className="px-8 py-4 bg-white border-b border-slate-100 flex flex-col sm:flex-row items-center gap-4">
					<div className="flex items-center gap-2 text-slate-400 min-w-fit">
						<Filter size={14} />
						<span className="text-[10px] font-black uppercase tracking-widest">
							Cari Riwayat:
						</span>
					</div>
					<div className="w-full">
						<Select
							options={filterOptions}
							styles={compactSelectStyles}
							placeholder="Pilih Mata Kuliah tertentu..."
							isClearable
							onChange={setSelectedFilter}
							value={selectedFilter}
						/>
					</div>
				</div>

				{/* CONTENT AREA */}
				<div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/30">
					{filteredDisplay.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center">
							<Search
								size={48}
								strokeWidth={1}
								className="mb-4 opacity-20"
							/>
							<p className="text-sm font-medium">
								Data riwayat tidak ditemukan.
							</p>
						</div>
					) : (
						<div className="space-y-12">
							{filteredDisplay.map((course) => (
								<div key={course.kode} className="text-left">
									{/* Judul Mata Kuliah Group */}
									<div className="flex items-center gap-3 mb-6">
										<div className="h-px flex-1 bg-slate-200"></div>
										<div className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
											<span className="text-[10px] font-black text-blue-600">
												{course.kode}
											</span>
											<span className="text-[10px] font-bold text-slate-700 uppercase">
												{course.nama_mata_kuliah}
											</span>
										</div>
										<div className="h-px flex-1 bg-slate-200"></div>
									</div>

									{/* Daftar Log Per MK */}
									<div className="space-y-5">
										{course.catatan_perubahan.map(
											(log, index) => (
												<div
													key={log.id || index}
													className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
												>
													{/* ACTION BUTTONS (Muncul saat hover) */}
													{isAdmin && (
														<div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
															<button
																onClick={() => {
																	onEditLog(
																		course,
																		log,
																	);
																	onClose(); // Tutup LogModal untuk membuka AddLogForm
																}}
																className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
																title="Edit Log"
															>
																<Edit2
																	size={14}
																/>
															</button>
															<button
																onClick={() =>
																	handleDeleteLog(
																		course,
																		log.id,
																	)
																}
																className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
																title="Hapus Log"
															>
																<Trash2
																	size={14}
																/>
															</button>
														</div>
													)}

													{/* Meta: Kurikulum & Tahun Ajaran */}
													<div className="flex flex-wrap gap-2 mb-3 pr-16">
														<div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800 text-white rounded-md">
															<BookOpen
																size={10}
															/>
															<span className="text-[9px] font-black uppercase tracking-widest">
																{
																	log.nama_kurikulum
																}
															</span>
														</div>
														<div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-md">
															<Calendar
																size={10}
															/>
															<span className="text-[9px] font-black uppercase tracking-widest">
																TA{" "}
																{
																	log.tahun_ajaran
																}
															</span>
														</div>
													</div>

													{/* Keterangan */}
													<p className="text-xs text-slate-600 leading-relaxed mb-5 font-medium italic">
														"{log.keterangan}"
													</p>

													{/* Snapshot Data Lama */}
													<div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
														<span className="text-[8px] font-black text-slate-400 uppercase mb-3 block tracking-widest">
															Snapshot Data
															Sebelum Perubahan
														</span>
														<div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-2">
															<div className="flex flex-col">
																<span className="text-[10px] font-bold text-slate-700 truncate">
																	{
																		log
																			.data_lama
																			.nama
																	}
																</span>
																<span className="text-[9px] text-slate-400 font-medium uppercase mt-1 tracking-tighter">
																	Nama MK
																</span>
															</div>
															<div className="flex flex-col border-l border-slate-200 pl-3">
																<span className="text-[10px] font-bold text-slate-700">
																	{
																		log
																			.data_lama
																			.sks
																	}{" "}
																	SKS / Sem{" "}
																	{
																		log
																			.data_lama
																			.semester
																	}
																</span>
																<span className="text-[9px] text-slate-400 font-medium uppercase mt-1 tracking-tighter">
																	Beban
																</span>
															</div>
															<div className="flex flex-col border-l border-slate-200 pl-3">
																<span className="text-[10px] font-bold text-slate-700 uppercase">
																	{log
																		.data_lama
																		.kelompok ||
																		"-"}
																</span>
																<span className="text-[9px] text-slate-400 font-medium uppercase mt-1 tracking-tighter">
																	Kelompok
																</span>
															</div>
															<div className="flex flex-col border-l border-slate-200 pl-3">
																<span
																	className={`text-[8px] font-black px-2 py-0.5 rounded-md self-start uppercase ${log.data_lama.sifat === "Wajib" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}
																>
																	{
																		log
																			.data_lama
																			.sifat
																	}
																</span>
																<span className="text-[9px] text-slate-400 font-medium uppercase mt-1 tracking-tighter">
																	Sifat
																</span>
															</div>
														</div>
													</div>
												</div>
											),
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* FOOTER */}
				<div className="bg-white px-8 py-4 border-t border-slate-100 flex justify-end">
					<button
						onClick={onClose}
						className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 transition-all"
					>
						Tutup Panel Riwayat
					</button>
				</div>
			</div>
		</div>
	);
};

const WhatsAppForm = ({ selectedCourses, onClose }) => {
	const [formData, setFormData] = useState({
		namaMahasiswa: "",
		nik: "",
		namaDosen: "",
		nomorHp: "",
	});

	const handleSend = (e) => {
		e.preventDefault();
		const { namaMahasiswa, nik, namaDosen, nomorHp } = formData;

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
			`NIK/NIM: *${nik}*\n\n` +
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
							<label className={labelClass}>NIK / NIM</label>
							<GraduationCap
								className="absolute left-3 bottom-3.5 text-slate-400"
								size={16}
							/>
							<input
								required
								className={inputClass}
								placeholder="2021001"
								value={formData.nik}
								onChange={(e) =>
									setFormData({
										...formData,
										nik: e.target.value,
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

// --- 5. MAIN APP ---
export default function App() {
	const [activeMenu, setActiveMenu] = useState("Course");
	const [allCourses, setAllCourses] = useState(initialCourses);
	const {
		selectedIds,
		selectedCourses,
		totalSks,
		toggleCourse,
		activeHighlight,
		isCourseLocked,
	} = useCoursePlanner(allCourses);
	const [modalCourse, setModalCourse] = useState(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [formMode, setFormMode] = useState("add");

	const [isAddLogOpen, setIsAddLogOpen] = useState(false);
	const [selectedCourseForLog, setSelectedCourseForLog] = useState(null);

	const [isLogModalOpen, setIsLogModalOpen] = useState(false);
	const [selectedEditLog, setSelectedEditLog] = useState(null);

	const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
	const [studentData, setStudentData] = useState({ nama: "", nik: "" });

	const activeObj = useMemo(
		() => allCourses.find((c) => c.kode === activeHighlight),
		[activeHighlight, allCourses],
	);

	const handleAddNewCourse = (newCourse) => {
		setAllCourses((prev) => [...prev, newCourse]);
		setIsFormOpen(false);
	};

	const handleUpdateCourse = (updatedCourse) => {
		setAllCourses((prevCourses) =>
			prevCourses.map((course) =>
				course.kode === updatedCourse.kode ? updatedCourse : course,
			),
		);

		console.log(
			`Berhasil memperbarui data: ${updatedCourse.nama_mata_kuliah}`,
		);
	};

	const handleEditLogAction = (course, log) => {
		// 1. Simpan objek mata kuliah dan log ke state
		setSelectedEditLog({ course, log });

		// 2. Buka AddLogForm
		setIsAddLogOpen(true);
	};

	const [isWaFormOpen, setIsWaFormOpen] = useState(false);

	const [isImageModalOpen, setIsImageModalOpen] = useState(false);
	const [selectedImageUrl, setSelectedImageUrl] = useState(
		"https://picsum.photos/200/300",
	); // Ganti dengan URL gambar Anda

	const handleOpenImage = () => {
		setIsImageModalOpen(true);
	};

	const [isDocModalOpen, setIsDocModalOpen] = useState(false);
	const documents = [
		{
			name: "Salinan Kurikulum Teknik Geomatika 2024",
			format: "PDF",
			size: "2.4 MB",
			url: "#",
		},
		{
			name: "Buku Pedoman Akademik UPNVY",
			format: "PDF",
			size: "5.1 MB",
			url: "#",
		},
		{
			name: "Alur Prasyarat Mata Kuliah",
			format: "PNG",
			size: "1.2 MB",
			url: "#",
		},
	];

	const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);

	const faqData = [
		{
			q: "Apa itu UNIPLAN?",
			a: "UNIPLAN adalah platform simulasi kurikulum interaktif yang membantu mahasiswa Teknik Geomatika merencanakan pengambilan mata kuliah setiap semester secara visual.",
		},
		{
			q: "Bagaimana cara kerja prasyarat?",
			a: "Mata kuliah yang memiliki prasyarat akan terkunci (ikon gembok) jika mata kuliah pendahulunya belum diambil (diklik/centang).",
		},
		{
			q: "Apakah data simulasi ini tersimpan otomatis?",
			a: "Untuk saat ini simulasi bersifat sementara di browser. Anda bisa menggunakan fitur 'Share WA' untuk mengirimkan rencana studi Anda ke Dosen Pembimbing sebagai catatan.",
		},
		{
			q: "Apa arti warna pada kartu mata kuliah?",
			a: "Biru menunjukkan mata kuliah tersedia, Hijau berarti sudah diambil/terpenuhi, dan Merah/Gembok berarti prasyarat belum terpenuhi.",
		},
	];

	const [isAdmin, setIsAdmin] = useState(false);

	const ADMIN_HASH = "#geomatika-admin-2026";

	useEffect(() => {
		const checkAccess = () => {
			if (window.location.hash === ADMIN_HASH) {
				setIsAdmin(true);
			} else {
				setIsAdmin(false);
			}
		};

		// Cek saat pertama kali load
		checkAccess();

		// Pantau perubahan hash tanpa perlu refresh halaman
		window.addEventListener("hashchange", checkAccess);
		return () => window.removeEventListener("hashchange", checkAccess);
	}, []);

	const renderContent = () => {
		switch (activeMenu) {
			case "Dashboard":
				return <Dashboard allCourses={allCourses} />;
			case "Menu 2":
				return <DummyPage2 />;
			default:
				return (
					<main className="flex-1 flex flex-col min-h-0 p-4">
						<div className="space-y-1 mb-3">
							<div className="flex items-center gap-2">
								{/* <div className="h-4 w-1 bg-blue-600 rounded-full" /> */}
								<h1 className="text-lg font-bold text-slate-800">
									Perencanaan Studi
								</h1>
							</div>
							<p className="text-sm font-medium text-slate-500 leading-relaxed">
								Visualisasi struktur kurikulum interaktif yang
								dapat dicoba untuk
								<a
									href="https://www.youtube.com/watch?v=RnbqVremDo8"
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 font-bold hover:underline hover:text-blue-700 transition-colors"
								>
									{" "}
									simulasi pengambilan mata kuliah{" "}
								</a>
								sebelum mengambil KRS pada setiap awal semester.
							</p>
						</div>
						{/* 4. Toolbar: flex-none (berada di atas, tidak ikut scroll) */}
						<div className="flex-none flex flex-wrap items-center justify-between gap-3 mb-4 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
							<div className="flex items-center gap-2">
								{isAdmin && (
									<div className="relative group">
										<button className="text-white bg-blue-700 hover:bg-blue-800 font-bold rounded-lg text-[10px] px-3 py-2 uppercase tracking-wide transition-all flex items-center gap-1.5 shadow-sm active:scale-95">
											<Plus size={14} strokeWidth={3} />{" "}
											Kelola MK <ChevronDown size={12} />
										</button>

										{/* Dropdown Menu */}
										<div className="absolute left-0 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
											<button
												onClick={() => {
													setFormMode("add");
													setIsFormOpen(true);
												}}
												className="w-full flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold text-slate-700 hover:bg-slate-50 border-b border-slate-100 transition-colors"
											>
												<Plus
													size={14}
													className="text-blue-600"
												/>{" "}
												TAMBAH BARU
											</button>
											<button
												onClick={() => {
													setFormMode("edit");
													setIsFormOpen(true);
												}}
												className="w-full flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
											>
												<Edit3
													size={14}
													className="text-orange-500"
												/>{" "}
												EDIT DATA
											</button>
											<button
												onClick={() => {
													setFormMode("delete");
													setIsFormOpen(true);
												}}
												className="w-full flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold text-red-600 hover:bg-red-50 transition-colors"
											>
												<Trash2 size={14} /> HAPUS DATA
											</button>
											<button
												onClick={() => {
													setIsAddLogOpen(true);
												}}
												className="w-full flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold text-blue-600 hover:bg-blue-50 border-t border-slate-100 transition-colors"
											>
												<ClipboardPenLine size={14} />{" "}
												TULIS CATATAN BARU
											</button>
										</div>
									</div>
								)}

								<div className="h-6 w-[1px] bg-slate-200 mx-1" />

								{/* Export & Info Group: Small Size */}
								<div className="inline-flex rounded-md shadow-sm bg-white">
									<button
										onClick={() =>
											setIsImageModalOpen(true)
										}
										className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold text-slate-600 border border-slate-200 rounded-l-lg hover:bg-slate-50 hover:text-blue-600 transition-colors"
										title="Catatan Perubahan"
									>
										<View size={14} />
										<span className="hidden lg:inline">
											View Diagram Kurikulum
										</span>
									</button>
									<button
										onClick={() => setIsDocModalOpen(true)}
										className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold text-slate-600 border border-slate-200 rounded-l-lg hover:bg-slate-50 hover:text-blue-600 transition-colors"
										title="Catatan Perubahan"
									>
										<File size={14} />
										<span className="hidden lg:inline">
											Dokumen
										</span>
									</button>
									<button
										onClick={() => setIsLogModalOpen(true)}
										className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold text-slate-600 border border-slate-200 rounded-l-lg hover:bg-slate-50 hover:text-blue-600 transition-colors"
										title="Catatan Perubahan"
									>
										<ClipboardList size={14} />
										<span className="hidden lg:inline">
											Log
										</span>
									</button>

									{/* Button: FAQ */}
									<button
										onClick={() => setIsFaqModalOpen(true)}
										className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold text-slate-600 border-t border-b border-r border-slate-200 hover:bg-slate-50 hover:text-amber-600 transition-colors"
										title="Tanya Jawab"
									>
										<HelpCircle size={14} />
										<span className="hidden lg:inline">
											FAQ
										</span>
									</button>
								</div>
							</div>

							{/* SKS COUNTER */}
							<div className="inline-flex rounded-md shadow-sm bg-white">
								{/* Button: PDF (Cetak) */}
								{/* <button
									onClick={() => setIsWaFormOpen(true)}
									className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold text-slate-600 border-t border-b border-r border-slate-200 hover:bg-slate-50 hover:text-red-600 transition-colors"
								>
									<MessageSquareShareIcon size={14} /> Share
								</button> */}
								{/* Button: PDF (Cetak) */}
								<button
									onClick={() => setIsPrintModalOpen(true)}
									className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold text-slate-600 border-t border-b border-r border-slate-200 hover:bg-slate-50 hover:text-red-600 transition-colors"
								>
									<FileText size={14} /> PDF
								</button>

								{/* Button: Excel */}
								{/* <button
									onClick={() =>
										ExportService.toExcel(selectedCourses)
									}
									className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold text-slate-600 border-t border-b border-r border-slate-200 rounded-r-lg hover:bg-slate-50 hover:text-green-600 transition-colors"
								>
									<TableProperties size={14} /> Excel
								</button> */}

								<div className="flex items-center gap-2.5 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 ml-4">
									<div className="p-1 bg-blue-600 rounded text-white">
										<BookCheck size={14} />
									</div>
									<div className="text-left">
										<p className="text-[9px] uppercase font-bold text-blue-400 leading-none mb-0.5">
											Total
										</p>
										<p className="font-black text-sm text-blue-900 leading-none">
											{totalSks}{" "}
											<span className="text-[10px] font-medium opacity-70">
												SKS
											</span>
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* 5. Scroll Container: flex-1 & overflow-x-auto */}
						{/* Bagian ini yang akan scroll ke samping jika semester meluap */}
						<div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar pb-2">
							<div className="flex gap-4 h-full min-w-max">
								{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((sem) => {
									// 1. Definisikan 'steps' (Mata kuliah untuk semester ini)
									const steps = allCourses.filter((c) => {
										if (sem === 9) {
											return c.is_pilihan === true;
										} else {
											return (
												c.semester === sem &&
												!c.is_pilihan
											);
										}
									});

									// 2. Hitung Kapasitas Total SKS Semester
									const semesterSks = steps.reduce(
										(acc, curr) => acc + (curr.sks || 0),
										0,
									);

									// 3. Hitung SKS yang sudah diambil (Terpenuhi)
									const SksTerambil = steps
										.filter((step) =>
											selectedIds.includes(step.kode),
										)
										.reduce(
											(sum, step) =>
												sum + (step.sks || 0),
											0,
										);

									return (
										<section
											key={sem}
											className="w-60 flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
										>
											{/* Header Semester */}
											<div className="flex-none p-3 flex flex-col gap-1 transition-all bg-white border-b border-slate-100 shadow-sm text-slate-800">
												{/* Baris Atas: Judul Semester */}
												<div className="font-black text-[14px] leading-none text-slate-500">
													{sem === 9
														? "Peminatan"
														: `Semester ${sem}`}

													<div className="w-1/2 mt-2">
														<span
															className={`text-[9pt] font-semibold ${
																SksTerambil > 0
																	? "text-green-600"
																	: "text-slate-400"
															}`}
														>
															Diambil:{" "}
															{SksTerambil} SKS
														</span>
													</div>
												</div>
												{/* Baris Bawah: Total SKS dengan Badge Style */}
												{/* <div className="flex items-center gap-1.5 mt-0.5">
													<span className="text-[9px] font-black text-blue-600 tracking-widest whitespace-nowrap">
														{semesterSks} SKS TOTAL
													</span>
													<div className="h-[1px] flex-1 bg-slate-100" />
												</div> */}
											</div>

											{/* List Mata Kuliah: flex-1 & overflow-y-auto */}
											{/* Jika MK dalam satu semester banyak, bagian ini akan scroll ke bawah */}
											<div className="flex-1 p-2.5 space-y-2 overflow-y-auto bg-slate-50/50 min-h-0">
												{steps.length > 0 ? (
													steps.map((course) => (
														<CourseCard
															key={course.kode}
															course={course}
															isSelected={selectedIds.includes(
																course.kode,
															)}
															isActive={
																activeHighlight ===
																course.kode
															}
															isLocked={isCourseLocked(
																course,
															)}
															isRelated={
																activeObj?.kode_mata_kuliah_prasyarat.includes(
																	course.kode,
																) ||
																course.kode_mata_kuliah_prasyarat.includes(
																	activeHighlight,
																)
															}
															onSelect={
																toggleCourse
															}
															onDetail={
																setModalCourse
															}
														/>
													))
												) : (
													<div className="flex flex-col items-center justify-center h-full opacity-30 py-10">
														<span className="text-[10px] font-black uppercase">
															Belum ada data
														</span>
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
		}
	};

	return (
		/* 1. Container Utama: h-screen & overflow-hidden mengunci layar agar tidak scroll ke bawah */
		<div className="h-screen w-screen flex flex-col bg-slate-50 text-slate-900 font-sans overflow-hidden">
			{/* 2. Navbar: flex-none (tinggi tetap) */}
			<nav className="flex-none bg-[#375C62] border-b border-slate-200 px-6 py-3 z-30 shadow-sm">
				<div className="max-w-[1600px] mx-auto flex justify-between items-center">
					{/* Sisi Kiri: Logo, Brand & Deskripsi Kurikulum */}
					<div className="flex items-center gap-4">
						{/* Logo UPN */}
						<div className="flex items-center gap-3">
							<img
								src="src/assets/upn_logo.png"
								alt="Logo UPN"
								className="h-15 w-auto object-contain"
							/>
							<div className="h-12 w-[1.5px] bg-slate-200 hidden md:block" />{" "}
							{/* Divider Visual */}
						</div>

						{/* Brand & Teks Kurikulum */}
						<div className="flex flex-col md:flex-row md:items-center md:gap-3">
							{/* <div className="hidden md:block h-1 w-1 bg-slate-300 rounded-full" />{" "} */}
							{/* Dot Separator */}
							<span className="text-[10px] md:text-[20px] font-bold text-white tracking-tight leading-tight">
								Kurikulum Teknik Geomatika <br />
								<span>UPN "Veteran" Yogyakarta</span>
							</span>
						</div>
					</div>

					{/* Sisi Kanan: Menu Links */}
					{/* <div className="flex items-center gap-6">
						<div className="hidden md:flex items-center gap-6">
							{["Dashboard", "Course", "Menu 2"].map((menu) => (
								<button
									key={menu}
									onClick={() => setActiveMenu(menu)}
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

			{/* RENDER HALAMAN AKTIF */}
			{renderContent()}

			{/* MODALS (Tetap di luar aliran flex) */}
			{isFormOpen && (
				<AddCourseForm
					onAdd={handleAddNewCourse}
					onUpdate={handleUpdateCourse}
					onClose={() => setIsFormOpen(false)}
					allCourses={allCourses}
					mode={formMode}
				/>
			)}

			{/* MODAL DETAIL - EXPANDED VERSION */}
			{modalCourse && (
				<div
					className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
					onClick={() => setModalCourse(null)}
				>
					<div
						className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in duration-200"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex flex-col h-full">
							{/* Bagian Kiri: Info Utama */}
							<div className="p-6 w-full border-b md:border-b-0 md:border-r border-slate-100">
								<div className="mb-4">
									<span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-1">
										{modalCourse.kode} • Semester{" "}
										{modalCourse.semester}
									</span>
									<h2 className="text-xl font-black text-slate-800 leading-tight">
										{modalCourse.nama_mata_kuliah}
										<span className="font-medium text-gray-500">
											{" "}
											(<span>{modalCourse.sks} SKS</span>
											){" "}
										</span>
										{/* <span> {modalCourse.sks} SKS </span> */}
									</h2>
								</div>

								<div className="space-y-4 mb-4">
									<p className="text-[9px] text-slate-400 font-bold uppercase mb-4 flex items-center gap-2">
										<AlertCircle size={12} /> Prasyarat
									</p>

									<div className="space-y-3 relative">
										{(() => {
											const chain = [];
											const visited = new Set();

											// Fungsi rekursif untuk mencari silsilah prasyarat
											const findChain = (kode) => {
												const course = allCourses.find(
													(c) => c.kode === kode,
												);
												if (
													course &&
													course.kode_mata_kuliah_prasyarat &&
													!visited.has(kode)
												) {
													visited.add(kode);
													course.kode_mata_kuliah_prasyarat.forEach(
														(pKode) => {
															const prereq =
																allCourses.find(
																	(c) =>
																		c.kode ===
																		pKode,
																);
															if (prereq) {
																chain.push(
																	prereq,
																);
																findChain(
																	pKode,
																); // Rekursi ke bawah
															}
														},
													);
												}
											};

											findChain(modalCourse.kode);

											if (chain.length === 0) {
												return (
													<div className="text-center py-10">
														<p className="text-[10px] text-slate-400 font-medium">
															Mata kuliah ini
															tidak memiliki
															prasyarat.
														</p>
													</div>
												);
											}

											return chain.map((step, index) => (
												<div
													key={index}
													className="flex items-start gap-3 relative"
												>
													{/* Garis Alur Vertikal */}
													{index !==
														chain.length - 1 && (
														<div className="absolute left-[11px] top-6 w-[2px] h-6 bg-slate-200" />
													)}

													<div
														className={`z-10 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
															selectedIds.includes(
																step.kode,
															)
																? "bg-green-500 text-white"
																: "bg-slate-200 text-slate-500"
														}`}
													>
														{index + 1}
													</div>

													<div className="flex-1 bg-white p-2.5 rounded-lg border border-slate-200">
														<div className="flex justify-between items-center mb-0.5">
															<span className="text-[9px] font-black text-blue-500">
																{step.kode}
															</span>

															{/* Indikator Status Terpenuhi / Tidak Terpenuhi */}
															{selectedIds.includes(
																step.kode,
															) ? (
																<div className="flex items-center gap-1">
																	<span className="text-[11px] font-black text-green-600 tracking-tighter">
																		Terpenuhi
																	</span>
																	<CircleCheck
																		size={
																			14
																		}
																		className="text-green-500 fill-green-50"
																		variant="filled" // Jika menggunakan library yang mendukung variant, atau cukup gunakan CSS fill
																	/>
																</div>
															) : (
																<div className="flex items-center gap-1">
																	<span className="text-[11px] font-black text-red-600 tracking-tighter">
																		Tidak
																		Terpenuhi
																	</span>
																	<CircleX
																		size={
																			14
																		}
																		className="text-red-500 fill-red-50"
																	/>
																</div>
															)}
														</div>

														<p className="text-[11px] font-bold text-slate-700 truncate w-40">
															{
																step.nama_mata_kuliah
															}
														</p>
													</div>
												</div>
											));
										})()}
									</div>
								</div>

								<div className="space-y-4">
									<div>
										<p className="text-[9px] text-slate-400 font-bold uppercase mb-1">
											Deskripsi
										</p>
										<p className="text-xs text-slate-600 leading-relaxed italic">
											"
											{modalCourse.deskripsi ||
												"Tidak ada deskripsi tersedia untuk mata kuliah ini."}
											"
										</p>
									</div>

									{/* <div className="flex gap-4">
										<div>
											<p className="text-[9px] text-slate-400 font-bold uppercase mb-1">
												SKS
											</p>
											<p className="text-sm font-bold text-slate-700">
												{modalCourse.sks} SKS
											</p>
										</div>
										<div>
											<p className="text-[9px] text-slate-400 font-bold uppercase mb-1">
												Sifat
											</p>
											<p className="text-sm font-bold text-slate-700">
												{modalCourse.sifat_mata_kuliah}
											</p>
										</div>
									</div> */}
								</div>

								<button className="w-full mt-8 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95">
									Unduh RPS <ExternalLink size={14} />
								</button>
							</div>
						</div>

						{/* Close Button Floating */}
						<button
							onClick={() => setModalCourse(null)}
							className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
						>
							<X size={20} />
						</button>
					</div>
				</div>
			)}

			{isPrintModalOpen && (
				<div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
					<div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in duration-200">
						<div className="p-4 bg-slate-50 border-b flex justify-between items-center">
							<h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
								<FileText size={14} className="text-red-600" />{" "}
								Pengaturan Cetak PDF
							</h3>
							<button
								onClick={() => setIsPrintModalOpen(false)}
								className="text-slate-400 hover:text-slate-600"
							>
								<X size={18} />
							</button>
						</div>

						<div className="p-6 space-y-4">
							<div>
								<label className="block mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
									Nama Mahasiswa
								</label>
								<input
									type="text"
									className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
									placeholder="Masukkan nama lengkap..."
									value={studentData.nama}
									onChange={(e) =>
										setStudentData({
											...studentData,
											nama: e.target.value,
										})
									}
								/>
							</div>
							<div>
								<label className="block mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
									NIK / NIM
								</label>
								<input
									type="text"
									className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
									placeholder="Masukkan nomor identitas..."
									value={studentData.nik}
									onChange={(e) =>
										setStudentData({
											...studentData,
											nik: e.target.value,
										})
									}
								/>
							</div>

							<button
								onClick={() => {
									ExportService.toPDF(
										selectedCourses,
										totalSks,
										studentData,
									);
									setIsPrintModalOpen(false);
								}}
								disabled={!studentData.nama || !studentData.nik}
								className="w-full py-3 bg-red-600 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none"
							>
								<Printer size={14} /> Cetak Sekarang
							</button>
						</div>
					</div>
				</div>
			)}

			{isAddLogOpen && (
				<AddLogForm
					allCourses={allCourses}
					editData={selectedEditLog}
					onUpdate={handleUpdateCourse}
					onClose={() => {
						setIsAddLogOpen(false);
						setEditLogData(null);
					}}
				/>
			)}

			{isLogModalOpen && (
				<LogModal
					allCourses={allCourses}
					onUpdate={handleUpdateCourse}
					onEditLog={handleEditLogAction}
					onClose={() => setIsLogModalOpen(false)}
				/>
			)}

			{isWaFormOpen && (
				<WhatsAppForm
					selectedCourses={selectedCourses} // Data MK dari modal detail
					onClose={() => setIsWaFormOpen(false)}
				/>
			)}

			{isImageModalOpen && (
				<div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[500] flex flex-col animate-in fade-in duration-300">
					{/* Top Navigation Bar */}
					<div className="flex justify-between items-center px-8 py-6 text-white border-b border-white/10 bg-slate-900/50">
						<div>
							<h4 className="text-xs font-black uppercase tracking-[0.2em]">
								Preview Gambar Kurikulum
							</h4>
							<p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-widest italic">
								Zoom & Pan Mode Active
							</p>
						</div>
						<div className="flex items-center gap-4">
							{/* Tombol Download (Opsional) */}
							<a
								href={selectedImageUrl}
								download
								className="p-3 hover:bg-white/10 rounded-full transition-all text-slate-400 hover:text-white"
							>
								<svg
									size={20}
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
								onClick={() => setIsImageModalOpen(false)}
								className="p-3 bg-white/10 hover:bg-red-500 rounded-full transition-all text-white group"
							>
								<svg
									size={24}
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

					{/* Image Container (Full Screen Scrollable) */}
					<div className="flex-1 overflow-auto p-4 flex justify-center items-center custom-scrollbar">
						<img
							src={selectedImageUrl}
							alt="Full View"
							className="max-w-none shadow-2xl rounded-lg cursor-zoom-in"
							onClick={() =>
								window.open(selectedImageUrl, "_blank")
							}
						/>
					</div>

					{/* Footer Hint */}
					<div className="py-4 text-center text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] bg-slate-900/50">
						Gunakan Scroll Mouse untuk navigasi • Klik gambar untuk
						resolusi asli
					</div>
				</div>
			)}

			{isDocModalOpen && (
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
								onClick={() => setIsDocModalOpen(false)}
								className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
							>
								<svg
									size={20}
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
						<div className="p-6 space-y-3">
							{documents.map((doc, index) => (
								<div
									key={index}
									className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all"
								>
									<div className="flex items-center gap-4">
										<div className="p-3 bg-white border border-slate-200 rounded-xl text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
											<svg
												size={18}
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
												<line
													x1="16"
													y1="13"
													x2="8"
													y2="13"
												/>
												<line
													x1="16"
													y1="17"
													x2="8"
													y2="17"
												/>
												<line
													x1="10"
													y1="9"
													x2="8"
													y2="9"
												/>
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
										rel="noopener noreferrer"
										className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:shadow-sm transition-all shadow-sm"
									>
										<svg
											size={18}
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
											<line
												x1="12"
												x2="12"
												y1="15"
												y2="3"
											/>
										</svg>
									</a>
								</div>
							))}
						</div>

						{/* Footer Modal */}
						<div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
							<button
								onClick={() => setIsDocModalOpen(false)}
								className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all shadow-sm"
							>
								Tutup
							</button>
						</div>
					</div>
				</div>
			)}

			{isFaqModalOpen && (
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
								onClick={() => setIsFaqModalOpen(false)}
								className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
							>
								<svg
									size={20}
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
							{faqData.map((item, index) => (
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
												size={18}
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
							))}
						</div>

						{/* Footer */}
						<div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
							<button
								onClick={() => setIsFaqModalOpen(false)}
								className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all shadow-sm"
							>
								Tutup
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
