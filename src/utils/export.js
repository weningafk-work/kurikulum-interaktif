import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const ExportService = {
    /**
     * Export data ke format PDF (KRS Style)
     */
    toPDF: (data, totalSks, info) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // --- 1. HEADER TITLE ---
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("KARTU RENCANA STUDI (KRS)", pageWidth / 2, 18, {
            align: "center",
        });
        
        // Penambahan Program Studi
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("PROGRAM STUDI TEKNIK GEOMATIKA, FTME, UPN VETERAN YOGYAKARTA", pageWidth / 2, 25, {
            align: "center",
        });

        // Garis Pemisah Header (Posisi Y sedikit diturunkan karena ada baris baru)
        doc.setLineWidth(0.5);
        doc.line(14, 28, pageWidth - 14, 28);

        // --- 2. IDENTITAS MAHASISWA ---
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Nama Mahasiswa", 14, 38);
        doc.text(`: ${info.nama.toUpperCase()}`, 45, 38);
        doc.text("NIM", 14, 43);
        doc.text(`: ${info.nim}`, 45, 43);
        doc.text("Tanggal Cetak", 14, 48);
        doc.text(`: ${new Date().toLocaleDateString("id-ID")}`, 45, 48);

        // --- 3. PROSES GROUPING DATA ---
        const sortedData = [...data].sort((a, b) => a.semester - b.semester);
        const groupedData = [];
        let currentSemester = null;

        sortedData.forEach((c) => {
            const isNumber = !isNaN(parseInt(c.semester, 10));
            const label = isNumber ? `SEMESTER ${c.semester}` : c.semester.toUpperCase();

            if (label !== currentSemester) {
                currentSemester = label;
                groupedData.push([
                    {
                        content: label,
                        colSpan: 6,
                        styles: {
                            fillColor: [241, 245, 249],
                            textColor: [71, 85, 105],
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
                isNumber ? `Sem ${c.semester}` : c.semester,
                c.kelompok_mata_kuliah,
                c.sifat_mata_kuliah || "-",
            ]);
        });

        autoTable(doc, {
            startY: 55, // Disesuaikan agar tidak menabrak identitas
            head: [["Kode", "Mata Kuliah", "SKS", "Sem", "Kelompok", "Sifat"]],
            body: groupedData,
            theme: "grid",
            headStyles: {
                fillColor: [37, 99, 235],
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
                const isLastPage = d.pageNumber === doc.internal.getNumberOfPages();
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

        // --- 4. CATATAN DOSEN & SIGNATURE AREA ---
        let finalY = doc.lastAutoTable.finalY + 15;
        const pageHeight = doc.internal.pageSize.getHeight();

        // Cek apakah sisa halaman cukup untuk Catatan + Tanda Tangan (butuh sekitar 60-70 unit)
        if (finalY > pageHeight - 70) {
            doc.addPage();
            finalY = 25;
        }

        // 4a. Kolom Catatan Dosen
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Catatan Dosen Pembimbing Akademik:", 14, finalY);

        doc.setFont("helvetica", "normal");
        doc.setLineWidth(0.2);
        // Membuat kotak/garis tempat catatan (opsional, agar terlihat seperti form)
        doc.rect(14, finalY + 2, pageWidth - 28, 30); // x, y, width, height

        // 4b. Area Tanda Tangan (Posisi Y digeser ke bawah setelah kotak catatan)
        const signatureY = finalY + 45; 

        doc.setFontSize(10);
        doc.text(
            "Yogyakarta, " + new Date().toLocaleDateString("id-ID"),
            pageWidth - 80,
            signatureY - 5,
        );
        doc.text("Mengetahui,", pageWidth - 80, signatureY);
        doc.text("Pembimbing Akademik,", pageWidth - 80, signatureY + 5);

        doc.setFont("helvetica", "bold");
        doc.text("( __________________________ )", pageWidth - 80, signatureY + 35);
        doc.setFontSize(9);
        doc.text(
            "NIP. ...........................",
            pageWidth - 80,
            signatureY + 40,
        );

        const fileName = `KRS_${info.nim}_${info.nama.replace(/\s+/g, "_")}.pdf`;
        doc.save(fileName);
    },

    toExcel: (data) => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "KRS");
        XLSX.writeFile(wb, "krs_akademik.xlsx");
    },
};

export default ExportService;