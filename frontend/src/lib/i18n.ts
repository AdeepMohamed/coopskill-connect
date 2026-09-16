/**
 * Internationalization (i18n) support for English, Tamil, and Hindi
 */

export type Language = 'en' | 'ta' | 'hi';

export const translations = {
  en: {
    // Nav
    dashboard: 'Dashboard',
    myLearning: 'My Learning',
    attendance: 'Attendance',
    assessments: 'Assessments',
    certificates: 'Certificates',
    aiAdvisor: 'AI Career Advisor',
    employment: 'Employment',
    myProfile: 'My Profile',
    ruralEdge: 'Rural Learning Edge',
    logout: 'Logout',
    // Dashboard
    goodMorning: 'Good Morning',
    goodAfternoon: 'Good Afternoon',
    goodEvening: 'Good Evening',
    learningProgress: 'Learning Progress',
    attendanceRate: 'Attendance',
    skillsAcquired: 'Skills',
    certificatesIssued: 'Certificates',
    jobMatches: 'Job Matches',
    continueLearning: 'Continue Learning',
    viewAIRecommendation: 'View AI Recommendation',
    // LMS
    markComplete: 'Mark Complete',
    downloadOffline: 'Download for Offline',
    nextModule: 'Next Module',
    // Attendance
    simulateQRScan: 'Simulate QR Scan',
    attendanceRecorded: 'Attendance Recorded ✓',
    // Assessment
    submitAssessment: 'Submit Assessment',
    passed: 'PASSED ✓',
    failed: 'FAILED ✗',
    // Certificate
    generateCertificate: 'Generate Certificate',
    verifyCertificate: 'Verify Certificate',
    downloadPDF: 'Download PDF',
    // Jobs
    applyNow: 'Apply Now',
    applied: 'Applied ✓',
    skillMatch: 'Skill Match',
    // AI
    askGemini: 'Ask about careers, skills, or courses...',
    sendMessage: 'Send',
    generatingAI: 'Gemini is analyzing your profile...',
    // Offline
    simulateOutage: 'Simulate Internet Outage',
    restoreInternet: 'Restore Internet',
    syncComplete: 'SYNC COMPLETE ✓',
    // Common
    loading: 'Loading...',
    error: 'Something went wrong',
    retry: 'Retry',
    save: 'Save',
    cancel: 'Cancel',
    back: 'Back',
  },
  ta: {
    // Nav
    dashboard: 'டாஷ்போர்டு',
    myLearning: 'என் கற்றல்',
    attendance: 'வருகை',
    assessments: 'மதிப்பீட்டு',
    certificates: 'சான்றிதழ்கள்',
    aiAdvisor: 'AI தொழில் ஆலோசகர்',
    employment: 'வேலைவாய்ப்பு',
    myProfile: 'என் சுயவிவரம்',
    ruralEdge: 'கிராம கற்றல் எட்ஜ்',
    logout: 'வெளியேறு',
    // Dashboard
    goodMorning: 'காலை வணக்கம்',
    goodAfternoon: 'மதிய வணக்கம்',
    goodEvening: 'மாலை வணக்கம்',
    learningProgress: 'கற்றல் முன்னேற்றம்',
    attendanceRate: 'வருகை விகிதம்',
    skillsAcquired: 'திறன்கள்',
    certificatesIssued: 'சான்றிதழ்கள்',
    jobMatches: 'வேலை பொருத்தங்கள்',
    continueLearning: 'தொடர்ந்து கற்றல்',
    viewAIRecommendation: 'AI பரிந்துரை காண்க',
    // LMS
    markComplete: 'முடிந்தது என குறிக்கவும்',
    downloadOffline: 'ஆஃப்லைன் பதிவிறக்கம்',
    nextModule: 'அடுத்த பாடம்',
    // Attendance
    simulateQRScan: 'QR ஸ்கான் செய்',
    attendanceRecorded: 'வருகை பதிவாகியது ✓',
    // Assessment
    submitAssessment: 'மதிப்பீடு சமர்ப்பி',
    passed: 'தேர்ச்சி ✓',
    failed: 'தோல்வி ✗',
    // Certificate
    generateCertificate: 'சான்றிதழ் உருவாக்கு',
    verifyCertificate: 'சான்றிதழ் சரிபார்',
    downloadPDF: 'PDF பதிவிறக்கம்',
    // Jobs
    applyNow: 'இப்போது விண்ணப்பி',
    applied: 'விண்ணப்பிக்கப்பட்டது ✓',
    skillMatch: 'திறன் பொருத்தம்',
    // AI
    askGemini: 'தொழில், திறன்கள் பற்றி கேளுங்கள்...',
    sendMessage: 'அனுப்பு',
    generatingAI: 'Gemini உங்கள் சுயவிவரத்தை பகுப்பாய்கிறது...',
    // Offline
    simulateOutage: 'இணைய தடை உருவகப்படுத்து',
    restoreInternet: 'இணையம் மீட்டமை',
    syncComplete: 'ஒத்திசைவு முடிந்தது ✓',
    // Common
    loading: 'ஏற்றுகிறது...',
    error: 'பிழை ஏற்பட்டது',
    retry: 'மீண்டும் முயற்சி',
    save: 'சேமி',
    cancel: 'ரத்துசெய்',
    back: 'பின்செல்',
  },
  hi: {
    // Nav
    dashboard: 'डैशबोर्ड',
    myLearning: 'मेरी सीख',
    attendance: 'उपस्थिति',
    assessments: 'मूल्यांकन',
    certificates: 'प्रमाणपत्र',
    aiAdvisor: 'AI कैरियर सलाहकार',
    employment: 'रोजगार',
    myProfile: 'मेरी प्रोफ़ाइल',
    ruralEdge: 'ग्रामीण लर्निंग एज',
    logout: 'लॉग आउट',
    // Dashboard
    goodMorning: 'सुप्रभात',
    goodAfternoon: 'नमस्कार',
    goodEvening: 'शुभ संध्या',
    learningProgress: 'सीखने की प्रगति',
    attendanceRate: 'उपस्थिति',
    skillsAcquired: 'कौशल',
    certificatesIssued: 'प्रमाणपत्र',
    jobMatches: 'नौकरी मिलान',
    continueLearning: 'सीखना जारी रखें',
    viewAIRecommendation: 'AI सुझाव देखें',
    // LMS
    markComplete: 'पूर्ण करें',
    downloadOffline: 'ऑफलाइन डाउनलोड',
    nextModule: 'अगला मॉड्यूल',
    // Attendance
    simulateQRScan: 'QR स्कैन करें',
    attendanceRecorded: 'उपस्थिति दर्ज ✓',
    // Assessment
    submitAssessment: 'मूल्यांकन जमा करें',
    passed: 'उत्तीर्ण ✓',
    failed: 'अनुत्तीर्ण ✗',
    // Certificate
    generateCertificate: 'प्रमाणपत्र बनाएं',
    verifyCertificate: 'प्रमाणपत्र सत्यापित करें',
    downloadPDF: 'PDF डाउनलोड',
    // Jobs
    applyNow: 'अभी आवेदन करें',
    applied: 'आवेदित ✓',
    skillMatch: 'कौशल मिलान',
    // AI
    askGemini: 'करियर, कौशल के बारे में पूछें...',
    sendMessage: 'भेजें',
    generatingAI: 'Gemini आपकी प्रोफ़ाइल का विश्लेषण कर रहा है...',
    // Offline
    simulateOutage: 'इंटरनेट आउटेज सिम्युलेट करें',
    restoreInternet: 'इंटरनेट पुनर्स्थापित करें',
    syncComplete: 'सिंक पूर्ण ✓',
    // Common
    loading: 'लोड हो रहा है...',
    error: 'कुछ गलत हुआ',
    retry: 'पुनः प्रयास',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    back: 'वापस',
  }
} as const;

export type TranslationKey = keyof typeof translations.en;

export function t(lang: Language, key: TranslationKey): string {
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}
