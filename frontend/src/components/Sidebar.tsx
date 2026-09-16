'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap, LayoutDashboard, BookOpen, QrCode, ClipboardList,
  Award, Bot, Briefcase, User, Wifi, LogOut, Bell, ChevronRight,
  Building2, BarChart3, Users
} from 'lucide-react';
import { useApp } from '@/lib/context';
import { t } from '@/lib/i18n';

const TRAINEE_NAV = [
  { href: '/dashboard/trainee', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard', key: 'dashboard' },
  { href: '/dashboard/trainee/learning', icon: <BookOpen className="w-4 h-4" />, label: 'My Learning', key: 'myLearning' },
  { href: '/dashboard/trainee/attendance', icon: <QrCode className="w-4 h-4" />, label: 'Attendance', key: 'attendance' },
  { href: '/dashboard/trainee/assessment', icon: <ClipboardList className="w-4 h-4" />, label: 'Assessments', key: 'assessments' },
  { href: '/dashboard/trainee/certificates', icon: <Award className="w-4 h-4" />, label: 'Certificates', key: 'certificates' },
  { href: '/dashboard/trainee/ai-advisor', icon: <Bot className="w-4 h-4" />, label: 'AI Career Advisor', key: 'aiAdvisor' },
  { href: '/dashboard/trainee/employment', icon: <Briefcase className="w-4 h-4" />, label: 'Employment', key: 'employment' },
  { href: '/dashboard/trainee/profile', icon: <User className="w-4 h-4" />, label: 'My Profile', key: 'myProfile' },
  { href: '/dashboard/trainee/rural-edge', icon: <Wifi className="w-4 h-4" />, label: 'Rural Learning Edge', key: 'ruralEdge' },
];

const ADMIN_NAV = [
  { href: '/dashboard/admin', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
  { href: '/dashboard/admin/trainees', icon: <Users className="w-4 h-4" />, label: 'Trainees' },
  { href: '/dashboard/admin/courses', icon: <BookOpen className="w-4 h-4" />, label: 'Courses' },
  { href: '/dashboard/admin/certificates', icon: <Award className="w-4 h-4" />, label: 'Certificates' },
  { href: '/dashboard/admin/analytics', icon: <BarChart3 className="w-4 h-4" />, label: 'Analytics' },
  { href: '/dashboard/admin/ai-insights', icon: <Bot className="w-4 h-4" />, label: 'AI Insights' },
];

const EMPLOYER_NAV = [
  { href: '/dashboard/employer', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
  { href: '/dashboard/employer/post-job', icon: <Briefcase className="w-4 h-4" />, label: 'Post Job' },
  { href: '/dashboard/employer/applications', icon: <Users className="w-4 h-4" />, label: 'Applications' },
  { href: '/dashboard/employer/ai-match', icon: <Bot className="w-4 h-4" />, label: 'AI Candidate Match' },
];

const TRAINER_NAV = [
  { href: '/dashboard/trainer', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
  { href: '/dashboard/trainer/batches', icon: <Users className="w-4 h-4" />, label: 'My Batches' },
  { href: '/dashboard/trainer/attendance', icon: <QrCode className="w-4 h-4" />, label: 'Attendance' },
  { href: '/dashboard/trainer/assessments', icon: <ClipboardList className="w-4 h-4" />, label: 'Assessments' },
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
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm text-white">CoopSkill Connect</div>
            <div className="text-[10px] text-blue-200">NCCT | Min. of Cooperation</div>
          </div>
        </div>
        {/* Language selector */}
        <select
          value={lang}
          onChange={e => setLang(e.target.value as 'en' | 'ta' | 'hi')}
          className="w-full text-xs rounded-lg px-2 py-1.5 text-white bg-white/10 border border-white/20 focus:outline-none"
        >
          <option value="en">🌐 English</option>
          <option value="ta">தமிழ்</option>
          <option value="hi">हिन्दी</option>
        </select>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {navItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span className="flex-1 text-sm">
                {('key' in item) ? t(lang, (item as {key: string}).key as Parameters<typeof t>[1]) : item.label}
              </span>
              {isActive && <ChevronRight className="w-3 h-3 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="sidebar-user">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          {ROLE_ICONS[role]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</div>
          <div className="text-xs text-blue-300">{ROLE_LABELS[role]}</div>
        </div>
        <button
          onClick={logout}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          title={t(lang, 'logout')}
        >
          <LogOut className="w-4 h-4 text-blue-200" />
        </button>
      </div>
    </aside>
  );
}
