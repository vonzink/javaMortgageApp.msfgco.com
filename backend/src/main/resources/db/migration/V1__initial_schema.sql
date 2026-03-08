-- V1__initial_schema.sql
-- Create all tables for the MSFG Mortgage Application

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    initials VARCHAR(10),
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(512) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);

CREATE TABLE IF NOT EXISTS loan_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_number VARCHAR(50) NOT NULL UNIQUE,
    loan_purpose VARCHAR(100),
    loan_type VARCHAR(100),
    loan_amount DECIMAL(15, 2),
    property_value DECIMAL(15, 2),
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    ghl_contact_id VARCHAR(255),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_loan_applications_status ON loan_applications(status);
CREATE INDEX idx_loan_applications_number ON loan_applications(application_number);

CREATE TABLE IF NOT EXISTS borrowers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    sequence_number INT,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    ssn VARCHAR(20),
    birth_date VARCHAR(20),
    marital_status VARCHAR(50),
    email VARCHAR(255),
    phone VARCHAR(50),
    citizenship_type VARCHAR(50),
    dependents_count INT,
    current_address_line VARCHAR(500),
    current_city VARCHAR(255),
    current_state VARCHAR(50),
    current_zip_code VARCHAR(20),
    FOREIGN KEY (application_id) REFERENCES loan_applications(id) ON DELETE CASCADE
);

CREATE INDEX idx_borrowers_application_id ON borrowers(application_id);

CREATE TABLE IF NOT EXISTS properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    address_line VARCHAR(500),
    city VARCHAR(255),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    county VARCHAR(255),
    property_type VARCHAR(100),
    property_value DECIMAL(15, 2),
    construction_type VARCHAR(100),
    year_built VARCHAR(10),
    units_count INT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES loan_applications(id) ON DELETE CASCADE
);

CREATE INDEX idx_properties_application_id ON properties(application_id);

CREATE TABLE IF NOT EXISTS employment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    borrower_id INT NOT NULL,
    sequence_number INT,
    employer_name VARCHAR(255),
    position VARCHAR(255),
    employer_phone VARCHAR(50),
    employer_address VARCHAR(500),
    employer_city VARCHAR(255),
    employer_state VARCHAR(50),
    employer_zip VARCHAR(20),
    start_date VARCHAR(20),
    end_date VARCHAR(20),
    monthly_income DECIMAL(15, 2),
    employment_status VARCHAR(50),
    is_present BOOLEAN DEFAULT FALSE,
    self_employed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (borrower_id) REFERENCES borrowers(id) ON DELETE CASCADE
);

CREATE INDEX idx_employment_borrower_id ON employment(borrower_id);

CREATE TABLE IF NOT EXISTS income_sources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    borrower_id INT NOT NULL,
    income_type VARCHAR(100),
    monthly_amount DECIMAL(15, 2),
    description VARCHAR(500),
    FOREIGN KEY (borrower_id) REFERENCES borrowers(id) ON DELETE CASCADE
);

CREATE INDEX idx_income_sources_borrower_id ON income_sources(borrower_id);

CREATE TABLE IF NOT EXISTS assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    borrower_id INT NOT NULL,
    asset_type VARCHAR(100),
    bank_name VARCHAR(255),
    account_number VARCHAR(100),
    asset_value DECIMAL(15, 2),
    used_for_downpayment BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (borrower_id) REFERENCES borrowers(id) ON DELETE CASCADE
);

CREATE INDEX idx_assets_borrower_id ON assets(borrower_id);

CREATE TABLE IF NOT EXISTS liabilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    borrower_id INT,
    account_number VARCHAR(100),
    creditor_name VARCHAR(255),
    liability_type VARCHAR(100),
    monthly_payment DECIMAL(15, 2),
    unpaid_balance DECIMAL(15, 2),
    payoff_status BOOLEAN DEFAULT FALSE,
    to_be_paid_off BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (application_id) REFERENCES loan_applications(id) ON DELETE CASCADE,
    FOREIGN KEY (borrower_id) REFERENCES borrowers(id) ON DELETE SET NULL
);

CREATE INDEX idx_liabilities_application_id ON liabilities(application_id);
CREATE INDEX idx_liabilities_borrower_id ON liabilities(borrower_id);

CREATE TABLE IF NOT EXISTS residences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    borrower_id INT NOT NULL,
    address_line VARCHAR(500),
    city VARCHAR(255),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    residency_type VARCHAR(50),
    residency_basis VARCHAR(50),
    duration_months INT,
    monthly_rent DECIMAL(15, 2),
    FOREIGN KEY (borrower_id) REFERENCES borrowers(id) ON DELETE CASCADE
);

CREATE INDEX idx_residences_borrower_id ON residences(borrower_id);

CREATE TABLE IF NOT EXISTS reo_properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    borrower_id INT NOT NULL,
    sequence_number INT,
    address_line VARCHAR(500),
    city VARCHAR(255),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    property_type VARCHAR(100),
    property_value DECIMAL(15, 2),
    monthly_rental_income DECIMAL(15, 2),
    monthly_payment DECIMAL(15, 2),
    unpaid_balance DECIMAL(15, 2),
    FOREIGN KEY (borrower_id) REFERENCES borrowers(id) ON DELETE CASCADE
);

CREATE INDEX idx_reo_properties_borrower_id ON reo_properties(borrower_id);

CREATE TABLE IF NOT EXISTS declarations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    borrower_id INT NOT NULL,
    outstanding_judgments BOOLEAN DEFAULT FALSE,
    bankruptcy BOOLEAN DEFAULT FALSE,
    foreclosure BOOLEAN DEFAULT FALSE,
    lawsuit BOOLEAN DEFAULT FALSE,
    loan_foreclosure BOOLEAN DEFAULT FALSE,
    presently_delinquent BOOLEAN DEFAULT FALSE,
    alimony_child_support BOOLEAN DEFAULT FALSE,
    borrowing_down_payment BOOLEAN DEFAULT FALSE,
    comaker_endorser BOOLEAN DEFAULT FALSE,
    us_citizen BOOLEAN DEFAULT FALSE,
    permanent_resident BOOLEAN DEFAULT FALSE,
    intent_to_occupy BOOLEAN DEFAULT FALSE,
    down_payment_gift BOOLEAN DEFAULT FALSE,
    ownership_interest BOOLEAN DEFAULT FALSE,
    property_type_changed BOOLEAN DEFAULT FALSE,
    prior_property_type BOOLEAN DEFAULT FALSE,
    prior_property_title BOOLEAN DEFAULT FALSE,
    gift_source VARCHAR(255),
    co_signer_obligation VARCHAR(500),
    credit_explanation TEXT,
    employment_gap_explanation TEXT,
    gift_amount DECIMAL(15, 2),
    pending_credit_inquiry BOOLEAN DEFAULT FALSE,
    income_verification_consent BOOLEAN DEFAULT FALSE,
    credit_report_consent BOOLEAN DEFAULT FALSE,
    property_insurance_required BOOLEAN DEFAULT FALSE,
    flood_insurance_required BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (borrower_id) REFERENCES borrowers(id) ON DELETE CASCADE
);

CREATE INDEX idx_declarations_borrower_id ON declarations(borrower_id);

CREATE TABLE IF NOT EXISTS documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    document_type VARCHAR(100),
    file_name VARCHAR(500),
    file_path VARCHAR(1000),
    file_size BIGINT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES loan_applications(id) ON DELETE CASCADE
);

CREATE INDEX idx_documents_application_id ON documents(application_id);
