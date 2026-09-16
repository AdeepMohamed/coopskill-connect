'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useApp } from '@/lib/context';
import { Users, QrCode, ClipboardList, BookOpen, CheckCircle } from 'lucide-react';

const BATCH = {
  name: 'Digital Cooperative Management',
  code: 'DCM-2026-041',
  trainees: 28,
  start: '6 Sep 2026',
  end: '15 Sep 2026',
  attendance_today: 26,
};

export default function TrainerDashboard() {
  const { user, isLoading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.push('/'); return; }
    if (user.role !== 'trainer') { router.push(`/dashboard/${user.role}`); return; }
  }, [user, isLoading, router]);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content bg-slate-50">
        <div className="page-header">
          <div>
            <h1 className="font-bold text-slate-800 text-base">👨‍🏫 Trainer Dashboard</h1>
            <p className="text-xs text-slate-500">Dr. Arun Sharma | RICM Chennai | Senior Faculty</p>
          </div>
          <div className="badge badge-blue">Active Session</div>
        </div>

        <div className="page-body">
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { val: BATCH.trainees, label: 'Trainees', icon: <Users className="w-5 h-5" />, color: '#1b4f8a' },
              { val: BATCH.attendance_today, label: "Today's Attendance", icon: <QrCode className="w-5 h-5" />, color: '#15803d' },
              { val: '86%', label: 'Avg Assessment', icon: <ClipboardList className="w-5 h-5" />, color: '#ea580c' },
              { val: 2, label: 'Assessments', icon: <BookOpen className="w-5 h-5" />, color: '#7c3aed' },
            ].map(s => (
              <div key={s.label} className="stat-card" style={{ borderTopColor: s.color }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                  style={{ backgroundColor: `${s.color}15`, color: s.color }}>
                  {s.icon}
                </div>
                <div className="text-2xl font-bold text-slate-800">{s.val}</div>
                <div className="text-sm text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Current Batch */}
            <div className="card">
              <h2 className="font-bold text-slate-800 mb-4">Current Batch</h2>
              <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: '#f8faff', border: '1px solid #1b4f8a20' }}>
                <div className="font-bold text-slate-800 mb-2">{BATCH.name}</div>
                <div className="text-xs text-slate-500 mb-3">{BATCH.code} • {BATCH.start} – {BATCH.end}</div>
                <div className="flex justify-between text-sm">
                  <span>{BATCH.trainees} Trainees enrolled</span>
                  <span className="font-bold" style={{ color: '#15803d' }}>{BATCH.attendance_today} present today</span>
                </div>
              </div>
              <button className="btn btn-primary w-full">
                <QrCode className="w-4 h-4" /> Generate QR for Today's Session
              </button>
            </div>

            {/* Trainee Progress */}
            <div className="card">
              <h2 className="font-bold text-slate-800 mb-4">Trainee Progress Overview</h2>
              <table className="data-table">
                <thead>
                  <tr><th>Name</th><th>Progress</th><th>Assessment</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Ravi Kumar', progress: 72, score: 86, status: 'On Track' },
                    { name: 'Preethi Devi', progress: 85, score: 78, status: 'On Track' },
                    { name: 'Arjun Kumar', progress: 45, score: 62, status: 'Needs Help' },
                    { name: 'Meena Selvam', progress: 92, score: 91, status: 'Excellent' },
                    { name: 'Suresh Babu', progress: 60, score: 70, status: 'On Track' },
                  ].map(t => (
                    <tr key={t.name}>
                      <td className="font-medium text-sm">{t.name}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-16 progress-track h-1.5">
                            <div className="progress-bar" style={{ width: `${t.progress}%`, backgroundColor: '#1b4f8a' }} />
                          </div>
                          <span className="text-xs text-slate-500">{t.progress}%</span>
                        </div>
                      </td>
                      <td className="text-sm font-bold" style={{ color: t.score >= 80 ? '#15803d' : '#ea580c' }}>{t.score}%</td>
                      <td>
                        <span className={`badge text-[10px] ${t.status === 'Excellent' ? 'badge-green' : t.status === 'On Track' ? 'badge-blue' : 'badge-red'}`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
