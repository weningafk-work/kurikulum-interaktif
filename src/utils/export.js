import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const ExportService = {
    /**
     * Export data ke format PDF (KRS Style)
     * @param {Array} data - Daftar mata kuliah terpilih
     * @param {number} totalSks - Total SKS yang diambil
     * @param {Object} info - Data identitas { nama, nik }
     */
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
        const sortedData = [...data].sort((a, b) => a.semester - b.semester);

        let currentSemester = null;

        sortedData.forEach((c) => {
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
            groupedData.push([
                c.kode_mata_kuliah,
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
            rowPageBreak: "avoid",
            didDrawPage: (d) => {
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

        // --- 4. SIGNATURE AREA ---
        let finalY = doc.lastAutoTable.finalY + 25;
        const pageHeight = doc.internal.pageSize.getHeight();

        if (finalY > pageHeight - 50) {
            doc.addPage();
            finalY = 30;
        }

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(
            "Yogyakarta, " + new Date().toLocaleDateString("id-ID"),
            pageWidth - 80,
            finalY - 5,
        );
        doc.text("Mengetahui,", pageWidth - 80, finalY);
        doc.text("Pembimbing Akademik,", pageWidth - 80, finalY + 5);

        doc.setFont("helvetica", "bold");
        doc.text("( __________________________ )", pageWidth - 80, finalY + 35);
        doc.setFontSize(9);
        doc.text(
            "NIP/NIK. ...........................",
            pageWidth - 80,
            finalY + 40,
        );

        // Simpan file
        const fileName = `KRS_${info.nik}_${info.nama.replace(/\s+/g, "_")}.pdf`;
        doc.save(fileName);
    },

    /**
     * Export data ke format Excel
     * @param {Array} data - Daftar mata kuliah
     */
    toExcel: (data) => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "KRS");
        XLSX.writeFile(wb, "krs_akademik.xlsx");
    },
};

export default ExportService;