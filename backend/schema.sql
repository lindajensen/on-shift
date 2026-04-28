DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS employer_profile CASCADE;
DROP TABLE IF EXISTS worker_profile CASCADE;
DROP TABLE IF EXISTS worker_role CASCADE;
DROP TABLE IF EXISTS job CASCADE;
DROP TABLE IF EXISTS availability CASCADE;
DROP TABLE IF EXISTS availability CASCADE;
DROP TABLE IF EXISTS application CASCADE;
DROP TABLE IF EXISTS review CASCADE;
DROP TABLE IF EXISTS saved_worker CASCADE;
DROP TABLE IF EXISTS saved_employer CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('worker', 'employer')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employer_profile (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  description TEXT,
  email TEXT,
  phone TEXT,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE worker_profile (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  bio TEXT,
  education TEXT,
  email TEXT,
  phone TEXT,
  is_available BOOLEAN DEFAULT FALSE,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE worker_role (
  id SERIAL PRIMARY KEY,
  worker_id INTEGER NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('servitör', 'kock', 'bartender', 'diskare', 'runner', 'servis extra')),
  experience_level TEXT CHECK (experience_level IN ('beginner', 'junior', 'experienced', 'senior')),
  FOREIGN KEY (worker_id) REFERENCES worker_profile(id) ON DELETE CASCADE
);

CREATE TABLE job (
  id SERIAL PRIMARY KEY,
  employer_id INTEGER NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  compensation NUMERIC (10, 2) NOT NULL,
  job_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'filled', 'closed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (employer_id) REFERENCES employer_profile(id) ON DELETE CASCADE
);

CREATE TABLE availability (
  id SERIAL PRIMARY KEY,
  worker_id INTEGER NOT NULL,
  day_of_week TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,

  FOREIGN KEY (worker_id) REFERENCES worker_profile(id) ON DELETE CASCADE
);

CREATE TABLE application (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL,
  worker_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'hired', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE (job_id, worker_id),

  FOREIGN KEY (job_id) REFERENCES job(id) ON DELETE CASCADE,
  FOREIGN KEY (worker_id) REFERENCES worker_profile(id) ON DELETE CASCADE
);

CREATE TABLE review (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL,
  reviewer_id INTEGER NOT NULL,
  reviewee_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CHECK (reviewer_id <> reviewee_id),
  UNIQUE (job_id, reviewer_id, reviewee_id),

  FOREIGN KEY (job_id) REFERENCES job(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE saved_worker (
  id SERIAL PRIMARY KEY,
  employer_id INTEGER NOT NULL,
  worker_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE (employer_id, worker_id),

  FOREIGN KEY (employer_id) REFERENCES employer_profile(id) ON DELETE CASCADE,
  FOREIGN KEY (worker_id) REFERENCES worker_profile(id) ON DELETE CASCADE
);

CREATE TABLE saved_employer (
  id SERIAL PRIMARY KEY,
  employer_id INTEGER NOT NULL,
  worker_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE (employer_id, worker_id),

  FOREIGN KEY (employer_id) REFERENCES employer_profile(id) ON DELETE CASCADE,
  FOREIGN KEY (worker_id) REFERENCES worker_profile(id) ON DELETE CASCADE
);
