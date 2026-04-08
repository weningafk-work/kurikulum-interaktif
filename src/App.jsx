import React, { useEffect, useState } from "react";

import { initialCourses } from "./data/courses";
import Dashboard from "./page/dashboard";
import DummyPage2 from "./page/about";
import AddCourseForm from "./components/AddCourseForm";
import AddLogForm from "./components/AddLogForm";
import LogModal from "./components/LogModal";
import WhatsAppForm from "./components/WhatsAppForm";
import ExportService from "./utils/export";
import FaqModal from "./components/FaqModal";
import DocumentModal from "./components/DocumentModal"
import ImagePreviewModal from "./components/ImagePreviewModal";
import Navbar from "./components/layouts/Navbar";
import CourseDetailModal from "./components/CourseDetailModal";
import PrintKrsModal from "./components/PrintKrsModal";
import Planner from "./components/Planner";
import faqData from "./data/faqData";
import documents from "./data/documentData";
import linkImage from "./data/linkImage";
import { useAdminAccess } from "./hooks/useAdminAccess";
import { useCoursePlanner } from "./hooks/useCoursePlanner";
import { CourseService } from "./services/api";
import Swal from "sweetalert2";


// --- MAIN APP ---
export default function App() {
	const [activeMenu, setActiveMenu] = useState("Course");
	const [allCourses, setAllCourses] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// Custom Hooks
	const isAdmin = useAdminAccess("#geomatika-admin-2026");
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
	const [isLogModalOpen, setIsLogModalOpen] = useState(false);
	const [selectedEditLog, setSelectedEditLog] = useState(null);

	const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
	const [studentData, setStudentData] = useState({ nama: "", nim: "" });

	// const handleAddNewCourse = (newCourse) => {
	// 	setAllCourses((prev) => [...prev, newCourse]);
	// 	setIsFormOpen(false);
	// };

	// const handleUpdateCourse = (updatedCourse) => {
	// 	setAllCourses((prevCourses) =>
	// 		prevCourses.map((course) =>
	// 			course.kode === updatedCourse.kode ? updatedCourse : course,
	// 		),
	// 	);

	// 	console.log(
	// 		`Berhasil memperbarui data: ${updatedCourse.nama_mata_kuliah}`,
	// 	);
	// };

	const handleEditLogAction = (course, log) => {
		setSelectedEditLog({ course, log });
		setIsAddLogOpen(true);
	};

	const [isWaFormOpen, setIsWaFormOpen] = useState(false);

	const [isImageModalOpen, setIsImageModalOpen] = useState(false);
	const [selectedImageUrl, setSelectedImageUrl] = useState(linkImage.kurikulum);
	const [isDocModalOpen, setIsDocModalOpen] = useState(false);


	const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);


	// FETCH DATA
	useEffect(() => {
		const loadData = async () => {
			try {
				const data = await CourseService.getAllCourses();
				setAllCourses(data);
			} catch (err) {
				console.error("Gagal memuat data:", err.message);
			} finally {
				setIsLoading(false);
			}
		};
		loadData();
	}, []);

	// POST DATA
	const handleAddNewCourse = async (newCourse) => {
		Swal.fire({
			title: "Menyimpan Data...",
			text: "Sedang menambahkan mata kuliah ke database",
			allowOutsideClick: false,
			didOpen: () => {
				Swal.showLoading();
			},
		});

		try {
			const addedData = await CourseService.createCourse(newCourse);

			setAllCourses((prev) => [...prev, newCourse]);

			setIsFormOpen(false);

			Swal.fire({
				icon: "success",
				title: "Berhasil!",
				text: `Mata kuliah ${newCourse.nama_mata_kuliah} telah ditambahkan.`,
				timer: 2000,
				showConfirmButton: false,
			});

		} catch (err) {
			Swal.fire({
				icon: "error",
				title: "Gagal Menambah Data",
				text: err.message,
				confirmButtonColor: "#3b82f6",
			});
		}
	};

	// UPDATE DATA
	const handleUpdateCourse = async (updatedCourse) => {
		Swal.fire({
			title: "Memperbarui Data...",
			text: `Sedang menyimpan perubahan: ${updatedCourse.nama_mata_kuliah}`,
			allowOutsideClick: false,
			didOpen: () => {
				Swal.showLoading();
			},
		});

		try {
			const result = await CourseService.updateCourse({
				...updatedCourse,
				is_pilihan: updatedCourse.is_pilihan ? 1 : 0
			});

			setAllCourses((prev) =>
				prev.map((c) => (c.kode_mata_kuliah === result.kode_mata_kuliah ? updatedCourse : c))
			);

			setIsFormOpen(false);

			Swal.fire({
				icon: "success",
				title: "Berhasil Diperbarui!",
				text: `Data mata kuliah ${result.nama_mata_kuliah} telah diperbarui di database.`,
				timer: 2000,
				showConfirmButton: false,
			});

			console.log(`Berhasil memperbarui data: ${result.nama_mata_kuliah}`);

		} catch (err) {
			Swal.fire({
				icon: "error",
				title: "Gagal Memperbarui",
				text: "Terjadi kesalahan: " + err.message,
				confirmButtonColor: "#3b82f6",
			});
		}
	};

	// DELETE DATA
	const handleDeleteCourse = async (kode, nama) => {
		const result = await Swal.fire({
			title: "Apakah Anda yakin?",
			text: `Mata kuliah (${kode}) - ${nama} akan dihapus permanen!`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#64748b",
			confirmButtonText: "Ya, Hapus!",
			cancelButtonText: "Batal",
			reverseButtons: true,
		});

		if (result.isConfirmed) {
			try {
				Swal.showLoading();

				await CourseService.deleteCourse(kode);

				setAllCourses((prev) =>
					prev.filter((course) => course.kode_mata_kuliah !== kode)
				);

				Swal.fire({
					title: "Terhapus!",
					text: "Data mata kuliah telah berhasil dihapus.",
					icon: "success",
					timer: 2000,
					showConfirmButton: false,
				});

				setIsFormOpen(false);
				console.log(`Mata kuliah ${kode} berhasil dihapus.`);
			} catch (err) {
				Swal.fire({
					title: "Gagal!",
					text: "Terjadi kesalahan: " + err.message,
					icon: "error",
				});
			}
		}
	};

	const renderContent = () => {
		switch (activeMenu) {
			case "Dashboard":
				return <Dashboard allCourses={allCourses} />;
			case "Profile":
				return <DummyPage2 />;
			case "Course":
			default:
				return (
					<Planner
						isLoading={isLoading}
						isAdmin={isAdmin}
						allCourses={allCourses}
						selectedIds={selectedIds}
						totalSks={totalSks}
						activeHighlight={activeHighlight}
						isCourseLocked={isCourseLocked}
						toggleCourse={toggleCourse}
						setModalCourse={setModalCourse}
						setIsFormOpen={setIsFormOpen}
						setFormMode={setFormMode}
						setIsAddLogOpen={setIsAddLogOpen}
						setIsImageModalOpen={setIsImageModalOpen}
						setIsDocModalOpen={setIsDocModalOpen}
						setIsLogModalOpen={setIsLogModalOpen}
						setIsFaqModalOpen={setIsFaqModalOpen}
						setIsPrintModalOpen={setIsPrintModalOpen}
					/>
				);
		}
	};

	return (
		<div className="h-screen w-screen flex flex-col bg-slate-50 text-slate-900 font-sans overflow-hidden">
			<Navbar
				activeMenu={activeMenu}
				setActiveMenu={setActiveMenu}
				logoPath="/src/assets/upn_logo.png"
			/>

			{/* RENDER HALAMAN AKTIF */}
			{renderContent()}

			<AddCourseForm
				isOpen={isFormOpen}
				onAdd={handleAddNewCourse}
				onUpdate={handleUpdateCourse}
				onDelete={handleDeleteCourse}
				onClose={() => setIsFormOpen(false)}
				allCourses={allCourses}
				mode={formMode}
			/>

			{/* MODAL DETAIL - EXPANDED VERSION */}
			<CourseDetailModal
				course={modalCourse}
				allCourses={allCourses}
				selectedIds={selectedIds}
				onClose={() => setModalCourse(null)}
			/>

			<PrintKrsModal
				isOpen={isPrintModalOpen}
				onClose={() => setIsPrintModalOpen(false)}
				studentData={studentData}
				totalSks={totalSks}
				selectedCourses={selectedCourses}
				setStudentData={setStudentData}
				onExport={ExportService.toPDF}
			/>

			<AddLogForm
				isOpen={isAddLogOpen}
				allCourses={allCourses}
				editData={selectedEditLog}
				onUpdate={handleUpdateCourse}
				onClose={() => {
					setIsAddLogOpen(false);
					setEditLogData(null);
					setSelectedEditLog(null);
				}}
			/>

			<LogModal
				isOpen={isLogModalOpen}
				isAdmin={isAdmin}
				allCourses={allCourses}
				onUpdate={handleUpdateCourse}
				onEditLog={handleEditLogAction}
				onClose={() => setIsLogModalOpen(false)}
			/>


			<WhatsAppForm
				isOpen={isWaFormOpen}
				selectedCourses={selectedCourses} // Data MK dari modal detail
				onClose={() => setIsWaFormOpen(false)}
			/>

			<ImagePreviewModal
				isOpen={isImageModalOpen}
				onClose={() => setIsImageModalOpen(false)}
				imageUrl={selectedImageUrl}
				title="Struktur Kurikulum 2025"
			/>

			<DocumentModal
				isOpen={isDocModalOpen}
				onClose={() => setIsDocModalOpen(false)}
				documents={documents}
			/>

			<FaqModal
				isOpen={isFaqModalOpen}
				onClose={() => setIsFaqModalOpen(false)}
				faqData={faqData}
			/>
		</div>
	);
}