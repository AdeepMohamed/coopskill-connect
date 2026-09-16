'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { useApp } from '@/lib/context';
import { recordQRAttendance, getAttendanceSummary } from '@/lib/api';
import { QrCode, CheckCircle, Clock, X, RefreshCw } from 'lucide-react';
import { t } from '@/lib/i18n';

const MOCK_HISTORY = [
  { session: 11, date: 'Today', status: 'present' },
  { session: 10, date: '14 Sep', status: 'present' },
  { session: 9, date: '12 Sep', status: 'absent' },
  { session: 8, date: '10 Sep', status: 'present' },
  { session: 7, date: '8 Sep', status: 'present' },
  { session: 6, date: '6 Sep', status: 'present' },
  { session: 5, date: '4 Sep', status: 'absent' },
  { session: 4, date: '2 Sep', status: 'present' },
];

function QRCodeSVG() {
  // Visual QR code pattern (decorative, not scannable)
  const cells = Array.from({ length: 21 * 21 }, (_, i) => {
    const row = Math.floor(i / 21);
    const col = i % 21;
    // Corner squares
    if ((row < 7 && col < 7) || (row < 7 && col > 13) || (row > 13 && col < 7)) {
      if (row === 0 || row === 6 || col === 0 || col === 6) return true;
      if (row >= 2 && row <= 4 && col >= 2 && col <= 4) return true;
      return false;
    }
    return Math.random() > 0.5;
  });

  return (
    <div className="inline-block p-3 bg-white border-2 border-slate-200 rounded-xl shadow-sm">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(21, 8px)', gap: '1px' }}>
        {cells.map((dark, i) => (
          <div key={i} style={{
            width: 8, height: 8,
            borderRadius: 1,
            backgroundColor: dark ? '#1b4f8a' : 'white'
          }} />
        ))}
      </div>
    </div>
  );
}

export default function AttendancePage() {
  const { user, lang } = useApp();
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{ time: string; session: number } | null>(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState(MOCK_HISTORY);
  const courseId = 1; // DCM course

  const handleScan = async () => {
    if (scanned) return;
    setScanning(true);
    setError('');

    // Simulate scan animation
    await new Promise(r => setTimeout(r, 1500));

    try {
      let res;
      if (user) {
        res = await recordQRAttendance(user.user_id, courseId);
      }
      const now = new Date();
      setResult({
        time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        session: res?.session_number || 12
      });
      setScanned(true);
      setHistory(prev => [{ session: res?.session_number || 12, date: 'Today', status: 'present' }, ...prev]);
    } catch {
      // Demo fallback
      const now = new Date();
      setResult({ time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), session: 12 });
      setScanned(true);
    } finally {
      setScanning(false);
    }
  };

  const reset = () => { setScanned(false); setResult(null); };

  const present = history.filter(h => h.status === 'present').length;
  const total = history.length;
  const rate = Math.round((present / total) * 100);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content bg-slate-50">
        <div className="page-header">
          <div>
            <h1 className="font-bold text-slate-800 text-base">📷 Smart Attendance</h1>
            <p className="text-xs text-slate-500 mt-0.5">Digital Cooperative Management | Batch DCM-2026-041</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-4 h-4" />
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        <div className="page-body">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* QR Scanner */}
            <div className="card">
              <div className="flex items-center gap-2 mb-1">
                <QrCode className="w-5 h-5" style={{ color: '#1b4f8a' }} />
                <h2 className="font-bold text-slate-800">QR Attendance System</h2>
              </div>
              <p className="text-xs text-slate-500 mb-6">Scan the QR code to mark your attendance for today's session</p>

              {!scanned ? (
                <div className="flex flex-col items-center gap-5">
                  <div className="relative animate-pulse-border rounded-xl">
                    <QRCodeSVG />
                    {scanning && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-blue-900/30">
                        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-slate-700">Scan to Mark Attendance</div>
                    <div className="text-xs text-slate-400 font-mono mt-1">NCCT-QR-2026-0916-DCM041</div>
                  </div>
                  <div className="text-xs text-slate-500 text-center">
                    Trainer: Dr. Arun Sharma | Location: RICM Chennai
                  </div>
                  <button
                    onClick={handleScan}
                    disabled={scanning}
                    className="btn btn-primary btn-lg w-full"
                  >
                    {scanning ? (
                      <><div className="spinner border-white border-t-transparent" />Scanning...</>
                    ) : (
                      <><QrCode className="w-5 h-5" />{t(lang, 'simulateQRScan')}</>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 py-4 animate-slide-up">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700 mb-1">{t(lang, 'attendanceRecorded')}</div>
                    <div className="text-slate-600 text-sm">Time: {result?.time}</div>
                    <div className="text-slate-600 text-sm">Method: QR Verification</div>
                    <div className="text-slate-600 text-sm">Session #{result?.session}</div>
                  </div>
                  <div className="w-full p-3 rounded-xl text-center font-bold text-white text-sm"
                    style={{ backgroundColor: '#15803d' }}>
                    ✓ PRESENT — Recorded Successfully
                  </div>
                  <button onClick={reset} className="btn btn-outline btn-sm">
                    <RefreshCw className="w-3 h-3" /> Reset (Demo)
                  </button>
                </div>
              )}
            </div>

            {/* Attendance History + Stats */}
            <div className="space-y-5">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { val: present, label: 'Present', color: '#15803d', bg: '#f0fdf4' },
                  { val: total - present, label: 'Absent', color: '#dc2626', bg: '#fef2f2' },
                  { val: `${rate}%`, label: 'Rate', color: '#1b4f8a', bg: '#eff6ff' },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-3 text-center" style={{ backgroundColor: s.bg }}>
                    <div className="text-2xl font-bold" style={{ color: s.color }}>{s.val}</div>
                    <div className="text-xs text-slate-500 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* History Table */}
              <div className="card card-sm">
                <h3 className="font-bold text-slate-800 text-sm mb-3">Attendance History</h3>
                <div className="overflow-hidden rounded-xl border" style={{ borderColor: '#e2e8f0' }}>
                  <table className="data-table">
                    <thead>
                      <tr><th>Session</th><th>Date</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {history.slice(0, 8).map((h, i) => (
                        <tr key={i}>
                          <td className="font-mono text-xs">#{h.session}</td>
                          <td>{h.date}</td>
                          <td>
                            <span className={`badge ${h.status === 'present' ? 'badge-green' : 'badge-red'}`}>
                              {h.status === 'present' ? '✓ Present' : '✗ Absent'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Course Info */}
              <div className="card card-sm" style={{ backgroundColor: '#f8faff', borderColor: '#1b4f8a20' }}>
                <div className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider">Course Details</div>
                {[
                  ['Course', 'Digital Cooperative Management'],
                  ['Code', 'DCM-2026-041'],
                  ['Trainer', 'Dr. Arun Sharma'],
                  ['Duration', '10 Days | Residential'],
                  ['Minimum Attendance', '75% required for certificate'],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-2 text-sm py-1 border-b last:border-0" style={{ borderColor: '#e2e8f0' }}>
                    <span className="text-slate-500 w-36 flex-shrink-0">{k}</span>
                    <span className="font-medium text-slate-800">{v}</span>
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
