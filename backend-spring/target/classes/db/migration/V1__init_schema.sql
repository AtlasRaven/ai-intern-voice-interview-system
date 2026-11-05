-- =============================================================================
-- V1__init_schema.sql
-- Voice AI Intern Interview System - Normalized 3NF Schema
-- PostgreSQL 16+ DDL
-- =============================================================================

-- 1. Roles table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- 2. Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_email ON users(email);

-- 3. Candidates table
CREATE TABLE IF NOT EXISTS candidates (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    university VARCHAR(200),
    major VARCHAR(150),
    graduation_year INT,
    gpa NUMERIC(3,2),
    cv_url VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Skills table
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL
);

-- 5. Positions table
CREATE TABLE IF NOT EXISTS positions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    is_open BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_positions_code ON positions(code);

-- 6. Position Skills intersection table (2NF/3NF M-N mapping)
CREATE TABLE IF NOT EXISTS position_skills (
    position_id INT NOT NULL REFERENCES positions(id) ON DELETE CASCADE,
    skill_id INT NOT NULL REFERENCES skills(id) ON DELETE RESTRICT,
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (position_id, skill_id)
);

-- 7. Questions table
CREATE TABLE IF NOT EXISTS questions (
    id BIGSERIAL PRIMARY KEY,
    position_id INT NOT NULL REFERENCES positions(id) ON DELETE RESTRICT,
    content TEXT NOT NULL,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
    sample_answer TEXT NOT NULL,
    evaluation_rubric TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_questions_pos_diff ON questions(position_id, difficulty);

-- 8. Question Skills intersection table
CREATE TABLE IF NOT EXISTS question_skills (
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    skill_id INT NOT NULL REFERENCES skills(id) ON DELETE RESTRICT,
    PRIMARY KEY (question_id, skill_id)
);

-- 9. Interview Sessions table
CREATE TABLE IF NOT EXISTS interview_sessions (
    id BIGSERIAL PRIMARY KEY,
    candidate_id BIGINT NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    position_id INT NOT NULL REFERENCES positions(id) ON DELETE RESTRICT,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED' 
        CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'TIMEOUT')),
    scheduled_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_candidate ON interview_sessions(candidate_id);
CREATE INDEX idx_sessions_status ON interview_sessions(status);
CREATE INDEX idx_sessions_token ON interview_sessions(session_token);

-- 10. Session Questions table
CREATE TABLE IF NOT EXISTS session_questions (
    id BIGSERIAL PRIMARY KEY,
    session_id BIGINT NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE RESTRICT,
    sequence_order INT NOT NULL,
    asked_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_session_question_order UNIQUE (session_id, sequence_order)
);

CREATE INDEX idx_sess_ques_order ON session_questions(session_id, sequence_order);

-- 11. Transcript Segments table
CREATE TABLE IF NOT EXISTS transcript_segments (
    id BIGSERIAL PRIMARY KEY,
    session_id BIGINT NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    session_question_id BIGINT REFERENCES session_questions(id) ON DELETE SET NULL,
    question_text TEXT NOT NULL,
    answer_text TEXT NOT NULL,
    duration_seconds INT NOT NULL DEFAULT 0,
    audio_recording_url VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transcripts_session ON transcript_segments(session_id);

-- 12. Evaluations table
CREATE TABLE IF NOT EXISTS evaluations (
    id BIGSERIAL PRIMARY KEY,
    session_id BIGINT NOT NULL UNIQUE REFERENCES interview_sessions(id) ON DELETE CASCADE,
    technical_score NUMERIC(4,2) NOT NULL CHECK (technical_score >= 0.0 AND technical_score <= 10.0),
    problem_solving_score NUMERIC(4,2) NOT NULL CHECK (problem_solving_score >= 0.0 AND problem_solving_score <= 10.0),
    communication_score NUMERIC(4,2) NOT NULL CHECK (communication_score >= 0.0 AND communication_score <= 10.0),
    overall_score NUMERIC(4,2) NOT NULL CHECK (overall_score >= 0.0 AND overall_score <= 10.0),
    ai_feedback TEXT NOT NULL,
    hr_score_override NUMERIC(4,2) CHECK (hr_score_override >= 0.0 AND hr_score_override <= 10.0),
    hr_notes TEXT,
    hr_evaluator_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    final_status VARCHAR(30) NOT NULL DEFAULT 'UNDER_REVIEW' 
        CHECK (final_status IN ('PASSED', 'FAILED', 'UNDER_REVIEW')),
    evaluated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_eval_session ON evaluations(session_id);
CREATE INDEX idx_eval_scores ON evaluations(overall_score DESC, final_status);

-- 13. Consents table
CREATE TABLE IF NOT EXISTS consents (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    consent_type VARCHAR(50) NOT NULL,
    agreed BOOLEAN NOT NULL DEFAULT TRUE,
    policy_version VARCHAR(20) NOT NULL,
    ip_address VARCHAR(50),
    user_agent VARCHAR(500),
    agreed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_consents_user_type ON consents(user_id, consent_type);

-- 14. Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);
