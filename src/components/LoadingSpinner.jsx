import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ message = "Memuat Data Kurikulum..." }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm">
      <div className="relative flex items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-slate-200"></div>
        
        <Loader2 
          className="absolute h-16 w-16 animate-spin text-blue-600" 
          strokeWidth={2.5}
        />
      </div>

      {/* Pesan Teks */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <p className="text-lg font-semibold text-slate-700 animate-pulse">
          {message}
        </p>
        <p className="text-sm text-slate-500">
          Mohon tunggu sebentar
        </p>
      </div>

      <div className="absolute bottom-10 text-slate-400 text-xs tracking-widest uppercase">
        UPN "Veteran" Yogyakarta
      </div>
    </div>
  );
};

export default LoadingSpinner;