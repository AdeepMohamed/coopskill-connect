'use client';
import { usePathname } from 'next/navigation';
import { useState, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  Users, QrCode, ClipboardList, Search, Download, 
  ChevronRight, MoreVertical, Calendar, CheckCircle,
  X, Upload, FileJson
} from 'lucide-react';

const MOCK_BATCHES = [
  { code: 'DCM-2026-041', name: 'Digital Cooperative Management', start: '6 Sep 2026', trainees: 28, progress: 65 },
  { code: 'CFA-2026-012', name: 'Cooperative Finance Basics', start: '1 Sep 2026', trainees: 42, progress: 80 },
  { code: 'ASC-2026-003', name: 'Agri Supply Chain Tech', start: '15 Sep 2026', trainees: 18, progress: 12 },
];

const MOCK_DATA = Array.from({ length: 15 }).map((_, i) => ({
  id: `CC-2026-0${100 + i}`,
  name: ['Ravi Kumar', 'Priya Devi', 'Arjun M', 'Meena S', 'Suresh Babu', 'Anjali K', 'Vikram Singh', 'Lakshmi P'][i % 8],
  batch: 'DCM-2026-041',
  date: new Date().toISOString().split('T')[0],
  status: i % 7 === 0 ? 'Absent' : 'Present',
  score: (i * 23) % 40 + 60,
  method: 'QR Scan'
}));

export default function TrainerPlaceholderPage() {
  const pathname = usePathname();
  const slug = pathname.split('/').pop() || '';
  const pageName = slug.replace('-', ' ');

  // Interactive State
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      alert(`Successfully imported assessment from ${e.target.files[0].name}!`);
      // Reset input so it can trigger again
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const renderContent = () => {
    if (slug === 'batches') {
      return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_BATCHES.map((batch) => (
            <div key={batch.code} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600`}>
                  <Users className="w-6 h-6" />
                </div>
                <span className="px-2 py-1 text-[10px] font-bold uppercase rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                  Active
                </span>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{batch.name}</h3>
              <div className="text-xs font-mono text-slate-500 mb-4">{batch.code}</div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1.5"><Calendar className="w-4 h-4"/> Started</span>
                  <span className="font-semibold text-slate-700">{batch.start}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1.5"><Users className="w-4 h-4"/> Trainees</span>
                  <span className="font-semibold text-slate-700">{batch.trainees} Enrolled</span>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                    <span>Avg. Progress</span>
                    <span className="text-brand-600">{batch.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-600 rounded-full" style={{ width: `${batch.progress}%` }}></div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => { setSelectedBatch(batch); setActiveModal('batchDetails'); }}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-xl border border-slate-200 transition-colors">
                View Batch Details
              </button>
            </div>
          ))}
        </div>
      );
    }

    // Default Table View (Attendance, Assessments)
    return (
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder={`Search ${pageName}...`} className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white w-64" />
          </div>
          <div className="flex gap-3">
            {slug === 'attendance' && (
              <button 
                onClick={() => setActiveModal('qrCode')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700 transition-colors">
                <QrCode className="w-4 h-4" /> Generate QR Code
              </button>
            )}
            
            {slug === 'assessments' && (
              <>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-colors">
                  <FileJson className="w-4 h-4" /> Import JSON
                </button>
                <input 
                  type="file" 
                  accept=".json" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </>
            )}

            <button 
              onClick={() => alert(`Exporting ${pageName} data as CSV...`)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800">
              <Download className="w-4 h-4" /> Export {pageName}
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Trainee ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Batch / Course</th>
                {slug === 'assessments' ? (
                  <th className="p-4">Score</th>
                ) : (
                  <th className="p-4">Date</th>
                )}
                <th className="p-4">Status</th>
                <th className="p-4 pr-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_DATA.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 font-mono text-sm text-slate-500">{row.id}</td>
                  <td className="p-4 font-bold text-slate-800">{row.name}</td>
                  <td className="p-4 text-sm text-slate-600">{row.batch}</td>
                  
                  {slug === 'assessments' ? (
                    <td className="p-4">
                      <span className="font-extrabold text-brand-600">{row.score}%</span>
                    </td>
                  ) : (
                    <td className="p-4 text-sm font-medium text-slate-600">{row.date}</td>
                  )}

                  <td className="p-4">
                    {slug === 'assessments' ? (
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border ${
                        row.score >= 70 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {row.score >= 70 ? 'Passed' : 'Failed'}
                      </span>
                    ) : (
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border flex items-center gap-1 w-max ${
                        row.status === 'Present' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {row.status === 'Present' && <CheckCircle className="w-3 h-3" />} {row.status}
                      </span>
                    )}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"><MoreVertical className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <Sidebar />
      <div className="flex-1 overflow-y-auto relative">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight capitalize">{pageName}</h1>
            <div className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
              Trainer Dashboard <ChevronRight className="w-3 h-3" /> <span className="capitalize">{pageName}</span>
            </div>
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto space-y-6">
          {renderContent()}
        </main>
      </div>

      {/* MODALS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => { setActiveModal(null); setSelectedBatch(null); }}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
            
            {activeModal === 'batchDetails' && selectedBatch && (
              <div className="p-8">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">{selectedBatch.name}</h2>
                <p className="text-sm font-mono text-slate-500 mb-6">{selectedBatch.code}</p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-sm font-bold text-slate-600">Total Enrolled</span>
                    <span className="text-lg font-extrabold text-slate-900">{selectedBatch.trainees}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-sm font-bold text-slate-600">Avg Progress</span>
                    <span className="text-lg font-extrabold text-brand-600">{selectedBatch.progress}%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-sm font-bold text-slate-600">Start Date</span>
                    <span className="text-sm font-extrabold text-slate-900">{selectedBatch.start}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-full mt-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
                  Close Details
                </button>
              </div>
            )}

            {activeModal === 'qrCode' && (
              <div className="p-8 text-center">
                <h2 className="text-xl font-bold text-slate-900 mb-2">Attendance Scan</h2>
                <p className="text-sm text-slate-500 mb-6">Ask trainees to scan this code using their mobile app.</p>
                
                {/* Fake QR Code using CSS grid blocks to look real */}
                <div className="mx-auto w-48 h-48 bg-white border-4 border-slate-100 rounded-xl p-2 relative mb-6 shadow-sm">
                  <div className="absolute top-4 left-4 w-10 h-10 border-4 border-slate-900"></div>
                  <div className="absolute top-4 right-4 w-10 h-10 border-4 border-slate-900"></div>
                  <div className="absolute bottom-4 left-4 w-10 h-10 border-4 border-slate-900"></div>
                  <div className="absolute inset-4 grid grid-cols-6 grid-rows-6 gap-1 p-2">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div key={i} className={`bg-slate-900 ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>
                    ))}
                  </div>
                </div>

                <div className="px-4 py-2 bg-purple-50 text-purple-700 text-sm font-bold rounded-xl border border-purple-200 inline-block">
                  Valid for: 04:59
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
