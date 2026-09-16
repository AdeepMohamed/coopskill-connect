'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { useApp } from '@/lib/context';
import { getAdminMetrics } from '@/lib/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart, Legend
} from 'recharts';
import { Users, BookOpen, Award, Briefcase, Bot, Building2, TrendingUp, Download, Plus, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

const DEMO_METRICS = {
  total_trainees: 12480,
  active_programmes: 86,
  institutions: 240,
  certificates_issued: 8642,
  employment_connections: 3218,
  monthly_registrations: [
    { month: 'Jan', registrations: 420 }, { month: 'Feb', registrations: 580 },
    { month: 'Mar', registrations: 720 }, { month: 'Apr', registrations: 890 },
    { month: 'May', registrations: 1050 }, { month: 'Jun', registrations: 1240 },
    { month: 'Jul', registrations: 1380 }, { month: 'Aug', registrations: 1520 },
    { month: 'Sep', registrations: 680 },
  ],
  course_completion_by_category: [
    { category: 'Digital', completed: 2840, enrolled: 3200 },
    { category: 'Finance', completed: 1920, enrolled: 2400 },
    { category: 'Management', completed: 2100, enrolled: 2600 },
    { category: 'Agricultural', completed: 980, enrolled: 1300 },
    { category: 'ERP', completed: 760, enrolled: 980 },
  ],
  employment_trend: [
    { month: 'Apr', connections: 180 }, { month: 'May', connections: 240 },
    { month: 'Jun', connections: 310 }, { month: 'Jul', connections: 420 },
    { month: 'Aug', connections: 580 }, { month: 'Sep', connections: 680 },
  ],
  assessment_performance: [
    { label: 'Excellent (>85%)', value: 35, color: '#10b981' }, // emerald-500
    { label: 'Good (60-85%)', value: 42, color: '#3b82f6' }, // blue-500
    { label: 'Needs Improvement (<60%)', value: 23, color: '#f97316' }, // orange-500
  ],
};

function StatCard({ value, label, subLabel, colorClass, icon: Icon }: {
  value: string | number; label: string; subLabel: string; colorClass: string; icon: any;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
        <TrendingUp className="w-5 h-5 text-emerald-500 opacity-60" />
      </div>
      <div className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">{value}</div>
      <div className="text-sm font-semibold text-slate-500">{label}</div>
      <div className="text-xs font-bold text-emerald-600 mt-2">{subLabel}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, isLoading } = useApp();
  const router = useRouter();
  const [metrics, setMetrics] = useState(DEMO_METRICS);
  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.push('/'); return; }
    if (user.role !== 'admin') { router.push(`/dashboard/${user.role}`); return; }
    const fetch = async () => {
      setApiLoading(true);
      try { setMetrics(await getAdminMetrics()); } catch {}
      setApiLoading(false);
    };
    fetch();
  }, [user, isLoading, router]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 items-start md:items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">NCCT Admin Dashboard</h1>
            <div className="text-sm font-medium text-slate-500 mt-1">National Council for Cooperative Training | Ministry of Cooperation</div>
          </div>
          <div className="flex items-center gap-4">
            {apiLoading ? (
               <div className="w-5 h-5 border-2 border-slate-300 border-t-brand-600 rounded-full animate-spin"></div>
            ) : (
              <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Live Data
              </div>
            )}
          </div>
        </header>

        <main className="p-4 md:p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
          
          {/* Stat Cards Row */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard value={metrics.total_trainees.toLocaleString()} label="Total Trainees" subLabel="+12% this month" colorClass="bg-blue-50 text-blue-600" icon={Users} />
            <StatCard value={metrics.active_programmes} label="Active Programmes" subLabel="Across 19 states" colorClass="bg-emerald-50 text-emerald-600" icon={BookOpen} />
            <StatCard value={metrics.institutions} label="Institutions" subLabel="Active on platform" colorClass="bg-purple-50 text-purple-600" icon={Building2} />
            <StatCard value={metrics.certificates_issued.toLocaleString()} label="Certificates Issued" subLabel="+8.4% this month" colorClass="bg-orange-50 text-orange-600" icon={Award} />
            <StatCard value={metrics.employment_connections.toLocaleString()} label="Job Placements" subLabel="Connected via AI" colorClass="bg-brand-50 text-brand-600" icon={Briefcase} />
          </div>

          {/* Charts Row 1 */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Monthly Registrations */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 items-start md:items-center mb-6">
                <h2 className="text-lg font-bold text-slate-900">Monthly Registrations (2026)</h2>
                <button onClick={() => alert("Downloading report...")} className="text-slate-400 hover:text-slate-600"><Download className="w-4 h-4" /></button>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics.monthly_registrations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="registrations" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorReg)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Employment Trend */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 items-start md:items-center mb-6">
                <h2 className="text-lg font-bold text-slate-900">Employment Connections Trend</h2>
                <button onClick={() => alert("Downloading report...")} className="text-slate-400 hover:text-slate-600"><Download className="w-4 h-4" /></button>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics.employment_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="connections" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Course Completion */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm lg:col-span-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 items-start md:items-center mb-6">
                <h2 className="text-lg font-bold text-slate-900">Course Completion by Category</h2>
              </div>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.course_completion_by_category} barGap={4} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                    <Bar dataKey="enrolled" name="Enrolled" fill="#bfdbfe" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="completed" name="Completed" fill="#1e40af" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Assessment Performance Pie */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Assessment Performance</h2>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics.assessment_performance}
                      dataKey="value"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {metrics.assessment_performance.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(val) => `${val}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 mt-4">
                {metrics.assessment_performance.map(e => (
                  <div key={e.label} className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 items-start md:items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: e.color }} />
                      <span className="font-medium text-slate-600">{e.label}</span>
                    </div>
                    <span className="font-bold text-slate-900">{e.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Grid: Table & AI Insights */}
          <div className="grid lg:grid-cols-3 gap-6 pb-10">
            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm lg:col-span-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 items-start md:items-center mb-6">
                <h2 className="text-lg font-bold text-slate-900">Recent Trainee Registrations</h2>
                <button onClick={() => alert("Navigating to all records...")} className="text-sm font-semibold text-brand-600 hover:text-brand-800">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trainee ID</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Institution</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { id: 'CC-2026-00127', name: 'Ravi Kumar', inst: 'RICM Chennai', status: 'In Progress' },
                      { id: 'CC-2026-00128', name: 'Preethi Devi', inst: 'RICM Chennai', status: 'Enrolled' },
                      { id: 'CC-2026-00129', name: 'Arjun Kumar', inst: 'VAMNICOM', status: 'Completed' },
                      { id: 'CC-2026-00130', name: 'Meena Selvam', inst: 'CTH', status: 'In Progress' },
                      { id: 'CC-2026-00131', name: 'Suresh Babu', inst: 'RICM Bhopal', status: 'Enrolled' },
                    ].map(t => (
                      <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4 font-mono text-sm text-slate-500">{t.id}</td>
                        <td className="py-4 px-4 font-bold text-slate-800">{t.name}</td>
                        <td className="py-4 px-4 text-sm text-slate-600">{t.inst}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                            t.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                            t.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
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

            {/* Quick Actions & AI Intelligence */}
            <div className="space-y-6">
              
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Add New Course', icon: Plus, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Register Institution', icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Download Analytics', icon: Download, color: 'text-orange-600', bg: 'bg-orange-50' },
                    { label: 'System Settings', icon: Settings, color: 'text-slate-600', bg: 'bg-slate-100' },
                  ].map(a => (
                    <button key={a.label} className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all group">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.bg}`}>
                        <a.icon className={`w-4 h-4 ${a.color}`} />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-50"></div>
                <div className="relative z-10 flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-200 rounded-lg"><Bot className="w-4 h-4 text-purple-700" /></div>
                  <h3 className="font-bold text-purple-900">AI Skill Intelligence</h3>
                </div>
                <p className="text-sm text-purple-800 font-medium leading-relaxed mb-4 relative z-10">
                  AI analysis: <strong className="text-purple-900">ERP Operations</strong> shows a CRITICAL demand-supply gap. 
                  Recommend launching 3 new ERP batches in Q4 2026.
                </p>
                <button onClick={() => alert("Generating full AI report...")} className="relative z-10 w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl shadow-md transition-colors">
                  View Full Report
                </button>
              </div>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
