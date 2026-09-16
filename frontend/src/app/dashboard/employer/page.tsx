'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context';
import Sidebar from '@/components/Sidebar';
import { Users, Briefcase, Bot, Star, ChevronRight, CheckCircle, AlertTriangle, Search, ExternalLink } from 'lucide-react';

const TOP_CANDIDATES = [
  { name: 'Ravi Kumar', id: 'CC-2026-00127', inst: 'RICM Chennai', match: 91, skills: ['Coop Mgmt', 'Digital Lit', 'Excel'], gap: 'Advanced Accounting', status: 'Applied' },
  { name: 'Preethi Devi', id: 'CC-2026-00128', inst: 'RICM Chennai', match: 84, skills: ['Digital Finance', 'Excel', 'Accounting'], gap: 'ERP Ops', status: 'Shortlisted' },
  { name: 'Arjun Kumar', id: 'CC-2026-00129', inst: 'VAMNICOM', match: 78, skills: ['Coop Mgmt', 'Communication'], gap: 'Digital Finance', status: 'Applied' },
];

function StatCard({ value, label, colorClass, icon: Icon }: {
  value: string | number; label: string; colorClass: string; icon: any;
}) {
  return (
    <div className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-default group`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">{value}</div>
      <div className="text-sm font-semibold text-slate-500">{label}</div>
    </div>
  );
}

export default function EmployerDashboard() {
  const { user, isLoading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.push('/'); return; }
    if (user.role !== 'employer') { router.push(`/dashboard/${user.role}`); return; }
  }, [user, isLoading, router]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">🏢 Employer Dashboard</h1>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mt-1">
              ABC Cooperative Federation <span className="text-slate-300">•</span> Chennai, Tamil Nadu
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-bold shadow-sm flex items-center gap-2">
              <Bot className="w-3.5 h-3.5" /> AI Matching Active
            </div>
          </div>
        </header>

        <main className="p-8 max-w-[1600px] mx-auto space-y-8">
          
          {/* Metrics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard value={12} label="Active Job Postings" colorClass="bg-blue-50 text-blue-600" icon={Briefcase} />
            <StatCard value={148} label="Total Applications" colorClass="bg-emerald-50 text-emerald-600" icon={Users} />
            <StatCard value={34} label="AI Recommended Candidates" colorClass="bg-purple-50 text-purple-600" icon={Bot} />
            <StatCard value={16} label="Candidates Shortlisted" colorClass="bg-orange-50 text-orange-600" icon={Star} />
          </div>

          <div className="grid lg:grid-cols-2 gap-8 pb-10">
            {/* Top AI Candidates */}
            <div className="bg-white border-2 border-purple-100 rounded-3xl p-6 lg:p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-purple-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none"></div>
              
              <div className="relative z-10 flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3 mb-1">
                    <div className="p-2 bg-purple-100 rounded-lg"><Bot className="w-5 h-5 text-purple-700"/></div>
                    Top AI-Matched Candidates
                  </h2>
                  <p className="text-sm font-medium text-slate-500">For: <span className="text-slate-700 font-bold">Cooperative Operations Assistant</span></p>
                </div>
                <div className="px-3 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full border border-purple-200 uppercase tracking-wider">
                  CoopSkill AI
                </div>
              </div>

              <div className="relative z-10 space-y-4">
                {TOP_CANDIDATES.map((c, i) => (
                  <div key={c.id} className={`p-5 rounded-2xl border transition-all ${
                    i === 0 ? 'bg-emerald-50/50 border-emerald-200 shadow-sm' : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-md'
                  }`}>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
                          i === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white'
                        }`}>
                          {c.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{c.name}</div>
                          <div className="text-xs font-medium text-slate-500 mt-0.5">{c.id} • {c.inst}</div>
                        </div>
                      </div>
                      <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        c.match >= 85 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
                        c.match >= 75 ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                        'bg-orange-100 text-orange-700 border-orange-200'
                      }`}>
                        {c.match}% Match
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {c.skills.map(s => (
                        <span key={s} className="px-2 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-500" /> {s}
                        </span>
                      ))}
                      <span className="px-2 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Needs: {c.gap}
                      </span>
                    </div>
                    
                    <div className="flex gap-3">
                      <button onClick={() => alert("Viewing candidate profile...")} className="flex-1 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-center gap-2">
                        View Profile
                      </button>
                      <button onClick={() => alert("Candidate shortlisted!")} className={`flex-1 py-2 text-sm font-bold text-white rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 ${
                        c.status === 'Shortlisted' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-brand-600 hover:bg-brand-700'
                      }`}>
                        <Star className="w-4 h-4" /> {c.status === 'Shortlisted' ? 'Shortlisted' : 'Shortlist'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Jobs & Applications */}
            <div className="space-y-8">
              
              {/* Active Jobs */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-slate-900">Active Job Postings</h2>
                  <button onClick={() => alert("Opening Post Job modal...")} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Post New Job
                  </button>
                </div>
                
                <div className="space-y-3">
                  {[
                    { title: 'Cooperative Operations Assistant', loc: 'Coimbatore', apps: 48, matches: 12, salary: '₹20-28k' },
                    { title: 'Digital Accounts Assistant', loc: 'Madurai', apps: 62, matches: 18, salary: '₹22-30k' },
                    { title: 'Field Coordinator', loc: 'Tamil Nadu', apps: 38, matches: 4, salary: '₹18-25k' },
                  ].map(job => (
                    <div key={job.title} className="p-4 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all group cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-slate-900 group-hover:text-brand-700 transition-colors">{job.title}</div>
                        <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200 uppercase tracking-wider">
                          Active
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-slate-500 mb-3">{job.loc} • {job.salary}/month</div>
                      
                      <div className="flex items-center gap-4 text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-2 py-1 rounded-md"><Users className="w-3.5 h-3.5" /> {job.apps} Apps</span>
                        <span className="flex items-center gap-1.5 text-purple-700 bg-purple-100 px-2 py-1 rounded-md"><Bot className="w-3.5 h-3.5" /> {job.matches} AI Matches</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Applications Table */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-slate-900">Recent Applications</h2>
                  <button onClick={() => alert("Navigating to Applications...")} className="text-sm font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="py-3 px-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Applicant</th>
                        <th className="py-3 px-2 text-xs font-bold text-slate-500 uppercase tracking-wider">AI Match</th>
                        <th className="py-3 px-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { name: 'Ravi Kumar', match: 91, status: 'Under Review' },
                        { name: 'Preethi Devi', match: 84, status: 'Shortlisted' },
                        { name: 'Arjun Kumar', match: 78, status: 'Under Review' },
                        { name: 'Meena Selvam', match: 72, status: 'Rejected' },
                      ].map(a => (
                        <tr key={a.name} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-2 font-bold text-slate-800">{a.name}</td>
                          <td className="py-4 px-2">
                            <span className={`font-extrabold ${a.match >= 80 ? 'text-emerald-600' : 'text-orange-500'}`}>
                              {a.match}%
                            </span>
                          </td>
                          <td className="py-4 px-2">
                            <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
                              a.status === 'Shortlisted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                              a.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' : 
                              'bg-blue-50 text-blue-700 border-blue-200'
                            }`}>
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

        </main>
      </div>
    </div>
  );
}
