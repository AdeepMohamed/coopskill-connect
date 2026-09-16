'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen, QrCode, Award, Bot, Briefcase, Bell,
  ChevronRight, Play, Star, AlertCircle, Building2, MapPin, ClipboardList
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
    { id: 3, title: 'AI Recommendation Ready 🤖', message: 'Your AI career recommendation is ready.', type: 'info', is_read: false },
  ],
};

function StatCard({ value, label, subLabel, colorClass, icon: Icon, href }: {
  value: string | number; label: string; subLabel?: string;
  colorClass: string; icon: any; href?: string;
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
      {subLabel && <div className="text-xs text-slate-400 mt-1">{subLabel}</div>}
    </div>
  );
  return href ? <Link href={href} className="block">{content}</Link> : content;
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
        // Fallback to demo
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
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 items-start md:items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{greeting}, {data.trainee.name}</h1>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2 md:mt-1 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-1.5 text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md"><BookOpen className="w-3.5 h-3.5"/> {data.trainee.trainee_id}</span>
              <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5"/> {data.trainee.institution_name || 'NCCT'}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> {data.trainee.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {usingDemo && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold shadow-sm">
                <AlertCircle className="w-4 h-4" /> Demo Data
              </div>
            )}
            {apiLoading && <div className="w-5 h-5 border-2 border-slate-300 border-t-brand-600 rounded-full animate-spin"></div>}
            
            <Link href="/dashboard/trainee/profile" className="relative p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              <Bell className="w-5 h-5 text-slate-600" />
              {unread > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {unread}
                </span>
              )}
            </Link>
          </div>
        </header>

        <main className="p-4 md:p-4 md:p-8 max-w-7xl mx-auto">
          {/* Metrics */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
            <StatCard value={`${data.learning_progress}%`} label={t(lang, 'learningProgress')} subLabel={data.current_course?.title} colorClass="bg-brand-50 text-brand-600" icon={BookOpen} href="/dashboard/trainee/learning" />
            <StatCard value={`${data.attendance_rate}%`} label={t(lang, 'attendanceRate')} colorClass="bg-emerald-50 text-emerald-600" icon={QrCode} href="/dashboard/trainee/attendance" />
            <StatCard value={data.skills_count} label={t(lang, 'skillsAcquired')} colorClass="bg-purple-50 text-purple-600" icon={Star} href="/dashboard/trainee/profile" />
            <StatCard value={data.certificates_count} label={t(lang, 'certificatesIssued')} colorClass="bg-orange-50 text-orange-600" icon={Award} href="/dashboard/trainee/certificates" />
            <StatCard value={data.job_matches_count} label={t(lang, 'jobMatches')} colorClass="bg-blue-50 text-blue-600" icon={Briefcase} href="/dashboard/trainee/employment" />
          </div>

          <div className="grid xl:grid-cols-3 gap-4 md:p-8">
            {/* Main Content Column */}
            <div className="xl:col-span-2 space-y-8">
              
              {/* Current Course Widget */}
              {data.current_course && (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-4 md:p-8 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-3xl opacity-60 -mr-20 -mt-20 pointer-events-none"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 items-start md:items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                      <div className="p-2 bg-brand-100 rounded-lg"><BookOpen className="w-5 h-5 text-brand-700"/></div>
                      Continue Learning
                    </h2>
                    <Link href="/dashboard/trainee/learning" className="text-sm font-semibold text-brand-600 hover:text-brand-800 transition-colors">View All Courses →</Link>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{data.current_course.title}</h3>
                        <p className="text-sm font-medium text-slate-500 mt-1">{data.current_course.code} • Module {data.current_course.current_module} of {data.current_course.modules_count}</p>
                      </div>
                      <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200 uppercase tracking-wider self-start md:self-auto">
                        {data.current_course.status.replace('_', ' ')}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                        <span>Course Progress</span>
                        <span className="text-brand-600">{data.current_course.progress}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-600 rounded-full" style={{ width: `${data.current_course.progress}%` }}></div>
                      </div>
                    </div>
                    
                    <Link href="/dashboard/trainee/learning" className="inline-flex w-full items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-md transition-all">
                      <Play className="w-4 h-4 fill-current" /> Resume Module
                    </Link>
                  </div>
                </div>
              )}

              {/* Gemini AI Advisor Widget */}
              {data.latest_ai_recommendation && (
                <div className="bg-white border-2 border-purple-100 rounded-3xl p-6 lg:p-4 md:p-8 shadow-sm relative overflow-hidden">
                  <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-50 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 items-start md:items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg"><Bot className="w-5 h-5 text-purple-700"/></div>
                      Gemini Career Advisor
                    </h2>
                    <Link href="/dashboard/trainee/ai-advisor" className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors">Full Analysis →</Link>
                  </div>
                  
                  <div className="relative z-10">
                    <p className="text-slate-600 font-medium leading-relaxed mb-6 bg-purple-50/50 p-4 rounded-xl border border-purple-100/50">
                      "{data.latest_ai_recommendation.response.recommendation}"
                    </p>
                    
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Top AI Matches</h4>
                    <div className="space-y-3 mb-6">
                      {data.latest_ai_recommendation.response.career_paths.slice(0, 3).map((path, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-white hover:border-purple-300 hover:shadow-md transition-all">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-inner
                            ${i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-brand-500' : 'bg-orange-400'}`}>
                            #{i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-900 truncate">{path.title}</div>
                            <div className="text-xs font-medium text-slate-500 truncate mt-0.5">{path.why}</div>
                          </div>
                          <div className={`text-lg font-extrabold flex-shrink-0 ${path.match_percentage >= 85 ? 'text-emerald-600' : path.match_percentage >= 70 ? 'text-brand-600' : 'text-orange-500'}`}>
                            {path.match_percentage}%
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Link href="/dashboard/trainee/ai-advisor" className="inline-flex w-full items-center justify-center gap-2 px-6 py-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded-xl font-bold transition-all">
                      <Bot className="w-5 h-5" /> Consult CoopSkill AI
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Column */}
            <div className="space-y-8">
              
              {/* Skills */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 items-start md:items-center mb-6">
                  <h2 className="text-lg font-bold text-slate-900">Skill Profile</h2>
                  <Link href="/dashboard/trainee/profile" className="text-sm font-semibold text-brand-600">Edit</Link>
                </div>
                <div className="space-y-4">
                  {data.skills.slice(0, 6).map((skill, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-semibold text-slate-700">{skill.name}</span>
                        <span className="text-xs font-bold text-slate-500">{skill.proficiency}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${skill.proficiency >= 80 ? 'bg-emerald-500' : skill.proficiency >= 60 ? 'bg-brand-500' : 'bg-orange-500'}`} style={{ width: `${skill.proficiency}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificates */}
              {data.recent_certificates.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900 mb-5">Latest Certificates</h2>
                  <div className="space-y-3">
                    {data.recent_certificates.map(cert => (
                      <div key={cert.certificate_id} className="flex gap-4 p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 text-sm truncate">{cert.course_title}</div>
                          <div className="text-xs font-medium text-slate-500 mt-1 font-mono">{cert.certificate_id}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  {[
                    { href: '/dashboard/trainee/attendance', icon: QrCode, label: 'Scan QR Attendance', bg: 'bg-slate-100 text-slate-700' },
                    { href: '/dashboard/trainee/assessment', icon: ClipboardList, label: 'Pending Assessments', bg: 'bg-slate-100 text-slate-700' },
                    { href: '/dashboard/trainee/employment', icon: Briefcase, label: 'Browse Job Matches', bg: 'bg-slate-100 text-slate-700' },
                  ].map(action => (
                    <Link key={action.label} href={action.href} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all group">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${action.bg}`}>
                        <action.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 flex-1">{action.label}</span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
