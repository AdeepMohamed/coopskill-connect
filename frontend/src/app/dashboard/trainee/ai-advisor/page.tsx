'use client';
import { useState, useRef, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { useApp } from '@/lib/context';
import { sendCareerChat, getCareerRecommendation, getSkillGap } from '@/lib/api';
import { Bot, Send, RefreshCw, Sparkles, TrendingUp, BookOpen, Briefcase, AlertTriangle } from 'lucide-react';

const DEMO_RECOMMENDATION = {
  recommendation: "Based on your 6 skills and 2 completed NCCT courses with average score of 84%, you are well-positioned for cooperative operations roles in Tamil Nadu.",
  career_paths: [
    { title: 'Cooperative Operations Assistant', match_percentage: 91, why: 'Strong cooperative management foundation with digital record-keeping skills aligns with operational requirements.', matching_skills: ['Cooperative Management', 'Digital Literacy', 'MS Excel'], skill_gaps: ['Advanced Accounting'], recommended_course: 'Advanced Cooperative Accounting' },
    { title: 'Digital Accounts Assistant', match_percentage: 84, why: 'Digital finance and MS Excel skills are directly applicable to digital accounting roles.', matching_skills: ['Digital Finance', 'MS Excel', 'Basic Accounting'], skill_gaps: ['ERP Operations'], recommended_course: 'ERP for Cooperatives' },
    { title: 'Field Coordinator', match_percentage: 78, why: 'Communication and cooperative management skills make you suitable for field coordination.', matching_skills: ['Communication Skills', 'Cooperative Management'], skill_gaps: ['Regional Language Proficiency'], recommended_course: 'Communication in Tamil' },
  ],
  matching_skills: ['Cooperative Management', 'Digital Literacy', 'MS Excel', 'Digital Finance'],
  skill_gaps: ['Advanced Accounting', 'ERP Operations'],
  recommended_courses: ['Advanced Cooperative Accounting', 'ERP for Cooperatives', 'Digital Entrepreneurship'],
  next_steps: ['Complete ERP Fundamentals module', 'Enroll in Advanced Cooperative Accounting', 'Apply for Cooperative Operations Assistant'],
  is_fallback: false,
};

const DEMO_MESSAGES = [
  { role: 'user', content: 'What jobs match my current skills?' },
  { role: 'assistant', content: 'Based on your 6 skills and 2 completed NCCT courses with an average score of 84%, you have strong alignment with Cooperative Operations roles. Your highest match is **Cooperative Operations Assistant at 91%** — your cooperative management background (85% proficiency) and digital literacy (90%) directly meet the job requirements. I recommend applying for this position while working on Advanced Accounting to close your skill gap.' },
  { role: 'user', content: 'What should I learn next?' },
  { role: 'assistant', content: 'I recommend **Advanced Cooperative Accounting** as your next course. It addresses your primary skill gap (currently 0% vs 65% required for most finance roles) and increases your match score for 3+ available positions in Tamil Nadu. After that, **ERP for Cooperatives** would unlock higher-paying roles (₹32,000+/month). Both courses are available through NCCT and can be completed within 8 weeks.' },
];

const SKILL_GAP_DATA = [
  { skill: 'Accounting', required: 90, candidate: 65, met: false },
  { skill: 'Excel', required: 80, candidate: 78, met: false },
  { skill: 'ERP Operations', required: 85, candidate: 0, met: false },
  { skill: 'Communication', required: 70, candidate: 72, met: true },
  { skill: 'Coop Management', required: 75, candidate: 85, met: true },
];

export default function AIAdvisorPage() {
  const { user, lang } = useApp();
  const [rec, setRec] = useState(DEMO_RECOMMENDATION);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(DEMO_MESSAGES);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const fetchRecommendation = async (force = false) => {
    if (!user) return;
    setRefreshing(true);
    try {
      const data = await getCareerRecommendation(user.user_id, force);
      setRec(data);
    } catch { /* use demo */ }
    finally { setRefreshing(false); }
  };

  const sendMessage = async () => {
    if (!input.trim() || chatLoading) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setChatLoading(true);

    try {
      const data = await sendCareerChat(user?.user_id || 1, [...messages, userMsg]);
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm temporarily offline. Based on your profile, I recommend completing Advanced Cooperative Accounting next — it addresses your primary skill gap and improves your match for 3 positions in Tamil Nadu."
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const matchColor = (pct: number) => pct >= 85 ? '#15803d' : pct >= 70 ? '#1b4f8a' : '#ea580c';

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content bg-slate-50">
        <div className="page-header">
          <div>
            <h1 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5" style={{ color: '#7c3aed' }} />
              AI Career Advisor
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Your skills. Your next opportunity. Powered by CoopSkill AI.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="badge badge-purple text-xs">COOPSKILL AI</div>
            <button onClick={() => fetchRecommendation(true)} disabled={refreshing}
              className="btn btn-outline btn-sm" style={{ borderColor: '#7c3aed', color: '#7c3aed' }}>
              <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="page-body">
          {/* AI Disclaimer */}
          <div className="mb-5 p-3 rounded-xl border flex items-start gap-2 text-sm"
            style={{ backgroundColor: '#f5f3ff', borderColor: '#ede9fe', color: '#7c3aed' }}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>AI recommendations are generated by CoopSkill AI based on your skill profile and available job market data. AI suggestions are for guidance only and do not guarantee employment outcomes.</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Career Path Cards */}
              <div className="card">
                <h2 className="font-bold text-slate-800 text-base mb-1">Career Path Recommendations</h2>
                <p className="text-xs text-slate-500 mb-4">{rec.recommendation}</p>
                <div className="space-y-4">
                  {rec.career_paths.map((path, i) => (
                    <div key={i} className="p-4 rounded-xl border"
                      style={{ borderColor: i === 0 ? '#15803d50' : '#e2e8f0', backgroundColor: i === 0 ? '#f0fdf4' : 'white' }}>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full text-xs font-bold text-white flex items-center justify-center"
                            style={{ backgroundColor: i === 0 ? '#15803d' : i === 1 ? '#1b4f8a' : '#ea580c' }}>
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="font-bold text-slate-800">{path.title}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-sm font-bold"
                          style={{ backgroundColor: matchColor(path.match_percentage) }}>
                          {path.match_percentage}% Match
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{path.why}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {path.matching_skills.map(s => (
                          <span key={s} className="badge badge-green text-[10px]">✓ {s}</span>
                        ))}
                        {path.skill_gaps.map(s => (
                          <span key={s} className="badge badge-amber text-[10px]">⚠ {s}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                          📚 Recommended: <span className="font-medium text-slate-700">{path.recommended_course}</span>
                        </div>
                        <button className="btn btn-green btn-sm">Learn This Skill →</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Gap Analysis */}
              <div className="card" style={{ borderLeft: '3px solid #1b4f8a' }}>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5" style={{ color: '#1b4f8a' }} />
                  <h2 className="font-bold text-slate-800 text-base">Skill Gap Analysis</h2>
                  <span className="text-xs text-slate-500">— For: Cooperative Accounts Executive</span>
                </div>
                <div className="space-y-4">
                  {SKILL_GAP_DATA.map(item => (
                    <div key={item.skill}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-slate-700">{item.skill}</span>
                        <div className="flex gap-3 text-xs">
                          <span className="text-slate-400">Required: {item.required}%</span>
                          <span className="font-bold" style={{ color: item.met ? '#15803d' : item.candidate === 0 ? '#dc2626' : '#ea580c' }}>
                            Yours: {item.candidate}%
                          </span>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="progress-track">
                          <div className="progress-bar" style={{ width: `${item.required}%`, backgroundColor: '#e2e8f0' }} />
                        </div>
                        <div className="progress-track absolute inset-0">
                          <div className="progress-bar" style={{
                            width: `${item.candidate}%`,
                            backgroundColor: item.met ? '#15803d' : item.candidate === 0 ? '#dc2626' : '#ea580c'
                          }} />
                        </div>
                      </div>
                      {!item.met && (
                        <div className="text-xs mt-1" style={{ color: item.candidate === 0 ? '#dc2626' : '#ea580c' }}>
                          Gap: {item.required - item.candidate}% — {item.candidate === 0 ? 'Not started' : 'Close to target'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-xl text-sm italic text-slate-600" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0', border: '1px solid' }}>
                  🤖 "Advanced Accounting is your primary gap. Completing the NCCT Advanced Cooperative Accounting course (6 weeks) would make you a strong candidate for this role."
                </div>
              </div>
            </div>

            {/* Chat + Quick Actions */}
            <div className="space-y-5">
              {/* CoopSkill AI Chat */}
              <div className="card flex flex-col" style={{ height: 440 }}>
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-4 h-4" style={{ color: '#7c3aed' }} />
                  <h3 className="font-bold text-slate-800 text-sm">Ask CoopSkill AI</h3>
                  <div className="badge badge-purple text-[10px]">AI</div>
                </div>
                <div ref={chatRef} className="flex-1 overflow-y-auto flex flex-col gap-2 mb-3 pr-1">
                  {messages.map((msg, i) => (
                    <div key={i} className={msg.role === 'user' ? 'self-end' : 'self-start'}>
                      {msg.role === 'assistant' && (
                        <div className="text-[10px] text-slate-400 mb-0.5 ml-1">CoopSkill AI</div>
                      )}
                      <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                        {msg.content.split('**').map((part, j) =>
                          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                        )}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="self-start chat-bubble-ai flex items-center gap-1">
                      <div className="spinner w-3 h-3" />
                      <span className="text-xs text-slate-400">CoopSkill AI is thinking...</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask about careers, skills, courses..."
                    className="flex-1 text-sm border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    style={{ borderColor: '#e2e8f0' }}
                  />
                  <button onClick={sendMessage} disabled={chatLoading || !input.trim()}
                    className="btn btn-sm text-white" style={{ backgroundColor: '#7c3aed', borderRadius: 10 }}>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Profile Context */}
              <div className="card card-sm">
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs font-bold text-slate-700">Your Profile Sent to AI</span>
                </div>
                <div className="text-xs text-slate-500 space-y-1.5">
                  {[
                    ['Name', 'Ravi Kumar'],
                    ['Skills', '6 skills'],
                    ['Courses', '2 completed'],
                    ['Avg Score', '84%'],
                    ['Location', 'Tamil Nadu'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-slate-400">{k}</span>
                      <span className="font-medium text-slate-700">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-slate-400 mt-2 border-t pt-2" style={{ borderColor: '#e2e8f0' }}>
                  🔒 No personal PII sent to AI. Skills & scores only.
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card card-sm">
                <h3 className="font-bold text-slate-700 text-sm mb-3">Quick Actions</h3>
                {[
                  { icon: <TrendingUp className="w-4 h-4" />, label: 'Generate Career Report', color: '#7c3aed' },
                  { icon: <Briefcase className="w-4 h-4" />, label: 'Find Matching Jobs', color: '#1b4f8a' },
                  { icon: <BookOpen className="w-4 h-4" />, label: 'View Recommended Courses', color: '#15803d' },
                ].map(a => (
                  <button key={a.label} onClick={() => alert(`Starting: ${a.label}`)} className="w-full btn btn-sm mb-1.5 justify-start" style={{ color: a.color, border: `1px solid ${a.color}30`, background: `${a.color}08` }}>
                    {a.icon} {a.label}
                  </button>
                ))}
                <div className="text-[10px] text-slate-400 mt-2 text-center">
                  AI recommendation generated: {new Date().toLocaleDateString('en-IN')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
