'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { useApp } from '@/lib/context';
import { listJobs, applyForJob, getJobMatch } from '@/lib/api';
import { Briefcase, MapPin, IndianRupee, Bot, CheckCircle, ChevronRight, Filter } from 'lucide-react';

const DEMO_JOBS = [
  {
    id: 1, title: 'Cooperative Operations Assistant', employer_name: 'ABC Cooperative Federation',
    location: 'Coimbatore', state: 'Tamil Nadu', employment_type: 'Full Time',
    salary_min: 20000, salary_max: 28000, education_required: 'Graduate', experience_years: 0,
    required_skills: [{ skill_name: 'Cooperative Management', required_level: 70 }, { skill_name: 'Digital Literacy', required_level: 70 }, { skill_name: 'MS Excel', required_level: 60 }],
    ai_match_score: 91, applications_count: 48,
  },
  {
    id: 2, title: 'Digital Accounts Assistant', employer_name: 'ABC Cooperative Federation',
    location: 'Madurai', state: 'Tamil Nadu', employment_type: 'Full Time',
    salary_min: 22000, salary_max: 30000, education_required: 'B.Com', experience_years: 1,
    required_skills: [{ skill_name: 'Basic Accounting', required_level: 75 }, { skill_name: 'MS Excel', required_level: 70 }, { skill_name: 'Digital Finance', required_level: 65 }],
    ai_match_score: 84, applications_count: 62,
  },
  {
    id: 3, title: 'Field Coordinator', employer_name: 'ABC Cooperative Federation',
    location: 'Tamil Nadu', state: 'Tamil Nadu', employment_type: 'Full Time',
    salary_min: 18000, salary_max: 25000, education_required: 'Graduate', experience_years: 0,
    required_skills: [{ skill_name: 'Communication Skills', required_level: 70 }, { skill_name: 'Cooperative Management', required_level: 65 }],
    ai_match_score: 78, applications_count: 38,
  },
  {
    id: 4, title: 'Credit Officer', employer_name: 'Tamil Nadu State Cooperative Bank',
    location: 'Chennai', state: 'Tamil Nadu', employment_type: 'Full Time',
    salary_min: 28000, salary_max: 38000, education_required: 'B.Com/MBA', experience_years: 2,
    required_skills: [{ skill_name: 'Credit Management', required_level: 75 }, { skill_name: 'Advanced Accounting', required_level: 70 }],
    ai_match_score: 68, applications_count: 24,
  },
  {
    id: 5, title: 'ERP Implementation Analyst', employer_name: 'ABC Cooperative Federation',
    location: 'Chennai', state: 'Tamil Nadu', employment_type: 'Full Time',
    salary_min: 32000, salary_max: 45000, education_required: 'B.Tech/BCA', experience_years: 2,
    required_skills: [{ skill_name: 'ERP Operations', required_level: 80 }, { skill_name: 'Digital Literacy', required_level: 75 }],
    ai_match_score: 60, applications_count: 15,
  },
];

function MatchBadge({ score }: { score: number }) {
  const color = score >= 80 ? '#15803d' : score >= 70 ? '#1b4f8a' : '#ea580c';
  return (
    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-white text-xs font-bold" style={{ backgroundColor: color }}>
      <Bot className="w-3 h-3" />
      {score}% Match
    </div>
  );
}

export default function EmploymentPage() {
  const { user } = useApp();
  const [applied, setApplied] = useState<Set<number>>(new Set());
  const [applying, setApplying] = useState<number | null>(null);
  const [selectedJob, setSelectedJob] = useState<typeof DEMO_JOBS[0] | null>(DEMO_JOBS[0]);
  const [filter, setFilter] = useState('all');

  const handleApply = async (jobId: number, matchScore?: number) => {
    setApplying(jobId);
    try {
      if (user) await applyForJob(user.user_id, jobId, matchScore);
    } catch {}
    setApplied(prev => new Set(prev).add(jobId));
    setApplying(null);
  };

  const jobs = filter === 'high' ? DEMO_JOBS.filter(j => j.ai_match_score >= 80)
    : filter === 'applied' ? DEMO_JOBS.filter(j => applied.has(j.id))
    : DEMO_JOBS;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content bg-slate-50">
        <div className="page-header">
          <div>
            <h1 className="font-bold text-slate-800 text-base">💼 Employment</h1>
            <p className="text-xs text-slate-500">AI-matched job opportunities in the cooperative sector</p>
          </div>
          <div className="badge badge-purple text-xs">
            <Bot className="w-3 h-3 inline mr-1" />
            CoopSkill AI Matching
          </div>
        </div>

        <div className="page-body">
          {/* Filter Bar */}
          <div className="flex items-center gap-3 mb-5">
            <Filter className="w-4 h-4 text-slate-400" />
            {[
              { val: 'all', label: 'All Jobs (10)' },
              { val: 'high', label: '🟢 High Match (≥80%)' },
              { val: 'applied', label: `Applied (${applied.size})` },
            ].map(f => (
              <button key={f.val} onClick={() => setFilter(f.val)}
                className="btn btn-sm" style={{
                  backgroundColor: filter === f.val ? '#1b4f8a' : 'white',
                  color: filter === f.val ? 'white' : '#374151',
                  border: `1px solid ${filter === f.val ? '#1b4f8a' : '#e2e8f0'}`,
                }}>
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Job List */}
            <div className="space-y-3">
              {jobs.map(job => (
                <div key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className="card card-sm cursor-pointer hover:shadow-md transition-all"
                  style={{ borderLeft: `3px solid ${job.ai_match_score >= 80 ? '#15803d' : job.ai_match_score >= 70 ? '#1b4f8a' : '#ea580c'}`, borderColor: selectedJob?.id === job.id ? '#1b4f8a' : '#e2e8f0' }}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{job.title}</div>
                      <div className="text-xs text-slate-500">{job.employer_name}</div>
                    </div>
                    <MatchBadge score={job.ai_match_score} />
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}, {job.state}</span>
                    <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" />{(job.salary_min / 1000).toFixed(0)}k–{(job.salary_max / 1000).toFixed(0)}k/mo</span>
                    <span>{job.employment_type}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {job.required_skills.slice(0, 3).map(s => (
                      <span key={s.skill_name} className="badge badge-blue text-[10px]">{s.skill_name}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Job Detail */}
            {selectedJob && (
              <div className="card animate-slide-up" style={{ position: 'sticky', top: 88, alignSelf: 'start' }}>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h2 className="font-bold text-slate-800">{selectedJob.title}</h2>
                    <div className="text-sm text-slate-500">{selectedJob.employer_name}</div>
                  </div>
                  <MatchBadge score={selectedJob.ai_match_score} />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  {[
                    ['📍 Location', `${selectedJob.location}, ${selectedJob.state}`],
                    ['💰 Salary', `₹${(selectedJob.salary_min / 1000).toFixed(0)}k–${(selectedJob.salary_max / 1000).toFixed(0)}k/month`],
                    ['⏰ Type', selectedJob.employment_type],
                    ['🎓 Education', selectedJob.education_required],
                    ['📈 Experience', `${selectedJob.experience_years} year${selectedJob.experience_years !== 1 ? 's' : ''}`],
                    ['📋 Applications', selectedJob.applications_count.toString()],
                  ].map(([k, v]) => (
                    <div key={k} className="p-2.5 rounded-lg" style={{ backgroundColor: '#f8fafc' }}>
                      <div className="text-xs text-slate-400">{k}</div>
                      <div className="font-semibold text-slate-700 text-xs mt-0.5">{v}</div>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Required Skills</div>
                  <div className="space-y-2">
                    {selectedJob.required_skills.map(s => {
                      const mySkills: Record<string, number> = {
                        'Cooperative Management': 85, 'Digital Literacy': 90, 'MS Excel': 78,
                        'Basic Accounting': 65, 'Communication Skills': 72, 'Digital Finance': 80
                      };
                      const myLevel = mySkills[s.skill_name] || 0;
                      const met = myLevel >= s.required_level;
                      return (
                        <div key={s.skill_name}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-600">{s.skill_name}</span>
                            <span style={{ color: met ? '#15803d' : '#ea580c' }}>
                              {met ? `✓ ${myLevel}%` : `${myLevel}% / ${s.required_level}% required`}
                            </span>
                          </div>
                          <div className="progress-track h-1.5">
                            <div className="progress-bar" style={{ width: `${(myLevel / 100) * 100}%`, backgroundColor: met ? '#15803d' : '#ea580c' }} />
                            <div className="absolute inset-0" style={{ left: `${s.required_level}%`, borderLeft: '2px dashed #94a3b8' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {applied.has(selectedJob.id) ? (
                  <div className="flex items-center justify-center gap-2 p-4 rounded-xl font-bold text-green-700" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                    <CheckCircle className="w-5 h-5" /> Application Submitted ✓
                  </div>
                ) : (
                  <button
                    onClick={() => handleApply(selectedJob.id, selectedJob.ai_match_score)}
                    disabled={applying === selectedJob.id}
                    className="btn btn-primary w-full btn-lg"
                  >
                    {applying === selectedJob.id
                      ? <><div className="spinner border-white border-t-transparent" /> Applying...</>
                      : <><Briefcase className="w-4 h-4" /> Apply Now</>
                    }
                  </button>
                )}
                <div className="text-xs text-center text-slate-400 mt-2">
                  AI Match: {selectedJob.ai_match_score}% based on your skill profile
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
