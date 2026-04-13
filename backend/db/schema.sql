-- ── Users ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id           SERIAL PRIMARY KEY,
  firebase_uid VARCHAR(128) UNIQUE NOT NULL,
  email        VARCHAR(255) UNIQUE NOT NULL,
  name         VARCHAR(255),
  role         VARCHAR(20) NOT NULL CHECK (role IN ('candidate', 'engineer', 'company', 'admin')),
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Candidate Profiles ────────────────────────────────────
CREATE TABLE IF NOT EXISTS candidate_profiles (
  id          SERIAL PRIMARY KEY,
  user_id     VARCHAR(128) UNIQUE REFERENCES users(firebase_uid) ON DELETE CASCADE,
  skills      TEXT[],
  resume_url  TEXT,
  github      VARCHAR(255),
  portfolio   VARCHAR(255),
  bio         TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Engineer Profiles ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS engineer_profiles (
  id                SERIAL PRIMARY KEY,
  user_id           VARCHAR(128) UNIQUE REFERENCES users(firebase_uid) ON DELETE CASCADE,
  company           VARCHAR(255),
  designation       VARCHAR(255),
  experience_years  INTEGER DEFAULT 0,
  linkedin          VARCHAR(255),
  skills            TEXT[],
  verified          BOOLEAN DEFAULT FALSE,
  bio               TEXT,
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── Jobs ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jobs (
  id               SERIAL PRIMARY KEY,
  company_id       VARCHAR(128) REFERENCES users(firebase_uid) ON DELETE CASCADE,
  title            VARCHAR(255) NOT NULL,
  description      TEXT,
  location         VARCHAR(255),
  salary_range     VARCHAR(100),
  skills_required  TEXT[],
  status           VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
  posted_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── Applications ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS applications (
  id           SERIAL PRIMARY KEY,
  candidate_id VARCHAR(128) REFERENCES users(firebase_uid) ON DELETE CASCADE,
  job_id       INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  status       VARCHAR(30) DEFAULT 'applied' CHECK (status IN ('applied', 'reviewed', 'shortlisted', 'rejected', 'hired')),
  applied_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(candidate_id, job_id)
);

-- ── Referrals ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS referrals (
  id           SERIAL PRIMARY KEY,
  engineer_id  VARCHAR(128) REFERENCES users(firebase_uid) ON DELETE CASCADE,
  candidate_id VARCHAR(128) REFERENCES users(firebase_uid) ON DELETE CASCADE,
  job_id       INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  status       VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'hired')),
  note         TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Payments ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id             SERIAL PRIMARY KEY,
  user_id        VARCHAR(128) REFERENCES users(firebase_uid) ON DELETE CASCADE,
  engineer_id    VARCHAR(128) REFERENCES users(firebase_uid),
  referral_id    INTEGER REFERENCES referrals(id),
  amount         NUMERIC(10, 2) NOT NULL,
  type           VARCHAR(30) NOT NULL CHECK (type IN ('job_posting', 'mock_interview', 'premium', 'referral_reward')),
  status         VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  transaction_id VARCHAR(255),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── Documents (post-hire) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS documents (
  id                  SERIAL PRIMARY KEY,
  candidate_id        VARCHAR(128) REFERENCES users(firebase_uid) ON DELETE CASCADE,
  referral_id         INTEGER REFERENCES referrals(id),
  offer_letter_url    TEXT,
  joining_letter_url  TEXT,
  salary_slip_url     TEXT,
  verified            BOOLEAN DEFAULT FALSE,
  uploaded_at         TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(candidate_id, referral_id)
);

-- ── Mock Interviews ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS interviews (
  id            SERIAL PRIMARY KEY,
  candidate_id  VARCHAR(128) REFERENCES users(firebase_uid) ON DELETE CASCADE,
  engineer_id   VARCHAR(128) REFERENCES users(firebase_uid) ON DELETE CASCADE,
  scheduled_at  TIMESTAMPTZ,
  status        VARCHAR(20) DEFAULT 'booked' CHECK (status IN ('booked', 'completed', 'cancelled')),
  notes         TEXT,
  feedback      TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
