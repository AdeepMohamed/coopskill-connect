'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen, QrCode, Award, Bot, Briefcase, Bell, TrendingUp,
  ChevronRight, Play, Star, CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { useApp } from '@/lib/context';
import { getTraineeDashboard } from '@/lib/api';
import { t } from '@/lib/i18n';

interface DashboardData {
  trainee: {
    trainee_id: string;
    name: string;
    institution_name?: string;
    education?: string;
    location?: string;
    state?: string;
  };
  learning_progress: number;
  attendance_rate: number;
  skills_count: number;
  certificates_count: number;
  job_matches_count: number;
  current_course?: {
    id: number;
    title: string;
    code: string;
    progress: number;
    current_module: number;
    modules_count: number;
    status: string;
  };
  latest_ai_recommendation?: {
    response: {
      recommendation: string;
      career_paths: Array<{ title: string; match_percentage: number; why: string }>;
      recommended_courses: string[];
    };
    created_at: string;
  };
  recent_certificates: Array<{ certificate_id: string; course_title: string; issue_date: string }>;
  skills: Array<{ name: string; proficiency: number; category: string }>;
  notifications: Array<{ id: number; title: string; message: string; type: string; is_read: boolean }>;
}

// Fallback demo data when backend is not connected
const DEMO_DATA: DashboardData = {
  trainee: {
    trainee_id: 'CC-2026-00127',
    name: 'Ravi Kumar',
    institution_name: 'RICM Chennai',
    education: 'B.Com',
    location: 'Coimbatore, Tamil Nadu',
    state: 'Tamil Nadu',
  },
  learning_progress: 72,
  attendance_rate: 90.9,
  skills_count: 6,
  certificates_count: 2,
  job_matches_count: 8,
  current_course: {
    id: 1,
    title: 'Digital Cooperative Management',
    code: 'DCM-2026',
    progress: 72,
    current_module: 4,
    modules_count: 6,
    status: 'in_progress',
  },
  latest_ai_recommendation: {
    response: {
      recommendation: 'Based on your cooperative management and digital skills with 84% average assessment score, you are well-positioned for cooperative operations roles in Tamil Nadu.',
      career_paths: [
        { title: 'Cooperative Operations Assistant', match_percentage: 91, why: 'Strong cooperative management skills align perfectly.' },
        { title: 'Digital Accounts Assistant', match_percentage: 84, why: 'Digital finance skills directly applicable.' },
        { title: 'Field Coordinator', match_percentage: 78, why: 'Communication and management skills match well.' },
      ],
      recommended_courses: ['Advanced Cooperative Accounting', 'ERP for Cooperatives'],
    },
    created_at: new Date().toISOString(),
  },
  recent_certificates: [
    { certificate_id: 'NCCT-CC-2026-00127-001', course_title: 'Digital Cooperative Management', issue_date: new Date().toISOString() },
    { certificate_id: 'NCCT-CC-2026-00127-002', course_title: 'Digital Finance Basics', issue_date: new Date(Date.now() - 864000000 * 15).toISOString() },
  ],
  skills: [
    { name: 'Cooperative Management', proficiency: 85, category: 'Management' },
    { name: 'Digital Literacy', proficiency: 90, category: 'Digital' },
    { name: 'MS Excel', proficiency: 78, category: 'Digital' },
    { name: 'Basic Accounting', proficiency: 65, category: 'Finance' },
    { name: 'Communication Skills', proficiency: 72, category: 'Soft Skills' },
    { name: 'Digital Finance', proficiency: 80, category: 'Finance' },
  ],
  notifications: [
    { id: 1, title: 'Assessment Passed ✓', message: 'You scored 86% on DCM Final Assessment.', type: 'success', is_read: true },
    { id: 2, title: 'New Job Match 🎯', message: '8 new job opportunities match your skill profile.', type: 'info', is_read: false },
    { id: 3, title: 'AI Recommendation Ready 🤖', message: 'Your Gemini AI career recommendation is ready.', type: 'info', is_read: false },
  ],
};

function StatCard({ value, label, subLabel, color, icon, href }: {
  value: string | number; label: string; subLabel?: string;
  color: string; icon: React.ReactNode; href?: string;
}) {
  const content = (
    <div className="stat-card hover:shadow-md transition-all cursor-pointer group" style={{ borderTopColor: color }}>
      <div className="flex items-start justify-between mb-2">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15`, color }}>
          {icon}
        </div>
        {href && <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />}
      </div>
      <div className="text-2xl font-bold text-slate-800 mb-0.5">{value}</div>
      <div className="text-sm font-medium text-slate-600">{label}</div>
      {subLabel && <div className="text-xs text-slate-400 mt-0.5">{subLabel}</div>}
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

function SkillBar({ name, proficiency, category }: { name: string; proficiency: number; category: string }) {
  const color = proficiency >= 80 ? '#15803d' : proficiency >= 60 ? '#1b4f8a' : '#ea580c';
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-slate-700 font-medium">{name}</span>
        <span className="text-xs font-bold" style={{ color }}>{proficiency}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-bar" style={{ width: `${proficiency}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function TraineeDashboard() {
  const router = useRouter();
  const { user, lang, isLoading } = useApp();
  const [data, setData] = useState<DashboardData>(DEMO_DATA);
  const [apiLoading, setApiLoading] = useState(false);
  const [usingDemo, setUsingDemo] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.push('/'); return; }
    if (user.role !== 'trainee') { router.push(`/dashboard/${user.role}`); return; }

    const fetchData = async () => {
      setApiLoading(true);
      try {
        const d = await getTraineeDashboard(user.user_id);
        setData(d);
        setUsingDemo(false);
      } catch {
        // Use demo data silently
      } finally {
        setApiLoading(false);
      }
    };
    fetchData();
  }, [user, isLoading, router]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? t(lang, 'goodMorning') : hour < 17 ? t(lang, 'goodAfternoon') : t(lang, 'goodEvening');

  const unread = data.notifications.filter(n => !n.is_read).length;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content bg-slate-50">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="font-bold text-slate-800 text-base">{greeting}, {data.trainee.name}!</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {data.trainee.trainee_id} • {data.trainee.institution_name || 'NCCT'} • {data.trainee.location}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {usingDemo && (
              <div className="badge badge-amber text-xs">Demo Mode</div>
            )}
            {apiLoading && <div className="spinner" />}
            <Link href="/dashboard/trainee/profile" className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5 text-slate-600" />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                  style={{ backgroundColor: '#ea580c' }}>
                  {unread}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Body */}
        <div className="page-body">
          {/* Demo mode notice */}
          {usingDemo && (
            <div className="mb-6 p-3 rounded-xl border text-sm flex items-center gap-2"
              style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a', color: '#92400e' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              Demo mode — showing pre-seeded data. Start the FastAPI backend and run <code className="font-mono mx-1 bg-amber-100 px-1 rounded">python seed.py</code> for live data.
            </div>
          )}

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <StatCard
              value={`${data.learning_progress}%`}
              label={t(lang, 'learningProgress')}
              subLabel={data.current_course?.title}
              color="#1b4f8a"
              icon={<BookOpen className="w-5 h-5" />}
              href="/dashboard/trainee/learning"
            />
            <StatCard
              value={`${data.attendance_rate}%`}
              label={t(lang, 'attendanceRate')}
              color="#15803d"
              icon={<QrCode className="w-5 h-5" />}
              href="/dashboard/trainee/attendance"
            />
            <StatCard
              value={data.skills_count}
              label={t(lang, 'skillsAcquired')}
              color="#7c3aed"
              icon={<Star className="w-5 h-5" />}
              href="/dashboard/trainee/profile"
            />
            <StatCard
              value={data.certificates_count}
              label={t(lang, 'certificatesIssued')}
              color="#ea580c"
              icon={<Award className="w-5 h-5" />}
              href="/dashboard/trainee/certificates"
            />
            <StatCard
              value={data.job_matches_count}
              label={t(lang, 'jobMatches')}
              color="#15803d"
              icon={<Briefcase className="w-5 h-5" />}
              href="/dashboard/trainee/employment"
            />
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Course */}
              {data.current_course && (
                <div className="card animate-slide-up">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-slate-800 text-base">📚 Current Course</h2>
                    <Link href="/dashboard/trainee/learning" className="text-xs font-semibold hover:underline" style={{ color: '#1b4f8a' }}>
                      View All →
                    </Link>
                  </div>
                  <div className="p-4 rounded-xl border mb-4" style={{ borderColor: '#1b4f8a20', backgroundColor: '#f8faff' }}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="font-bold text-slate-800">{data.current_course.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {data.current_course.code} • Module {data.current_course.current_module} of {data.current_course.modules_count}
                        </div>
                      </div>
                      <div className="badge badge-blue">{data.current_course.status.replace('_', ' ')}</div>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Progress</span>
                        <span className="font-bold" style={{ color: '#1b4f8a' }}>{data.current_course.progress}%</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-bar" style={{ width: `${data.current_course.progress}%`, backgroundColor: '#1b4f8a' }} />
                      </div>
                    </div>
                    <Link href="/dashboard/trainee/learning" className="btn btn-primary btn-sm mt-3 w-full justify-center" style={{ display: 'flex' }}>
                      <Play className="w-3 h-3" />
                      {t(lang, 'continueLearning')}
                    </Link>
                  </div>
                </div>
              )}

              {/* AI Recommendation Preview */}
              {data.latest_ai_recommendation && (
                <div className="card animate-slide-up" style={{ borderLeft: '3px solid #7c3aed' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Bot className="w-5 h-5" style={{ color: '#7c3aed' }} />
                      <h2 className="font-bold text-slate-800 text-base">AI Career Advisor</h2>
                      <div className="badge badge-purple text-[10px]">Gemini AI</div>
                    </div>
                    <Link href="/dashboard/trainee/ai-advisor" className="text-xs font-semibold hover:underline" style={{ color: '#7c3aed' }}>
                      Full Analysis →
                    </Link>
                  </div>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    {data.latest_ai_recommendation.response.recommendation}
                  </p>
                  <div className="space-y-2 mb-4">
                    {data.latest_ai_recommendation.response.career_paths.slice(0, 3).map((path, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: '#e2e8f0' }}>
                        <div className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0"
                          style={{ backgroundColor: i === 0 ? '#15803d' : i === 1 ? '#1b4f8a' : '#ea580c' }}>
                          {String(i + 1).padStart(2, '0')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-slate-800 truncate">{path.title}</div>
                          <div className="text-xs text-slate-500 truncate">{path.why}</div>
                        </div>
                        <div className="text-sm font-bold flex-shrink-0"
                          style={{ color: path.match_percentage >= 85 ? '#15803d' : path.match_percentage >= 70 ? '#1b4f8a' : '#ea580c' }}>
                          {path.match_percentage}%
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href="/dashboard/trainee/ai-advisor" className="btn btn-outline btn-sm w-full justify-center" style={{ display: 'flex', borderColor: '#7c3aed', color: '#7c3aed' }}>
                    <Bot className="w-3 h-3" />
                    {t(lang, 'viewAIRecommendation')}
                  </Link>
                </div>
              )}

              {/* Recent Certificates */}
              {data.recent_certificates.length > 0 && (
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-slate-800 text-base">🏅 Certificates</h2>
                    <Link href="/dashboard/trainee/certificates" className="text-xs font-semibold hover:underline" style={{ color: '#1b4f8a' }}>
                      View All →
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {data.recent_certificates.map(cert => (
                      <div key={cert.certificate_id} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: '#e2e8f0', backgroundColor: '#f0fdf4' }}>
                        <Award className="w-8 h-8 flex-shrink-0" style={{ color: '#15803d' }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-slate-800 truncate">{cert.course_title}</div>
                          <div className="text-xs text-slate-500">{cert.certificate_id}</div>
                        </div>
                        <div className="badge badge-green text-[10px]">Verified ✓</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column (1/3) */}
            <div className="space-y-6">
              {/* Skill Profile */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-slate-800 text-base">💪 Skill Profile</h2>
                  <Link href="/dashboard/trainee/profile" className="text-xs font-semibold hover:underline" style={{ color: '#1b4f8a' }}>
                    View All →
                  </Link>
                </div>
                {data.skills.slice(0, 6).map(skill => (
                  <SkillBar key={skill.name} {...skill} />
                ))}
              </div>

              {/* Notifications */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-slate-800 text-base">🔔 Notifications</h2>
                  {unread > 0 && <div className="badge badge-orange">{unread} new</div>}
                </div>
                <div className="space-y-2">
                  {data.notifications.slice(0, 5).map(notif => (
                    <div key={notif.id}
                      className="p-3 rounded-xl border text-sm"
                      style={{
                        borderColor: '#e2e8f0',
                        backgroundColor: !notif.is_read ? (
                          notif.type === 'success' ? '#f0fdf4' : notif.type === 'warning' ? '#fffbeb' : '#eff6ff'
                        ) : '#f8fafc'
                      }}>
                      <div className="font-semibold text-slate-800 text-xs mb-0.5">{notif.title}</div>
                      <div className="text-xs text-slate-500 leading-relaxed">{notif.message}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="card">
                <h2 className="font-bold text-slate-800 text-base mb-4">⚡ Quick Actions</h2>
                <div className="space-y-2">
                  {[
                    { href: '/dashboard/trainee/attendance', icon: '📷', label: 'Mark Attendance', color: '#1b4f8a' },
                    { href: '/dashboard/trainee/assessment', icon: '📋', label: 'Take Assessment', color: '#15803d' },
                    { href: '/dashboard/trainee/employment', icon: '💼', label: 'Browse Jobs', color: '#ea580c' },
                    { href: '/dashboard/trainee/ai-advisor', icon: '🤖', label: 'Ask AI Advisor', color: '#7c3aed' },
                  ].map(action => (
                    <Link key={action.href} href={action.href}
                      className="flex items-center gap-3 p-2.5 rounded-xl border hover:shadow-sm transition-all"
                      style={{ borderColor: '#e2e8f0' }}>
                      <span className="text-lg">{action.icon}</span>
                      <span className="text-sm font-medium text-slate-700 flex-1">{action.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
