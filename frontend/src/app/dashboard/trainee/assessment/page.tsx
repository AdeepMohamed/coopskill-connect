'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { useApp } from '@/lib/context';
import { submitAssessment, generateCertificate } from '@/lib/api';
import { ClipboardList, CheckCircle, X, Award, ChevronRight, BookOpen } from 'lucide-react';

const ASSESSMENT = {
  id: 1,
  title: 'Digital Cooperative Management — Final Assessment',
  description: 'Comprehensive test covering cooperative management and digital tools. 5 questions. Passing score: 60%',
  passing_score: 60,
  course_title: 'Digital Cooperative Management',
  course_id: 1,
  questions: [
    {
      id: 1, order: 1,
      question: 'Which system helps a cooperative centrally manage training programmes and trainee records?',
      option_a: 'Paper register', option_b: 'ERP System', option_c: 'Notice board', option_d: 'Manual spreadsheet',
      correct_answer: 'B',
      explanation: 'An Enterprise Resource Planning (ERP) system integrates all management functions in one platform.',
    },
    {
      id: 2, order: 2,
      question: "What does the acronym 'NCCT' stand for?",
      option_a: 'National College of Cooperative Training', option_b: 'National Council for Cooperative Training',
      option_c: 'National Centre for Cooperative Technology', option_d: 'National Cooperative Commerce Training',
      correct_answer: 'B',
      explanation: 'NCCT stands for National Council for Cooperative Training, under Ministry of Cooperation.',
    },
    {
      id: 3, order: 3,
      question: 'Which Indian government ministry oversees cooperative development?',
      option_a: 'Ministry of Agriculture', option_b: 'Ministry of Commerce',
      option_c: 'Ministry of Cooperation', option_d: 'Ministry of Finance',
      correct_answer: 'C',
      explanation: 'The Ministry of Cooperation was established in 2021 to provide a separate framework for cooperatives.',
    },
    {
      id: 4, order: 4,
      question: 'In a cooperative society, who holds the ultimate authority?',
      option_a: 'The Board of Directors', option_b: 'The CEO',
      option_c: 'The General Body of Members', option_d: 'The Government',
      correct_answer: 'C',
      explanation: 'In a cooperative, the General Body comprising all members holds ultimate authority through democratic voting.',
    },
    {
      id: 5, order: 5,
      question: 'What is the primary purpose of a cooperative society?',
      option_a: 'To maximize profit for shareholders', option_b: 'To serve the collective needs of its members',
      option_c: 'To compete with private enterprises', option_d: 'To provide government services',
      correct_answer: 'B',
      explanation: 'Cooperatives are formed to serve the collective economic, social and cultural needs of their members.',
    },
  ],
};

type Phase = 'intro' | 'taking' | 'result' | 'cert';

export default function AssessmentPage() {
  const { user } = useApp();
  const [phase, setPhase] = useState<Phase>('intro');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [certId, setCertId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [current, setCurrent] = useState(0);

  const handleAnswer = (qId: number, option: string) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      let res;
      const strAnswers: Record<string, string> = {};
      Object.entries(answers).forEach(([k, v]) => { strAnswers[k] = v; });

      if (user) {
        res = await submitAssessment(ASSESSMENT.id, user.user_id, strAnswers);
      } else {
        // Demo calculation
        let correct = 0;
        ASSESSMENT.questions.forEach(q => {
          if (strAnswers[q.id] === q.correct_answer) correct++;
        });
        const score = (correct / ASSESSMENT.questions.length) * 100;
        res = {
          score,
          passed: score >= ASSESSMENT.passing_score,
          correct_count: correct,
          total_questions: ASSESSMENT.questions.length,
          status: score >= ASSESSMENT.passing_score ? 'passed' : 'failed',
          detailed_results: ASSESSMENT.questions.map(q => ({
            question_id: q.id,
            question: q.question,
            submitted: strAnswers[q.id],
            correct_answer: q.correct_answer,
            is_correct: strAnswers[q.id] === q.correct_answer,
            explanation: q.explanation,
          })),
          skill_updates: [
            { skill: 'Cooperative Management', old: 85, new: 88, gain: 3 },
            { skill: 'Digital Literacy', old: 90, new: 92, gain: 2 },
          ],
          certificate_eligible: score >= ASSESSMENT.passing_score,
        };
      }
      setResult(res);
      setPhase('result');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateCert = async () => {
    try {
      let res;
      if (user) {
        res = await generateCertificate(user.user_id, ASSESSMENT.course_id, (result as Record<string, number>).score);
      } else {
        res = { certificate_id: 'NCCT-CC-2026-00127-001', course_title: 'Digital Cooperative Management' };
      }
      setCertId(res.certificate_id);
      setPhase('cert');
    } catch {
      setCertId('NCCT-CC-2026-00127-001');
      setPhase('cert');
    }
  };

  const q = ASSESSMENT.questions[current];
  const progress = ((current + 1) / ASSESSMENT.questions.length) * 100;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content bg-slate-50">
        <div className="page-header">
          <div>
            <h1 className="font-bold text-slate-800 text-base">📋 Assessments</h1>
            <p className="text-xs text-slate-500">Test your knowledge and earn NCCT skill credits</p>
          </div>
        </div>

        <div className="page-body max-w-3xl">
          {/* INTRO */}
          {phase === 'intro' && (
            <div className="card animate-slide-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#eff6ff' }}>
                  <ClipboardList className="w-6 h-6" style={{ color: '#1b4f8a' }} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-800">{ASSESSMENT.title}</h2>
                  <div className="text-xs text-slate-500">{ASSESSMENT.course_title}</div>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-6">{ASSESSMENT.description}</p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: 'Questions', val: ASSESSMENT.questions.length },
                  { label: 'Passing Score', val: `${ASSESSMENT.passing_score}%` },
                  { label: 'Certificate', val: 'On Pass ✓' },
                ].map(s => (
                  <div key={s.label} className="text-center p-3 rounded-xl" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div className="font-bold text-slate-800 text-lg">{s.val}</div>
                    <div className="text-xs text-slate-500">{s.label}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => setPhase('taking')} className="btn btn-primary w-full btn-lg">
                <BookOpen className="w-5 h-5" /> Start Assessment
              </button>
            </div>
          )}

          {/* TAKING */}
          {phase === 'taking' && (
            <div className="card animate-slide-up">
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs font-semibold text-slate-500">Question {current + 1} of {ASSESSMENT.questions.length}</div>
                <div className="text-xs font-bold" style={{ color: '#1b4f8a' }}>{Math.round(progress)}%</div>
              </div>
              <div className="progress-track mb-6">
                <div className="progress-bar" style={{ width: `${progress}%`, backgroundColor: '#1b4f8a' }} />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-5 leading-relaxed">{q.question}</h3>
              <div className="space-y-3 mb-8">
                {(['A', 'B', 'C', 'D'] as const).map(opt => {
                  const val = q[`option_${opt.toLowerCase()}` as keyof typeof q] as string;
                  const selected = answers[q.id] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(q.id, opt)}
                      className="w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-sm"
                      style={{
                        borderColor: selected ? '#1b4f8a' : '#e2e8f0',
                        backgroundColor: selected ? '#eff6ff' : 'white',
                        color: selected ? '#1b4f8a' : '#374151',
                      }}
                    >
                      <span className="font-bold mr-3">{opt}.</span>{val}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3">
                {current > 0 && (
                  <button onClick={() => setCurrent(c => c - 1)} className="btn btn-outline flex-1">← Previous</button>
                )}
                {current < ASSESSMENT.questions.length - 1 ? (
                  <button onClick={() => setCurrent(c => c + 1)} disabled={!answers[q.id]}
                    className="btn btn-primary flex-1">
                    Next Question →
                  </button>
                ) : (
                  <button onClick={handleSubmit}
                    disabled={Object.keys(answers).length < ASSESSMENT.questions.length || submitting}
                    className="btn btn-green flex-1 btn-lg">
                    {submitting ? <><div className="spinner border-white" /> Submitting...</> : 'Submit Assessment ✓'}
                  </button>
                )}
              </div>
              <div className="flex gap-1 mt-4 justify-center">
                {ASSESSMENT.questions.map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full cursor-pointer transition-colors"
                    onClick={() => setCurrent(i)}
                    style={{ backgroundColor: answers[ASSESSMENT.questions[i].id] ? '#15803d' : i === current ? '#1b4f8a' : '#e2e8f0' }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* RESULT */}
          {phase === 'result' && result && (
            <div className="card animate-slide-up text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: (result as Record<string, boolean>).passed ? '#f0fdf4' : '#fef2f2' }}>
                {(result as Record<string, boolean>).passed
                  ? <CheckCircle className="w-10 h-10 text-green-600" />
                  : <X className="w-10 h-10 text-red-600" />
                }
              </div>
              <h2 className="text-2xl font-bold mb-2"
                style={{ color: (result as Record<string, boolean>).passed ? '#15803d' : '#dc2626' }}>
                {(result as Record<string, boolean>).passed ? 'PASSED ✓' : 'NOT PASSED ✗'}
              </h2>
              <div className="text-5xl font-bold mb-1" style={{ color: '#1b4f8a' }}>
                {Math.round(result.score as number)}%
              </div>
              <p className="text-slate-500 mb-6">
                {result.correct_count as number} of {result.total_questions as number} questions correct
              </p>

              {/* Skill updates */}
              {((result.skill_updates as unknown[]) || []).length > 0 && (
                <div className="text-left mb-6 p-4 rounded-xl" style={{ backgroundColor: '#f0fdf4' }}>
                  <div className="text-sm font-bold text-green-700 mb-2">Skill Profile Updated ✓</div>
                  {(result.skill_updates as Array<{ skill: string; old: number; new: number; gain: number }>).map(u => (
                    <div key={u.skill} className="flex justify-between text-sm text-slate-700 py-1">
                      <span>{u.skill}</span>
                      <span className="font-bold text-green-700">{u.old}% → {u.new}% (+{u.gain}%)</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Detailed results */}
              <div className="text-left mb-6">
                <div className="text-sm font-bold text-slate-700 mb-3">Detailed Results</div>
                {(result.detailed_results as Array<{ question_id: number; question: string; submitted: string; correct_answer: string; is_correct: boolean; explanation: string }>).map((r, i) => (
                  <div key={i} className="p-3 rounded-xl border mb-2"
                    style={{ borderColor: r.is_correct ? '#bbf7d0' : '#fecaca', backgroundColor: r.is_correct ? '#f0fdf4' : '#fef2f2' }}>
                    <div className="flex items-start gap-2">
                      {r.is_correct ? <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        : <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />}
                      <div>
                        <div className="text-xs font-medium text-slate-700 mb-0.5">{r.question}</div>
                        {!r.is_correct && (
                          <div className="text-xs text-slate-500">
                            Your answer: <strong>{r.submitted}</strong> | Correct: <strong>{r.correct_answer}</strong>
                          </div>
                        )}
                        {r.explanation && <div className="text-xs text-slate-500 italic mt-0.5">{r.explanation}</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setPhase('intro'); setAnswers({}); setCurrent(0); }} className="btn btn-outline flex-1">
                  Retake
                </button>
                {(result as Record<string, boolean>).passed && (
                  <button onClick={handleGenerateCert} className="btn btn-green flex-1">
                    <Award className="w-4 h-4" /> Generate Certificate
                  </button>
                )}
              </div>
            </div>
          )}

          {/* CERTIFICATE */}
          {phase === 'cert' && certId && (
            <div className="animate-slide-up">
              <div className="certificate-card p-8 mb-4 text-center">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1b4f8a' }}>
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-800">National Council for Cooperative Training</div>
                    <div className="text-xs text-slate-500">Ministry of Cooperation, Government of India</div>
                  </div>
                </div>
                <div className="text-xs font-bold tracking-[0.3em] text-slate-400 uppercase mb-2">Certificate of Completion</div>
                <div className="text-sm text-slate-500 mb-2">This is to certify that</div>
                <div className="text-3xl font-bold mb-1" style={{ color: '#1b4f8a' }}>RAVI KUMAR</div>
                <div className="text-xs text-slate-500 mb-4">Trainee ID: CC-2026-00127</div>
                <div className="text-sm text-slate-600 mb-1">has successfully completed</div>
                <div className="text-xl font-bold text-slate-800 mb-1">Digital Cooperative Management</div>
                <div className="text-sm text-slate-500 mb-6">10-Day Residential Programme | Score: 86%</div>
                <div className="flex justify-between items-end border-t pt-4" style={{ borderColor: '#e2e8f0' }}>
                  <div className="text-left">
                    <div className="text-xs text-slate-400">Certificate ID</div>
                    <div className="text-xs font-mono font-bold text-slate-700">{certId}</div>
                    <div className="text-xs text-slate-400 mt-1">Issued: {new Date().toLocaleDateString('en-IN')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-slate-700">Dr. A.K. Sharma</div>
                    <div className="text-xs text-slate-400">Director General, NCCT</div>
                  </div>
                  <div className="badge badge-green">VERIFIED ✓</div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="btn btn-primary flex-1">📥 Download PDF</button>
                <button className="btn btn-green flex-1">🔗 Share</button>
                <button onClick={() => setPhase('intro')} className="btn btn-outline">Done</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
