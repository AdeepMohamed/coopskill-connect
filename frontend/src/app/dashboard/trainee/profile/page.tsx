'use client';
import Sidebar from '@/components/Sidebar';
import { useApp } from '@/lib/context';
import { Award, User, BookOpen, Briefcase, MapPin, Phone, GraduationCap } from 'lucide-react';

const DEMO_PROFILE = {
  trainee: {
    trainee_id: 'CC-2026-00127', name: 'Ravi Kumar', email: 'ravi.kumar@demo.coopskill',
    phone: '9876543210', institution_name: 'RICM Chennai', education: 'B.Com',
    location: 'Coimbatore, Tamil Nadu', state: 'Tamil Nadu', languages: 'English, Tamil',
    employment_status: 'seeking',
  },
  skills: [
    { name: 'Cooperative Management', category: 'Management', proficiency: 85 },
    { name: 'Digital Literacy', category: 'Digital', proficiency: 90 },
    { name: 'MS Excel', category: 'Digital', proficiency: 78 },
    { name: 'Basic Accounting', category: 'Finance', proficiency: 65 },
    { name: 'Communication Skills', category: 'Soft Skills', proficiency: 72 },
    { name: 'Digital Finance', category: 'Finance', proficiency: 80 },
  ],
  enrollments: [
    { course_title: 'Digital Cooperative Management', progress: 72, status: 'in_progress' },
    { course_title: 'Digital Finance Basics', progress: 100, status: 'completed' },
  ],
  certificates_count: 2,
};

export default function ProfilePage() {
  const { user } = useApp();

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content bg-slate-50">
        <div className="page-header">
          <div>
            <h1 className="font-bold text-slate-800 text-base">👤 My Skill Profile</h1>
            <p className="text-xs text-slate-500">Your complete NCCT trainee profile and skill portfolio</p>
          </div>
          <div className="badge badge-blue">Trainee ID: {DEMO_PROFILE.trainee.trainee_id}</div>
        </div>

        <div className="page-body">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div>
              <div className="card text-center mb-5">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-white"
                  style={{ backgroundColor: '#1b4f8a' }}>
                  {DEMO_PROFILE.trainee.name.charAt(0)}
                </div>
                <h2 className="font-bold text-slate-800 text-lg">{DEMO_PROFILE.trainee.name}</h2>
                <div className="text-sm text-slate-500 mb-2">{DEMO_PROFILE.trainee.trainee_id}</div>
                <div className="badge badge-blue mb-4">{DEMO_PROFILE.trainee.employment_status === 'seeking' ? 'Seeking Employment' : DEMO_PROFILE.trainee.employment_status}</div>

                <div className="text-left space-y-2 text-sm border-t pt-4" style={{ borderColor: '#e2e8f0' }}>
                  {[
                    [<MapPin className="w-3.5 h-3.5" />, DEMO_PROFILE.trainee.location],
                    [<Phone className="w-3.5 h-3.5" />, DEMO_PROFILE.trainee.phone],
                    [<GraduationCap className="w-3.5 h-3.5" />, `${DEMO_PROFILE.trainee.education} | ${DEMO_PROFILE.trainee.institution_name}`],
                    [<span className="text-xs">🌐</span>, DEMO_PROFILE.trainee.languages],
                  ].map(([icon, val], i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-600">
                      <span style={{ color: '#1b4f8a' }}>{icon}</span>
                      <span className="text-xs">{val as string}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { val: DEMO_PROFILE.skills.length, label: 'Skills', color: '#7c3aed' },
                  { val: DEMO_PROFILE.enrollments.length, label: 'Courses', color: '#1b4f8a' },
                  { val: DEMO_PROFILE.certificates_count, label: 'Certs', color: '#ea580c' },
                ].map(s => (
                  <div key={s.label} className="text-center p-3 rounded-xl border" style={{ borderColor: '#e2e8f0' }}>
                    <div className="text-xl font-bold" style={{ color: s.color }}>{s.val}</div>
                    <div className="text-xs text-slate-500">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills + Courses */}
            <div className="lg:col-span-2 space-y-5">
              <div className="card">
                <h2 className="font-bold text-slate-800 mb-4">💪 Skill Portfolio</h2>
                {DEMO_PROFILE.skills.map(skill => {
                  const color = skill.proficiency >= 80 ? '#15803d' : skill.proficiency >= 60 ? '#1b4f8a' : '#ea580c';
                  return (
                    <div key={skill.name} className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <div>
                          <span className="text-sm font-medium text-slate-700">{skill.name}</span>
                          <span className="text-xs text-slate-400 ml-2">{skill.category}</span>
                        </div>
                        <span className="text-sm font-bold" style={{ color }}>{skill.proficiency}%</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-bar" style={{ width: `${skill.proficiency}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  );
                })}
                <div className="mt-4 p-3 rounded-xl text-sm" style={{ backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
                  🤖 AI Suggestion: Enroll in <strong>Advanced Cooperative Accounting</strong> to strengthen your profile for finance roles.
                </div>
              </div>

              <div className="card">
                <h2 className="font-bold text-slate-800 mb-4">📚 Course History</h2>
                {DEMO_PROFILE.enrollments.map(e => (
                  <div key={e.course_title} className="p-4 rounded-xl border mb-3"
                    style={{ borderColor: '#e2e8f0', borderLeft: `3px solid ${e.status === 'completed' ? '#15803d' : '#1b4f8a'}` }}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-slate-800">{e.course_title}</span>
                      <span className={`badge ${e.status === 'completed' ? 'badge-green' : 'badge-blue'}`}>
                        {e.status === 'completed' ? 'Completed ✓' : 'In Progress'}
                      </span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-bar" style={{ width: `${e.progress}%`, backgroundColor: e.status === 'completed' ? '#15803d' : '#1b4f8a' }} />
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{e.progress}% complete</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
