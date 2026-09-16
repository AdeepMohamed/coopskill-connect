'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context';
import { demoLogin } from '@/lib/api';
import { 
  Building2, Users, GraduationCap, ArrowRight, ShieldCheck, 
  BookOpen, Network, CheckCircle2, ChevronRight, Play 
} from 'lucide-react';

const METRICS = [
  { label: 'Trainees Empowered', value: '12.4K+' },
  { label: 'Verified Certificates', value: '8.6K+' },
  { label: 'Cooperative Societies', value: '450+' },
  { label: 'Active Placements', value: '3.2K+' }
];

const PORTALS = [
  { id: 'trainee', name: 'Trainee Portal', desc: 'Access LMS, attendance, and AI career advisor', icon: GraduationCap, color: 'text-brand-600', bg: 'bg-brand-50' },
  { id: 'trainer', name: 'Trainer Console', desc: 'Manage batches, attendance, and assessments', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'admin', name: 'NCCT Admin', desc: 'Monitor ecosystem analytics and certifications', icon: ShieldCheck, color: 'text-orange-600', bg: 'bg-orange-50' },
  { id: 'employer', name: 'Employer Hub', desc: 'Find AI-matched cooperative talent instantly', icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50' }
];

export default function LandingPage() {
  const router = useRouter();
  const { login } = useApp();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleLogin = async (role: string) => {
    setLoading(role);
    setError('');
    try {
      const data = await demoLogin(role);
      login({ token: data.access_token, role: data.role, user_id: data.user_id, name: data.name });
      router.push(data.redirect_to);
    } catch {
      setError('Could not connect to backend. Please ensure FastAPI is running.');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-brand-100 selection:text-brand-900">
      
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-700 rounded-xl flex items-center justify-center shadow-lg shadow-brand-700/20">
              <Network className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-900 tracking-tight">CoopSkill Connect</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-0.5">Ministry of Cooperation</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-brand-700 transition">Ecosystem</a>
            <a href="#demo" className="text-sm font-semibold text-slate-600 hover:text-brand-700 transition">Access Portals</a>
            <div className="w-px h-5 bg-slate-300"></div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> System Online
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-brand-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-sm font-bold mb-8">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              SIH 2025 Prototype
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
              From Rural Skills to <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-emerald-600">
                Real Opportunities.
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl font-medium">
              An AI-enabled cooperative capacity building and employment ecosystem. 
              Equipping rural talent with verified certifications and connecting them to cooperative jobs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#demo" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-700 text-white rounded-full font-bold shadow-lg shadow-brand-700/25 hover:bg-brand-800 hover:-translate-y-0.5 transition-all">
                Access Demo Portals <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#features" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-full font-bold hover:border-slate-300 hover:bg-slate-50 transition-all">
                <Play className="w-5 h-5 text-slate-400" /> See How it Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="bg-slate-900 py-16 relative z-10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x-0 lg:divide-x divide-slate-800">
            {METRICS.map((metric, idx) => (
              <div key={idx} className="text-center px-4">
                <div className="text-4xl lg:text-5xl font-extrabold text-white mb-2">{metric.value}</div>
                <div className="text-sm font-semibold text-slate-400 uppercase tracking-widest">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Ecosystem Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">One Unified Ecosystem</h2>
            <p className="text-lg text-slate-600">A seamless flow from registration to employment, designed specifically for the cooperative sector.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Offline-First LMS', icon: BookOpen, desc: 'Raspberry Pi edge nodes ensure training continues even without internet connectivity in remote areas.' },
              { title: 'Gemini AI Advisor', icon: Network, desc: 'Personalized career guidance, skill gap analysis, and intelligent job matching powered by AI.' },
              { title: 'Verified Certification', icon: ShieldCheck, desc: 'Blockchain-backed certificates instantly synced with DigiLocker for tamper-proof verification.' }
            ].map((feat, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-shadow">
                <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <feat.icon className="w-7 h-7 text-brand-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Portals */}
      <section id="demo" className="py-24 bg-slate-50 relative border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Try the Prototype</h2>
              <p className="text-lg text-slate-600">Select a role below to explore the functional dashboards. The system is pre-seeded with realistic data for SIH evaluation.</p>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-2xl font-semibold border border-red-200 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5" /> {error}
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PORTALS.map((portal) => (
              <button
                key={portal.id}
                onClick={() => handleLogin(portal.id)}
                disabled={loading !== null}
                className={`group text-left p-8 rounded-3xl bg-white border-2 border-slate-100 hover:border-brand-500 hover:shadow-2xl hover:shadow-brand-900/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className={`w-16 h-16 rounded-2xl ${portal.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <portal.icon className={`w-8 h-8 ${portal.color}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{portal.name}</h3>
                <p className="text-sm text-slate-500 mb-8 min-h-[40px]">{portal.desc}</p>
                
                <div className="flex items-center justify-between mt-auto">
                  {loading === portal.id ? (
                    <div className="flex items-center gap-3 text-brand-600 font-bold text-sm">
                      <div className="w-5 h-5 rounded-full border-2 border-slate-200 border-t-current animate-spin"></div>
                      Authenticating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm font-bold text-brand-600 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      Access Portal <ChevronRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Network className="w-6 h-6 text-brand-700" />
            <span className="font-extrabold text-slate-900 tracking-tight">CoopSkill Connect</span>
          </div>
          <div className="text-sm font-medium text-slate-500 text-center md:text-left">
            © 2026 Ministry of Cooperation | Govt. of India. SIH Prototype.
          </div>
        </div>
      </footer>
    </div>
  );
}
