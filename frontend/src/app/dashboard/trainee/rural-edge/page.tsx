'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { useApp } from '@/lib/context';
import { syncOfflineData } from '@/lib/api';
import { Wifi, WifiOff, Server, Smartphone, RotateCcw, CheckCircle, AlertCircle, Zap, Database, Globe, Cloud } from 'lucide-react';
import { t } from '@/lib/i18n';

type OfflineState = 'online' | 'offline' | 'syncing' | 'synced';

const OFFLINE_COURSES = [
  { id: 1, title: 'Digital Cooperative Management', modules: 6, size: '420 MB' },
  { id: 2, title: 'Digital Finance Basics', modules: 5, size: '280 MB' },
  { id: 3, title: 'ERP for Cooperatives', modules: 8, size: '580 MB' },
  { id: 4, title: 'Advanced Cooperative Governance', modules: 5, size: '320 MB' },
];

const SYNC_ITEMS = [
  { label: 'Attendance Records', key: 'attendance' },
  { label: 'Learning Progress', key: 'progress' },
  { label: 'Assessment Data', key: 'assessments' },
  { label: 'Certificate Data', key: 'certificates' },
];

export default function RuralEdgePage() {
  const { user, lang } = useApp();
  const [state, setState] = useState<OfflineState>('online');
  const [syncProgress, setSyncProgress] = useState<Record<string, number>>({});
  const [pendingCount, setPendingCount] = useState(0);

  const simulateOutage = () => {
    setState('offline');
    setPendingCount(5);
  };

  const restoreInternet = async () => {
    setState('syncing');
    // Simulate progressive sync
    for (const item of SYNC_ITEMS) {
      await new Promise(r => setTimeout(r, 600));
      setSyncProgress(prev => ({ ...prev, [item.key]: 100 }));
    }
    try {
      if (user) await syncOfflineData(user.user_id, { offline_attendance: [], offline_progress: [] });
    } catch {}
    await new Promise(r => setTimeout(r, 400));
    setState('synced');
    setPendingCount(0);
    await new Promise(r => setTimeout(r, 2500));
    setState('online');
    setSyncProgress({});
  };

  const isOnline = state === 'online' || state === 'synced';

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content bg-slate-50">
        <div className="page-header">
          <div>
            <h1 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <Wifi className="w-5 h-5" style={{ color: '#ea580c' }} />
              Rural Learning Edge
            </h1>
            <p className="text-xs text-slate-500">Offline-capable LMS for remote cooperative training centres</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`badge ${isOnline ? 'badge-green' : 'badge-red'}`}>
              {isOnline ? '🟢 ONLINE' : '🔴 OFFLINE'}
            </div>
          </div>
        </div>

        <div className="page-body">
          {/* Offline Alert */}
          {state === 'offline' && (
            <div className="mb-5 p-4 rounded-xl border flex items-start gap-3 animate-slide-up"
              style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a' }}>
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-800">You are in offline mode.</div>
                <p className="text-sm text-amber-700">All learning data is being stored locally and will sync automatically when internet is restored. The Raspberry Pi edge server is serving content locally.</p>
              </div>
            </div>
          )}

          {/* Architecture Diagram */}
          <div className="card mb-6">
            <h2 className="font-bold text-slate-800 mb-1">Edge Computing Architecture</h2>
            <p className="text-xs text-slate-500 mb-5">How CoopSkill Connect works in rural areas without reliable internet</p>
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
              {[
                { icon: <Cloud className="w-6 h-6" />, label: 'Cloud', sub: 'Neon DB + FastAPI', color: '#1b4f8a', ok: isOnline },
                { icon: <span className="text-lg font-bold text-slate-400">⟺</span>, label: '', sub: '', color: '#e2e8f0', isArrow: true },
                { icon: <Zap className="w-6 h-6" />, label: 'Sync Engine', sub: 'Auto-retry on reconnect', color: '#15803d', ok: true },
                { icon: <span className="text-lg font-bold text-slate-400">⟺</span>, label: '', sub: '', color: '#e2e8f0', isArrow: true },
                { icon: <Server className="w-6 h-6" />, label: 'Raspberry Pi', sub: 'Local LMS + 256GB SSD', color: '#ea580c', ok: true },
                { icon: <span className="text-lg font-bold text-slate-400">→</span>, label: '', sub: '', color: '#e2e8f0', isArrow: true },
                { icon: <Wifi className="w-6 h-6" />, label: 'Wi-Fi Router', sub: '50m range, 30+ devices', color: '#7c3aed', ok: true },
                { icon: <span className="text-lg font-bold text-slate-400">→</span>, label: '', sub: '', color: '#e2e8f0', isArrow: true },
                { icon: <Smartphone className="w-6 h-6" />, label: 'Trainee Devices', sub: 'Any Android 8+', color: '#1b4f8a', ok: true },
              ].map((node, i) => {
                if (node.isArrow) {
                  return <div key={i} className="text-2xl text-slate-300 hidden md:block">{node.icon}</div>;
                }
                return (
                  <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white border shadow-sm min-w-28 text-center"
                    style={{ borderColor: '#e2e8f0', borderTopWidth: 3, borderTopColor: node.color }}>
                    <div style={{ color: node.color }}>{node.icon}</div>
                    <div className="font-bold text-xs text-slate-800">{node.label}</div>
                    <div className="text-[10px] text-slate-500">{node.sub}</div>
                    <div className={`badge text-[10px] ${node.ok ? 'badge-green' : 'badge-red'}`}>
                      {node.ok ? 'ACTIVE' : 'OFFLINE'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Status Panel */}
            <div className="space-y-5">
              {/* Status Cards */}
              <div className="card">
                <h2 className="font-bold text-slate-800 mb-4">System Status</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Internet', ok: isOnline, val: isOnline ? 'Connected' : 'Disconnected', color: '#1b4f8a' },
                    { label: 'Edge Node', ok: true, val: 'Raspberry Pi running', color: '#ea580c' },
                    { label: 'Local Wi-Fi', ok: true, val: 'Signal: Strong', color: '#7c3aed' },
                    { label: 'Active Learners', ok: true, val: '8 sessions', color: '#15803d' },
                  ].map(s => (
                    <div key={s.label} className="p-3 rounded-xl border" style={{ borderColor: '#e2e8f0' }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className={`w-2 h-2 rounded-full ${s.ok ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-xs font-bold text-slate-600">{s.label}</span>
                      </div>
                      <div className="text-xs text-slate-500">{s.val}</div>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  {[
                    ['Offline Courses', '12'],
                    ['Pending Sync', state === 'offline' ? pendingCount : '0'],
                    ['Last Sync', '8:30 PM Today'],
                    ['Cache Size', '4.2 GB'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1 border-b text-xs" style={{ borderColor: '#f1f5f9' }}>
                      <span className="text-slate-400">{k}</span>
                      <span className="font-bold text-slate-700">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Control Buttons */}
                <div className="flex gap-3 mt-4">
                  {state === 'online' && (
                    <button onClick={simulateOutage} className="btn btn-amber flex-1">
                      <WifiOff className="w-4 h-4" />
                      {t(lang, 'simulateOutage')}
                    </button>
                  )}
                  {state === 'offline' && (
                    <button onClick={restoreInternet} className="btn btn-primary flex-1">
                      <Wifi className="w-4 h-4" />
                      {t(lang, 'restoreInternet')}
                    </button>
                  )}
                  {state === 'syncing' && (
                    <div className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl" style={{ backgroundColor: '#eff6ff' }}>
                      <div className="spinner" />
                      <span className="text-sm font-bold text-blue-700">Synchronizing to Cloud...</span>
                    </div>
                  )}
                  {state === 'synced' && (
                    <div className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-green-700 animate-slide-up"
                      style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                      <CheckCircle className="w-5 h-5" />
                      {t(lang, 'syncComplete')}
                    </div>
                  )}
                </div>
              </div>

              {/* Sync Progress (when syncing) */}
              {(state === 'syncing' || state === 'synced') && (
                <div className="card animate-slide-up">
                  <h3 className="font-bold text-slate-800 mb-4">Synchronizing to Cloud</h3>
                  <div className="space-y-3">
                    {SYNC_ITEMS.map(item => {
                      const pct = syncProgress[item.key] || 0;
                      return (
                        <div key={item.key}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-600">{item.label}</span>
                            <span className="font-bold" style={{ color: pct === 100 ? '#15803d' : '#1b4f8a' }}>
                              {pct === 100 ? '✓ SYNCED' : pct === 0 ? 'Pending...' : `${pct}%`}
                            </span>
                          </div>
                          <div className="progress-track">
                            <div className="progress-bar" style={{ width: `${pct}%`, backgroundColor: pct === 100 ? '#15803d' : '#1b4f8a', transition: 'width 0.5s ease' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Offline Course Access */}
              {state === 'offline' && (
                <div className="card animate-slide-up" style={{ borderLeft: '3px solid #15803d' }}>
                  <div className="text-xs font-bold text-green-700 mb-2">✓ Local Edge Server Active</div>
                  <h3 className="font-bold text-slate-800 mb-3">Digital Cooperative Management</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Available from local edge server ✓ — You are learning from the Raspberry Pi node.
                  </p>
                  <button className="btn btn-green w-full">
                    CONTINUE LEARNING (OFFLINE)
                  </button>
                </div>
              )}
            </div>

            {/* Offline Courses + Hardware */}
            <div className="space-y-5">
              {/* Offline Courses */}
              <div className="card">
                <h2 className="font-bold text-slate-800 mb-4">
                  <Database className="w-4 h-4 inline mr-2" style={{ color: '#ea580c' }} />
                  Offline Content Library
                </h2>
                <div className="space-y-2">
                  {OFFLINE_COURSES.map(course => (
                    <div key={course.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 items-start md:items-center p-3 rounded-xl border"
                      style={{ borderColor: '#e2e8f0' }}>
                      <div>
                        <div className="text-sm font-medium text-slate-700">{course.title}</div>
                        <div className="text-xs text-slate-400">{course.modules} modules • {course.size}</div>
                      </div>
                      <div className="badge badge-green text-[10px]">✓ Cached</div>
                    </div>
                  ))}
                  <div className="text-xs text-slate-400 text-center pt-1">
                    12 courses available offline • Total: 4.2 GB
                  </div>
                </div>
              </div>

              {/* Hardware Components */}
              <div className="card">
                <h2 className="font-bold text-slate-800 mb-4">🖥️ Hardware Components</h2>
                <div className="space-y-2">
                  {[
                    { icon: '🔴', name: 'Raspberry Pi 4B', spec: '8GB RAM • 256GB SSD • Local LMS + Sync Engine', color: '#ea580c' },
                    { icon: '📶', name: 'Wi-Fi Router', spec: 'TP-Link or equivalent • 50m range • 30+ devices', color: '#1b4f8a' },
                    { icon: '📱', name: 'Trainee Devices', spec: 'Any Android 8+ • Works in browser • No app needed', color: '#15803d' },
                    { icon: '📷', name: 'QR Scanner', spec: 'USB/Bluetooth or phone camera • Optional', color: '#7c3aed' },
                    { icon: '☀️', name: 'Solar Power Bank', spec: '20,000 mAh • 12 hours backup • Optional for remote', color: '#ea580c' },
                  ].map(h => (
                    <div key={h.name} className="flex items-start gap-3 p-2.5 rounded-xl border text-sm"
                      style={{ borderColor: '#e2e8f0', borderLeftWidth: 3, borderLeftColor: h.color }}>
                      <span className="text-lg">{h.icon}</span>
                      <div>
                        <div className="font-semibold text-slate-800">{h.name}</div>
                        <div className="text-xs text-slate-500">{h.spec}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-xl text-xs" style={{ backgroundColor: '#fffbeb', color: '#92400e' }}>
                  💡 Estimated hardware cost: ₹12,000–18,000 per training centre. Suitable for 30+ simultaneous learners.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
