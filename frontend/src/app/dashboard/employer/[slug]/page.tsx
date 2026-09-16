'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { 
  Users, Briefcase, Bot, Search, Filter, Download, 
  ChevronRight, MoreVertical, Star, Plus, CheckCircle
} from 'lucide-react';

const MOCK_APPLICATIONS = Array.from({ length: 8 }).map((_, i) => ({
  id: `APP-2026-${100 + i}`,
  name: ['Ravi Kumar', 'Priya Devi', 'Arjun M', 'Meena S', 'Suresh Babu', 'Anjali K', 'Vikram Singh', 'Lakshmi P'][i],
  job: ['Cooperative Ops Assistant', 'Digital Accounts Assistant', 'Field Coordinator'][i % 3],
  match: (i * 17) % 40 + 55,
  status: i % 4 === 0 ? 'Shortlisted' : i % 5 === 0 ? 'Rejected' : 'Under Review'
}));

const MOCK_JOBS = [
  { title: 'Cooperative Operations Assistant', type: 'Full-time', loc: 'Coimbatore', apps: 48, status: 'Active' },
  { title: 'Digital Accounts Assistant', type: 'Contract', loc: 'Madurai', apps: 62, status: 'Active' },
  { title: 'Field Coordinator', type: 'Full-time', loc: 'Tamil Nadu', apps: 38, status: 'Active' },
  { title: 'ERP Implementation Specialist', type: 'Full-time', loc: 'Chennai', apps: 0, status: 'Draft' },
];

export default function EmployerPlaceholderPage() {
  const pathname = usePathname();
  const slug = pathname.split('/').pop() || '';
  const pageName = slug.replace('-', ' ');

  const renderContent = () => {
    if (slug === 'post-job') {
      return (
        <div className="bg-white border border-slate-200 rounded-3xl p-4 md:p-8 shadow-sm max-w-3xl">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Create New Job Posting</h2>
              <p className="text-sm text-slate-500">Reach certified cooperative professionals across India.</p>
            </div>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Job Title</label>
              <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="e.g. Digital Accounts Assistant" />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                <input type="text" className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="e.g. Chennai, Tamil Nadu" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Employment Type</label>
                <select className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Required NCCT Skills / Certificates</label>
              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex gap-2">
                <span className="px-3 py-1.5 bg-brand-100 text-brand-700 text-xs font-bold rounded-lg flex items-center gap-2">Digital Cooperative Management <button>×</button></span>
                <span className="px-3 py-1.5 bg-brand-100 text-brand-700 text-xs font-bold rounded-lg flex items-center gap-2">ERP Fundamentals <button>×</button></span>
                <button className="px-3 py-1.5 border border-dashed border-slate-300 text-slate-500 hover:text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1"><Plus className="w-3 h-3" /> Add Skill</button>
              </div>
            </div>
            <div className="pt-4 flex gap-3">
              <button className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">Publish Job</button>
              <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">Save as Draft</button>
            </div>
          </div>
        </div>
      );
    }

    if (slug === 'ai-match') {
      // In a real app, state would be managed at the list level
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [shortlisted, setShortlisted] = React.useState<Record<string, boolean>>({});
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [loadingProfile, setLoadingProfile] = React.useState<string | null>(null);

      const handleShortlist = (id: string) => {
        setShortlisted(prev => ({ ...prev, [id]: !prev[id] }));
      };

      const handleViewProfile = (id: string) => {
        setLoadingProfile(id);
        setTimeout(() => setLoadingProfile(null), 1000);
      };

      return (
        <div className="grid md:grid-cols-2 gap-6">
          {MOCK_APPLICATIONS.slice(0,4).map((app, i) => (
            <div key={app.id} className="bg-white border-2 border-purple-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
                    {app.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{app.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">Matched for: {app.job}</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full border border-purple-200 flex items-center gap-1">
                  <Bot className="w-3 h-3" /> {app.match + 20}% Match
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">CoopSkill AI Analysis</div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Candidate possesses strong foundation in Cooperative Operations. Directly holds NCCT certification matching 3 out of 4 required skills. Highly recommended for interview.
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleShortlist(app.id)} className={`flex-1 py-2 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 ${shortlisted[app.id] ? 'bg-slate-800 hover:bg-slate-900' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                  {shortlisted[app.id] ? <CheckCircle className="w-4 h-4" /> : <Star className="w-4 h-4" />} 
                  {shortlisted[app.id] ? 'Shortlisted' : 'Shortlist'}
                </button>
                <button onClick={() => handleViewProfile(app.id)} disabled={loadingProfile === app.id} className="flex-1 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition-colors flex items-center justify-center">
                  {loadingProfile === app.id ? <div className="w-4 h-4 rounded-full border-2 border-slate-300 border-t-slate-700 animate-spin" /> : 'View Profile'}
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Default Table View (Applications, Jobs)
    const handleExport = () => {
      const content = `ID,Candidate Name,Applied Job,Status,Match\n1,Demo Candidate,Operations Manager,Under Review,91%\n\n(This is a simulated ${pageName} export for the SIH Prototype)`;
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', `NCCT_Employer_${slug}_Export.csv`);
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
                <th className="p-4">Candidate Name</th>
                <th className="p-4">Applied Job</th>
                <th className="p-4">AI Match</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_APPLICATIONS.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 font-mono text-sm text-slate-500">{row.id}</td>
                  <td className="p-4 font-bold text-slate-800">{row.name}</td>
                  <td className="p-4 text-sm text-slate-600">{row.job}</td>
                  <td className="p-4">
                    <span className={`font-extrabold ${row.match >= 80 ? 'text-emerald-600' : 'text-brand-600'}`}>{row.match}%</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full border ${
                      row.status === 'Shortlisted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                      row.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' : 
                      'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {row.status}
                    </span>
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
      <div className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 items-start md:items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight capitalize">{pageName}</h1>
            <div className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
              Employer Dashboard <ChevronRight className="w-3 h-3" /> <span className="capitalize">{pageName}</span>
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
