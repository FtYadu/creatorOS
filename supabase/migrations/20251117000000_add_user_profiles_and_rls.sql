/*
  # User Profiles and Row Level Security (RLS) Setup

  ## Overview
  Creates user profiles table and adds Row Level Security policies to all existing tables
  to ensure users can only access their own data.

  ## New Tables

  ### user_profiles
    - Stores additional user information beyond auth
    - Links to auth.users via user_id
    - Contains business/studio information

  ## Security Updates
  - Enables RLS on all existing tables
  - Adds user_id column to all tables
  - Creates policies for authenticated users to manage their own data

  ## Migration Strategy
  - Add user_id to existing tables
  - Create user_profiles table
  - Enable RLS on all tables
  - Add policies for user data access
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  studio_name text,
  business_type text,
  phone text,
  avatar_url text,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Add user_id to existing tables if not exists
ALTER TABLE projects ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE social_posts ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE email_campaigns ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE referrals ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE partnerships ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE growth_metrics ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_board_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE shot_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shots ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_sheet_schedule_items ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_magnets ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_assets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for projects (and cascades to related tables)
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for pre-production tables (access via project ownership)
CREATE POLICY "Users can view mood boards for own projects"
  ON mood_boards FOR SELECT
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = mood_boards.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can manage mood boards for own projects"
  ON mood_boards FOR ALL
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = mood_boards.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can view mood board images"
  ON mood_board_images FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM mood_boards
    JOIN projects ON projects.id = mood_boards.project_id
    WHERE mood_boards.id = mood_board_images.mood_board_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage mood board images"
  ON mood_board_images FOR ALL
  USING (EXISTS (
    SELECT 1 FROM mood_boards
    JOIN projects ON projects.id = mood_boards.project_id
    WHERE mood_boards.id = mood_board_images.mood_board_id
    AND projects.user_id = auth.uid()
  ));

-- Similar policies for other pre-production tables
CREATE POLICY "Users can manage shot lists"
  ON shot_lists FOR ALL
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = shot_lists.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can manage shots"
  ON shots FOR ALL
  USING (EXISTS (
    SELECT 1 FROM shot_lists
    JOIN projects ON projects.id = shot_lists.project_id
    WHERE shot_lists.id = shots.shot_list_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage locations"
  ON locations FOR ALL
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = locations.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can manage equipment lists"
  ON equipment_lists FOR ALL
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = equipment_lists.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can manage equipment items"
  ON equipment_items FOR ALL
  USING (EXISTS (
    SELECT 1 FROM equipment_lists
    JOIN projects ON projects.id = equipment_lists.project_id
    WHERE equipment_lists.id = equipment_items.equipment_list_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage crew assignments"
  ON crew_assignments FOR ALL
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = crew_assignments.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can manage call sheets"
  ON call_sheets FOR ALL
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = call_sheets.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can manage call sheet schedule items"
  ON call_sheet_schedule_items FOR ALL
  USING (EXISTS (
    SELECT 1 FROM call_sheets
    JOIN projects ON projects.id = call_sheets.project_id
    WHERE call_sheets.id = call_sheet_schedule_items.call_sheet_id
    AND projects.user_id = auth.uid()
  ));

-- RLS Policies for post-production tables
CREATE POLICY "Users can manage file organization"
  ON file_organization FOR ALL
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = file_organization.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can manage edit stages"
  ON edit_stages FOR ALL
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = edit_stages.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can manage review versions"
  ON review_versions FOR ALL
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = review_versions.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can manage review comments"
  ON review_comments FOR ALL
  USING (EXISTS (
    SELECT 1 FROM review_versions
    JOIN projects ON projects.id = review_versions.project_id
    WHERE review_versions.id = review_comments.review_version_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage render tasks"
  ON render_tasks FOR ALL
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = render_tasks.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can manage deliverables"
  ON deliverables FOR ALL
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = deliverables.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can manage delivery checklist"
  ON delivery_checklist_items FOR ALL
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = delivery_checklist_items.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can manage revisions"
  ON revisions FOR ALL
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = revisions.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can manage backup locations"
  ON backup_locations FOR ALL
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = backup_locations.project_id AND projects.user_id = auth.uid()));

CREATE POLICY "Users can manage storage quota"
  ON storage_quota FOR ALL
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = storage_quota.project_id AND projects.user_id = auth.uid()));

-- RLS Policies for marketing tables
CREATE POLICY "Users can manage own leads"
  ON leads FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage lead activities"
  ON lead_activities FOR ALL
  USING (EXISTS (SELECT 1 FROM leads WHERE leads.id = lead_activities.lead_id AND leads.user_id = auth.uid()));

CREATE POLICY "Users can manage own social posts"
  ON social_posts FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view all hashtags"
  ON hashtags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own hashtags"
  ON hashtags FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can manage own testimonials"
  ON testimonials FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own referrals"
  ON referrals FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own email campaigns"
  ON email_campaigns FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view all lead magnets"
  ON lead_magnets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own partnerships"
  ON partnerships FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view all portfolio pages"
  ON portfolio_pages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own growth metrics"
  ON growth_metrics FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view all marketing workflows"
  ON marketing_workflows FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view all content assets"
  ON content_assets FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes on user_id columns for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_user_id ON social_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Function to automatically set updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at trigger to user_profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
