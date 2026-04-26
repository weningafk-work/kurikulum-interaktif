const faqData = [
    {
        q: "Bagaimana saya mengetahui informasi detil setiap mata kuliah?",
        a: "Anda dapat melakukan klik 2x (double click) pada setiap kartu mata kuliah untuk melihat detailnya seperti, deskripsi mata kuliah, alur prasyarat, dokumen Rencana Pembelajaran Semester (RPS) atau panduan terkait.",
    },
    {
        q: "Apakah tersedia buku panduan atau informasi akademik yang dapat diakses?",
        a: "Dokumen panduan dan informasi akademik dapat diunduh melalui fitur 'Dokumen'.",
    },
    {
        q: "Apa arti warna pada bagian SKS di setiap mata kuliah?",
        a: "Abu-abu menunjukkan mata kuliah Umum, Kuning mata kuliah Sains Dasar, Biru mata kuliah Inti Teknik Geomatika, dan Hijau mata kuliah Pendukung Rekayasa.",
    },
    {
        q: "Apa arti warna pada kartu mata kuliah?",
        a: "Putih menunjukkan mata kuliah tersedia, Hijau berarti sudah diambil/terpenuhi (otomatis berwarna hijau saat dipilih/ select, pastikan Anda hanya memilih mata kuliah sebelumnya yang sudah lulus dengan nilai minimal D sebagai prasyarat pengambilan mata kuliah semester setelahnya), dan Abu-abu atau ada tanda Gembok berarti prasyarat belum terpenuhi sehingga belum dapat mengambil mata kuliah tersebut.",
    },
    {
        q: "Bagaimana cara kerja prasyarat?",
        a: "Mata kuliah yang memiliki prasyarat akan terkunci (ikon gembok) jika mata kuliah prasyaratnya belum diambil (diklik/centang) atau jumlah minimum SKS belum terpenuhi.",
    },
    {
        q: "Apa arti mata kuliah yang berubah warna menjadi oranye saat saya klik mata kuliah tertentu?",
        a: "Warna oranye pada mata kuliah menunjukkan hubungan prasyarat langsung dengan mata kuliah yang sedang Anda klik. Hubungan ini bersifat dua arah, yaitu mata kuliah tersebut dapat menjadi dasar (prasyarat) untuk mata kuliah yang sedang Anda klik, atau sebaliknya, membutuhkan mata kuliah yang Anda klik sebagai prasyarat sebelumnya.",
    },
    {
        q: "Apakah data simulasi ini tersimpan otomatis?",
        a: "Untuk saat ini simulasi bersifat sementara di browser. Anda bisa menggunakan fitur unduh PDF untuk mengirimkan rencana studi Anda ke Dosen Pembimbing Akademik sebagai catatan.",
    },
    {
        q: "Bagaimana saya dapat mengetahui keseluruhan alur diagram prasyarat mata kuliah?",
        a: "Keseluruhan alur prasyarat mata kuliah dapat dilihat pada Struktur Kurikulum melalui fitur 'View Diagram Kurikulum'",
    },
    
];

export default faqData;