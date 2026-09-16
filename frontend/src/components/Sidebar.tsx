'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap, LayoutDashboard, BookOpen, QrCode, ClipboardList,
  Award, Bot, Briefcase, User, Wifi, LogOut, ChevronRight,
  Building2, BarChart3, Users, Network
} from 'lucide-react';
import { useApp } from '@/lib/context';
import { t, Language } from '@/lib/i18n';
import { Settings } from 'lucide-react';

const TRAINEE_NAV = [
  { href: '/dashboard/trainee', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', key: 'dashboard' },
  { href: '/dashboard/trainee/learning', icon: <BookOpen className="w-5 h-5" />, label: 'My Learning', key: 'myLearning' },
  { href: '/dashboard/trainee/attendance', icon: <QrCode className="w-5 h-5" />, label: 'Attendance', key: 'attendance' },
  { href: '/dashboard/trainee/assessment', icon: <ClipboardList className="w-5 h-5" />, label: 'Assessments', key: 'assessments' },
  { href: '/dashboard/trainee/certificates', icon: <Award className="w-5 h-5" />, label: 'Certificates', key: 'certificates' },
  { href: '/dashboard/trainee/ai-advisor', icon: <Bot className="w-5 h-5" />, label: 'AI Career Advisor', key: 'aiAdvisor' },
  { href: '/dashboard/trainee/employment', icon: <Briefcase className="w-5 h-5" />, label: 'Employment', key: 'employment' },
  { href: '/dashboard/trainee/profile', icon: <User className="w-5 h-5" />, label: 'My Profile', key: 'myProfile' },
  { href: '/dashboard/trainee/rural-edge', icon: <Wifi className="w-5 h-5" />, label: 'Rural Learning Edge', key: 'ruralEdge' },
];

const ADMIN_NAV = [
  { href: '/dashboard/admin', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', key: 'dashboard' },
  { href: '/dashboard/admin/trainees', icon: <Users className="w-5 h-5" />, label: 'Trainees', key: 'traineesNav' },
  { href: '/dashboard/admin/courses', icon: <BookOpen className="w-5 h-5" />, label: 'Courses', key: 'coursesNav' },
  { href: '/dashboard/admin/certificates', icon: <Award className="w-5 h-5" />, label: 'Certificates', key: 'certificates' },
  { href: '/dashboard/admin/analytics', icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics', key: 'analyticsNav' },
  { href: '/dashboard/admin/ai-insights', icon: <Bot className="w-5 h-5" />, label: 'AI Insights', key: 'aiInsightsNav' },
];

const EMPLOYER_NAV = [
  { href: '/dashboard/employer', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', key: 'dashboard' },
  { href: '/dashboard/employer/post-job', icon: <Briefcase className="w-5 h-5" />, label: 'Post Job', key: 'postJobNav' },
  { href: '/dashboard/employer/applications', icon: <Users className="w-5 h-5" />, label: 'Applications', key: 'applicationsNav' },
  { href: '/dashboard/employer/ai-match', icon: <Bot className="w-5 h-5" />, label: 'AI Candidate Match', key: 'aiMatchNav' },
];

const TRAINER_NAV = [
  { href: '/dashboard/trainer', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', key: 'dashboard' },
  { href: '/dashboard/trainer/batches', icon: <Users className="w-5 h-5" />, label: 'My Batches', key: 'batchesNav' },
  { href: '/dashboard/trainer/attendance', icon: <QrCode className="w-5 h-5" />, label: 'Attendance', key: 'attendance' },
  { href: '/dashboard/trainer/assessments', icon: <ClipboardList className="w-5 h-5" />, label: 'Assessments', key: 'assessments' },
];

const NAV_BY_ROLE: Record<string, typeof TRAINEE_NAV> = {
  trainee: TRAINEE_NAV,
  admin: ADMIN_NAV,
  employer: EMPLOYER_NAV,
  trainer: TRAINER_NAV,
};

const ROLE_LABELS: Record<string, string> = {
  trainee: 'Trainee',
  admin: 'NCCT Admin',
  employer: 'Employer',
  trainer: 'Trainer',
};

const ROLE_ICONS: Record<string, React.ReactNode> = {
  trainee: <GraduationCap className="w-5 h-5" />,
  admin: <Building2 className="w-5 h-5" />,
  employer: <Briefcase className="w-5 h-5" />,
  trainer: <Users className="w-5 h-5" />,
};

export default function Sidebar() {
  const { user, logout, lang, setLang } = useApp();
  const pathname = usePathname();
  const role = user?.role || 'trainee';
  const navItems = NAV_BY_ROLE[role] || TRAINEE_NAV;

  return (
    <aside className="w-72 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col h-screen overflow-hidden selection:bg-brand-500 selection:text-white">
      {/* Brand & Logo */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-600/20">
            <Network className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-white tracking-tight">CoopSkill Connect</div>
            <div className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">NCCT Dashboard</div>
          </div>
        </div>

        {/* Language Selector */}
        <div className="relative">
          <select
            value={lang}
            onChange={e => setLang(e.target.value as Language)}
            className="w-full appearance-none bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold rounded-lg px-3 py-2.5 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 cursor-pointer transition-colors"
          >
            <option value="en">🌐 English (EN)</option>
            <option value="hi">हिन्दी (HI)</option>
            <option value="ta">தமிழ் (TA)</option>
            <option value="te">తెలుగు (TE)</option>
            <option value="ml">മലയാളം (ML)</option>
            <option value="kn">ಕನ್ನಡ (KN)</option>
          </select>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        <div className="px-3 mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">Main Menu</div>
        {navItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive 
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`}
            >
              <div className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300 transition-colors'}>
                {item.icon}
              </div>
              <span className="flex-1">
                {('key' in item) ? t(lang, (item as {key: string}).key as Parameters<typeof t>[1]) : item.label}
              </span>
              {isActive && <ChevronRight className="w-4 h-4 opacity-70" />}
            </Link>
          );
        })}
        
        <div className="pt-6 pb-2 px-3 text-xs font-bold text-slate-500 uppercase tracking-widest">System</div>
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
            pathname === '/dashboard/settings' 
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20' 
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
          }`}
        >
          <div className={pathname === '/dashboard/settings' ? 'text-white' : 'text-slate-500 group-hover:text-slate-300 transition-colors'}>
            <Settings className="w-5 h-5" />
          </div>
          <span className="flex-1">{t(lang, 'settings')}</span>
        </Link>
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800 border border-slate-700">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 text-slate-300">
            {ROLE_ICONS[role]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-slate-200 truncate">{user?.name || 'User'}</div>
            <div className="text-[11px] font-semibold text-brand-400 uppercase tracking-wider truncate">{ROLE_LABELS[role]}</div>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            title={t(lang, 'logout')}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
