'use client';
import { useApp } from '@/lib/context';
import Sidebar from '@/components/Sidebar';
import { Globe, Save, User, Bell, Shield, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
  const { lang, setLang } = useApp();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 items-start md:items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Settings & Preferences</h1>
            <div className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
              NCCT Dashboard <ChevronRight className="w-3 h-3" /> Settings
            </div>
          </div>
        </header>

        <main className="p-4 md:p-4 md:p-8 max-w-4xl mx-auto space-y-8">
          
          {/* Language Settings */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 md:p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Language Preferences</h2>
                <p className="text-sm text-slate-500">Change your native language for the dashboard. This will translate the entire sidebar navigation.</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[
                { code: 'en', name: 'English', desc: 'Default' },
                { code: 'hi', name: 'हिन्दी', desc: 'Hindi' },
                { code: 'ta', name: 'தமிழ்', desc: 'Tamil' },
                { code: 'te', name: 'తెలుగు', desc: 'Telugu' },
                { code: 'ml', name: 'മലയാളം', desc: 'Malayalam' },
                { code: 'kn', name: 'ಕನ್ನಡ', desc: 'Kannada' }
              ].map(l => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code as any)}
                  className={`flex flex-col text-left p-4 rounded-2xl border-2 transition-all ${
                    lang === l.code 
                      ? 'border-brand-500 bg-brand-50 shadow-sm' 
                      : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className={`font-bold text-lg mb-1 ${lang === l.code ? 'text-brand-700' : 'text-slate-800'}`}>
                    {l.name}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{l.desc}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <button onClick={() => alert("Language preferences saved successfully!")} className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Language
              </button>
            </div>
          </div>

          {/* Dummy Settings Sections */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-4 md:p-8 shadow-sm opacity-60">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-slate-500" />
                <h3 className="font-bold text-slate-900">Profile Settings</h3>
              </div>
              <p className="text-sm text-slate-500 mb-4">Update your personal information and contact details.</p>
              <button className="px-4 py-2 bg-slate-100 text-slate-500 text-sm font-bold rounded-xl">Manage Profile</button>
            </div>
            
            <div className="bg-white rounded-3xl border border-slate-200 p-4 md:p-8 shadow-sm opacity-60">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-5 h-5 text-slate-500" />
                <h3 className="font-bold text-slate-900">Notifications</h3>
              </div>
              <p className="text-sm text-slate-500 mb-4">Configure email and SMS alerts for new applications.</p>
              <button className="px-4 py-2 bg-slate-100 text-slate-500 text-sm font-bold rounded-xl">Manage Alerts</button>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
