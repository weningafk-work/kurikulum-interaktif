import { FileText } from "lucide-react";

const DummyPage2 = () => (
  <div className="flex-1 flex flex-col items-center justify-center bg-white m-6 rounded-2xl border-2 border-dashed border-slate-200">
    <div className="p-4 bg-purple-100 rounded-full text-purple-600 mb-4">
      <FileText size={40} />
    </div>
    <h2 className="text-xl font-black text-slate-800">Halaman Menu 2</h2>
    <p className="text-slate-400 text-sm mt-2">Konten untuk Menu 2 akan muncul di sini.</p>
  </div>
);

export default DummyPage2;