CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('candidate', 'engineer', 'company', 'admin');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_status') THEN
    CREATE TYPE job_status AS ENUM ('active', 'closed', 'draft');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
    CREATE TYPE application_status AS ENUM ('applied', 'reviewed', 'shortlisted', 'rejected', 'hired');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'referral_status') THEN
    CREATE TYPE referral_status AS ENUM ('pending', 'accepted', 'rejected', 'hired');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_type') THEN
    CREATE TYPE payment_type AS ENUM ('job_posting', 'mock_interview', 'premium', 'referral_reward');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
    CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'interview_status') THEN
    CREATE TYPE interview_status AS ENUM ('booked', 'completed', 'cancelled');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role user_role NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS candidate_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  resume_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  bio TEXT,
  location VARCHAR(255),
  experience_level VARCHAR(50),
  projects JSONB,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS engineer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company VARCHAR(255),
  designation VARCHAR(255),
  experience_years INT DEFAULT 0,
  linkedin_url TEXT,
  skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  verified BOOLEAN DEFAULT false,
  rating DOUBLE PRECISION DEFAULT 0,
  total_earnings DECIMAL(12, 2) DEFAULT 0,
  bio TEXT,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  salary_range VARCHAR(100),
  skills_required TEXT[] DEFAULT ARRAY[]::TEXT[],
  status job_status DEFAULT 'active',
  is_deleted BOOLEAN DEFAULT false,
  posted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  status application_status DEFAULT 'applied',
  is_deleted BOOLEAN DEFAULT false,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(candidate_id, job_id)
);

CREATE TABLE IF NOT EXISTS referral_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  engineer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  message TEXT,
  status referral_status DEFAULT 'pending',
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  engineer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INT NOT NULL,
  comment TEXT,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  engineer_id UUID REFERENCES users(id),
  referral_id UUID REFERENCES referral_requests(id),
  amount DECIMAL(10, 2) NOT NULL,
  type payment_type NOT NULL,
  status payment_status DEFAULT 'pending',
  transaction_id VARCHAR(255),
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referral_id UUID UNIQUE REFERENCES referral_requests(id),
  offer_letter_url TEXT,
  joining_letter_url TEXT,
  salary_slip_url TEXT,
  verified BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(candidate_id, referral_id)
);

CREATE TABLE IF NOT EXISTS interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  engineer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ,
  status interview_status DEFAULT 'booked',
  notes TEXT,
  feedback TEXT,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_referral_requests_candidate_id ON referral_requests(candidate_id);
CREATE INDEX IF NOT EXISTS idx_referral_requests_engineer_id ON referral_requests(engineer_id);
CREATE INDEX IF NOT EXISTS idx_referral_requests_job_id ON referral_requests(job_id);
CREATE INDEX IF NOT EXISTS idx_reviews_engineer_id ON reviews(engineer_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_engineer_id ON payments(engineer_id);
CREATE INDEX IF NOT EXISTS idx_payments_referral_id ON payments(referral_id);
CREATE INDEX IF NOT EXISTS idx_documents_candidate_id ON documents(candidate_id);
CREATE INDEX IF NOT EXISTS idx_documents_referral_id ON documents(referral_id);
CREATE INDEX IF NOT EXISTS idx_interviews_candidate_id ON interviews(candidate_id);
CREATE INDEX IF NOT EXISTS idx_interviews_engineer_id ON interviews(engineer_id);
