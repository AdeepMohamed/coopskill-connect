'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { updateProgress, getCourse } from '@/lib/api';
import { useApp } from '@/lib/context';
import { Play, CheckCircle, Lock, BookOpen, ChevronRight, Download, Globe } from 'lucide-react';

const COURSE = {
  id: 1, title: 'Digital Cooperative Management', code: 'DCM-2026',
  description: 'Comprehensive digital skills for cooperative managers',
  modules: [
    { id: 1, order: 1, title: 'Introduction to Cooperatives', description: 'History and principles', duration_minutes: 45, done: true },
    { id: 2, order: 2, title: 'Cooperative Governance', description: 'Bylaws, elections, member rights', duration_minutes: 60, done: true },
    { id: 3, order: 3, title: 'Digital Finance', description: 'Digital payments for cooperatives', duration_minutes: 50, done: true },
    { id: 4, order: 4, title: 'ERP Fundamentals', description: 'Introduction to ERP systems', duration_minutes: 90, done: false, current: true },
    { id: 5, order: 5, title: 'Data & Record Management', description: 'Digital records and data security', duration_minutes: 60, done: false },
    { id: 6, order: 6, title: 'Final Assessment', description: 'Comprehensive assessment', duration_minutes: 120, done: false },
  ],
  content: `An Enterprise Resource Planning (ERP) system integrates all cooperative management functions — accounting, HR, inventory, member management — into a single platform.

## Why ERP for Cooperatives?

Traditional cooperatives manage records manually or with disconnected software. This leads to:
- Data duplication and errors
- Slow reporting to regulatory bodies  
- Difficulty in auditing
- Poor member service

## Key ERP Modules for Cooperatives

**1. Member Management**
Track all member profiles, share capital, and democratic voting rights.

**2. Financial Management**
Integrated accounting, audit trails, and automated regulatory reporting.

**3. Inventory & Procurement**
For agricultural cooperatives: track produce procurement, storage, and distribution.

**4. HR & Training**
Integrate with NCCT LMS for automated training records and certification.

**5. Analytics Dashboard**
Real-time dashboards for the Board of Directors and regulatory oversight.

## NCCT ERP Integration

CoopSkill Connect integrates with cooperative ERP systems to:
- Auto-update skill profiles when employees complete training
- Share certified skill data with cooperative HR systems
- Enable employer verification of certificates via API

*Complete this module and take the Final Assessment to earn your NCCT Certificate.*`,
};

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🌐' },
  { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
];

export default function LearningPage() {
  const { user } = useApp();
  const [currentModule, setCurrentModule] = useState(COURSE.modules[3]);
  const [lang, setLang] = useState('en');
  const [progress, setProgress] = useState(67);
  const [marking, setMarking] = useState(false);
  const [markedDone, setMarkedDone] = useState(false);

  const handleMarkComplete = async () => {
    setMarking(true);
    const newProgress = progress + 16.7;
    try {
      if (user) await updateProgress(user.user_id, COURSE.id, Math.min(100, newProgress), currentModule.order + 1);
    } catch {}
    await new Promise(r => setTimeout(r, 600));
    setProgress(Math.min(100, newProgress));
    setMarkedDone(true);
    setMarking(false);
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content bg-slate-50">
        <div className="page-header">
          <div>
            <h1 className="font-bold text-slate-800 text-base">📚 My Learning</h1>
            <p className="text-xs text-slate-500">{COURSE.title} — {COURSE.code}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-slate-500">Progress:</div>
            <div className="font-bold text-sm" style={{ color: '#1b4f8a' }}>{Math.round(progress)}%</div>
            <div className="w-24 progress-track h-2">
              <div className="progress-bar" style={{ width: `${progress}%`, backgroundColor: '#1b4f8a' }} />
            </div>
          </div>
        </div>

        <div className="page-body">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Content Viewer */}
            <div className="lg:col-span-2 space-y-4">
              {/* Language Selector */}
              <div className="flex gap-2">
                {LANGUAGES.map(l => (
                  <button key={l.code} onClick={() => setLang(l.code)}
                    className="btn btn-sm" style={{
                      backgroundColor: lang === l.code ? '#1b4f8a' : 'white',
                      color: lang === l.code ? 'white' : '#374151',
                      border: `1px solid ${lang === l.code ? '#1b4f8a' : '#e2e8f0'}`,
                    }}>
                    {l.flag} {l.label}
                  </button>
                ))}
              </div>

              {/* Video Player */}
              <div className="rounded-2xl overflow-hidden border" style={{ borderColor: '#e2e8f0', backgroundColor: '#0f172a', aspectRatio: '16/9', position: 'relative' }}>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4 cursor-pointer hover:bg-white/30 transition-colors">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                  <div className="text-white font-bold text-lg mb-1">ERP Fundamentals — Introduction</div>
                  <div className="text-white/60 text-sm">Module 4 of 6 • 24:30</div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: '30%', backgroundColor: '#3b82f6' }} />
                    </div>
                    <div className="flex justify-between text-white/40 text-xs mt-1">
                      <span>7:21</span><span>24:30</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="card">
                <h2 className="font-bold text-slate-800 text-lg mb-1">{currentModule.title}</h2>
                <div className="text-xs text-slate-400 mb-4">{currentModule.duration_minutes} minutes</div>
                {lang !== 'en' && (
                  <div className="mb-4 p-3 rounded-xl text-sm" style={{ backgroundColor: '#fffbeb', color: '#92400e' }}>
                    🌐 Content translation to {LANGUAGES.find(l => l.code === lang)?.label} is being generated by AI...
                  </div>
                )}
                <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap text-sm">
                  {COURSE.content}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {!markedDone ? (
                  <button onClick={handleMarkComplete} disabled={marking}
                    className="btn btn-green flex-1 btn-lg">
                    {marking ? <><div className="spinner border-white border-t-transparent" /> Marking...</>
                      : <><CheckCircle className="w-5 h-5" /> Mark Complete</>}
                  </button>
                ) : (
                  <div className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl font-bold text-green-700"
                    style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                    <CheckCircle className="w-5 h-5" /> Module Completed ✓
                  </div>
                )}
                <button onClick={() => alert("Downloading module for offline access...")} className="btn btn-outline gap-2">
                  <Download className="w-4 h-4" /> Offline
                </button>
              </div>
            </div>

            {/* Module List */}
            <div>
              <div className="card">
                <h3 className="font-bold text-slate-800 mb-4">Course Modules</h3>
                <div className="space-y-2">
                  {COURSE.modules.map((mod) => (
                    <div
                      key={mod.id}
                      onClick={() => !(!mod.done && !mod.current) && setCurrentModule(mod)}
                      className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all"
                      style={{
                        borderColor: mod.current ? '#1b4f8a' : '#e2e8f0',
                        backgroundColor: mod.current ? '#eff6ff' : mod.done ? '#f0fdf4' : 'white',
                        opacity: (!mod.done && !mod.current && mod.order > 5) ? 0.5 : 1,
                      }}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{
                        backgroundColor: mod.done ? '#15803d' : mod.current ? '#1b4f8a' : '#f1f5f9'
                      }}>
                        {mod.done ? <CheckCircle className="w-4 h-4 text-white" />
                          : mod.current ? <Play className="w-3 h-3 text-white ml-0.5" />
                          : mod.order > 4 ? <Lock className="w-3 h-3 text-slate-400" />
                          : <span className="text-xs font-bold text-slate-500">{mod.order}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-800 truncate">{mod.title}</div>
                        <div className="text-xs text-slate-400">{mod.duration_minutes} min</div>
                      </div>
                      {mod.current && <ChevronRight className="w-3.5 h-3.5" style={{ color: '#1b4f8a' }} />}
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-xl text-sm" style={{ backgroundColor: '#f8fafc' }}>
                  <div className="text-xs text-slate-400 mb-1">Module Progress</div>
                  <div className="text-lg font-bold" style={{ color: '#1b4f8a' }}>4 / 6 Modules</div>
                  <div className="progress-track h-2 mt-2">
                    <div className="progress-bar" style={{ width: `${progress}%`, backgroundColor: '#1b4f8a' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
