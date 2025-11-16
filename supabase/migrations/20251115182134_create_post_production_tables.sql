/*
  # Post-Production Management System

  ## Overview
  Creates comprehensive database structure for post-production workflows including file organization, edit progress tracking, client reviews, render queue, deliverables, revisions, and backup verification.

  ## New Tables

  ### 1. file_organization
    - Tracks file metadata and folder structure
    - Records file types, sizes, and storage locations
    - Links to projects table
    - Supports organization by date, type, camera, priority

  ### 2. edit_stages
    - Individual editing workflow stages per project
    - Tracks status (not-started, in-progress, complete)
    - Time tracking (estimated vs actual hours)
    - Notes and assignee fields
    - Sorting order for custom stage sequences

  ### 3. review_versions
    - Version control for client reviews (V1, V2, V3, Final)
    - Tracks approval status and upload dates
    - Stores video URLs (mockup/embedded)
    - Links to projects table

  ### 4. review_comments
    - Timecode-based feedback on review versions
    - Comment types (change, suggestion, compliment)
    - Resolution tracking
    - Threaded conversations support

  ### 5. render_tasks
    - Render queue management
    - Format, resolution, and codec settings
    - Priority queue with status tracking
    - Estimated time and file size
    - Progress percentage for active renders

  ### 6. deliverables
    - Final export tracking
    - Delivery method and status
    - File naming conventions
    - Quality checklist completion

  ### 7. delivery_checklist_items
    - Pre-delivery quality check items
    - Custom and default checklist items
    - Completion tracking per project

  ### 8. revisions
    - Version history with change logs
    - Tracks what changed and why
    - Time spent per revision round
    - Revision limit tracking against contract

  ### 9. backup_locations
    - Backup location tracking (NAS, Cloud, HDD)
    - Verification status and timestamps
    - File integrity checks
    - Retention policy settings

  ## Security
  - RLS enabled on all tables
  - Public access policies for development (update for production auth)
  - All tables include created_at and updated_at timestamps

  ## Notes
  - All foreign keys use CASCADE delete for referential integrity
  - Timestamps use timestamptz for timezone awareness
  - Default values ensure data consistency
  - Indexes on foreign keys for query performance
*/

-- Create file_organization table
CREATE TABLE IF NOT EXISTS file_organization (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size text NOT NULL,
  folder_path text NOT NULL DEFAULT '/',
  storage_location text DEFAULT 'local',
  upload_date timestamptz DEFAULT now(),
  shoot_date timestamptz,
  camera_used text,
  priority text DEFAULT 'normal',
  tags text[] DEFAULT '{}',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create edit_stages table
CREATE TABLE IF NOT EXISTS edit_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  stage_name text NOT NULL,
  status text NOT NULL DEFAULT 'not-started',
  estimated_hours numeric NOT NULL DEFAULT 0,
  actual_hours numeric NOT NULL DEFAULT 0,
  notes text DEFAULT '',
  assignee text DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create review_versions table
CREATE TABLE IF NOT EXISTS review_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  version_name text NOT NULL,
  file_url text,
  file_size text,
  resolution text,
  duration text,
  upload_date timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'pending',
  approved_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create review_comments table
CREATE TABLE IF NOT EXISTS review_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_version_id uuid NOT NULL REFERENCES review_versions(id) ON DELETE CASCADE,
  timecode text,
  comment text NOT NULL,
  comment_type text NOT NULL DEFAULT 'change',
  resolved boolean DEFAULT false,
  commenter_name text DEFAULT '',
  parent_comment_id uuid REFERENCES review_comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create render_tasks table
CREATE TABLE IF NOT EXISTS render_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  task_name text NOT NULL,
  format text NOT NULL DEFAULT 'MP4',
  resolution text NOT NULL DEFAULT '1080p',
  codec text DEFAULT 'H.264',
  estimated_size text DEFAULT '',
  estimated_time text DEFAULT '',
  status text NOT NULL DEFAULT 'queued',
  progress numeric NOT NULL DEFAULT 0,
  priority integer NOT NULL DEFAULT 3,
  preset_name text,
  error_message text,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create deliverables table
CREATE TABLE IF NOT EXISTS deliverables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  delivery_method text NOT NULL DEFAULT 'google-drive',
  shareable_link text,
  folder_structure jsonb DEFAULT '{}',
  naming_convention text DEFAULT '{ClientName}_{ProjectType}_{Date}',
  total_size text DEFAULT '',
  delivery_date timestamptz,
  confirmed boolean DEFAULT false,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create delivery_checklist_items table
CREATE TABLE IF NOT EXISTS delivery_checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  item_text text NOT NULL,
  completed boolean DEFAULT false,
  is_custom boolean DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create revisions table
CREATE TABLE IF NOT EXISTS revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  version_number integer NOT NULL DEFAULT 1,
  version_label text NOT NULL,
  changes_made text[] DEFAULT '{}',
  reason text DEFAULT '',
  time_spent_hours numeric DEFAULT 0,
  revision_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create backup_locations table
CREATE TABLE IF NOT EXISTS backup_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  location_name text NOT NULL,
  location_type text NOT NULL DEFAULT 'external-hdd',
  status text NOT NULL DEFAULT 'pending',
  last_backup_date timestamptz,
  backup_size text DEFAULT '',
  verification_hash text,
  error_message text,
  retention_days integer DEFAULT 365,
  auto_archive boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create storage_quota table for tracking overall storage
CREATE TABLE IF NOT EXISTS storage_quota (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  storage_used_gb numeric NOT NULL DEFAULT 0,
  storage_quota_gb numeric NOT NULL DEFAULT 100,
  files_count integer NOT NULL DEFAULT 0,
  organized_files_count integer NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE file_organization ENABLE ROW LEVEL SECURITY;
ALTER TABLE edit_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE render_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_quota ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (public access for development)
CREATE POLICY "Allow public access to file_organization"
  ON file_organization FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to edit_stages"
  ON edit_stages FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to review_versions"
  ON review_versions FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to review_comments"
  ON review_comments FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to render_tasks"
  ON render_tasks FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to deliverables"
  ON deliverables FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to delivery_checklist_items"
  ON delivery_checklist_items FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to revisions"
  ON revisions FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to backup_locations"
  ON backup_locations FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to storage_quota"
  ON storage_quota FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_file_organization_project_id ON file_organization(project_id);
CREATE INDEX IF NOT EXISTS idx_edit_stages_project_id ON edit_stages(project_id);
CREATE INDEX IF NOT EXISTS idx_review_versions_project_id ON review_versions(project_id);
CREATE INDEX IF NOT EXISTS idx_review_comments_review_version_id ON review_comments(review_version_id);
CREATE INDEX IF NOT EXISTS idx_render_tasks_project_id ON render_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_project_id ON deliverables(project_id);
CREATE INDEX IF NOT EXISTS idx_delivery_checklist_items_project_id ON delivery_checklist_items(project_id);
CREATE INDEX IF NOT EXISTS idx_revisions_project_id ON revisions(project_id);
CREATE INDEX IF NOT EXISTS idx_backup_locations_project_id ON backup_locations(project_id);
CREATE INDEX IF NOT EXISTS idx_storage_quota_project_id ON storage_quota(project_id);

-- Create indexes for sorting and filtering
CREATE INDEX IF NOT EXISTS idx_edit_stages_sort_order ON edit_stages(sort_order);
CREATE INDEX IF NOT EXISTS idx_render_tasks_priority ON render_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_render_tasks_status ON render_tasks(status);
CREATE INDEX IF NOT EXISTS idx_delivery_checklist_items_sort_order ON delivery_checklist_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_revisions_version_number ON revisions(version_number);
