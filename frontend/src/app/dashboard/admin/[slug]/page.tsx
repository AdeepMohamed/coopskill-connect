'use client';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { 
  BarChart3, Users, BookOpen, Award, Search, Filter, Download, 
  ChevronRight, MoreVertical, CheckCircle, TrendingUp
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// --- MOCK DATA ---
const MOCK_TRAINEES = Array.from({ length: 12 }).map((_, i) => ({
  id: `CC-2026-0${100 + i}`,
  name: ['Ravi Kumar', 'Priya Devi', 'Arjun M', 'Meena S', 'Suresh Babu', 'Anjali K', 'Vikram Singh', 'Lakshmi P'][i % 8],
  inst: ['RICM Chennai', 'VAMNICOM', 'ICM Madurai', 'CTH Pune'][i % 4],
  state: ['Tamil Nadu', 'Maharashtra', 'Karnataka', 'Kerala'][i % 4],
  progress: (i * 19) % 60 + 40,
  status: i % 3 === 0 ? 'Completed' : 'In Progress'
}));

const MOCK_COURSES = [
  { title: 'Digital Cooperative Management', code: 'DCM-2026', enrolled: 1240, rating: 4.8, status: 'Active' },
  { title: 'ERP Fundamentals', code: 'ERP-101', enrolled: 890, rating: 4.6, status: 'Active' },
  { title: 'Cooperative Finance & Accounting', code: 'CFA-202', enrolled: 2100, rating: 4.9, status: 'Active' },
  { title: 'Agricultural Supply Chain', code: 'ASC-301', enrolled: 450, rating: 4.5, status: 'Draft' },
  { title: 'Cybersecurity for Coops', code: 'CYB-404', enrolled: 120, rating: 4.7, status: 'Beta' },
  { title: 'Leadership & Governance', code: 'LDR-500', enrolled: 3400, rating: 4.9, status: 'Active' },
];

const ANALYTICS_DATA = [
  { name: 'Week 1', users: 400, certs: 240 },
  { name: 'Week 2', users: 800, certs: 350 },
  { name: 'Week 3', users: 1200, certs: 580 },
  { name: 'Week 4', users: 1800, certs: 890 },
  { name: 'Week 5', users: 2400, certs: 1200 },
];

export default function AdminPlaceholderPage() {
  const pathname = usePathname();
  const slug = pathname.split('/').pop() || '';
  const pageName = slug.replace('-', ' ');

  const renderContent = () => {
    if (slug === 'analytics') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            {['Total Engagement', 'Completion Rate', 'Avg. Assessment Score'].map((kpi, i) => (
              <div key={kpi} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="text-sm font-semibold text-slate-500 mb-2">{kpi}</div>
                <div className="text-3xl font-extrabold text-slate-900">{[24580, '84.2%', '78%'][i]}</div>
                <div className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +{(i * 3 + 5)}% this week
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-6">User Growth & Certification</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ANALYTICS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={0.1} fill="#3b82f6" strokeWidth={3} />
                    <Area type="monotone" dataKey="certs" stroke="#10b981" fillOpacity={0.1} fill="#10b981" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-6">Module Engagement</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ANALYTICS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="users" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (slug === 'courses') {
      return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_COURSES.map((course, i) => (
            <div key={course.code} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${i%2===0 ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full border ${
                  course.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                  course.status === 'Draft' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                  'bg-purple-50 text-purple-700 border-purple-200'
                }`}>
                  {course.status}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{course.title}</h3>
              <div className="text-xs font-mono text-slate-500 mb-4">{course.code}</div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 items-start md:items-center text-sm font-semibold text-slate-600 mb-4">
                <div className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {course.enrolled.toLocaleString()} Enrolled</div>
                <div className="flex items-center gap-1.5 text-orange-500"><Award className="w-4 h-4" /> {course.rating}</div>
              </div>
              
              <button onClick={() => alert(`Opening management console for ${course.title}...`)} className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-xl border border-slate-200 transition-colors">
                Manage Course
              </button>
            </div>
          ))}
        </div>
      );
    }

    // Default Table View (Trainees, Certificates, etc.)
    const handleExport = () => {
      const content = `ID,Name,Location,Status,Metrics\n1,Demo Entry A,Delhi,Completed,95%\n2,Demo Entry B,Tamil Nadu,In Progress,45%\n\n(This is a simulated ${pageName} export for the SIH Prototype)`;
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', `NCCT_${slug}_Export.csv`);
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Delay revocation to ensure the browser has time to start the download
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    };

    return (
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 items-start md:items-center bg-slate-50/50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder={`Search ${pageName}...`} className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white w-64" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => alert(`Opening filters for ${pageName}...`)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">ID</th>
                <th className="p-4">Name / Entity</th>
                <th className="p-4">Location</th>
                <th className="p-4">Progress / Metrics</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_TRAINEES.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 font-mono text-sm text-slate-500">{row.id}</td>
                  <td className="p-4 font-bold text-slate-800">{row.name}</td>
                  <td className="p-4 text-sm text-slate-600">{row.inst}, {row.state}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${row.progress}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-slate-500">{row.progress}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full border ${
                      row.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button onClick={() => alert(`Viewing options for ${row.name}`)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"><MoreVertical className="w-4 h-4" /></button>
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
      <div className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 items-start md:items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight capitalize">{pageName}</h1>
            <div className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
              NCCT Admin Dashboard <ChevronRight className="w-3 h-3" /> <span className="capitalize">{pageName}</span>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-4 md:p-8 max-w-7xl mx-auto space-y-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
