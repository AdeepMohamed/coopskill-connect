'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useApp } from '@/lib/context';
import { Users, QrCode, ClipboardList, BookOpen, Clock, Calendar, CheckCircle, ChevronRight, Play } from 'lucide-react';
import Link from 'next/link';

const BATCH = {
  name: 'Digital Cooperative Management',
  code: 'DCM-2026-041',
  trainees: 28,
  start: '6 Sep 2026',
  end: '15 Sep 2026',
  attendance_today: 26,
};

function StatCard({ value, label, colorClass, icon: Icon, href }: {
  value: string | number; label: string; colorClass: string; icon: any; href?: string;
}) {
  const content = (
    <div className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
        {href && <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />}
      </div>
      <div className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">{value}</div>
      <div className="text-sm font-semibold text-slate-500">{label}</div>
    </div>
  );
  return href ? <Link href={href} className="block">{content}</Link> : content;
}

export default function TrainerDashboard() {
  const { user, isLoading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.push('/'); return; }
    if (user.role !== 'trainer') { router.push(`/dashboard/${user.role}`); return; }
  }, [user, isLoading, router]);

  const greeting = "Welcome back";

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 items-start md:items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">👨‍🏫 Trainer Dashboard</h1>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2 md:mt-1 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-1.5 text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md"><BookOpen className="w-3.5 h-3.5"/> Dr. Arun Sharma</span>
              <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5"/> Senior Faculty</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5"/> RICM Chennai</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Active Session
            </div>
          </div>
        </header>

        <main className="p-4 md:p-4 md:p-8 max-w-7xl mx-auto">
          {/* Metrics Row */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard value={BATCH.trainees} label="Enrolled Trainees" colorClass="bg-blue-50 text-blue-600" icon={Users} href="/dashboard/trainer/batches" />
            <StatCard value={BATCH.attendance_today} label="Today's Attendance" colorClass="bg-emerald-50 text-emerald-600" icon={QrCode} href="/dashboard/trainer/attendance" />
            <StatCard value="86%" label="Avg Assessment Score" colorClass="bg-orange-50 text-orange-600" icon={ClipboardList} href="/dashboard/trainer/assessments" />
            <StatCard value={2} label="Pending Assessments" colorClass="bg-purple-50 text-purple-600" icon={BookOpen} href="/dashboard/trainer/assessments" />
          </div>

          <div className="grid lg:grid-cols-3 gap-4 md:p-8">
            {/* Left Column (Current Batch Focus) */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-4 md:p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-brand-100 rounded-lg"><Users className="w-5 h-5 text-brand-700"/></div>
                  Current Batch
                </h2>
                
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight">{BATCH.name}</h3>
                      <p className="text-sm font-semibold text-slate-500 mt-1 font-mono">{BATCH.code}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-brand-600" />
                      <span className="font-medium">{BATCH.start} – {BATCH.end}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">{BATCH.trainees} Trainees enrolled</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-emerald-600">{BATCH.attendance_today} present today</span>
                    </div>
                  </div>
                </div>

                <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-md transition-all group">
                  <QrCode className="w-5 h-5 group-hover:scale-110 transition-transform" /> Generate QR for Session
                </button>
              </div>
            </div>

            {/* Right Column (Trainee Progress Table) */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-4 md:p-8 shadow-sm h-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 items-start md:items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Trainee Progress Overview</h2>
                  <Link href="/dashboard/trainer/batches" className="text-sm font-semibold text-brand-600 hover:text-brand-800">View All →</Link>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                        <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Progress</th>
                        <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Assessment</th>
                        <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { name: 'Ravi Kumar', progress: 72, score: 86, status: 'On Track' },
                        { name: 'Preethi Devi', progress: 85, score: 78, status: 'On Track' },
                        { name: 'Arjun Kumar', progress: 45, score: 62, status: 'Needs Help' },
                        { name: 'Meena Selvam', progress: 92, score: 91, status: 'Excellent' },
                        { name: 'Suresh Babu', progress: 60, score: 70, status: 'On Track' },
                      ].map(t => (
                        <tr key={t.name} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-4 font-bold text-slate-800">{t.name}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 max-w-[120px] h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-brand-600 rounded-full" style={{ width: `${t.progress}%` }}></div>
                              </div>
                              <span className="text-xs font-bold text-slate-600">{t.progress}%</span>
                            </div>
                          </td>
                          <td className={`py-4 px-4 font-extrabold ${t.score >= 80 ? 'text-emerald-600' : 'text-orange-500'}`}>
                            {t.score}%
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                              t.status === 'Excellent' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                              t.status === 'On Track' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                              'bg-orange-50 text-orange-700 border-orange-200'
                            }`}>
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
        </main>
      </div>
    </div>
  );
}
