/**
 * Internationalization (i18n) support for English, Tamil, and Hindi
 */

export type Language = 'en' | 'ta' | 'hi' | 'ml' | 'te' | 'kn';

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
    settings: 'Settings',
    traineesNav: 'Trainees',
    coursesNav: 'Courses',
    analyticsNav: 'Analytics',
    aiInsightsNav: 'AI Insights',
    batchesNav: 'My Batches',
    postJobNav: 'Post Job',
    applicationsNav: 'Applications',
    aiMatchNav: 'AI Candidate Match',
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
    generatingAI: 'CoopSkill AI is analyzing your profile...',
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
    settings: 'அமைப்புகள்',
    traineesNav: 'பயிற்சியாளர்கள்',
    coursesNav: 'பாடத்திட்டங்கள்',
    analyticsNav: 'பகுப்பாய்வு',
    aiInsightsNav: 'AI நுண்ணறிவுகள்',
    batchesNav: 'எனது தொகுதிகள்',
    postJobNav: 'வேலை பதிவு செய்',
    applicationsNav: 'விண்ணப்பங்கள்',
    aiMatchNav: 'AI வேட்பாளர் பொருத்தம்',
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
    generatingAI: 'CoopSkill AI உங்கள் சுயவிவரத்தை பகுப்பாய்கிறது...',
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
    settings: 'सेटिंग्स',
    traineesNav: 'प्रशिक्षु',
    coursesNav: 'पाठ्यक्रम',
    analyticsNav: 'विश्लेषण',
    aiInsightsNav: 'AI इनसाइट्स',
    batchesNav: 'मेरे बैच',
    postJobNav: 'नौकरी पोस्ट करें',
    applicationsNav: 'आवेदन',
    aiMatchNav: 'AI उम्मीदवार मिलान',
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
    generatingAI: 'CoopSkill AI आपकी प्रोफ़ाइल का विश्लेषण कर रहा है...',
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
  },
  te: {
    dashboard: 'డాష్‌బోర్డ్', myLearning: 'నా అభ్యాసం', attendance: 'హాజరు', assessments: 'అంచనాలు', certificates: 'సర్టిఫికెట్లు', aiAdvisor: 'AI కెరీర్ అడ్వైజర్', employment: 'ఉపాధి', myProfile: 'నా ప్రొఫైల్', ruralEdge: 'రూరల్ లెర్నింగ్ ఎడ్జ్', logout: 'లాగ్అవుట్', settings: 'సెట్టింగులు', traineesNav: 'శిక్షణార్థులు', coursesNav: 'కోర్సులు', analyticsNav: 'విశ్లేషణలు', aiInsightsNav: 'AI అంతర్దృష్టులు', batchesNav: 'నా బ్యాచ్‌లు', postJobNav: 'ఉద్యోగాన్ని పోస్ట్ చేయండి', applicationsNav: 'దరఖాస్తులు', aiMatchNav: 'AI అభ్యర్థి సరిపోలిక',
    goodMorning: 'శుభోదయం', goodAfternoon: 'మధ్యాహ్న నమస్కారం', goodEvening: 'శుభ సాయంత్రం', learningProgress: 'అభ్యాస పురోగతి', attendanceRate: 'హాజరు', skillsAcquired: 'నైపుణ్యాలు', certificatesIssued: 'సర్టిఫికెట్లు', jobMatches: 'ఉద్యోగ సరిపోలికలు', continueLearning: 'అభ్యాసం కొనసాగించండి', viewAIRecommendation: 'AI సిఫార్సు చూడండి',
    markComplete: 'పూర్తయినట్లు గుర్తు పెట్టు', downloadOffline: 'ఆఫ్‌లైన్ డౌన్‌లోడ్', nextModule: 'తదుపరి మాడ్యూల్',
    simulateQRScan: 'QR స్కాన్ చేయండి', attendanceRecorded: 'హాజరు నమోదైంది ✓',
    submitAssessment: 'సమర్పించండి', passed: 'ఉత్తీర్ణత ✓', failed: 'విఫలమైంది ✗',
    generateCertificate: 'సర్టిఫికేట్ సృష్టించండి', verifyCertificate: 'ధృవీకరించండి', downloadPDF: 'PDF డౌన్‌లోడ్',
    applyNow: 'ఇప్పుడే దరఖాస్తు చేయండి', applied: 'దరఖాస్తు చేయబడింది ✓', skillMatch: 'నైపుణ్యాల సరిపోలిక',
    askGemini: 'కెరీర్, నైపుణ్యాల గురించి అడగండి...', sendMessage: 'పంపండి', generatingAI: 'CoopSkill AI మీ ప్రొఫైల్‌ను విశ్లేషిస్తోంది...',
    simulateOutage: 'ఇంటర్నెట్ అంతరాయం అనుకరించండి', restoreInternet: 'ఇంటర్నెట్ పునరుద్ధరించండి', syncComplete: 'సింక్ పూర్తయింది ✓',
    loading: 'లోడ్ అవుతోంది...', error: 'ఏదో తప్పు జరిగింది', retry: 'మళ్ళీ ప్రయత్నించండి', save: 'సేవ్ చేయండి', cancel: 'రద్దు చేయండి', back: 'వెనుకకు',
  },
  ml: {
    dashboard: 'ഡാഷ്ബോർഡ്', myLearning: 'എന്റെ പഠനം', attendance: 'ഹാജർ', assessments: 'വിലയിരുത്തലുകൾ', certificates: 'സർട്ടിഫിക്കറ്റുകൾ', aiAdvisor: 'AI കരിയർ ഉപദേഷ്ടാവ്', employment: 'തൊഴിൽ', myProfile: 'എന്റെ പ്രൊഫൈൽ', ruralEdge: 'റൂറൽ ലേണിംഗ് എഡ്ജ്', logout: 'ലോഗൗട്ട്', settings: 'ക്രമീകരണങ്ങൾ', traineesNav: 'പരിശീലനാർത്ഥികൾ', coursesNav: 'കോഴ്സുകൾ', analyticsNav: 'വിശകലനങ്ങൾ', aiInsightsNav: 'AI സ്ഥിതിവിവരക്കണക്കുകൾ', batchesNav: 'എന്റെ ബാച്ചുകൾ', postJobNav: 'ജോലി പോസ്റ്റ് ചെയ്യുക', applicationsNav: 'അപേക്ഷകൾ', aiMatchNav: 'AI ഉദ്യോഗാർത്ഥി പൊരുത്തം',
    goodMorning: 'സുപ്രഭാതം', goodAfternoon: 'നമസ്കാരം', goodEvening: 'ശുഭ സായാഹ്നം', learningProgress: 'പഠന പുരോഗതി', attendanceRate: 'ഹാജർ', skillsAcquired: 'കഴിവുകൾ', certificatesIssued: 'സർട്ടിഫിക്കറ്റുകൾ', jobMatches: 'ജോലി പൊരുത്തങ്ങൾ', continueLearning: 'പഠനം തുടരുക', viewAIRecommendation: 'AI നിർദ്ദേശം കാണുക',
    markComplete: 'പൂർത്തിയായതായി അടയാളപ്പെടുത്തുക', downloadOffline: 'ഓഫ്‌ലൈൻ ഡൗൺലോഡ്', nextModule: 'അടുത്ത ഘടകം',
    simulateQRScan: 'QR സ്കാൻ ചെയ്യുക', attendanceRecorded: 'ഹാജർ രേഖപ്പെടുത്തി ✓',
    submitAssessment: 'സമർപ്പിക്കുക', passed: 'വിജയിച്ചു ✓', failed: 'പരാജയപ്പെട്ടു ✗',
    generateCertificate: 'സർട്ടിഫിക്കറ്റ് ഉണ്ടാക്കുക', verifyCertificate: 'സ്ഥിരീകരിക്കുക', downloadPDF: 'PDF ഡൗൺലോഡ്',
    applyNow: 'ഇപ്പോൾ അപേക്ഷിക്കുക', applied: 'അപേക്ഷിച്ചു ✓', skillMatch: 'നൈപുണ്യ പൊരുത്തം',
    askGemini: 'കരിയർ, കഴിവുകൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കുക...', sendMessage: 'അയക്കുക', generatingAI: 'CoopSkill AI നിങ്ങളുടെ പ്രൊഫൈൽ വിശകലനം ചെയ്യുന്നു...',
    simulateOutage: 'ഇന്റർനെറ്റ് തടസ്സം അനുകരിക്കുക', restoreInternet: 'ഇന്റർനെറ്റ് പുനഃസ്ഥാപിക്കുക', syncComplete: 'സമന്വയം പൂർത്തിയായി ✓',
    loading: 'ലോഡുചെയ്യുന്നു...', error: 'എന്തോ കുഴപ്പമുണ്ടായി', retry: 'വീണ്ടും ശ്രമിക്കുക', save: 'സേവ് ചെയ്യുക', cancel: 'റദ്ദാക്കുക', back: 'പിന്നോട്ട്',
  },
  kn: {
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', myLearning: 'ನನ್ನ ಕಲಿಕೆ', attendance: 'ಹಾಜರಾತಿ', assessments: 'ಮೌಲ್ಯಮಾಪನಗಳು', certificates: 'ಪ್ರಮಾಣಪತ್ರಗಳು', aiAdvisor: 'AI ವೃತ್ತಿ ಸಲಹೆಗಾರ', employment: 'ಉದ್ಯೋಗ', myProfile: 'ನನ್ನ ಪ್ರೊಫೈಲ್', ruralEdge: 'ರೂರಲ್ ಲರ್ನಿಂಗ್ ಎಡ್ಜ್', logout: 'ಲಾಗ್ ಔಟ್', settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು', traineesNav: 'ತರಬೇತಿದಾರರು', coursesNav: 'ಕೋರ್ಸ್‌ಗಳು', analyticsNav: 'ವಿಶ್ಲೇಷಣೆ', aiInsightsNav: 'AI ಒಳನೋಟಗಳು', batchesNav: 'ನನ್ನ ಬ್ಯಾಚ್‌ಗಳು', postJobNav: 'ಉದ್ಯೋಗವನ್ನು ಪೋಸ್ಟ್ ಮಾಡಿ', applicationsNav: 'ಅರ್ಜಿಗಳು', aiMatchNav: 'AI ಅಭ್ಯರ್ಥಿ ಹೊಂದಾಣಿಕೆ',
    goodMorning: 'ಶುಭೋದಯ', goodAfternoon: 'ನಮಸ್ಕಾರ', goodEvening: 'ಶುಭ ಸಂಜೆ', learningProgress: 'ಕಲಿಕೆಯ ಪ್ರಗತಿ', attendanceRate: 'ಹಾಜರಾತಿ', skillsAcquired: 'ಕೌಶಲ್ಯಗಳು', certificatesIssued: 'ಪ್ರಮಾಣಪತ್ರಗಳು', jobMatches: 'ಉದ್ಯೋಗ ಹೊಂದಾಣಿಕೆಗಳು', continueLearning: 'ಕಲಿಕೆ ಮುಂದುವರಿಸಿ', viewAIRecommendation: 'AI ಶಿಫಾರಸು ವೀಕ್ಷಿಸಿ',
    markComplete: 'ಪೂರ್ಣಗೊಳಿಸಿ', downloadOffline: 'ಆಫ್‌ಲೈನ್ ಡೌನ್‌ಲೋಡ್', nextModule: 'ಮುಂದಿನ ಮಾಡ್ಯೂಲ್',
    simulateQRScan: 'QR ಸ್ಕ್ಯಾನ್ ಮಾಡಿ', attendanceRecorded: 'ಹಾಜರಾತಿ ದಾಖಲಾಗಿದೆ ✓',
    submitAssessment: 'ಸಲ್ಲಿಸಿ', passed: 'ಉತ್ತೀರ್ಣ ✓', failed: 'ಅನುತ್ತೀರ್ಣ ✗',
    generateCertificate: 'ಪ್ರಮಾಣಪತ್ರ ರಚಿಸಿ', verifyCertificate: 'ಪರಿಶೀಲಿಸಿ', downloadPDF: 'PDF ಡೌನ್‌ಲೋಡ್',
    applyNow: 'ಈಗ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ', applied: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಲಾಗಿದೆ ✓', skillMatch: 'ಕೌಶಲ್ಯ ಹೊಂದಾಣಿಕೆ',
    askGemini: 'ವೃತ್ತಿ, ಕೌಶಲ್ಯಗಳ ಬಗ್ಗೆ ಕೇಳಿ...', sendMessage: 'ಕಳುಹಿಸಿ', generatingAI: 'CoopSkill AI ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಅನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...',
    simulateOutage: 'ಇಂಟರ್ನೆಟ್ ನಿಲುಗಡೆ ಅನುಕರಿಸಿ', restoreInternet: 'ಇಂಟರ್ನೆಟ್ ಮರುಸ್ಥಾಪಿಸಿ', syncComplete: 'ಸಿಂಕ್ ಪೂರ್ಣಗೊಂಡಿದೆ ✓',
    loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...', error: 'ಏನೋ ತಪ್ಪಾಗಿದೆ', retry: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ', save: 'ಉಳಿಸಿ', cancel: 'ರದ್ದುಮಾಡಿ', back: 'ಹಿಂದಕ್ಕೆ',
  }
}; // Removed as const to allow type inference flexibility

export type TranslationKey = keyof typeof translations.en;

export function t(lang: Language, key: TranslationKey): string {
  return (translations as Record<string, Record<string, string>>)[lang]?.[key] ?? translations.en[key] ?? key;
}
