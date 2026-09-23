-- CareEcho Expectations & Feedback Management System Schema
-- Production PostgreSQL Database Definition
-- NO EMAIL FIELDS ANYWHERE

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. States Table
CREATE TABLE IF NOT EXISTS states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Facilities Table
CREATE TABLE IF NOT EXISTS facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    ward VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_facilities_state_id ON facilities(state_id);

-- 3. Users Table (NO EMAIL)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    state_id UUID REFERENCES states(id) ON DELETE SET NULL,
    facility_id UUID REFERENCES facilities(id) ON DELETE SET NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN', 'SUPER_ADMIN')),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    avatar VARCHAR(50) DEFAULT 'avatar_1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_phone_number ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_state_facility ON users(state_id, facility_id);

-- 4. Expectations Table
CREATE TABLE IF NOT EXISTS expectations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(50) NOT NULL,
    expectation_text TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'RECORDED' CHECK (status IN ('RECORDED', 'RECONCILED', 'CANCELLED')),
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_expectations_user_id ON expectations(user_id);
CREATE INDEX IF NOT EXISTS idx_expectations_submitted_at ON expectations(submitted_at);

-- 5. Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expectation_id UUID NOT NULL REFERENCES expectations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expectation_met BOOLEAN NOT NULL,
    feedback_text TEXT NULL,
    tags TEXT[] DEFAULT '{}',
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_conditional_feedback CHECK (
        expectation_met = TRUE
        OR (
            expectation_met = FALSE
            AND feedback_text IS NOT NULL
            AND LENGTH(TRIM(feedback_text)) > 0
        )
    )
);

CREATE INDEX IF NOT EXISTS idx_feedback_expectation_id ON feedback(expectation_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_expectation_met ON feedback(expectation_met);

-- 6. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NULL,
    details JSONB NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
