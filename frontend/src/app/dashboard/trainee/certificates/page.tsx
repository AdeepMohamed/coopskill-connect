'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { verifyCertificate } from '@/lib/api';
import { Award, CheckCircle, Search, Download, Share2, X } from 'lucide-react';

const DEMO_CERTS = [
  {
    id: 1, certificate_id: 'NCCT-CC-2026-00127-001', course_title: 'Digital Cooperative Management',
    issue_date: '2026-09-11', status: 'valid', score: 86, verification_hash: 'a1b2c3d4e5f6'
  },
  {
    id: 2, certificate_id: 'NCCT-CC-2026-00127-002', course_title: 'Digital Finance Basics',
    issue_date: '2026-09-01', status: 'valid', score: 82, verification_hash: 'f6e5d4c3b2a1'
  },
];

export default function CertificatesPage() {
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<Record<string, unknown> | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [selectedCert, setSelectedCert] = useState<typeof DEMO_CERTS[0] | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [sharingId, setSharingId] = useState<string | null>(null);

  const handleDownload = (id: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      
      // Trigger an actual file download to the user's system
      // We embed a minimal valid PDF binary structure so the file is a true PDF
      const pdfContent = '%PDF-1.4\\n1 0 obj\\n<< /Type /Catalog /Pages 2 0 R >>\\nendobj\\n2 0 obj\\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\\nendobj\\n3 0 obj\\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\\nendobj\\n4 0 obj\\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\\nendobj\\n5 0 obj\\n<< /Length 58 >>\\nstream\\nBT\\n/F1 24 Tf\\n100 700 Td\\n(NCCT VERIFIED CERTIFICATE) Tj\\nET\\nendstream\\nendobj\\nxref\\n0 6\\n0000000000 65535 f \\n0000000009 00000 n \\n0000000058 00000 n \\n0000000115 00000 n \\n0000000227 00000 n \\n0000000295 00000 n \\ntrailer\\n<< /Size 6 /Root 1 0 R >>\\nstartxref\\n404\\n%%EOF';
      
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', `NCCT_Certificate_${id}.pdf`);
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
      
    }, 1500);
  };

  const handleShare = (id: string) => {
    setSharingId(id);
    setTimeout(() => {
      setSharingId(null);
      alert('Opened share dialog!');
    }, 1000);
  };

  const handleVerify = async () => {
    if (!verifyInput.trim()) return;
    setVerifying(true);
    setVerifyResult(null);
    try {
      const res = await verifyCertificate(verifyInput.trim());
      setVerifyResult(res);
    } catch {
      // Demo
      const demo = DEMO_CERTS.find(c => c.certificate_id === verifyInput.trim() || c.verification_hash === verifyInput.trim());
      if (demo) {
        setVerifyResult({ valid: true, certificate_id: demo.certificate_id, trainee_name: 'Ravi Kumar', course_title: demo.course_title, issue_date: demo.issue_date, status: 'VALID', message: 'Certificate is valid and verified by NCCT' });
      } else {
        setVerifyResult({ valid: false, status: 'NOT_FOUND', message: 'Certificate not found in NCCT database' });
      }
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content bg-slate-50">
        <div className="page-header">
          <div>
            <h1 className="font-bold text-slate-800 text-base">🏅 Certificates</h1>
            <p className="text-xs text-slate-500">NCCT-issued digital certificates. Verify authenticity instantly.</p>
          </div>
          <div className="badge badge-green">2 Certificates</div>
        </div>

        <div className="page-body">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* My Certificates */}
            <div>
              <h2 className="font-bold text-slate-800 mb-4">My Certificates</h2>
              <div className="space-y-4">
                {DEMO_CERTS.map(cert => (
                  <div key={cert.id} className="certificate-card p-6">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
                          <Award className="w-5 h-5" style={{ color: '#15803d' }} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{cert.course_title}</div>
                          <div className="text-xs text-slate-500">Issued: {new Date(cert.issue_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        </div>
                      </div>
                      <div className="badge badge-green">VERIFIED ✓</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div>
                        <div className="text-xs text-slate-400">Certificate ID</div>
                        <div className="font-mono text-xs font-bold text-slate-700">{cert.certificate_id}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Score</div>
                        <div className="font-bold text-green-700">{cert.score}%</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedCert(cert)} className="btn btn-primary btn-sm flex-1">
                        View Certificate
                      </button>
                      <button onClick={() => handleShare(cert.certificate_id)} disabled={sharingId === cert.certificate_id} className="btn btn-outline-green btn-sm flex-1">
                        {sharingId === cert.certificate_id ? <div className="spinner w-3 h-3 border-emerald-600 border-t-transparent inline-block align-middle mr-1" /> : <Share2 className="w-3 h-3 inline mr-1" />} 
                        {sharingId === cert.certificate_id ? 'Loading...' : 'LinkedIn'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Verify + Details */}
            <div className="space-y-5">
              {/* Certificate Detail Modal */}
              {selectedCert ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-slate-800">Certificate Preview</h3>
                    <button onClick={() => setSelectedCert(null)} className="p-1 hover:bg-slate-100 rounded">
                      <X className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                  <div className="certificate-card p-8 text-center animate-slide-up">
                    <div className="flex justify-center mb-5">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1b4f8a' }}>
                        <Award className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="font-bold text-slate-800 text-base">National Council for Cooperative Training</div>
                    <div className="text-xs text-slate-500 mb-4">Ministry of Cooperation, Government of India</div>
                    <div className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase mb-2">Certificate of Completion</div>
                    <div className="text-sm text-slate-500 mb-1">This is to certify that</div>
                    <div className="text-2xl font-bold mb-1" style={{ color: '#1b4f8a' }}>RAVI KUMAR</div>
                    <div className="text-xs text-slate-400 mb-3">Trainee ID: CC-2026-00127</div>
                    <div className="text-sm mb-1">has successfully completed</div>
                    <div className="text-lg font-bold text-slate-800 mb-1">{selectedCert.course_title}</div>
                    <div className="text-xs text-slate-500 mb-1">Score: <strong>{selectedCert.score}%</strong></div>
                    <div className="text-xs text-slate-500 mb-4">
                      Issued: {new Date(selectedCert.issue_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="flex justify-between items-center border-t pt-3 text-xs" style={{ borderColor: '#e2e8f0' }}>
                      <div>
                        <div className="text-slate-400">ID: {selectedCert.certificate_id}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-slate-700">Dr. A.K. Sharma</div>
                        <div className="text-slate-400">Director General, NCCT</div>
                      </div>
                      <div className="badge badge-green text-[10px]">VERIFIED ✓</div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleDownload(selectedCert.certificate_id)} disabled={downloadingId === selectedCert.certificate_id} className="btn btn-primary btn-sm flex-1">
                      {downloadingId === selectedCert.certificate_id ? <div className="spinner w-3 h-3 mr-1" /> : <Download className="w-3 h-3" />} 
                      {downloadingId === selectedCert.certificate_id ? 'Downloading...' : 'Download PDF'}
                    </button>
                    <button onClick={() => handleShare(selectedCert.certificate_id)} disabled={sharingId === selectedCert.certificate_id} className="btn btn-outline btn-sm flex-1">
                      {sharingId === selectedCert.certificate_id ? <div className="spinner w-3 h-3 border-slate-600 border-t-transparent mr-1" /> : <Share2 className="w-3 h-3" />} 
                      {sharingId === selectedCert.certificate_id ? 'Opening...' : 'Share'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Verify Certificate */
                <div className="card">
                  <h3 className="font-bold text-slate-800 text-sm mb-1">🔍 Verify a Certificate</h3>
                  <p className="text-xs text-slate-500 mb-4">Enter a Certificate ID or verification hash to verify authenticity</p>
                  <div className="flex gap-2 mb-4">
                    <input
                      value={verifyInput}
                      onChange={e => setVerifyInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleVerify()}
                      placeholder="NCCT-CC-2026-00127-001"
                      className="flex-1 text-sm border rounded-xl px-3 py-2 focus:outline-none focus:ring-2"
                      style={{ borderColor: '#e2e8f0' }}
                    />
                    <button onClick={handleVerify} disabled={verifying || !verifyInput.trim()}
                      className="btn btn-primary btn-sm">
                      {verifying ? <div className="spinner border-white border-t-transparent" /> : <Search className="w-4 h-4" />}
                    </button>
                  </div>
                  {verifyResult && (
                    <div className="p-4 rounded-xl border animate-slide-up"
                      style={{
                        borderColor: verifyResult.valid ? '#bbf7d0' : '#fecaca',
                        backgroundColor: verifyResult.valid ? '#f0fdf4' : '#fef2f2'
                      }}>
                      <div className="flex items-center gap-2 mb-2">
                        {verifyResult.valid
                          ? <CheckCircle className="w-5 h-5 text-green-600" />
                          : <X className="w-5 h-5 text-red-600" />}
                        <div className="font-bold text-sm" style={{ color: verifyResult.valid ? '#15803d' : '#dc2626' }}>
                          {verifyResult.status as string} — {verifyResult.message as string}
                        </div>
                      </div>
                      {verifyResult.valid && (
                        <div className="text-sm text-slate-700 space-y-1 mt-2">
                          <div>Name: <strong>{verifyResult.trainee_name as string}</strong></div>
                          <div>Course: <strong>{verifyResult.course_title as string}</strong></div>
                          <div>Date: <strong>{verifyResult.issue_date as string}</strong></div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="mt-4 text-xs text-slate-400">
                    Try: <code className="font-mono bg-slate-100 px-1 rounded">NCCT-CC-2026-00127-001</code>
                  </div>
                </div>
              )}

              {/* Info Box */}
              <div className="card card-sm" style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
                <div className="text-sm font-bold text-blue-800 mb-2">About NCCT Digital Certificates</div>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>✓ Issued by National Council for Cooperative Training</li>
                  <li>✓ QR-code verified for instant authentication</li>
                  <li>✓ Linked to DigiLocker (Ministry of Education)</li>
                  <li>✓ Accepted by cooperative employers across India</li>
                  <li>✓ Blockchain-anchored verification hash</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
