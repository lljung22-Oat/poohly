CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(64) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL,
  track VARCHAR(32) NULL,
  full_name VARCHAR(255) NOT NULL,
  position_name VARCHAR(255) NULL,
  staff_id VARCHAR(64) NULL,
  person_type VARCHAR(255) NULL,
  department_name VARCHAR(255) NULL,
  faculty_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NULL,
  supervisor_id INT NULL,
  start_date DATE NULL,
  fail_ratee INT NOT NULL DEFAULT 0,
  lock_ratee_until DATETIME NULL,
  fail_eval INT NOT NULL DEFAULT 0,
  lock_eval_until DATETIME NULL,
  fail_admin INT NOT NULL DEFAULT 0,
  lock_admin_until DATETIME NULL
);

CREATE TABLE IF NOT EXISTS rounds (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fiscal_year VARCHAR(8) NOT NULL UNIQUE,
  calendar_dates VARCHAR(64) NOT NULL DEFAULT 'SOURCE_MISSING',
  round_pattern VARCHAR(64) NOT NULL DEFAULT 'SOURCE_MISSING'
);

CREATE TABLE IF NOT EXISTS evaluation_sets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  round_id INT NOT NULL,
  form_type VARCHAR(8) NOT NULL,
  status VARCHAR(32) NOT NULL,
  enabled TINYINT NOT NULL DEFAULT 0,
  faculty_signed TINYINT NOT NULL DEFAULT 0,
  disagree_reason TEXT NULL,
  UNIQUE KEY uniq_set (user_id, round_id, form_type)
);

CREATE TABLE IF NOT EXISTS workloads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  round_id INT NOT NULL,
  group_no TINYINT NOT NULL,
  group_id VARCHAR(32) NOT NULL,
  title VARCHAR(700) NOT NULL,
  weight DECIMAL(6,2) NULL,
  UNIQUE KEY uniq_workload (user_id, round_id, group_id)
);

CREATE TABLE IF NOT EXISTS agreements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  workload_id INT NOT NULL,
  title VARCHAR(700) NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'draft',
  decision_reason TEXT NULL
);

CREATE TABLE IF NOT EXISTS indicators (
  id INT PRIMARY KEY AUTO_INCREMENT,
  agreement_id INT NOT NULL,
  title VARCHAR(700) NULL,
  kind VARCHAR(64) NULL,
  weight DECIMAL(6,2) NULL,
  target_text VARCHAR(700) NULL,
  indicator_ref VARCHAR(32) NULL,
  self_score DECIMAL(4,2) NULL,
  head_score DECIMAL(4,2) NULL,
  self_locked TINYINT NOT NULL DEFAULT 0,
  head_locked TINYINT NOT NULL DEFAULT 0,
  evidence_name VARCHAR(255) NULL,
  evidence_path VARCHAR(255) NULL
);

CREATE TABLE IF NOT EXISTS competency_scores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  round_id INT NOT NULL,
  competency_type VARCHAR(8) NOT NULL,
  code VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  self_score DECIMAL(4,2) NULL,
  first_score DECIMAL(4,2) NULL,
  head_score DECIMAL(4,2) NULL,
  self_locked TINYINT NOT NULL DEFAULT 0,
  first_locked TINYINT NOT NULL DEFAULT 0,
  head_locked TINYINT NOT NULL DEFAULT 0,
  UNIQUE KEY uniq_comp (user_id, round_id, competency_type, code)
);

CREATE TABLE IF NOT EXISTS score_reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  round_id INT NOT NULL,
  strengths TEXT NULL,
  improvements TEXT NULL,
  suggestions TEXT NULL,
  checked_at DATETIME NULL,
  UNIQUE KEY uniq_review (user_id, round_id)
);

CREATE TABLE IF NOT EXISTS idp_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  round_id INT NOT NULL,
  title VARCHAR(700) NULL,
  method VARCHAR(8) NULL,
  budget DECIMAL(12,2) NOT NULL DEFAULT 0,
  report_text TEXT NULL,
  result_label VARCHAR(255) NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'draft',
  report_locked TINYINT NOT NULL DEFAULT 0,
  decision_reason TEXT NULL
);

CREATE TABLE IF NOT EXISTS research_int (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  round_id INT NOT NULL,
  status_text VARCHAR(255) NULL,
  row_no VARCHAR(64) NULL,
  project_name TEXT NULL,
  leader TEXT NULL,
  affiliation VARCHAR(255) NULL,
  fund_name VARCHAR(255) NULL,
  start_text VARCHAR(255) NULL,
  end_text VARCHAR(255) NULL,
  amount_text VARCHAR(255) NULL,
  objective TEXT NULL,
  benefit TEXT NULL,
  output_text TEXT NULL,
  contract_no VARCHAR(255) NULL
);

CREATE TABLE IF NOT EXISTS research_notice (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  round_id INT NOT NULL,
  row_no VARCHAR(64) NULL,
  project_name TEXT NULL,
  leader TEXT NULL,
  affiliation VARCHAR(255) NULL,
  remark VARCHAR(255) NULL
);
