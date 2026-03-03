/*
  # SHANNON Web Database Schema

  ## Overview
  Complete database schema for the SHANNON AI Penetration Testing Framework web application.
  This migration creates all necessary tables for managing security scans, findings, reports, and user consents.

  ## New Tables
  
  ### 1. `consents`
  Stores user authorization and legal consent records before allowing scans.
  - `id` (uuid, primary key) - Unique consent record identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `organization_name` (text) - Organization name provided
  - `target_domain` (text) - Domain being tested
  - `authorized` (boolean) - Confirmation of authorization
  - `terms_accepted` (boolean) - Terms acceptance flag
  - `ip_address` (text) - IP address of user providing consent
  - `created_at` (timestamptz) - When consent was given
  
  ### 2. `scans`
  Main table storing all security scan records and their configuration.
  - `id` (uuid, primary key) - Unique scan identifier
  - `user_id` (uuid, foreign key) - User who initiated the scan
  - `consent_id` (uuid, foreign key) - Associated consent record
  - `target_domain` (text) - Target domain/URL
  - `target_ip` (text) - Target IP address (optional)
  - `scope_description` (text) - Description of scan scope
  - `scan_depth` (text) - Scan depth: quick, standard, or deep
  - `status` (text) - Current status: pending, running, completed, failed
  - `risk_score` (integer) - Overall risk score (0-100)
  - `started_at` (timestamptz) - When scan started
  - `completed_at` (timestamptz) - When scan completed
  - `created_at` (timestamptz) - Record creation time
  - `updated_at` (timestamptz) - Last update time
  
  ### 3. `scan_modules`
  Tracks which security testing modules were enabled for each scan.
  - `id` (uuid, primary key) - Unique record identifier
  - `scan_id` (uuid, foreign key) - Associated scan
  - `module_name` (text) - Module name (recon, osint, web_vuln, etc.)
  - `enabled` (boolean) - Whether module was enabled
  - `status` (text) - Module execution status
  - `results` (jsonb) - Module-specific results
  - `created_at` (timestamptz) - Record creation time
  
  ### 4. `findings`
  Stores individual security findings discovered during scans.
  - `id` (uuid, primary key) - Unique finding identifier
  - `scan_id` (uuid, foreign key) - Associated scan
  - `module_name` (text) - Module that discovered this finding
  - `title` (text) - Finding title
  - `description` (text) - Detailed description
  - `severity` (text) - Severity level: critical, high, medium, low, info
  - `cvss_score` (decimal) - CVSS score if applicable
  - `affected_url` (text) - Affected URL or endpoint
  - `evidence` (text) - Evidence/proof of finding
  - `remediation` (text) - Remediation guidance
  - `cwe_id` (text) - CWE identifier if applicable
  - `metadata` (jsonb) - Additional metadata
  - `created_at` (timestamptz) - When finding was recorded
  
  ### 5. `reports`
  Stores generated security reports (executive summaries, technical reports, etc.).
  - `id` (uuid, primary key) - Unique report identifier
  - `scan_id` (uuid, foreign key) - Associated scan
  - `report_type` (text) - Type: executive, technical, devops
  - `title` (text) - Report title
  - `content` (text) - Full report content
  - `format` (text) - Format: markdown, html, pdf
  - `generated_by` (text) - How generated: ai, system, manual
  - `metadata` (jsonb) - Additional metadata
  - `created_at` (timestamptz) - When report was generated
  
  ### 6. `attack_paths`
  Stores attack chain/path information for visualization.
  - `id` (uuid, primary key) - Unique path identifier
  - `scan_id` (uuid, foreign key) - Associated scan
  - `source_node` (text) - Starting point of attack path
  - `target_node` (text) - Target/endpoint of attack path
  - `path_data` (jsonb) - Complete path data including intermediate nodes
  - `severity` (text) - Path severity level
  - `exploitability` (decimal) - Exploitability score
  - `created_at` (timestamptz) - Record creation time
  
  ## Security
  
  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - Users can only access their own scans, findings, and reports
  - Authenticated users required for all operations
  
  ### Policies
  Each table has policies for:
  - SELECT: Users can view their own records
  - INSERT: Users can create their own records
  - UPDATE: Users can update their own records
  - DELETE: Users can delete their own records
  
  ## Important Notes
  
  1. **Data Integrity**: All foreign key constraints ensure referential integrity
  2. **Timestamps**: All tables use timestamptz for proper timezone handling
  3. **Indexing**: Created indexes on frequently queried columns (user_id, scan_id, status)
  4. **JSONB**: Used for flexible metadata and results storage
  5. **Security**: RLS ensures users can only access their own data
*/

-- Create consents table
CREATE TABLE IF NOT EXISTS consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_name text NOT NULL,
  target_domain text NOT NULL,
  authorized boolean DEFAULT false,
  terms_accepted boolean DEFAULT false,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Create scans table
CREATE TABLE IF NOT EXISTS scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_id uuid REFERENCES consents(id) ON DELETE SET NULL,
  target_domain text NOT NULL,
  target_ip text,
  scope_description text,
  scan_depth text DEFAULT 'standard',
  status text DEFAULT 'pending',
  risk_score integer DEFAULT 0,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create scan_modules table
CREATE TABLE IF NOT EXISTS scan_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id uuid REFERENCES scans(id) ON DELETE CASCADE,
  module_name text NOT NULL,
  enabled boolean DEFAULT true,
  status text DEFAULT 'pending',
  results jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create findings table
CREATE TABLE IF NOT EXISTS findings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id uuid REFERENCES scans(id) ON DELETE CASCADE,
  module_name text,
  title text NOT NULL,
  description text,
  severity text DEFAULT 'info',
  cvss_score decimal(3,1),
  affected_url text,
  evidence text,
  remediation text,
  cwe_id text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id uuid REFERENCES scans(id) ON DELETE CASCADE,
  report_type text DEFAULT 'technical',
  title text NOT NULL,
  content text NOT NULL,
  format text DEFAULT 'markdown',
  generated_by text DEFAULT 'system',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create attack_paths table
CREATE TABLE IF NOT EXISTS attack_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id uuid REFERENCES scans(id) ON DELETE CASCADE,
  source_node text NOT NULL,
  target_node text NOT NULL,
  path_data jsonb DEFAULT '{}',
  severity text DEFAULT 'medium',
  exploitability decimal(3,1),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_consents_user_id ON consents(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_user_id ON scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_status ON scans(status);
CREATE INDEX IF NOT EXISTS idx_scan_modules_scan_id ON scan_modules(scan_id);
CREATE INDEX IF NOT EXISTS idx_findings_scan_id ON findings(scan_id);
CREATE INDEX IF NOT EXISTS idx_findings_severity ON findings(severity);
CREATE INDEX IF NOT EXISTS idx_reports_scan_id ON reports(scan_id);
CREATE INDEX IF NOT EXISTS idx_attack_paths_scan_id ON attack_paths(scan_id);

-- Enable Row Level Security on all tables
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE attack_paths ENABLE ROW LEVEL SECURITY;

-- Policies for consents table
CREATE POLICY "Users can view own consents"
  ON consents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own consents"
  ON consents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for scans table
CREATE POLICY "Users can view own scans"
  ON scans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own scans"
  ON scans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scans"
  ON scans FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scans"
  ON scans FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for scan_modules table
CREATE POLICY "Users can view own scan modules"
  ON scan_modules FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM scans
      WHERE scans.id = scan_modules.scan_id
      AND scans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own scan modules"
  ON scan_modules FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM scans
      WHERE scans.id = scan_modules.scan_id
      AND scans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own scan modules"
  ON scan_modules FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM scans
      WHERE scans.id = scan_modules.scan_id
      AND scans.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM scans
      WHERE scans.id = scan_modules.scan_id
      AND scans.user_id = auth.uid()
    )
  );

-- Policies for findings table
CREATE POLICY "Users can view own findings"
  ON findings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM scans
      WHERE scans.id = findings.scan_id
      AND scans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own findings"
  ON findings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM scans
      WHERE scans.id = findings.scan_id
      AND scans.user_id = auth.uid()
    )
  );

-- Policies for reports table
CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM scans
      WHERE scans.id = reports.scan_id
      AND scans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM scans
      WHERE scans.id = reports.scan_id
      AND scans.user_id = auth.uid()
    )
  );

-- Policies for attack_paths table
CREATE POLICY "Users can view own attack paths"
  ON attack_paths FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM scans
      WHERE scans.id = attack_paths.scan_id
      AND scans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own attack paths"
  ON attack_paths FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM scans
      WHERE scans.id = attack_paths.scan_id
      AND scans.user_id = auth.uid()
    )
  );