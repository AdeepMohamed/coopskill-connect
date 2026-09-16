'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { useApp } from '@/lib/context';
import { getAdminMetrics } from '@/lib/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart, Legend
} from 'recharts';
import { Users, BookOpen, Award, Briefcase, Bot, TrendingUp, Building2, Globe } from 'lucide-react';
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
    { label: 'Excellent (>85%)', value: 35, color: '#15803d' },
    { label: 'Good (60-85%)', value: 42, color: '#1b4f8a' },
    { label: 'Needs Improvement (<60%)', value: 23, color: '#ea580c' },
  ],
};

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

  const statCards = [
    { label: 'Total Trainees', val: metrics.total_trainees.toLocaleString(), icon: <Users className="w-5 h-5" />, color: '#1b4f8a', sub: '+12% this month' },
    { label: 'Active Programmes', val: metrics.active_programmes, icon: <BookOpen className="w-5 h-5" />, color: '#15803d', sub: 'Across 19 states' },
    { label: 'Institutions', val: metrics.institutions, icon: <Building2 className="w-5 h-5" />, color: '#7c3aed', sub: 'NCCT network' },
    { label: 'Certificates Issued', val: metrics.certificates_issued.toLocaleString(), icon: <Award className="w-5 h-5" />, color: '#ea580c', sub: '+8.4% this month' },
    { label: 'Employment Connections', val: metrics.employment_connections.toLocaleString(), icon: <Briefcase className="w-5 h-5" />, color: '#15803d', sub: 'Jobs connected' },
  ];

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content bg-slate-50">
        <div className="page-header">
          <div>
            <h1 className="font-bold text-slate-800 text-base">⚙️ NCCT Admin Dashboard</h1>
            <p className="text-xs text-slate-500">National Council for Cooperative Training | Ministry of Cooperation</p>
          </div>
          <div className="flex items-center gap-2">
            {apiLoading && <div className="spinner" />}
            <div className="badge badge-green">Live Data</div>
          </div>
        </div>

        <div className="page-body">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {statCards.map(card => (
              <div key={card.label} className="stat-card hover:shadow-md transition-all" style={{ borderTopColor: card.color }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                  {card.icon}
                </div>
                <div className="text-2xl font-bold text-slate-800">{card.val}</div>
                <div className="text-sm text-slate-600 mt-0.5">{card.label}</div>
                <div className="text-xs text-green-600 mt-1 font-medium">{card.sub}</div>
              </div>
            ))}
          </div>

          {/* Charts Row 1 */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Monthly Registrations */}
            <div className="card">
              <h2 className="font-bold text-slate-800 mb-4">Monthly Registrations (2026)</h2>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={metrics.monthly_registrations}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="registrations" fill="#eff6ff" stroke="#1b4f8a" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Employment Trend */}
            <div className="card">
              <h2 className="font-bold text-slate-800 mb-4">Employment Connections Trend</h2>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={metrics.employment_trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="connections" stroke="#15803d" strokeWidth={2.5} dot={{ fill: '#15803d' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Course Completion */}
            <div className="card lg:col-span-2">
              <h2 className="font-bold text-slate-800 mb-4">Course Completion by Category</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={metrics.course_completion_by_category} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="enrolled" name="Enrolled" fill="#bfdbfe" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" name="Completed" fill="#1b4f8a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Assessment Performance Pie */}
            <div className="card">
              <h2 className="font-bold text-slate-800 mb-4">Assessment Performance</h2>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={metrics.assessment_performance}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={({ value }) => `${value}%`}
                    labelLine={false}
                  >
                    {metrics.assessment_performance.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => `${val}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1 mt-2">
                {metrics.assessment_performance.map(e => (
                  <div key={e.label} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: e.color }} />
                    <span className="text-slate-600">{e.label}</span>
                    <span className="font-bold ml-auto">{e.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions + Recent */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="card lg:col-span-2">
              <h2 className="font-bold text-slate-800 mb-4">Recent Trainee Registrations</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Trainee ID</th><th>Name</th><th>Institution</th><th>State</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'CC-2026-00127', name: 'Ravi Kumar', inst: 'RICM Chennai', state: 'Tamil Nadu', status: 'In Progress' },
                    { id: 'CC-2026-00128', name: 'Preethi Devi', inst: 'RICM Chennai', state: 'Tamil Nadu', status: 'Enrolled' },
                    { id: 'CC-2026-00129', name: 'Arjun Kumar', inst: 'VAMNICOM', state: 'Maharashtra', status: 'Completed' },
                    { id: 'CC-2026-00130', name: 'Meena Selvam', inst: 'CTH', state: 'Telangana', status: 'In Progress' },
                    { id: 'CC-2026-00131', name: 'Suresh Babu', inst: 'RICM Bhopal', state: 'MP', status: 'Enrolled' },
                  ].map(t => (
                    <tr key={t.id}>
                      <td className="font-mono text-xs">{t.id}</td>
                      <td className="font-medium">{t.name}</td>
                      <td>{t.inst}</td>
                      <td>{t.state}</td>
                      <td>
                        <span className={`badge text-[10px] ${t.status === 'Completed' ? 'badge-green' : t.status === 'In Progress' ? 'badge-blue' : 'badge-amber'}`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-4">
              <div className="card card-sm">
                <h3 className="font-bold text-slate-700 text-sm mb-3">Quick Actions</h3>
                {[
                  { label: 'Add New Course', icon: '📚', color: '#1b4f8a' },
                  { label: 'Register Institution', icon: '🏛️', color: '#15803d' },
                  { label: 'AI Skill Demand Report', icon: '🤖', color: '#7c3aed' },
                  { label: 'Download Analytics', icon: '📊', color: '#ea580c' },
                  { label: 'Manage Employers', icon: '🏢', color: '#1b4f8a' },
                ].map(a => (
                  <button key={a.label} className="w-full flex items-center gap-2 p-2.5 rounded-lg text-left hover:bg-slate-50 border border-slate-100 mb-1.5 text-sm font-medium text-slate-700 transition-colors">
                    <span>{a.icon}</span> {a.label}
                  </button>
                ))}
              </div>
              <div className="card card-sm" style={{ backgroundColor: '#f5f3ff', borderColor: '#ede9fe' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4" style={{ color: '#7c3aed' }} />
                  <span className="text-sm font-bold text-purple-800">AI Skill Intelligence</span>
                </div>
                <p className="text-xs text-purple-700">
                  Gemini AI analysis: <strong>ERP Operations</strong> shows CRITICAL demand-supply gap. 
                  Recommend launching 3 new ERP batches in Q4 2026.
                </p>
                <button className="btn btn-sm mt-2 w-full" style={{ backgroundColor: '#7c3aed', color: 'white' }}>
                  View Full Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
