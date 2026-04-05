import React, { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { CourseSchema } from '../utils/validation';

export default function AddCourseForm({ onAdd, onClose, existingCourses }) {
  const [formData, setFormData] = useState({
    kode: '',
    nama_mata_kuliah: '',
    sks: 2,
    semester: 1,
    kelompok_mata_kuliah: 'MKK',
    sifat_mata_kuliah: 'Wajib',
    deskripsi: '',
    kode_mata_kuliah_prasyarat: [],
    minimal_sks_prasyarat: 0,
    rps_link: ''
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = CourseSchema.safeParse({
      ...formData,
      sks: Number(formData.sks),
      semester: Number(formData.semester),
      minimal_sks_prasyarat: Number(formData.minimal_sks_prasyarat)
    });

    if (!result.success) {
      const formattedErrors = result.error.format();
      setErrors(formattedErrors);
      return;
    }

    onAdd(result.data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
        <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <PlusCircle size={16} className="text-blue-600" /> Tambah Mata Kuliah
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18}/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <InputGroup label="Kode MK" error={errors.kode?._errors[0]}>
              <input 
                className="input-style" 
                placeholder="CS101" 
                onChange={e => setFormData({...formData, kode: e.target.value})} 
              />
            </InputGroup>
            <InputGroup label="Nama MK" error={errors.nama_mata_kuliah?._errors[0]}>
              <input 
                className="input-style" 
                placeholder="Struktur Data" 
                onChange={e => setFormData({...formData, nama_mata_kuliah: e.target.value})} 
              />
            </InputGroup>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <InputGroup label="SKS">
              <input type="number" className="input-style" value={formData.sks} onChange={e => setFormData({...formData, sks: e.target.value})} />
            </InputGroup>
            <InputGroup label="Semester">
              <input type="number" className="input-style" value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})} />
            </InputGroup>
            <InputGroup label="Sifat">
              <select className="input-style" onChange={e => setFormData({...formData, sifat_mata_kuliah: e.target.value})}>
                <option value="Wajib">Wajib</option>
                <option value="Pilihan">Pilihan</option>
              </select>
            </InputGroup>
          </div>

          <InputGroup label="Kelompok (MKK, MKWU, dll)">
            <input className="input-style" placeholder="MKK" onChange={e => setFormData({...formData, kelompok_mata_kuliah: e.target.value})} />
          </InputGroup>

          <InputGroup label="Prasyarat (Kode MK, pisah koma)">
            <input 
              className="input-style" 
              placeholder="CS101, CS102" 
              onChange={e => setFormData({...formData, kode_mata_kuliah_prasyarat: e.target.value.split(',').map(s => s.trim())})} 
            />
          </InputGroup>

          <InputGroup label="Deskripsi Ringkas">
            <textarea className="input-style h-20" onChange={e => setFormData({...formData, deskripsi: e.target.value})} />
          </InputGroup>

          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all mt-4">
            Simpan Mata Kuliah
          </button>
        </form>
      </div>
    </div>
  );
}

// Sub-komponen internal untuk kebersihan kode
const InputGroup = ({ label, children, error }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase">{label}</label>
    {children}
    {error && <span className="text-[9px] text-red-500 font-medium italic">{error}</span>}
  </div>
);