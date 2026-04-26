import { Edit2, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import Select from "react-select";

const AddCourseForm = ({ onAdd, onUpdate, onDelete, onClose, allCourses, mode, isOpen }) => {
	if (!isOpen) return null;

	const [formData, setFormData] = useState({
		kode_mata_kuliah: "",
		nama_mata_kuliah: "",
		sks: 2,
		semester: 1,
		kelompok_mata_kuliah: "",
		sifat_mata_kuliah: "",
		deskripsi: "",
		kode_mata_kuliah_prasyarat: [],
		minimal_sks_prasyarat: 0,
	});

	// Opsi-opsi untuk Dropdown
	const kelompokOptions = [
		{ value: "Umum", label: "Umum" },
		{ value: "Sains Dasar", label: "Sains Dasar" },
		{ value: "Inti Teknik Geomatika", label: "Inti Teknik Geomatika" },
		{ value: "Pendukung Rekayasa", label: "Pendukung Rekayasa" },
	];

	const sifatOptions = [
		{ "label": "Kognitif", "value": "Kognitif" },
		{ "label": "Case Based", "value": "Case Based" },
		{ "label": "Project Based", "value": "Project Based" }
	]

	const courseOptions = allCourses.map((c) => ({
		value: c.kode_mata_kuliah,
		label: `${c.kode_mata_kuliah} - ${c.nama_mata_kuliah}`,
	}));

	// Custom Style yang Compact (Mengecilkan ukuran dropdown)
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
			zIndex: 9999,
		}),
		menuList: (base) => ({
			...base,
			zIndex: 9999,
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
		const course = allCourses.find((c) => c.kode_mata_kuliah === opt.value);
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
			<div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-visible border border-slate-200">
				{/* Header Modal */}
				<div className="p-4 bg-slate-50 border-b flex justify-between items-center">
					<h3
						className={`text-xs font-bold uppercase tracking-tight flex items-center gap-2 ${themeColor}`}
					>
						{isDeleteMode ? (
							<Trash2 size={14} />
						) : mode === "edit" ? (
							<Edit2 size={14} />
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
										{formData.kode_mata_kuliah} -{" "}
										{formData.nama_mata_kuliah}
									</p>
								</div>
							)}
							<button
								onClick={() => onDelete(formData.kode_mata_kuliah, formData.nama_mata_kuliah)}
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
											value={formData.kode_mata_kuliah}
											readOnly={mode === "edit"}
											onChange={(e) =>
												setFormData({
													...formData,
													kode_mata_kuliah: e.target.value.toUpperCase(),
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
											(o) => o.value !== formData.kode_mata_kuliah,
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

export default AddCourseForm;