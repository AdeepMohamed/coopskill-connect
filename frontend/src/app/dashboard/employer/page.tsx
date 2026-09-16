'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context';
import Sidebar from '@/components/Sidebar';
import { Users, Briefcase, Bot, Star, ChevronRight } from 'lucide-react';

const TOP_CANDIDATES = [
  { name: 'Ravi Kumar', id: 'CC-2026-00127', inst: 'RICM Chennai', match: 91, skills: ['Coop Mgmt', 'Digital Lit', 'Excel'], gap: 'Advanced Accounting', status: 'Applied' },
  { name: 'Preethi Devi', id: 'CC-2026-00128', inst: 'RICM Chennai', match: 84, skills: ['Digital Finance', 'Excel', 'Accounting'], gap: 'ERP Ops', status: 'Shortlisted' },
  { name: 'Arjun Kumar', id: 'CC-2026-00129', inst: 'VAMNICOM', match: 78, skills: ['Coop Mgmt', 'Communication'], gap: 'Digital Finance', status: 'Applied' },
];

export default function EmployerDashboard() {
  const { user, isLoading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.push('/'); return; }
    if (user.role !== 'employer') { router.push(`/dashboard/${user.role}`); return; }
  }, [user, isLoading, router]);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content bg-slate-50">
        <div className="page-header">
          <div>
            <h1 className="font-bold text-slate-800 text-base">🏢 Employer Dashboard</h1>
            <p className="text-xs text-slate-500">ABC Cooperative Federation | Chennai, Tamil Nadu</p>
          </div>
          <div className="badge badge-purple">
            <Bot className="w-3 h-3 inline mr-1" />
            AI Matching Active
          </div>
        </div>

        <div className="page-body">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { val: 12, label: 'Active Jobs', icon: <Briefcase className="w-5 h-5" />, color: '#1b4f8a' },
              { val: 148, label: 'Applications', icon: <Users className="w-5 h-5" />, color: '#15803d' },
              { val: 34, label: 'AI Matched', icon: <Bot className="w-5 h-5" />, color: '#7c3aed' },
              { val: 16, label: 'Shortlisted', icon: <Star className="w-5 h-5" />, color: '#ea580c' },
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
            {/* AI Matched Candidates */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="w-5 h-5" style={{ color: '#7c3aed' }} />
                <h2 className="font-bold text-slate-800">Top AI-Matched Candidates</h2>
                <div className="badge badge-purple text-[10px]">Gemini AI</div>
              </div>
              <p className="text-xs text-slate-500 mb-4">For: Cooperative Operations Assistant</p>
              <div className="space-y-4">
                {TOP_CANDIDATES.map((c, i) => (
                  <div key={c.id} className="p-4 rounded-xl border" style={{ borderColor: i === 0 ? '#15803d40' : '#e2e8f0', backgroundColor: i === 0 ? '#f0fdf4' : 'white' }}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full text-white text-sm font-bold flex items-center justify-center"
                          style={{ backgroundColor: '#1b4f8a' }}>
                          {c.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{c.name}</div>
                          <div className="text-xs text-slate-400">{c.id} • {c.inst}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs font-bold"
                        style={{ backgroundColor: c.match >= 85 ? '#15803d' : c.match >= 75 ? '#1b4f8a' : '#ea580c' }}>
                        {c.match}% Match
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {c.skills.map(s => <span key={s} className="badge badge-green text-[10px]">✓ {s}</span>)}
                      <span className="badge badge-amber text-[10px]">⚠ {c.gap}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button className="btn btn-outline btn-sm flex-1">View Profile</button>
                      <button className="btn btn-green btn-sm flex-1">Shortlist ★</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Listings */}
            <div className="space-y-5">
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-slate-800">Active Job Postings</h2>
                  <button className="btn btn-primary btn-sm"><Briefcase className="w-3 h-3" /> Post Job</button>
                </div>
                <div className="space-y-3">
                  {[
                    { title: 'Cooperative Operations Assistant', loc: 'Coimbatore', apps: 48, matches: 12, salary: '₹20-28k' },
                    { title: 'Digital Accounts Assistant', loc: 'Madurai', apps: 62, matches: 18, salary: '₹22-30k' },
                    { title: 'Field Coordinator', loc: 'Tamil Nadu', apps: 38, matches: 4, salary: '₹18-25k' },
                  ].map(job => (
                    <div key={job.title} className="p-3 rounded-xl border" style={{ borderColor: '#e2e8f0' }}>
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-bold text-slate-800 text-sm">{job.title}</div>
                        <div className="badge badge-green text-[10px]">ACTIVE</div>
                      </div>
                      <div className="text-xs text-slate-500 mb-2">{job.loc} • {job.salary}/month</div>
                      <div className="flex gap-3 text-xs">
                        <span className="text-slate-500">{job.apps} applications</span>
                        <span style={{ color: '#7c3aed' }}>🤖 {job.matches} AI matches</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Applications Table */}
              <div className="card">
                <h2 className="font-bold text-slate-800 mb-4">Recent Applications</h2>
                <table className="data-table">
                  <thead>
                    <tr><th>Applicant</th><th>AI Match</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Ravi Kumar', match: 91, status: 'Under Review' },
                      { name: 'Preethi Devi', match: 84, status: 'Shortlisted' },
                      { name: 'Arjun Kumar', match: 78, status: 'Under Review' },
                      { name: 'Meena Selvam', match: 72, status: 'Rejected' },
                    ].map(a => (
                      <tr key={a.name}>
                        <td className="font-medium">{a.name}</td>
                        <td>
                          <span className="font-bold text-sm" style={{ color: a.match >= 80 ? '#15803d' : '#ea580c' }}>
                            {a.match}%
                          </span>
                        </td>
                        <td>
                          <span className={`badge text-[10px] ${a.status === 'Shortlisted' ? 'badge-green' : a.status === 'Rejected' ? 'badge-red' : 'badge-blue'}`}>
                            {a.status}
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
    </div>
  );
}
