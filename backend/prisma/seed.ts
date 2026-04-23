import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';

// ── Prisma client (uses pg adapter, same as app) ──────────────
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any);

// ── Helpers ───────────────────────────────────────────────────
const pw = (plain: string) => bcrypt.hashSync(plain, 10);

/** Returns a Date offset by `days` from today at the given `hour` */
function futureDate(days: number, hour = 10): Date {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(hour, 0, 0, 0);
    return d;
}

// ── Types ─────────────────────────────────────────────────────
interface CreatedUser { id: number }

// ── Main ──────────────────────────────────────────────────────
async function main(): Promise<void> {
    console.log('\n🌱  Seeding ReferX database…\n');

    // ── 1. Companies ──────────────────────────────────────────
    const companyDefs = [
        { email: 'hr@razorpay.com', name: 'Razorpay HR' },
        { email: 'hr@zepto.com', name: 'Zepto HR' },
        { email: 'hr@groww.in', name: 'Groww HR' },
        { email: 'hr@swiggy.com', name: 'Swiggy HR' },
        { email: 'hr@phonepe.com', name: 'PhonePe HR' },
    ];

    const companies: CreatedUser[] = await Promise.all(
        companyDefs.map((c) =>
            prisma.user.upsert({
                where: { email: c.email },
                update: {},
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                create: { email: c.email, password_hash: pw('password123'), name: c.name, role: 'company', email_verified: true } as any,
            }),
        ),
    );
    const [razorpay, zepto, groww, swiggy, phonepe] = companies;
    console.log('✅  Companies  (5)');

    // ── 2. Engineers ──────────────────────────────────────────
    const engineerDefs = [
        { email: 'rahul.kumar@engineer.com', name: 'Rahul Kumar', company: 'Razorpay', designation: 'Senior Software Engineer', exp: 5, skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'], bio: 'Senior SWE at Razorpay. Love helping freshers break into tech.' },
        { email: 'priya.singh@engineer.com', name: 'Priya Singh', company: 'Zepto', designation: 'Staff Engineer', exp: 7, skills: ['Python', 'Django', 'Redis', 'Kafka', 'Docker'], bio: 'Staff engineer at Zepto. Passionate about distributed systems.' },
        { email: 'amit.mehta@engineer.com', name: 'Amit Mehta', company: 'Swiggy', designation: 'Engineering Manager', exp: 9, skills: ['Java', 'Spring Boot', 'Kubernetes', 'Microservices', 'AWS'], bio: 'EM at Swiggy. Building high-scale food delivery systems.' },
        { email: 'sneha.rao@engineer.com', name: 'Sneha Rao', company: 'PhonePe', designation: 'Senior Frontend Engineer', exp: 4, skills: ['React', 'Next.js', 'TypeScript', 'GraphQL', 'Tailwind'], bio: 'Frontend engineer at PhonePe. Obsessed with great UX.' },
        { email: 'vikram.nair@engineer.com', name: 'Vikram Nair', company: 'Groww', designation: 'Principal Engineer', exp: 11, skills: ['Go', 'gRPC', 'Kubernetes', 'PostgreSQL', 'Redis'], bio: 'Principal engineer at Groww. Fintech infra nerd.' },
        { email: 'divya.menon@engineer.com', name: 'Divya Menon', company: 'Zepto', designation: 'SDE-2', exp: 3, skills: ['React', 'Python', 'FastAPI', 'MySQL', 'Docker'], bio: 'SDE-2 at Zepto. Love building consumer products.' },
        { email: 'karan.joshi@engineer.com', name: 'Karan Joshi', company: 'Swiggy', designation: 'Senior SDE', exp: 6, skills: ['Java', 'Scala', 'Spark', 'Kafka', 'Cassandra'], bio: 'Senior SDE at Swiggy. Data platform and big data systems.' },
        { email: 'ananya.iyer@engineer.com', name: 'Ananya Iyer', company: 'Razorpay', designation: 'Tech Lead', exp: 8, skills: ['Node.js', 'React', 'MongoDB', 'AWS', 'Terraform'], bio: 'Tech lead at Razorpay. Full-stack and cloud infra.' },
        { email: 'rohan.verma@engineer.com', name: 'Rohan Verma', company: 'PhonePe', designation: 'SDE-3', exp: 5, skills: ['Python', 'ML', 'TensorFlow', 'Spark', 'Airflow'], bio: 'ML engineer at PhonePe. Building intelligent systems.' },
        { email: 'pooja.desai@engineer.com', name: 'Pooja Desai', company: 'Groww', designation: 'Senior SDE', exp: 4, skills: ['React', 'Redux', 'Node.js', 'PostgreSQL', 'Jest'], bio: 'Senior SDE at Groww. Fintech frontend specialist.' },
    ];

    const engineers: CreatedUser[] = await Promise.all(
        engineerDefs.map((e) =>
            prisma.user.upsert({
                where: { email: e.email },
                update: {},
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                create: {
                    email: e.email, password_hash: pw('password123'),
                    name: e.name, role: 'engineer', email_verified: true,
                    engineer_profile: {
                        create: {
                            company: e.company, designation: e.designation,
                            experience_years: e.exp,
                            linkedin: `https://linkedin.com/in/${e.name.toLowerCase().replace(' ', '')}`,
                            skills: e.skills, verified: true, bio: e.bio,
                        },
                    },
                } as any,
            }),
        ),
    );
    console.log('✅  Engineers  (10)');

    // ── 3. Candidates ─────────────────────────────────────────
    const candidateDefs = [
        {
            email: 'arjun.sharma@candidate.com', name: 'Arjun Sharma',
            skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Python'],
            github: 'https://github.com/arjunsharma', portfolio: 'https://arjunsharma.dev',
            bio: 'Final year CS student. Looking for SDE-1 roles at product companies.',
            location: 'Bangalore, India', exp: 'fresher',
        },
        {
            email: 'neha.gupta@candidate.com', name: 'Neha Gupta',
            skills: ['Python', 'Django', 'SQL', 'Machine Learning', 'Pandas'],
            github: 'https://github.com/nehagupta', portfolio: null,
            bio: 'Data science enthusiast. Interned at a fintech startup.',
            location: 'Hyderabad, India', exp: 'fresher',
        },
        {
            email: 'siddharth.rao@candidate.com', name: 'Siddharth Rao',
            skills: ['Java', 'Spring Boot', 'MySQL', 'Docker', 'REST APIs'],
            github: 'https://github.com/siddharthrao', portfolio: 'https://siddharthrao.me',
            bio: 'Backend developer with 1 year internship experience.',
            location: 'Pune, India', exp: '1-2',
        },
        {
            email: 'meera.pillai@candidate.com', name: 'Meera Pillai',
            skills: ['React', 'Next.js', 'Tailwind', 'Figma', 'TypeScript'],
            github: 'https://github.com/meerapillai', portfolio: 'https://meerapillai.design',
            bio: 'Frontend developer with a design background. Love building beautiful UIs.',
            location: 'Chennai, India', exp: 'fresher',
        },
        {
            email: 'aditya.kumar@candidate.com', name: 'Aditya Kumar',
            skills: ['Go', 'PostgreSQL', 'Redis', 'Docker', 'Linux'],
            github: 'https://github.com/adityakumar', portfolio: null,
            bio: 'Systems programmer. Interested in infra and backend roles.',
            location: 'Delhi, India', exp: '1-2',
        },
    ];

    const candidates: CreatedUser[] = await Promise.all(
        candidateDefs.map((c) =>
            prisma.user.upsert({
                where: { email: c.email },
                update: {},
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                create: {
                    email: c.email, password_hash: pw('password123'),
                    name: c.name, role: 'candidate', email_verified: true,
                    candidate_profile: {
                        create: {
                            skills: c.skills, github: c.github, portfolio: c.portfolio,
                            bio: c.bio, location: c.location, experience_level: c.exp,
                            projects: [
                                { title: 'Project Alpha', description: 'Full-stack web app built with modern tooling.' },
                                { title: 'Project Beta', description: 'CLI automation tool for developer workflows.' },
                            ],
                        },
                    },
                } as any,
            }),
        ),
    );
    console.log('✅  Candidates (5)');

    // ── 4. Jobs ───────────────────────────────────────────────
    type JobDef = {
        id: number; companyId: number; title: string; description: string;
        location: string; salaryRange: string; skills: string[];
    };

    const jobDefs: JobDef[] = [
        { id: 1, companyId: razorpay.id, title: 'Frontend Developer', location: 'Mumbai · Remote', salaryRange: '₹12–18 LPA', skills: ['React', 'TypeScript', 'Node.js', 'CSS'], description: 'Build high-performance React apps for our payments dashboard used by millions.' },
        { id: 2, companyId: zepto.id, title: 'SDE-1 Backend', location: 'Bangalore', salaryRange: '₹10–15 LPA', skills: ['Node.js', 'PostgreSQL', 'Redis', 'Docker'], description: "Build scalable microservices for India's fastest growing quick-commerce platform." },
        { id: 3, companyId: groww.id, title: 'Full Stack Engineer', location: 'Pune · Hybrid', salaryRange: '₹14–20 LPA', skills: ['React', 'Python', 'AWS', 'PostgreSQL'], description: 'Own features end-to-end on our investment platform serving 50M+ users.' },
        { id: 4, companyId: swiggy.id, title: 'Software Engineer – Platform', location: 'Bangalore', salaryRange: '₹16–24 LPA', skills: ['Java', 'Spring Boot', 'Kafka', 'Kubernetes'], description: 'Build infrastructure powering food delivery for 100M+ orders.' },
        { id: 5, companyId: phonepe.id, title: 'Backend Engineer – Payments', location: 'Bangalore', salaryRange: '₹18–28 LPA', skills: ['Go', 'gRPC', 'PostgreSQL', 'Redis', 'Kafka'], description: 'Build payment rails processing billions of transactions at PhonePe.' },
        { id: 6, companyId: razorpay.id, title: 'DevOps Engineer', location: 'Mumbai', salaryRange: '₹14–22 LPA', skills: ['AWS', 'Terraform', 'Docker', 'Kubernetes', 'Python'], description: 'Own CI/CD pipelines and cloud infrastructure. Help us scale to 10x.' },
        { id: 7, companyId: zepto.id, title: 'Data Engineer', location: 'Mumbai · Remote', salaryRange: '₹12–18 LPA', skills: ['Python', 'Spark', 'Airflow', 'SQL', 'dbt'], description: 'Build data pipelines and analytics infrastructure at Zepto.' },
        { id: 8, companyId: groww.id, title: 'iOS Developer', location: 'Bangalore', salaryRange: '₹15–22 LPA', skills: ['Swift', 'SwiftUI', 'Xcode', 'REST APIs'], description: 'Build the Groww iOS app used by millions of retail investors.' },
        { id: 9, companyId: swiggy.id, title: 'SDE-2 Backend', location: 'Bangalore · Hybrid', salaryRange: '₹20–30 LPA', skills: ['Java', 'Spring Boot', 'MySQL', 'Redis', 'AWS'], description: "Own backend services for Swiggy's restaurant and delivery partner platform." },
        { id: 10, companyId: phonepe.id, title: 'React Native Developer', location: 'Bangalore · Hybrid', salaryRange: '₹12–16 LPA', skills: ['React Native', 'TypeScript', 'Redux', 'iOS'], description: "Build beautiful mobile experiences for PhonePe's 100M+ users." },
        { id: 11, companyId: razorpay.id, title: 'Security Engineer', location: 'Mumbai', salaryRange: '₹16–24 LPA', skills: ['Security', 'Python', 'AWS', 'Penetration Testing'], description: 'Protect Razorpay infrastructure and ensure PCI-DSS compliance.' },
        { id: 12, companyId: zepto.id, title: 'Android Developer', location: 'Bangalore', salaryRange: '₹10–16 LPA', skills: ['Kotlin', 'Android', 'Jetpack Compose', 'REST APIs'], description: 'Build the Zepto Android app for 5M+ daily active users.' },
        { id: 13, companyId: groww.id, title: 'Product Analyst', location: 'Bangalore', salaryRange: '₹12–18 LPA', skills: ['SQL', 'Python', 'Tableau', 'Excel', 'Product Sense'], description: "Drive data-informed product decisions for Groww's investment platform." },
        { id: 14, companyId: swiggy.id, title: 'ML Engineer', location: 'Bangalore', salaryRange: '₹18–26 LPA', skills: ['Python', 'TensorFlow', 'PyTorch', 'Spark', 'Airflow'], description: 'Build intelligent routing, pricing, and demand forecasting models at Swiggy.' },
        { id: 15, companyId: phonepe.id, title: 'Site Reliability Engineer', location: 'Bangalore', salaryRange: '₹20–32 LPA', skills: ['Go', 'Kubernetes', 'Prometheus', 'Terraform', 'Linux'], description: 'Ensure 99.99% uptime for PhonePe payment infrastructure.' },
    ];

    const jobs = await Promise.all(
        jobDefs.map((j) =>
            prisma.job.upsert({
                where: { id: j.id },
                update: {},
                create: {
                    id: j.id, company_id: j.companyId, title: j.title,
                    description: j.description, location: j.location,
                    salary_range: j.salaryRange, skills_required: j.skills, status: 'active',
                },
            }),
        ),
    );
    console.log('✅  Jobs       (15)');

    // ── 5. Applications ───────────────────────────────────────
    type AppDef = { candidateId: number; jobId: number; status: string };

    const appDefs: AppDef[] = [
        // Arjun
        { candidateId: candidates[0].id, jobId: jobs[0].id, status: 'under_review' },
        { candidateId: candidates[0].id, jobId: jobs[1].id, status: 'applied' },
        { candidateId: candidates[0].id, jobId: jobs[2].id, status: 'shortlisted' },
        { candidateId: candidates[0].id, jobId: jobs[4].id, status: 'applied' },
        { candidateId: candidates[0].id, jobId: jobs[9].id, status: 'rejected' },
        // Neha
        { candidateId: candidates[1].id, jobId: jobs[6].id, status: 'applied' },
        { candidateId: candidates[1].id, jobId: jobs[12].id, status: 'shortlisted' },
        { candidateId: candidates[1].id, jobId: jobs[13].id, status: 'under_review' },
        // Siddharth
        { candidateId: candidates[2].id, jobId: jobs[1].id, status: 'interviewed' },
        { candidateId: candidates[2].id, jobId: jobs[3].id, status: 'shortlisted' },
        { candidateId: candidates[2].id, jobId: jobs[8].id, status: 'applied' },
        // Meera
        { candidateId: candidates[3].id, jobId: jobs[0].id, status: 'applied' },
        { candidateId: candidates[3].id, jobId: jobs[9].id, status: 'under_review' },
        { candidateId: candidates[3].id, jobId: jobs[11].id, status: 'shortlisted' },
        // Aditya
        { candidateId: candidates[4].id, jobId: jobs[4].id, status: 'applied' },
        { candidateId: candidates[4].id, jobId: jobs[5].id, status: 'under_review' },
    ];

    for (const a of appDefs) {
        await prisma.application.upsert({
            where: { candidate_id_job_id: { candidate_id: a.candidateId, job_id: a.jobId } },
            update: {},
            create: { candidate_id: a.candidateId, job_id: a.jobId, status: a.status },
        });
    }
    console.log('✅  Applications (16)');

    // ── 6. Referrals ──────────────────────────────────────────
    type RefDef = { id: number; engineerId: number; candidateId: number; jobId: number; status: string; note: string };

    const refDefs: RefDef[] = [
        { id: 1, engineerId: engineers[0].id, candidateId: candidates[0].id, jobId: jobs[0].id, status: 'accepted', note: 'Strong React skills, good GitHub. Recommend for frontend role.' },
        { id: 2, engineerId: engineers[1].id, candidateId: candidates[0].id, jobId: jobs[1].id, status: 'pending', note: 'Solid Node.js background. Worth a look.' },
        { id: 3, engineerId: engineers[2].id, candidateId: candidates[2].id, jobId: jobs[3].id, status: 'accepted', note: 'Good Java fundamentals, strong DSA performance.' },
        { id: 4, engineerId: engineers[3].id, candidateId: candidates[3].id, jobId: jobs[9].id, status: 'accepted', note: 'Excellent React Native portfolio and design sensibility.' },
        { id: 5, engineerId: engineers[4].id, candidateId: candidates[4].id, jobId: jobs[4].id, status: 'pending', note: 'Knows Go well, good systems thinking.' },
        { id: 6, engineerId: engineers[5].id, candidateId: candidates[1].id, jobId: jobs[6].id, status: 'accepted', note: 'Strong Python and data engineering skills.' },
        { id: 7, engineerId: engineers[6].id, candidateId: candidates[2].id, jobId: jobs[8].id, status: 'rejected', note: 'Not enough distributed systems experience yet. Try again in 6 months.' },
        { id: 8, engineerId: engineers[7].id, candidateId: candidates[0].id, jobId: jobs[5].id, status: 'pending', note: 'Interested in DevOps track, has some AWS exposure.' },
        { id: 9, engineerId: engineers[8].id, candidateId: candidates[1].id, jobId: jobs[13].id, status: 'accepted', note: 'Great ML project portfolio, strong Python fundamentals.' },
        { id: 10, engineerId: engineers[9].id, candidateId: candidates[3].id, jobId: jobs[2].id, status: 'pending', note: 'Strong frontend skills, actively learning backend.' },
    ];

    const refs: { id: number }[] = [];
    for (const r of refDefs) {
        const ref = await prisma.referral.upsert({
            where: { id: r.id },
            update: {},
            create: {
                id: r.id, engineer_id: r.engineerId, candidate_id: r.candidateId,
                job_id: r.jobId, status: r.status, note: r.note,
            },
        });
        refs.push(ref);
    }
    console.log('✅  Referrals  (10)');

    // ── 7. Interviews ─────────────────────────────────────────
    type IvDef = {
        id: number; candidateId: number; engineerId: number;
        scheduledAt: Date; status: string; notes: string; feedback: string | null;
    };

    const ivDefs: IvDef[] = [
        { id: 1, candidateId: candidates[0].id, engineerId: engineers[0].id, scheduledAt: futureDate(1, 15), status: 'booked', notes: 'System Design Round — scalability and distributed systems', feedback: null },
        { id: 2, candidateId: candidates[0].id, engineerId: engineers[1].id, scheduledAt: futureDate(3, 11), status: 'booked', notes: 'DSA Round — arrays, trees, dynamic programming', feedback: null },
        { id: 3, candidateId: candidates[2].id, engineerId: engineers[2].id, scheduledAt: futureDate(-3, 14), status: 'completed', notes: 'Backend deep dive — Java, Spring Boot', feedback: 'Good fundamentals. Needs to improve system design depth.' },
        { id: 4, candidateId: candidates[3].id, engineerId: engineers[3].id, scheduledAt: futureDate(5, 10), status: 'booked', notes: 'Frontend interview — React, performance, accessibility', feedback: null },
        { id: 5, candidateId: candidates[1].id, engineerId: engineers[8].id, scheduledAt: futureDate(2, 16), status: 'booked', notes: 'ML concepts — regression, classification, feature engineering', feedback: null },
        { id: 6, candidateId: candidates[4].id, engineerId: engineers[4].id, scheduledAt: futureDate(-7, 11), status: 'completed', notes: 'Go and systems programming deep dive', feedback: 'Excellent candidate. Strong systems thinking. Highly recommend.' },
        { id: 7, candidateId: candidates[0].id, engineerId: engineers[9].id, scheduledAt: futureDate(7, 14), status: 'booked', notes: 'Full stack round — React + Node.js project walkthrough', feedback: null },
        { id: 8, candidateId: candidates[2].id, engineerId: engineers[6].id, scheduledAt: futureDate(-1, 10), status: 'cancelled', notes: 'Data engineering concepts — Spark, Airflow', feedback: null },
    ];

    for (const iv of ivDefs) {
        await prisma.interview.upsert({
            where: { id: iv.id },
            update: {},
            create: {
                id: iv.id, candidate_id: iv.candidateId, engineer_id: iv.engineerId,
                scheduled_at: iv.scheduledAt, status: iv.status,
                notes: iv.notes, feedback: iv.feedback,
            },
        });
    }
    console.log('✅  Interviews (8)');

    // ── 8. Payments ───────────────────────────────────────────
    type PayDef = {
        id: number; userId: number; engineerId: number; referralId: number | null;
        amount: number; type: string; status: string; transactionId: string | null;
    };

    const payDefs: PayDef[] = [
        { id: 1, userId: candidates[0].id, engineerId: engineers[0].id, referralId: refs[0].id, amount: 999, type: 'interview_booking', status: 'paid', transactionId: 'pay_rzp_001' },
        { id: 2, userId: candidates[0].id, engineerId: engineers[1].id, referralId: null, amount: 999, type: 'interview_booking', status: 'pending', transactionId: null },
        { id: 3, userId: candidates[2].id, engineerId: engineers[2].id, referralId: refs[2].id, amount: 999, type: 'interview_booking', status: 'paid', transactionId: 'pay_rzp_003' },
        { id: 4, userId: candidates[3].id, engineerId: engineers[3].id, referralId: refs[3].id, amount: 999, type: 'interview_booking', status: 'paid', transactionId: 'pay_rzp_004' },
        { id: 5, userId: candidates[1].id, engineerId: engineers[8].id, referralId: refs[8].id, amount: 999, type: 'interview_booking', status: 'paid', transactionId: 'pay_rzp_005' },
        { id: 6, userId: candidates[0].id, engineerId: engineers[0].id, referralId: refs[0].id, amount: 5000, type: 'referral_bonus', status: 'paid', transactionId: 'pay_rzp_006' },
        { id: 7, userId: candidates[2].id, engineerId: engineers[2].id, referralId: refs[2].id, amount: 5000, type: 'referral_bonus', status: 'pending', transactionId: null },
        { id: 8, userId: candidates[4].id, engineerId: engineers[4].id, referralId: null, amount: 999, type: 'interview_booking', status: 'paid', transactionId: 'pay_rzp_008' },
    ];

    for (const p of payDefs) {
        await prisma.payment.upsert({
            where: { id: p.id },
            update: {},
            create: {
                id: p.id, user_id: p.userId, engineer_id: p.engineerId,
                referral_id: p.referralId, amount: p.amount,
                type: p.type, status: p.status, transaction_id: p.transactionId,
            },
        });
    }
    console.log('✅  Payments   (8)');

    // ── Summary ───────────────────────────────────────────────
    console.log('\n🎉  Seed complete!\n');
    console.log('─'.repeat(50));
    console.log('All accounts use password: password123');
    console.log('─'.repeat(50));
    console.log('\nCANDIDATES:');
    candidateDefs.forEach((c) => console.log(`  ${c.email}`));
    console.log('\nENGINEERS:');
    engineerDefs.forEach((e) => console.log(`  ${e.email}`));
    console.log('\nCOMPANIES:');
    companyDefs.forEach((c) => console.log(`  ${c.email}`));
    console.log('─'.repeat(50) + '\n');
}

main()
    .catch((err: unknown) => { console.error(err); process.exit(1); })
    .finally(() => prisma.$disconnect());
