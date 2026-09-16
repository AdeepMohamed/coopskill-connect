"""
CoopSkill Connect - Database Seed Script
Run: python seed.py
Creates realistic demo data with fictional Indian names.
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from database import engine, SessionLocal, Base
from models import *
from datetime import date, datetime, timedelta
from passlib.context import CryptContext
import hashlib, random

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def make_cert_hash(cert_id: str, name: str, course: str) -> str:
    data = f"{cert_id}{name}{course}{date.today().isoformat()}"
    return hashlib.sha256(data.encode()).hexdigest()[:32]

def seed():
    print("🌱 Creating all tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # ── Clear existing data ────────────────────────────────────────────────
        print("🗑️  Clearing existing data...")
        for table in reversed(Base.metadata.sorted_tables):
            db.execute(table.delete())
        db.commit()

        # ── Skills ─────────────────────────────────────────────────────────────
        print("📚 Seeding skills...")
        skills_data = [
            ("Cooperative Management", "Management", "Understanding cooperative governance, bylaws, and operations"),
            ("Digital Literacy", "Digital", "Basic computer and internet skills"),
            ("MS Excel", "Digital", "Spreadsheet management and data analysis"),
            ("Basic Accounting", "Finance", "Bookkeeping and financial statements"),
            ("Advanced Accounting", "Finance", "Advanced financial management and auditing"),
            ("ERP Operations", "Digital", "Enterprise Resource Planning system usage"),
            ("Communication Skills", "Soft Skills", "Written and verbal communication"),
            ("Digital Finance", "Finance", "Digital payment systems and online banking"),
            ("Cooperative Law", "Legal", "Legal framework for cooperatives in India"),
            ("Data Management", "Digital", "Database and record-keeping skills"),
            ("Entrepreneurship", "Business", "Business development and startup skills"),
            ("Agricultural Cooperative", "Agriculture", "Agri-cooperative management"),
            ("Credit Management", "Finance", "Loan management and credit appraisal"),
            ("Leadership", "Soft Skills", "Team leadership and management"),
            ("Tamil Language Proficiency", "Language", "Professional Tamil communication"),
        ]
        skills = []
        for name, category, desc in skills_data:
            skill = Skill(name=name, category=category, description=desc)
            db.add(skill)
            skills.append(skill)
        db.flush()
        skill_map = {s.name: s for s in skills}

        # ── Institutions ───────────────────────────────────────────────────────
        print("🏛️  Seeding institutions...")
        institutions_data = [
            ("RICM Chennai", "RICM-CHN", "Chennai, Tamil Nadu", "Tamil Nadu", "Regional"),
            ("VAMNICOM Pune", "VAMNICOM", "Pune, Maharashtra", "Maharashtra", "National"),
            ("NCCT Delhi", "NCCT-DEL", "New Delhi", "Delhi", "National"),
            ("RICM Bhopal", "RICM-BHO", "Bhopal, Madhya Pradesh", "Madhya Pradesh", "Regional"),
            ("COOP Training Hyderabad", "CTH", "Hyderabad, Telangana", "Telangana", "State"),
        ]
        institutions = []
        for name, code, loc, state, typ in institutions_data:
            inst = Institution(name=name, code=code, location=loc, state=state, type=typ)
            db.add(inst)
            institutions.append(inst)
        db.flush()

        # ── Users + Trainees ───────────────────────────────────────────────────
        print("👤 Seeding users and trainees...")

        # Demo Users
        demo_users = [
            ("ravi.kumar@demo.coopskill", "demo123", UserRole.trainee),
            ("arun.sharma@demo.coopskill", "demo123", UserRole.trainer),
            ("priya.nair@ncct.gov.in", "demo123", UserRole.admin),
            ("hr@abccoop.org", "demo123", UserRole.employer),
        ]
        user_objects = []
        for email, pw, role in demo_users:
            u = User(email=email, hashed_password=hash_password(pw), role=role, is_active=True)
            db.add(u)
            user_objects.append(u)
        db.flush()

        trainee_user, trainer_user, admin_user, employer_user = user_objects

        # Primary trainee - Ravi Kumar
        ravi = Trainee(
            user_id=trainee_user.id,
            trainee_id="CC-2026-00127",
            name="Ravi Kumar",
            phone="9876543210",
            institution_id=institutions[0].id,
            education="B.Com",
            location="Coimbatore, Tamil Nadu",
            state="Tamil Nadu",
            languages="English, Tamil",
            employment_status=EmploymentStatus.seeking,
            created_at=datetime.utcnow() - timedelta(days=45)
        )
        db.add(ravi)
        db.flush()

        # Additional trainees
        trainees_data = [
            ("CC-2026-00128", "Preethi Devi", "9876543211", "B.Sc", "Madurai, Tamil Nadu", "Tamil Nadu", "English, Tamil"),
            ("CC-2026-00129", "Arjun Kumar", "9876543212", "B.Com", "Chennai, Tamil Nadu", "Tamil Nadu", "English, Tamil"),
            ("CC-2026-00130", "Meena Selvam", "9876543213", "M.Com", "Tirunelveli, Tamil Nadu", "Tamil Nadu", "Tamil"),
            ("CC-2026-00131", "Suresh Babu", "9876543214", "B.A", "Pune, Maharashtra", "Maharashtra", "English, Marathi"),
            ("CC-2026-00132", "Kavitha Reddy", "9876543215", "B.Com", "Hyderabad, Telangana", "Telangana", "English, Telugu"),
            ("CC-2026-00133", "Rahul Singh", "9876543216", "B.Sc", "Bhopal, M.P.", "Madhya Pradesh", "Hindi, English"),
            ("CC-2026-00134", "Ananya Sharma", "9876543217", "M.A", "Jaipur, Rajasthan", "Rajasthan", "Hindi"),
            ("CC-2026-00135", "Vikram Nair", "9876543218", "B.Com", "Kochi, Kerala", "Kerala", "English, Malayalam"),
            ("CC-2026-00136", "Lakshmi Iyer", "9876543219", "B.Sc", "Bangalore, Karnataka", "Karnataka", "English, Kannada"),
        ]
        extra_trainees = []
        for i, (tid, name, phone, edu, loc, state, langs) in enumerate(trainees_data):
            extra_user = User(
                email=f"trainee{i+2}@demo.coopskill",
                hashed_password=hash_password("demo123"),
                role=UserRole.trainee
            )
            db.add(extra_user)
            db.flush()
            t = Trainee(
                user_id=extra_user.id,
                trainee_id=tid,
                name=name,
                phone=phone,
                institution_id=random.choice(institutions).id,
                education=edu,
                location=loc,
                state=state,
                languages=langs,
                employment_status=random.choice(list(EmploymentStatus)),
                created_at=datetime.utcnow() - timedelta(days=random.randint(10, 60))
            )
            db.add(t)
            extra_trainees.append(t)
        db.flush()

        # ── Trainer ────────────────────────────────────────────────────────────
        trainer = Trainer(
            user_id=trainer_user.id,
            name="Dr. Arun Sharma",
            designation="Senior Faculty",
            institution_id=institutions[0].id,
            specialization="Cooperative Management & ERP"
        )
        db.add(trainer)
        db.flush()

        # ── Courses ────────────────────────────────────────────────────────────
        print("📖 Seeding courses...")
        courses_data = [
            ("DCM-2026", "Digital Cooperative Management", "Comprehensive digital skills for cooperative managers", "Management", 10, CourseLevel.intermediate),
            ("DFB-2026", "Digital Finance Basics", "Introduction to digital finance and payment systems", "Finance", 7, CourseLevel.beginner),
            ("ERP-2026", "ERP for Cooperatives", "Enterprise Resource Planning for cooperative societies", "Digital", 14, CourseLevel.intermediate),
            ("ACG-2026", "Advanced Cooperative Governance", "Legal framework and governance best practices", "Management", 5, CourseLevel.advanced),
            ("ACA-2026", "Advanced Cooperative Accounting", "Advanced accounting and audit for cooperatives", "Finance", 10, CourseLevel.advanced),
            ("ICB-2026", "Introduction to Cooperative Banking", "Basics of cooperative credit and banking", "Finance", 7, CourseLevel.beginner),
            ("DE-2026", "Digital Entrepreneurship", "Building digital businesses in cooperative sector", "Business", 5, CourseLevel.intermediate),
            ("ACS-2026", "Agricultural Cooperative Systems", "Modern agricultural cooperative management", "Agriculture", 10, CourseLevel.beginner),
        ]
        courses = []
        for code, title, desc, cat, days, level in courses_data:
            course = Course(
                code=code,
                title=title,
                description=desc,
                category=cat,
                language="English",
                duration_days=days,
                level=level,
                instructor_id=trainer.id,
                created_at=datetime.utcnow() - timedelta(days=90)
            )
            db.add(course)
            courses.append(course)
        db.flush()

        # ── Course Modules ─────────────────────────────────────────────────────
        dcm_course = courses[0]  # Digital Cooperative Management
        modules_data = [
            (dcm_course.id, "Introduction to Cooperatives", "History and principles of cooperatives in India", 1, 45,
             "A cooperative is an autonomous association of persons united voluntarily to meet their common economic, social, and cultural needs and aspirations through a jointly owned and democratically controlled enterprise..."),
            (dcm_course.id, "Cooperative Governance", "Bylaws, elections, and member rights", 2, 60,
             "Cooperative governance refers to the system of rules, practices and processes by which a cooperative society is directed and controlled..."),
            (dcm_course.id, "Digital Finance", "Digital payment systems for cooperatives", 3, 50,
             "Digital finance encompasses mobile banking, UPI payments, digital ledgers, and online cooperative management systems..."),
            (dcm_course.id, "ERP Fundamentals", "Introduction to ERP systems in cooperatives", 4, 90,
             "An Enterprise Resource Planning (ERP) system integrates all cooperative management functions — accounting, HR, inventory, member management — into a single platform..."),
            (dcm_course.id, "Data & Record Management", "Digital record keeping and data security", 5, 60,
             "Proper data management ensures cooperative records are accurate, accessible, and secure. This module covers NCCT's digital record standards..."),
            (dcm_course.id, "Final Assessment", "Comprehensive assessment of all topics", 6, 120, "Final assessment covers all 5 modules."),
        ]
        for cid, title, desc, order, mins, content in modules_data:
            mod = CourseModule(course_id=cid, title=title, description=desc, order=order, duration_minutes=mins, content=content)
            db.add(mod)

        # Modules for Digital Finance Basics
        dfb_course = courses[1]
        dfb_modules = [
            ("Introduction to Digital Finance", "Overview of fintech in cooperatives", 1, 40, "Digital finance is transforming how cooperative societies manage member transactions..."),
            ("UPI and Mobile Payments", "Practical guide to digital payments", 2, 50, "Unified Payments Interface (UPI) enables instant bank-to-bank transfers..."),
            ("Online Banking for Cooperatives", "Setting up and using cooperative internet banking", 3, 60, "Internet banking allows cooperative staff to manage accounts, transfers, and reports online..."),
            ("Digital Audit and Compliance", "Regulatory compliance in digital finance", 4, 45, "Cooperative societies must comply with RBI guidelines for digital transactions..."),
            ("Final Assessment", "Assessment for Digital Finance Basics", 5, 60, "Final assessment."),
        ]
        for title, desc, order, mins, content in dfb_modules:
            mod = CourseModule(course_id=dfb_course.id, title=title, description=desc, order=order, duration_minutes=mins, content=content)
            db.add(mod)
        db.flush()

        # ── Course Skills (what skills a course builds) ─────────────────────────
        course_skill_map = [
            (dcm_course.id, "Cooperative Management", 15.0),
            (dcm_course.id, "Digital Literacy", 10.0),
            (dcm_course.id, "ERP Operations", 15.0),
            (dcm_course.id, "Data Management", 10.0),
            (dfb_course.id, "Digital Finance", 20.0),
            (dfb_course.id, "Basic Accounting", 10.0),
            (courses[2].id, "ERP Operations", 25.0),  # ERP course
            (courses[4].id, "Advanced Accounting", 20.0),  # ACA
            (courses[4].id, "Credit Management", 15.0),
        ]
        for cid, sname, gain in course_skill_map:
            skill = skill_map.get(sname)
            if skill:
                cs = CourseSkill(course_id=cid, skill_id=skill.id, proficiency_gain=gain)
                db.add(cs)
        db.flush()

        # ── Enrollments ────────────────────────────────────────────────────────
        print("📝 Seeding enrollments...")
        # Ravi: DCM in progress at 72%, DFB completed
        enroll_ravi_dcm = Enrollment(
            trainee_id=ravi.id,
            course_id=dcm_course.id,
            progress=72.0,
            current_module=4,
            status=EnrollmentStatus.in_progress,
            enrolled_at=datetime.utcnow() - timedelta(days=20)
        )
        db.add(enroll_ravi_dcm)
        enroll_ravi_dfb = Enrollment(
            trainee_id=ravi.id,
            course_id=dfb_course.id,
            progress=100.0,
            current_module=5,
            status=EnrollmentStatus.completed,
            enrolled_at=datetime.utcnow() - timedelta(days=40),
            completed_at=datetime.utcnow() - timedelta(days=15)
        )
        db.add(enroll_ravi_dfb)

        # Extra trainees
        for t in extra_trainees[:5]:
            e = Enrollment(
                trainee_id=t.id,
                course_id=random.choice(courses).id,
                progress=random.uniform(30, 95),
                current_module=random.randint(1, 5),
                status=random.choice([EnrollmentStatus.in_progress, EnrollmentStatus.enrolled]),
                enrolled_at=datetime.utcnow() - timedelta(days=random.randint(5, 30))
            )
            db.add(e)
        db.flush()

        # ── Attendance ─────────────────────────────────────────────────────────
        print("📅 Seeding attendance...")
        attendance_pattern = [
            (0, "present"), (2, "present"), (4, "present"), (6, "present"),
            (8, "present"), (10, "absent"), (12, "present"), (14, "present"),
            (16, "present"), (18, "present"), (20, "present")
        ]
        for offset, status in attendance_pattern:
            att = Attendance(
                trainee_id=ravi.id,
                course_id=dcm_course.id,
                date=date.today() - timedelta(days=offset),
                status=AttendanceStatus[status],
                method="QR",
                check_in_time="09:30 AM",
                session_number=(20 - offset) // 2 + 1
            )
            db.add(att)
        db.flush()

        # ── Assessments ────────────────────────────────────────────────────────
        print("📋 Seeding assessments...")
        dcm_assessment = Assessment(
            course_id=dcm_course.id,
            title="Digital Cooperative Management - Final Assessment",
            description="Comprehensive test covering cooperative management and digital tools",
            passing_score=60.0,
            total_questions=5
        )
        db.add(dcm_assessment)
        dfb_assessment = Assessment(
            course_id=dfb_course.id,
            title="Digital Finance Basics - Assessment",
            description="Test covering digital finance and payment systems",
            passing_score=60.0,
            total_questions=5
        )
        db.add(dfb_assessment)
        db.flush()

        # Questions for DCM assessment
        dcm_questions = [
            ("Which system helps a cooperative centrally manage training programmes and trainee records?",
             "Paper register", "ERP System", "Notice board", "Manual spreadsheet", "B",
             "An Enterprise Resource Planning (ERP) system integrates all management functions in one platform."),
            ("What does the acronym 'NCCT' stand for?",
             "National College of Cooperative Training", "National Council for Cooperative Training",
             "National Centre for Cooperative Technology", "National Cooperative Commerce Training", "B",
             "NCCT stands for National Council for Cooperative Training, established under Ministry of Cooperation."),
            ("Which Indian government ministry oversees cooperative development?",
             "Ministry of Agriculture", "Ministry of Commerce", "Ministry of Cooperation", "Ministry of Finance", "C",
             "The Ministry of Cooperation was established in 2021 to provide a separate administrative, legal and policy framework for cooperatives."),
            ("In a cooperative society, who holds the ultimate authority?",
             "The Board of Directors", "The CEO", "The General Body of Members", "The Government", "C",
             "In a cooperative, the General Body comprising all members holds ultimate authority through democratic voting."),
            ("What is the primary purpose of a cooperative society?",
             "To maximize profit for shareholders", "To serve the collective needs of its members",
             "To compete with private enterprises", "To provide government services", "B",
             "Cooperatives are formed to serve the collective economic, social and cultural needs of their members, not for profit maximization."),
        ]
        for i, (q, oa, ob, oc, od, correct, exp) in enumerate(dcm_questions):
            question = AssessmentQuestion(
                assessment_id=dcm_assessment.id,
                question=q,
                option_a=oa, option_b=ob, option_c=oc, option_d=od,
                correct_answer=correct,
                explanation=exp,
                order=i + 1
            )
            db.add(question)

        # Questions for DFB assessment
        dfb_questions = [
            ("Which payment interface enables instant bank-to-bank transfers in India?",
             "SWIFT", "UPI", "NEFT (only)", "Western Union", "B",
             "UPI (Unified Payments Interface) enables instant, 24/7 bank-to-bank transfers."),
            ("What is the maximum UPI transaction limit per day for cooperative societies?",
             "₹10,000", "₹50,000", "₹1,00,000", "Unlimited", "C",
             "RBI guidelines set the standard UPI limit at ₹1 lakh per transaction for most use cases."),
            ("Which regulatory body oversees digital payment systems in India?",
             "SEBI", "IRDAI", "Reserve Bank of India (RBI)", "NABARD", "C",
             "The Reserve Bank of India regulates all digital payment systems and fintech operations in India."),
            ("What does 'IMPS' stand for?",
             "Indian Mobile Payment System", "Immediate Payment Service", "Integrated Mobile Processing System", "Indian Money Protocol Standard", "B",
             "IMPS stands for Immediate Payment Service, enabling 24/7 interbank electronic fund transfer."),
            ("For a cooperative to adopt digital accounting, which standard is recommended?",
             "Paper-based manual ledgers", "Tally or ERP-based digital accounting", "Excel spreadsheets only", "WhatsApp-based records", "B",
             "NCCT recommends Tally or cooperative-specific ERP systems for proper digital accounting compliance."),
        ]
        for i, (q, oa, ob, oc, od, correct, exp) in enumerate(dfb_questions):
            question = AssessmentQuestion(
                assessment_id=dfb_assessment.id,
                question=q,
                option_a=oa, option_b=ob, option_c=oc, option_d=od,
                correct_answer=correct,
                explanation=exp,
                order=i + 1
            )
            db.add(question)
        db.flush()

        # ── Trainee Skills for Ravi ────────────────────────────────────────────
        print("💪 Seeding trainee skills...")
        ravi_skills = [
            ("Cooperative Management", 85.0),
            ("Digital Literacy", 90.0),
            ("MS Excel", 78.0),
            ("Basic Accounting", 65.0),
            ("Communication Skills", 72.0),
            ("Digital Finance", 80.0),
        ]
        for sname, prof in ravi_skills:
            skill = skill_map.get(sname)
            if skill:
                ts = TraineeSkill(trainee_id=ravi.id, skill_id=skill.id, proficiency=prof, source="assessment")
                db.add(ts)

        for t in extra_trainees:
            skill_subset = random.sample(list(skill_map.values()), random.randint(3, 6))
            for skill in skill_subset:
                ts = TraineeSkill(trainee_id=t.id, skill_id=skill.id, proficiency=random.uniform(50, 95), source="assessment")
                db.add(ts)
        db.flush()

        # ── Assessment Attempts ────────────────────────────────────────────────
        print("✅ Seeding assessment attempts...")
        # Ravi passed DCM assessment with 86%
        dcm_attempt = AssessmentAttempt(
            trainee_id=ravi.id,
            assessment_id=dcm_assessment.id,
            score=86.0,
            status=AttemptStatus.passed,
            answers='{"1":"B","2":"B","3":"C","4":"C","5":"B"}',
            attempted_at=datetime.utcnow() - timedelta(days=5),
            completed_at=datetime.utcnow() - timedelta(days=5)
        )
        db.add(dcm_attempt)
        # Ravi passed DFB with 82%
        dfb_attempt = AssessmentAttempt(
            trainee_id=ravi.id,
            assessment_id=dfb_assessment.id,
            score=82.0,
            status=AttemptStatus.passed,
            answers='{"1":"B","2":"C","3":"C","4":"B","5":"B"}',
            attempted_at=datetime.utcnow() - timedelta(days=18),
            completed_at=datetime.utcnow() - timedelta(days=18)
        )
        db.add(dfb_attempt)
        db.flush()

        # ── Certificates ───────────────────────────────────────────────────────
        print("🏅 Seeding certificates...")
        certs_data = [
            (ravi.id, dcm_course.id, "NCCT-CC-2026-00127-001", date.today() - timedelta(days=5), 86.0),
            (ravi.id, dfb_course.id, "NCCT-CC-2026-00127-002", date.today() - timedelta(days=15), 82.0),
        ]
        for t_id, c_id, cert_id, issue_date, score in certs_data:
            cert = Certificate(
                trainee_id=t_id,
                course_id=c_id,
                certificate_id=cert_id,
                issue_date=issue_date,
                verification_status=CertificateStatus.valid,
                verification_hash=make_cert_hash(cert_id, "Ravi Kumar", "course"),
                score=score
            )
            db.add(cert)

        # Certificates for other trainees
        for t in extra_trainees[:4]:
            cid = random.choice(courses[:3]).id
            cert_code = f"NCCT-CC-2026-{t.trainee_id.split('-')[-1]}-001"
            cert = Certificate(
                trainee_id=t.id,
                course_id=cid,
                certificate_id=cert_code,
                issue_date=date.today() - timedelta(days=random.randint(5, 30)),
                verification_status=CertificateStatus.valid,
                verification_hash=make_cert_hash(cert_code, t.name, "course"),
                score=random.uniform(65, 92)
            )
            db.add(cert)
        db.flush()

        # ── Employer ──────────────────────────────────────────────────────────
        print("🏢 Seeding employers...")
        employers_data = [
            (employer_user.id, "ABC Cooperative Federation", "Cooperative Finance", "Chennai, Tamil Nadu", "Tamil Nadu", "Rajesh Kumar"),
            ("Tamil Nadu State Cooperative Bank", "Banking", "Chennai, Tamil Nadu", "Tamil Nadu", "Meenakshi Iyer"),
            ("Andhra Pradesh Cooperative Union", "Agriculture", "Vijayawada, AP", "Andhra Pradesh", "Venkat Rao"),
            ("Maharashtra State Cooperative Marketing Federation", "Marketing", "Pune, Maharashtra", "Maharashtra", "Suresh Pawar"),
            ("Karnataka Cooperative Milk Producers Federation", "Dairy", "Bangalore, Karnataka", "Karnataka", "Gowda H.R."),
        ]

        employer_objects = []
        emp = Employer(
            user_id=employer_user.id,
            organization_name="ABC Cooperative Federation",
            industry="Cooperative Finance",
            location="Chennai, Tamil Nadu",
            state="Tamil Nadu",
            contact_person="Rajesh Kumar"
        )
        db.add(emp)
        employer_objects.append(emp)

        for name, ind, loc, state, contact in employers_data[1:]:
            extra_emp_user = User(
                email=f"emp_{name[:5].lower().replace(' ', '')}@demo.coopskill",
                hashed_password=hash_password("demo123"),
                role=UserRole.employer
            )
            db.add(extra_emp_user)
            db.flush()
            extra_emp = Employer(
                user_id=extra_emp_user.id,
                organization_name=name,
                industry=ind,
                location=loc,
                state=state,
                contact_person=contact
            )
            db.add(extra_emp)
            employer_objects.append(extra_emp)
        db.flush()

        # ── Jobs ───────────────────────────────────────────────────────────────
        print("💼 Seeding jobs...")
        jobs_data = [
            (emp.id, "Cooperative Operations Assistant", "Manage day-to-day cooperative operations, member records, and digital transactions.", "Coimbatore", "Tamil Nadu", "Full Time", 20000, 28000, "Graduate", 0,
             [("Cooperative Management", 70), ("Digital Literacy", 70), ("MS Excel", 60), ("Advanced Accounting", 65)]),
            (emp.id, "Digital Accounts Assistant", "Handle digital accounting, UPI reconciliation, and financial reporting.", "Madurai", "Tamil Nadu", "Full Time", 22000, 30000, "B.Com", 1,
             [("Basic Accounting", 75), ("MS Excel", 70), ("Digital Finance", 65), ("ERP Operations", 60)]),
            (emp.id, "Field Coordinator", "Coordinate with member societies, collect data, and liaise with head office.", "Tamil Nadu", "Tamil Nadu", "Full Time", 18000, 25000, "Graduate", 0,
             [("Communication Skills", 70), ("Cooperative Management", 65), ("Digital Literacy", 60)]),
            (employer_objects[1].id, "Credit Officer", "Appraise loan applications and manage credit portfolios.", "Chennai", "Tamil Nadu", "Full Time", 28000, 38000, "B.Com/MBA", 2,
             [("Credit Management", 75), ("Advanced Accounting", 70), ("Cooperative Law", 65)]),
            (employer_objects[2].id, "Agricultural Extension Officer", "Support member farmers with cooperative services.", "Vijayawada", "Andhra Pradesh", "Full Time", 20000, 26000, "B.Sc Agri", 1,
             [("Agricultural Cooperative", 70), ("Communication Skills", 65), ("Digital Literacy", 60)]),
            (employer_objects[3].id, "Marketing Executive", "Promote cooperative products and manage sales channels.", "Pune", "Maharashtra", "Full Time", 22000, 30000, "Graduate", 1,
             [("Communication Skills", 70), ("Digital Literacy", 65), ("Leadership", 60)]),
            (employer_objects[4].id, "Dairy Operations Manager", "Manage milk procurement and processing operations.", "Bangalore", "Karnataka", "Full Time", 30000, 42000, "B.Sc", 2,
             [("Agricultural Cooperative", 70), ("Leadership", 70), ("ERP Operations", 60)]),
            (emp.id, "ERP Implementation Analyst", "Implement and support cooperative ERP systems.", "Chennai", "Tamil Nadu", "Full Time", 32000, 45000, "B.Tech/BCA", 2,
             [("ERP Operations", 80), ("Digital Literacy", 75), ("Data Management", 70)]),
            (employer_objects[1].id, "Compliance Officer", "Ensure regulatory compliance for cooperative operations.", "Chennai", "Tamil Nadu", "Full Time", 30000, 40000, "B.Com/LLB", 3,
             [("Cooperative Law", 80), ("Advanced Accounting", 70), ("Communication Skills", 65)]),
            (emp.id, "Digital Transformation Lead", "Lead digital initiatives across cooperative network.", "Chennai", "Tamil Nadu", "Full Time", 45000, 65000, "MBA/B.Tech", 5,
             [("ERP Operations", 85), ("Leadership", 80), ("Digital Finance", 80), ("Data Management", 75)]),
        ]

        job_objects = []
        for (emp_id, title, desc, loc, state, emp_type, sal_min, sal_max, edu, exp, req_skills) in jobs_data:
            job = Job(
                employer_id=emp_id,
                title=title,
                description=desc,
                location=loc,
                state=state,
                employment_type=emp_type,
                salary_min=sal_min,
                salary_max=sal_max,
                education_required=edu,
                experience_years=exp,
                status=JobStatus.active,
                created_at=datetime.utcnow() - timedelta(days=random.randint(1, 30))
            )
            db.add(job)
            db.flush()
            job_objects.append(job)

            for sname, level in req_skills:
                skill = skill_map.get(sname)
                if skill:
                    js = JobSkill(job_id=job.id, skill_id=skill.id, required_level=float(level))
                    db.add(js)

        db.flush()

        # ── Job Applications ───────────────────────────────────────────────────
        print("📨 Seeding job applications...")
        app1 = JobApplication(
            trainee_id=ravi.id,
            job_id=job_objects[0].id,
            status=ApplicationStatus.applied,
            ai_match_score=91.0,
            applied_at=datetime.utcnow() - timedelta(days=1)
        )
        db.add(app1)

        for t in extra_trainees[:6]:
            for job in random.sample(job_objects, random.randint(1, 3)):
                app = JobApplication(
                    trainee_id=t.id,
                    job_id=job.id,
                    status=random.choice(list(ApplicationStatus)),
                    ai_match_score=random.uniform(65, 92),
                    applied_at=datetime.utcnow() - timedelta(days=random.randint(1, 20))
                )
                db.add(app)
        db.flush()

        # ── AI Recommendations ─────────────────────────────────────────────────
        print("🤖 Seeding AI recommendations...")
        import json
        ai_rec = AIRecommendation(
            trainee_id=ravi.id,
            recommendation_type="career",
            input_snapshot=json.dumps({"skills_count": 6, "location": "Tamil Nadu"}),
            response=json.dumps({
                "recommendation": "Based on your cooperative management and digital skills with 84% average assessment score, you are well-positioned for cooperative operations roles in Tamil Nadu.",
                "career_paths": [
                    {"title": "Cooperative Operations Assistant", "match_percentage": 91, "why": "Strong cooperative management and digital record skills align with operational requirements.", "matching_skills": ["Cooperative Management", "Digital Literacy", "MS Excel"], "skill_gaps": ["Advanced Accounting"], "recommended_course": "Advanced Cooperative Accounting"},
                    {"title": "Digital Accounts Assistant", "match_percentage": 84, "why": "Digital finance and MS Excel skills are directly applicable.", "matching_skills": ["Digital Finance", "MS Excel", "Basic Accounting"], "skill_gaps": ["ERP Operations"], "recommended_course": "ERP for Cooperatives"},
                    {"title": "Field Coordinator", "match_percentage": 78, "why": "Communication and cooperative management skills are valuable.", "matching_skills": ["Communication Skills", "Cooperative Management"], "skill_gaps": ["Advanced Communication"], "recommended_course": "Leadership & Communication"}
                ],
                "matching_skills": ["Cooperative Management", "Digital Literacy", "MS Excel", "Digital Finance"],
                "skill_gaps": ["Advanced Accounting", "ERP Operations"],
                "recommended_courses": ["Advanced Cooperative Accounting", "ERP for Cooperatives", "Digital Entrepreneurship"],
                "next_steps": ["Complete ERP Fundamentals module", "Enroll in Advanced Cooperative Accounting", "Apply for Cooperative Operations Assistant positions"],
                "reasoning": "Your 86% score in Digital Cooperative Management and strong cooperative management foundation (85% proficiency) make you an excellent candidate for operational cooperative roles."
            }),
            created_at=datetime.utcnow() - timedelta(hours=3)
        )
        db.add(ai_rec)

        # ── Notifications ──────────────────────────────────────────────────────
        print("🔔 Seeding notifications...")
        notifs = [
            (ravi.id, "Assessment Passed ✓", "You scored 86% on Digital Cooperative Management Final Assessment.", "success", True),
            (ravi.id, "Certificate Issued ✓", "Your NCCT Certificate for Digital Cooperative Management has been issued. ID: NCCT-CC-2026-00127-001", "success", True),
            (ravi.id, "New Job Match 🎯", "8 new job opportunities match your skill profile in Tamil Nadu.", "info", False),
            (ravi.id, "AI Recommendation Ready 🤖", "Your Gemini AI career recommendation has been generated.", "info", False),
            (ravi.id, "Course Reminder 📚", "Don't forget: ERP Fundamentals module is next in your Digital Cooperative Management course.", "warning", False),
        ]
        for i, (tid, title, message, typ, is_read) in enumerate(notifs):
            notif = Notification(
                trainee_id=tid,
                title=title,
                message=message,
                type=typ,
                is_read=is_read,
                created_at=datetime.utcnow() - timedelta(hours=i * 4)
            )
            db.add(notif)

        db.commit()
        print("\n✅ Database seeded successfully!")
        print("=" * 50)
        print("DEMO ACCOUNTS:")
        print("  TRAINEE: ravi.kumar@demo.coopskill / demo123")
        print("  TRAINER: arun.sharma@demo.coopskill / demo123")
        print("  ADMIN:   priya.nair@ncct.gov.in / demo123")
        print("  EMPLOYER: hr@abccoop.org / demo123")
        print("=" * 50)
        print(f"  Trainees: 10 | Courses: 8 | Skills: 15 | Jobs: 10")
        print(f"  Employers: 5 | Certificates: 6 | Assessments: 2")

    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding database: {e}")
        import traceback
        traceback.print_exc()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
