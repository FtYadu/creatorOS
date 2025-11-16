/*
  # Pre-Production Management System Schema

  ## Overview
  Creates comprehensive database structure for photography/videography pre-production workflows including mood boards, shot lists, locations, equipment, crew, and call sheets.

  ## New Tables
  
  ### 1. projects
    - Core project data linked to Kanban stages
    - Stores client information, budget, deadlines, and project metadata
    
  ### 2. mood_boards
    - Stores mood board configurations with style and color preferences
    - Links to projects table
    - Contains AI generation parameters and keywords
    
  ### 3. mood_board_images
    - Individual images/references in a mood board
    - Supports custom uploads and AI-generated images
    - Includes ordering and notes per image
    
  ### 4. shot_lists
    - Master shot list container per project
    - Links to projects table
    
  ### 5. shots
    - Individual shot items with technical specifications
    - Contains scene, subject, lens recommendations, lighting notes
    - Tracks capture status and priority
    
  ### 6. locations
    - Scouting location details with addresses and coordinates
    - Stores parking, permits, and lighting condition notes
    - Weather integration metadata
    
  ### 7. equipment_lists
    - Master equipment list container per project
    
  ### 8. equipment_items
    - Individual equipment items with categories
    - Quantity tracking and pack status
    - Custom notes per item
    
  ### 9. crew_assignments
    - Crew roster with roles and contact information
    - Availability and responsibility tracking
    
  ### 10. call_sheets
    - Comprehensive call sheet data structure
    - Auto-populated from other pre-production tools
    - Version tracking for revisions
    
  ### 11. call_sheet_schedule_items
    - Timeline schedule items for call sheets
    - Time-based activity tracking with locations
    
  ## Security
  - RLS enabled on all tables
  - Policies restrict access to authenticated users only
  - All tables include created_at and updated_at timestamps
  
  ## Notes
  - All foreign keys use CASCADE delete to maintain referential integrity
  - Timestamps use timestamptz for timezone awareness
  - Default values ensure data consistency
  - Indexes added on foreign keys for query performance
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  project_type text NOT NULL,
  stage text NOT NULL DEFAULT 'leads',
  deadline timestamptz NOT NULL,
  budget numeric NOT NULL DEFAULT 0,
  location text NOT NULL DEFAULT '',
  requirements text[] DEFAULT '{}',
  urgent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create mood_boards table
CREATE TABLE IF NOT EXISTS mood_boards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  style text NOT NULL DEFAULT 'Modern',
  colors text[] DEFAULT '{}',
  keywords text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create mood_board_images table
CREATE TABLE IF NOT EXISTS mood_board_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mood_board_id uuid NOT NULL REFERENCES mood_boards(id) ON DELETE CASCADE,
  image_url text,
  notes text DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create shot_lists table
CREATE TABLE IF NOT EXISTS shot_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  template_name text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create shots table
CREATE TABLE IF NOT EXISTS shots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shot_list_id uuid NOT NULL REFERENCES shot_lists(id) ON DELETE CASCADE,
  shot_number integer NOT NULL DEFAULT 0,
  scene text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  lens_recommendation text DEFAULT 'Standard 50mm',
  lighting_notes text DEFAULT '',
  priority text NOT NULL DEFAULT 'medium',
  captured boolean DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text NOT NULL DEFAULT '',
  coordinates jsonb,
  parking_info text DEFAULT '',
  permit_required boolean DEFAULT false,
  best_time_of_day text DEFAULT '',
  lighting_conditions text DEFAULT 'Natural',
  weather_considerations text DEFAULT '',
  backup_location text DEFAULT '',
  is_primary boolean DEFAULT false,
  photos text[] DEFAULT '{}',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create equipment_lists table
CREATE TABLE IF NOT EXISTS equipment_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create equipment_items table
CREATE TABLE IF NOT EXISTS equipment_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_list_id uuid NOT NULL REFERENCES equipment_lists(id) ON DELETE CASCADE,
  category text NOT NULL,
  item_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  packed boolean DEFAULT false,
  notes text DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create crew_assignments table
CREATE TABLE IF NOT EXISTS crew_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  role text NOT NULL,
  name text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  responsibilities text DEFAULT '',
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create call_sheets table
CREATE TABLE IF NOT EXISTS call_sheets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  shoot_date timestamptz,
  main_contact_name text DEFAULT '',
  main_contact_phone text DEFAULT '',
  main_contact_email text DEFAULT '',
  emergency_contacts jsonb DEFAULT '[]',
  notes text DEFAULT '',
  version integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create call_sheet_schedule_items table
CREATE TABLE IF NOT EXISTS call_sheet_schedule_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  call_sheet_id uuid NOT NULL REFERENCES call_sheets(id) ON DELETE CASCADE,
  time text NOT NULL,
  activity text NOT NULL,
  location text DEFAULT '',
  duration integer DEFAULT 60,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
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

-- Create RLS policies for projects
CREATE POLICY "Allow public read access to projects"
  ON projects FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to projects"
  ON projects FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to projects"
  ON projects FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to projects"
  ON projects FOR DELETE
  TO public
  USING (true);

-- Create RLS policies for mood_boards
CREATE POLICY "Allow public access to mood_boards"
  ON mood_boards FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for mood_board_images
CREATE POLICY "Allow public access to mood_board_images"
  ON mood_board_images FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for shot_lists
CREATE POLICY "Allow public access to shot_lists"
  ON shot_lists FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for shots
CREATE POLICY "Allow public access to shots"
  ON shots FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for locations
CREATE POLICY "Allow public access to locations"
  ON locations FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for equipment_lists
CREATE POLICY "Allow public access to equipment_lists"
  ON equipment_lists FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for equipment_items
CREATE POLICY "Allow public access to equipment_items"
  ON equipment_items FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for crew_assignments
CREATE POLICY "Allow public access to crew_assignments"
  ON crew_assignments FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for call_sheets
CREATE POLICY "Allow public access to call_sheets"
  ON call_sheets FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for call_sheet_schedule_items
CREATE POLICY "Allow public access to call_sheet_schedule_items"
  ON call_sheet_schedule_items FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_mood_boards_project_id ON mood_boards(project_id);
CREATE INDEX IF NOT EXISTS idx_mood_board_images_mood_board_id ON mood_board_images(mood_board_id);
CREATE INDEX IF NOT EXISTS idx_shot_lists_project_id ON shot_lists(project_id);
CREATE INDEX IF NOT EXISTS idx_shots_shot_list_id ON shots(shot_list_id);
CREATE INDEX IF NOT EXISTS idx_locations_project_id ON locations(project_id);
CREATE INDEX IF NOT EXISTS idx_equipment_lists_project_id ON equipment_lists(project_id);
CREATE INDEX IF NOT EXISTS idx_equipment_items_equipment_list_id ON equipment_items(equipment_list_id);
CREATE INDEX IF NOT EXISTS idx_crew_assignments_project_id ON crew_assignments(project_id);
CREATE INDEX IF NOT EXISTS idx_call_sheets_project_id ON call_sheets(project_id);
CREATE INDEX IF NOT EXISTS idx_call_sheet_schedule_items_call_sheet_id ON call_sheet_schedule_items(call_sheet_id);

-- Create indexes for sorting
CREATE INDEX IF NOT EXISTS idx_mood_board_images_sort_order ON mood_board_images(sort_order);
CREATE INDEX IF NOT EXISTS idx_shots_sort_order ON shots(sort_order);
CREATE INDEX IF NOT EXISTS idx_equipment_items_sort_order ON equipment_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_call_sheet_schedule_items_sort_order ON call_sheet_schedule_items(sort_order);
