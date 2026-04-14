import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);
const u = (data: any) => data;

async function main() {
    console.log('🌱 Seeding database...');

    // ── Companies ──────────────────────────────────────────────
    const companyDefs = [
        { email: 'hr@razorpay.com', name: 'Razorpay HR' },
        { email: 'hr@zepto.com',    name: 'Zepto HR' },
        { email: 'hr@groww.in',     name: 'Groww HR' },
        { email: 'hr@swiggy.com',   name: 'Swiggy HR' },
        { email: 'hr@cred.club',    name: 'CRED HR' },
        { email: 'hr@phonepe.com',  name: 'PhonePe HR' },
        { email: 'hr@meesho.com',   name: 'Meesho HR' },
        { email: 'hr@flipkart.com', name: 'Flipkart HR' },
        { email: 'hr@paytm.com',    name: 'Paytm HR' },
        { email: 'hr@ola.com',      name: 'Ola HR' },
    ];
    const companies = await Promise.all(companyDefs.map(c =>
        prisma.user.upsert({
            where: { email: c.email }, update: {},
            create: u({ email: c.email, password_hash: bcrypt.hashSync('password123', 10), name: c.name, role: 'company', email_verified: true }),
        })
    ));
    const [razorpay, zepto, groww, swiggy, cred, phonepe, meesho, flipkart, paytm, ola] = companies;
    console.log('✅ Companies created (10)');

    // ── Engineers ──────────────────────────────────────────────
    const engDefs = [
        { email: 'rahul.kumar@engineer.com',  name: 'Rahul Kumar',  company: 'Razorpay', designation: 'Senior Software Engineer', exp: 5,  skills: ['React','Node.js','TypeScript','PostgreSQL','AWS'],        bio: 'Senior SWE at Razorpay. Love helping freshers break into tech.' },
        { email: 'priya.singh@engineer.com',  name: 'Priya Singh',  company: 'Zepto',    designation: 'Staff Engineer',           exp: 7,  skills: ['Python','Django','Redis','Kafka','Docker'],               bio: 'Staff engineer at Zepto. Passionate about distributed systems.' },
        { email: 'amit.mehta@engineer.com',   name: 'Amit Mehta',   company: 'Swiggy',   designation: 'Engineering Manager',      exp: 9,  skills: ['Java','Spring Boot','Kubernetes','Microservices','AWS'],  bio: 'EM at Swiggy. Building high-scale food delivery systems.' },
        { email: 'sneha.rao@engineer.com',    name: 'Sneha Rao',    company: 'CRED',     designation: 'Senior Frontend Engineer', exp: 4,  skills: ['React','Next.js','TypeScript','GraphQL','Tailwind'],     bio: 'Frontend engineer at CRED. Obsessed with great UX.' },
        { email: 'vikram.nair@engineer.com',  name: 'Vikram Nair',  company: 'PhonePe',  designation: 'Principal Engineer',      exp: 11, skills: ['Go','gRPC','Kubernetes','PostgreSQL','Redis'],            bio: 'Principal engineer at PhonePe. Fintech infra nerd.' },
        { email: 'divya.menon@engineer.com',  name: 'Divya Menon',  company: 'Meesho',   designation: 'SDE-2',                   exp: 3,  skills: ['React','Python','FastAPI','MySQL','Docker'],              bio: 'SDE-2 at Meesho. Love building consumer products.' },
        { email: 'karan.joshi@engineer.com',  name: 'Karan Joshi',  company: 'Flipkart', designation: 'Senior SDE',              exp: 6,  skills: ['Java','Scala','Spark','Kafka','Cassandra'],               bio: 'Senior SDE at Flipkart. Data platform and big data systems.' },
        { email: 'ananya.iyer@engineer.com',  name: 'Ananya Iyer',  company: 'Paytm',    designation: 'Tech Lead',               exp: 8,  skills: ['Node.js','React','MongoDB','AWS','Terraform'],            bio: 'Tech lead at Paytm. Full-stack and cloud infra.' },
        { email: 'rohan.verma@engineer.com',  name: 'Rohan Verma',  company: 'Ola',      designation: 'SDE-3',                   exp: 5,  skills: ['Python','ML','TensorFlow','Spark','Airflow'],            bio: 'ML engineer at Ola. Building intelligent routing systems.' },
        { email: 'pooja.desai@engineer.com',  name: 'Pooja Desai',  company: 'Groww',    designation: 'Senior SDE',              exp: 4,  skills: ['React','Redux','Node.js','PostgreSQL','Jest'],            bio: 'Senior SDE at Groww. Fintech frontend specialist.' },
    ];
    const engineers = await Promise.all(engDefs.map(e =>
        prisma.user.upsert({
            where: { email: e.email }, update: {},
            create: u({
                email: e.email, password_hash: bcrypt.hashSync('password123', 10),
                name: e.name, role: 'engineer', email_verified: true,
                engineer_profile: { create: { company: e.company, designation: e.designation, experience_years: e.exp, linkedin: `https://linkedin.com/in/${e.name.toLowerCase().replace(' ','')}`, skills: e.skills, verified: true, bio: e.bio } },
            }),
        })
    ));
    console.log('✅ Engineers created (10)');

    // ── Candidates ─────────────────────────────────────────────
    const candDefs = [
        { email: 'arjun.sharma@candidate.com',   name: 'Arjun Sharma',    skills: ['React','Node.js','TypeScript','MongoDB','Python'],          github: 'https://github.com/arjunsharma',   portfolio: 'https://arjunsharma.dev',      bio: 'Final year CS student. Looking for SDE-1 roles at product companies.', location: 'Bangalore, India', exp: 'fresher' },
        { email: 'neha.gupta@candidate.com',     name: 'Neha Gupta',      skills: ['Python','Django','SQL','Machine Learning','Pandas'],        github: 'https://github.com/nehagupta',     portfolio: null,                           bio: 'Data science enthusiast. Interned at a fintech startup.',              location: 'Hyderabad, India', exp: 'fresher' },
        { email: 'siddharth.rao@candidate.com',  name: 'Siddharth Rao',   skills: ['Java','Spring Boot','MySQL','Docker','REST APIs'],          github: 'https://github.com/siddharthrao',  portfolio: 'https://siddharthrao.me',      bio: 'Backend developer with 1 year internship experience.',                 location: 'Pune, India',      exp: '1-2' },
        { email: 'meera.pillai@candidate.com',   name: 'Meera Pillai',    skills: ['React','Next.js','Tailwind','Figma','TypeScript'],          github: 'https://github.com/meerapillai',   portfolio: 'https://meerapillai.design',   bio: 'Frontend developer with a design background. Love building beautiful UIs.', location: 'Chennai, India', exp: 'fresher' },
        { email: 'aditya.kumar@candidate.com',   name: 'Aditya Kumar',    skills: ['Go','PostgreSQL','Redis','Docker','Linux'],                 github: 'https://github.com/adityakumar',   portfolio: null,                           bio: 'Systems programmer. Interested in infra and backend roles.',           location: 'Delhi, India',     exp: '1-2' },
    ];
    const candidates = await Promise.all(candDefs.map(c =>
        prisma.user.upsert({
            where: { email: c.email }, update: {},
            create: u({
                email: c.email, password_hash: bcrypt.hashSync('password123', 10),
                name: c.name, role: 'candidate', email_verified: true,
                candidate_profile: { create: { skills: c.skills, github: c.github, portfolio: c.portfolio, bio: c.bio, location: c.location, experience_level: c.exp, projects: [{ title: 'Project Alpha', description: 'Full-stack web app.' }, { title: 'Project Beta', description: 'CLI automation tool.' }] } },
            }),
        })
    ));
    console.log('✅ Candidates created (5)');

    // ── Jobs ───────────────────────────────────────────────────
    const jobDefs = [
        { id: 1,  co: razorpay, title: 'Frontend Developer',           loc: 'Mumbai · Remote',   sal: '₹12–18 LPA', skills: ['React','TypeScript','Node.js','CSS'],               desc: 'Build high-performance React apps for our payments dashboard used by millions.' },
        { id: 2,  co: zepto,    title: 'SDE-1 Backend',                loc: 'Bangalore',          sal: '₹10–15 LPA', skills: ['Node.js','PostgreSQL','Redis','Docker'],             desc: "Build scalable microservices for India's fastest growing quick-commerce platform." },
        { id: 3,  co: groww,    title: 'Full Stack Engineer',          loc: 'Pune · Hybrid',      sal: '₹14–20 LPA', skills: ['React','Python','AWS','PostgreSQL'],                 desc: 'Own features end-to-end on our investment platform serving 50M+ users.' },
        { id: 4,  co: swiggy,   title: 'Software Engineer - Platform', loc: 'Bangalore',          sal: '₹16–24 LPA', skills: ['Java','Spring Boot','Kafka','Kubernetes'],           desc: 'Build infrastructure powering food delivery for 100M+ orders.' },
        { id: 5,  co: cred,     title: 'React Native Developer',       loc: 'Bangalore · Hybrid', sal: '₹12–16 LPA', skills: ['React Native','TypeScript','Redux','iOS'],           desc: "Build beautiful mobile experiences for CRED's 10M+ premium users." },
        { id: 6,  co: razorpay, title: 'DevOps Engineer',              loc: 'Mumbai',             sal: '₹14–22 LPA', skills: ['AWS','Terraform','Docker','Kubernetes','Python'],    desc: 'Own CI/CD pipelines and cloud infrastructure. Help us scale to 10x.' },
        { id: 7,  co: zepto,    title: 'Data Engineer',                loc: 'Mumbai · Remote',    sal: '₹12–18 LPA', skills: ['Python','Spark','Airflow','SQL','dbt'],              desc: 'Build data pipelines and analytics infrastructure at Zepto.' },
        { id: 8,  co: groww,    title: 'iOS Developer',                loc: 'Bangalore',          sal: '₹15–22 LPA', skills: ['Swift','SwiftUI','Xcode','REST APIs'],               desc: 'Build the Groww iOS app used by millions of retail investors.' },
        { id: 9,  co: phonepe,  title: 'Backend Engineer - Payments',  loc: 'Bangalore',          sal: '₹18–28 LPA', skills: ['Go','gRPC','PostgreSQL','Redis','Kafka'],            desc: 'Build payment rails processing billions of transactions at PhonePe.' },
        { id: 10, co: meesho,   title: 'SDE-1 Frontend',               loc: 'Bangalore · Remote', sal: '₹10–14 LPA', skills: ['React','JavaScript','CSS','REST APIs'],              desc: "Build seller and buyer experiences on Meesho's social commerce platform." },
        { id: 11, co: flipkart, title: 'Data Scientist',               loc: 'Bangalore',          sal: '₹16–24 LPA', skills: ['Python','ML','TensorFlow','Spark','SQL'],            desc: "Build recommendation and search ranking models for Flipkart's 400M+ users." },
        { id: 12, co: paytm,    title: 'Android Developer',            loc: 'Noida',              sal: '₹10–16 LPA', skills: ['Kotlin','Android','Jetpack Compose','REST APIs'],    desc: 'Build the Paytm Android app used by 300M+ users.' },
        { id: 13, co: ola,      title: 'ML Engineer',                  loc: 'Bangalore',          sal: '₹18–26 LPA', skills: ['Python','TensorFlow','PyTorch','Spark','Airflow'],   desc: 'Build intelligent routing, pricing, and demand forecasting models at Ola.' },
        { id: 14, co: swiggy,   title: 'SDE-2 Backend',                loc: 'Bangalore · Hybrid', sal: '₹20–30 LPA', skills: ['Java','Spring Boot','MySQL','Redis','AWS'],           desc: "Own backend services for Swiggy's restaurant and delivery partner platform." },
        { id: 15, co: cred,     title: 'Product Analyst',              loc: 'Bangalore',          sal: '₹12–18 LPA', skills: ['SQL','Python','Tableau','Excel','Product Sense'],    desc: "Drive data-informed product decisions for CRED's premium financial products." },
    ];
    const jobs = await Promise.all(jobDefs.map(j =>
        prisma.job.upsert({
            where: { id: j.id }, update: {},
            create: { id: j.id, company_id: j.co.id, title: j.title, description: j.desc, location: j.loc, salary_range: j.sal, skills_required: j.skills, status: 'active' },
        })
    ));
    console.log('✅ Jobs created (15)');

    // ── Applications ───────────────────────────────────────────
    const appDefs = [
        { cid: candidates[0].id, jid: jobs[0].id,  status: 'under_review' },
        { cid: candidates[0].id, jid: jobs[1].id,  status: 'applied' },
        { cid: candidates[0].id, jid: jobs[2].id,  status: 'shortlisted' },
        { cid: candidates[0].id, jid: jobs[8].id,  status: 'applied' },
        { cid: candidates[0].id, jid: jobs[9].id,  status: 'rejected' },
        { cid: candidates[1].id, jid: jobs[6].id,  status: 'applied' },
        { cid: candidates[1].id, jid: jobs[10].id, status: 'shortlisted' },
        { cid: candidates[1].id, jid: jobs[12].id, status: 'under_review' },
        { cid: candidates[2].id, jid: jobs[1].id,  status: 'interviewed' },
        { cid: candidates[2].id, jid: jobs[3].id,  status: 'shortlisted' },
        { cid: candidates[2].id, jid: jobs[13].id, status: 'applied' },
        { cid: candidates[3].id, jid: jobs[0].id,  status: 'applied' },
        { cid: candidates[3].id, jid: jobs[4].id,  status: 'under_review' },
        { cid: candidates[3].id, jid: jobs[9].id,  status: 'shortlisted' },
        { cid: candidates[4].id, jid: jobs[8].id,  status: 'applied' },
        { cid: candidates[4].id, jid: jobs[5].id,  status: 'under_review' },
    ];
    for (const a of appDefs) {
        await prisma.application.upsert({
            where: { candidate_id_job_id: { candidate_id: a.cid, job_id: a.jid } }, update: {},
            create: { candidate_id: a.cid, job_id: a.jid, status: a.status },
        });
    }
    console.log('✅ Applications created (16)');

    // ── Referrals ──────────────────────────────────────────────
    const refDefs = [
        { id: 1,  eid: engineers[0].id, cid: candidates[0].id, jid: jobs[0].id,  status: 'accepted', note: 'Strong React skills, good GitHub. Recommend for frontend role.' },
        { id: 2,  eid: engineers[1].id, cid: candidates[0].id, jid: jobs[1].id,  status: 'pending',  note: 'Solid Node.js background.' },
        { id: 3,  eid: engineers[2].id, cid: candidates[2].id, jid: jobs[3].id,  status: 'accepted', note: 'Good Java fundamentals, strong DSA.' },
        { id: 4,  eid: engineers[3].id, cid: candidates[3].id, jid: jobs[4].id,  status: 'accepted', note: 'Excellent React Native portfolio.' },
        { id: 5,  eid: engineers[4].id, cid: candidates[4].id, jid: jobs[8].id,  status: 'pending',  note: 'Knows Go, good systems thinking.' },
        { id: 6,  eid: engineers[5].id, cid: candidates[1].id, jid: jobs[9].id,  status: 'accepted', note: 'Strong Python and data skills.' },
        { id: 7,  eid: engineers[6].id, cid: candidates[2].id, jid: jobs[13].id, status: 'rejected', note: 'Not enough distributed systems experience yet.' },
        { id: 8,  eid: engineers[7].id, cid: candidates[0].id, jid: jobs[5].id,  status: 'pending',  note: 'Interested in DevOps track.' },
        { id: 9,  eid: engineers[8].id, cid: candidates[1].id, jid: jobs[12].id, status: 'accepted', note: 'Great ML project portfolio.' },
        { id: 10, eid: engineers[9].id, cid: candidates[3].id, jid: jobs[2].id,  status: 'pending',  note: 'Strong frontend, learning backend.' },
    ];
    const refs: any[] = [];
    for (const r of refDefs) {
        const ref = await prisma.referral.upsert({
            where: { id: r.id }, update: {},
            create: { id: r.id, engineer_id: r.eid, candidate_id: r.cid, job_id: r.jid, status: r.status, note: r.note },
        });
        refs.push(ref);
    }
    console.log('✅ Referrals created (10)');

    // ── Interviews ─────────────────────────────────────────────
    const d = (days: number, hour: number) => { const dt = new Date(); dt.setDate(dt.getDate() + days); dt.setHours(hour, 0, 0, 0); return dt; };
    const ivDefs = [
        { id: 1, cid: candidates[0].id, eid: engineers[0].id, at: d(1,  15), status: 'booked',    notes: 'System Design Round — scalability and distributed systems',  feedback: null },
        { id: 2, cid: candidates[0].id, eid: engineers[1].id, at: d(3,  11), status: 'booked',    notes: 'DSA Round — arrays, trees, dynamic programming',             feedback: null },
        { id: 3, cid: candidates[2].id, eid: engineers[2].id, at: d(-3, 14), status: 'completed', notes: 'Backend deep dive — Java, Spring Boot',                      feedback: 'Good fundamentals. Work on system design.' },
        { id: 4, cid: candidates[3].id, eid: engineers[3].id, at: d(5,  10), status: 'booked',    notes: 'Frontend interview — React, performance, accessibility',      feedback: null },
        { id: 5, cid: candidates[1].id, eid: engineers[8].id, at: d(2,  16), status: 'booked',    notes: 'ML concepts — regression, classification, feature engineering', feedback: null },
        { id: 6, cid: candidates[4].id, eid: engineers[4].id, at: d(-7, 11), status: 'completed', notes: 'Go and systems programming',                                  feedback: 'Excellent. Strong candidate for backend roles.' },
        { id: 7, cid: candidates[0].id, eid: engineers[9].id, at: d(7,  14), status: 'booked',    notes: 'Full stack round — React + Node.js project walkthrough',      feedback: null },
        { id: 8, cid: candidates[2].id, eid: engineers[6].id, at: d(-1, 10), status: 'cancelled', notes: 'Data engineering concepts',                                   feedback: null },
    ];
    for (const iv of ivDefs) {
        await prisma.interview.upsert({
            where: { id: iv.id }, update: {},
            create: { id: iv.id, candidate_id: iv.cid, engineer_id: iv.eid, scheduled_at: iv.at, status: iv.status, notes: iv.notes, feedback: iv.feedback },
        });
    }
    console.log('✅ Interviews created (8)');

    // ── Payments ───────────────────────────────────────────────
    const payDefs = [
        { id: 1, uid: candidates[0].id, eid: engineers[0].id, rid: refs[0].id, amount: 999,  type: 'interview_booking', status: 'paid',    txn: 'pay_001' },
        { id: 2, uid: candidates[0].id, eid: engineers[1].id, rid: null,       amount: 999,  type: 'interview_booking', status: 'pending', txn: null },
        { id: 3, uid: candidates[2].id, eid: engineers[2].id, rid: refs[2].id, amount: 999,  type: 'interview_booking', status: 'paid',    txn: 'pay_003' },
        { id: 4, uid: candidates[3].id, eid: engineers[3].id, rid: refs[3].id, amount: 999,  type: 'interview_booking', status: 'paid',    txn: 'pay_004' },
        { id: 5, uid: candidates[1].id, eid: engineers[8].id, rid: refs[8].id, amount: 999,  type: 'interview_booking', status: 'paid',    txn: 'pay_005' },
        { id: 6, uid: candidates[0].id, eid: engineers[0].id, rid: refs[0].id, amount: 5000, type: 'referral_bonus',    status: 'paid',    txn: 'pay_006' },
        { id: 7, uid: candidates[2].id, eid: engineers[2].id, rid: refs[2].id, amount: 5000, type: 'referral_bonus',    status: 'pending', txn: null },
        { id: 8, uid: candidates[4].id, eid: engineers[4].id, rid: null,       amount: 999,  type: 'interview_booking', status: 'paid',    txn: 'pay_008' },
    ];
    for (const p of payDefs) {
        await prisma.payment.upsert({
            where: { id: p.id }, update: {},
            create: { id: p.id, user_id: p.uid, engineer_id: p.eid, referral_id: p.rid, amount: p.amount, type: p.type, status: p.status, transaction_id: p.txn },
        });
    }
    console.log('✅ Payments created (8)');

    console.log('\n🎉 Seed complete!\n');
    console.log('─────────────────────────────────────────');
    console.log('All passwords: password123');
    console.log('─────────────────────────────────────────');
    console.log('CANDIDATES:');
    candDefs.forEach(c => console.log('  ' + c.email));
    console.log('\nENGINEERS:');
    engDefs.forEach(e => console.log('  ' + e.email));
    console.log('\nCOMPANIES:');
    companyDefs.forEach(c => console.log('  ' + c.email));
    console.log('─────────────────────────────────────────\n');
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
