/**
 * CoopSkill Connect API Client
 * All backend communication. NEVER directly calls Gemini.
 * Gemini calls go through FastAPI backend only.
 */
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Auth ──────────────────────────────────────────────────────────────────────

export const demoLogin = async (role: string) => {
  const res = await api.post('/api/auth/demo-login', { role });
  return res.data;
};

// ── Trainee ───────────────────────────────────────────────────────────────────

export const getTraineeDashboard = async (traineeId: number) => {
  const res = await api.get(`/api/trainees/${traineeId}/dashboard`);
  return res.data;
};

export const getTraineeProfile = async (traineeId: number) => {
  const res = await api.get(`/api/trainees/${traineeId}/profile`);
  return res.data;
};

export const getTraineeSkills = async (traineeId: number) => {
  const res = await api.get(`/api/trainees/${traineeId}/skills`);
  return res.data;
};

// ── Courses ───────────────────────────────────────────────────────────────────

export const listCourses = async () => {
  const res = await api.get('/api/courses/');
  return res.data;
};

export const getCourse = async (courseId: number) => {
  const res = await api.get(`/api/courses/${courseId}`);
  return res.data;
};

export const enrollCourse = async (traineeId: number, courseId: number) => {
  const res = await api.post('/api/courses/enroll', { trainee_id: traineeId, course_id: courseId });
  return res.data;
};

export const updateProgress = async (traineeId: number, courseId: number, progress: number, currentModule: number) => {
  const res = await api.put('/api/courses/progress', {
    trainee_id: traineeId, course_id: courseId, progress, current_module: currentModule
  });
  return res.data;
};

export const getEnrollments = async (traineeId: number) => {
  const res = await api.get(`/api/courses/${traineeId}/enrollments`);
  return res.data;
};

// ── Attendance ────────────────────────────────────────────────────────────────

export const recordQRAttendance = async (traineeId: number, courseId: number) => {
  const res = await api.post('/api/attendance/qr-scan', { trainee_id: traineeId, course_id: courseId });
  return res.data;
};

export const getAttendanceSummary = async (traineeId: number, courseId?: number) => {
  const params = courseId ? `?course_id=${courseId}` : '';
  const res = await api.get(`/api/attendance/${traineeId}/summary${params}`);
  return res.data;
};

// ── Assessments ───────────────────────────────────────────────────────────────

export const getAssessment = async (assessmentId: number) => {
  const res = await api.get(`/api/assessments/${assessmentId}`);
  return res.data;
};

export const submitAssessment = async (assessmentId: number, traineeId: number, answers: Record<string, string>) => {
  const res = await api.post(`/api/assessments/${assessmentId}/submit`, {
    trainee_id: traineeId, answers
  });
  return res.data;
};

// ── Certificates ──────────────────────────────────────────────────────────────

export const generateCertificate = async (traineeId: number, courseId: number, score: number) => {
  const res = await api.post('/api/certificates/generate', { trainee_id: traineeId, course_id: courseId, score });
  return res.data;
};

export const verifyCertificate = async (certIdOrHash: string) => {
  const res = await api.get(`/api/certificates/verify/${certIdOrHash}`);
  return res.data;
};

export const getTraineeCertificates = async (traineeId: number) => {
  const res = await api.get(`/api/certificates/${traineeId}/list`);
  return res.data;
};

// ── Jobs ──────────────────────────────────────────────────────────────────────

export const listJobs = async () => {
  const res = await api.get('/api/jobs/');
  return res.data;
};

export const getJob = async (jobId: number) => {
  const res = await api.get(`/api/jobs/${jobId}`);
  return res.data;
};

export const applyForJob = async (traineeId: number, jobId: number, matchScore?: number) => {
  const res = await api.post('/api/jobs/apply', {
    trainee_id: traineeId, job_id: jobId, ai_match_score: matchScore
  });
  return res.data;
};

export const createJob = async (jobData: Record<string, unknown>) => {
  const res = await api.post('/api/jobs/create', jobData);
  return res.data;
};

// ── Employer ──────────────────────────────────────────────────────────────────

export const getEmployerDashboard = async (employerId: number) => {
  const res = await api.get(`/api/employers/${employerId}/dashboard`);
  return res.data;
};

export const getMatchedCandidates = async (employerId: number, jobId: number) => {
  const res = await api.get(`/api/employers/${employerId}/candidates/${jobId}`);
  return res.data;
};

export const shortlistCandidate = async (applicationId: number) => {
  const res = await api.post('/api/employers/shortlist', { application_id: applicationId });
  return res.data;
};

// ── AI (Gemini via backend) ───────────────────────────────────────────────────

export const getCareerRecommendation = async (traineeId: number, forceRefresh = false) => {
  const res = await api.post('/api/ai/career-recommendation', {
    trainee_id: traineeId, force_refresh: forceRefresh
  });
  return res.data;
};

export const getSkillGap = async (traineeId: number, jobId: number) => {
  const res = await api.post('/api/ai/skill-gap', { trainee_id: traineeId, job_id: jobId });
  return res.data;
};

export const getCourseRecommendations = async (traineeId: number) => {
  const res = await api.post('/api/ai/course-recommendation', { trainee_id: traineeId });
  return res.data;
};

export const getJobMatch = async (traineeId: number, jobId: number) => {
  const res = await api.post('/api/ai/job-match', { trainee_id: traineeId, job_id: jobId });
  return res.data;
};

export const sendCareerChat = async (traineeId: number, messages: Array<{ role: string; content: string }>) => {
  const res = await api.post('/api/ai/chat', { trainee_id: traineeId, messages });
  return res.data;
};

export const getSkillDemandIntelligence = async () => {
  const res = await api.get('/api/ai/skill-demand');
  return res.data;
};

// ── Analytics ─────────────────────────────────────────────────────────────────

export const getAdminMetrics = async () => {
  const res = await api.get('/api/analytics/admin/metrics');
  return res.data;
};

// ── Offline/Sync ──────────────────────────────────────────────────────────────

export const syncOfflineData = async (traineeId: number, offlineData: Record<string, unknown[]>) => {
  const res = await api.post('/api/offline/sync', { trainee_id: traineeId, ...offlineData });
  return res.data;
};

export const getOfflineStatus = async () => {
  const res = await api.get('/api/offline/status');
  return res.data;
};

export default api;
