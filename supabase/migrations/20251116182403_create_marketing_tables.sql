/*
  # Growth & Marketing Autopilot System

  ## Overview
  Creates comprehensive database structure for marketing automation, CRM, social media management,
  client relationships, portfolio generation, and business growth analytics.

  ## New Tables

  ### 1. crm_leads
    - Enhanced lead management with scoring and pipeline tracking
    - Source attribution and stage management
    - Budget and timeline tracking
    - Activity logging and notes

  ### 2. lead_activities
    - Timeline of all lead interactions
    - Activity types: email, call, proposal, meeting, note
    - Automated logging from system actions

  ### 3. social_media_posts
    - Content calendar with scheduling
    - Multi-platform support (Instagram, TikTok, YouTube, LinkedIn)
    - Performance metrics tracking
    - Project linking for showcasing work

  ### 4. hashtag_library
    - Organized hashtag collections
    - UAE-specific and category-specific tags
    - Usage tracking and performance metrics

  ### 5. testimonials
    - Client reviews and ratings
    - Approval workflow
    - Platform tracking (website, Google, social)
    - Featured testimonial selection

  ### 6. referrals
    - Referral program tracking
    - Reward management
    - Conversion tracking from referral to booking

  ### 7. email_campaigns
    - Email marketing campaign management
    - Templates and segmentation
    - Scheduling and analytics
    - Mockup for future email service integration

  ### 8. lead_magnets
    - Downloadable resources for lead generation
    - Landing page data
    - Capture form configuration
    - Performance tracking

  ### 9. partnerships
    - Vendor and partner directory
    - Collaboration tracking
    - Referral exchange management

  ### 10. portfolio_pages
    - Auto-generated portfolio content
    - SEO optimization metadata
    - Performance analytics

  ### 11. growth_metrics
    - Aggregate business analytics
    - Lead generation and conversion tracking
    - Revenue by source
    - Monthly snapshots for trend analysis

  ### 12. marketing_workflows
    - Automation sequence definitions
    - Trigger and action configuration
    - Performance tracking

  ### 13. content_library
    - Marketing asset storage
    - Brand kit and templates
    - Categorization and tagging

  ## Security
  - RLS enabled on all tables
  - Public access policies for development
  - All tables include created_at and updated_at timestamps

  ## Notes
  - Foreign keys use CASCADE delete for referential integrity
  - Timestamps use timestamptz for timezone awareness
  - Indexes on foreign keys and frequently queried fields
*/

-- Create crm_leads table
CREATE TABLE IF NOT EXISTS crm_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  project_type text NOT NULL,
  budget text DEFAULT '',
  timeline text DEFAULT '',
  source text NOT NULL DEFAULT 'website',
  stage text NOT NULL DEFAULT 'new',
  score integer NOT NULL DEFAULT 5,
  budget_score integer DEFAULT 5,
  timeline_score integer DEFAULT 5,
  engagement_score integer DEFAULT 5,
  location text DEFAULT '',
  requirements text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  referred_by text DEFAULT '',
  last_contact_date timestamptz,
  follow_up_date timestamptz,
  converted_to_project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  lost_reason text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lead_activities table
CREATE TABLE IF NOT EXISTS lead_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  description text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_by text DEFAULT 'system',
  created_at timestamptz DEFAULT now()
);

-- Create social_media_posts table
CREATE TABLE IF NOT EXISTS social_media_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  caption text NOT NULL DEFAULT '',
  hashtags text[] DEFAULT '{}',
  media_urls text[] DEFAULT '{}',
  scheduled_date timestamptz,
  published_date timestamptz,
  status text NOT NULL DEFAULT 'draft',
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  post_type text DEFAULT 'showcase',
  views integer DEFAULT 0,
  likes integer DEFAULT 0,
  comments integer DEFAULT 0,
  shares integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create hashtag_library table
CREATE TABLE IF NOT EXISTS hashtag_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag text NOT NULL UNIQUE,
  category text NOT NULL,
  usage_count integer DEFAULT 0,
  avg_engagement numeric DEFAULT 0,
  is_trending boolean DEFAULT false,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_email text DEFAULT '',
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  rating integer NOT NULL DEFAULT 5,
  review text NOT NULL,
  platform text NOT NULL DEFAULT 'website',
  approved boolean DEFAULT false,
  featured boolean DEFAULT false,
  can_use_on_website boolean DEFAULT false,
  can_use_on_social boolean DEFAULT false,
  client_photo_url text,
  response text DEFAULT '',
  requested_date timestamptz DEFAULT now(),
  submitted_date timestamptz,
  approved_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_name text NOT NULL,
  referrer_email text NOT NULL,
  referrer_client_id uuid,
  referred_name text NOT NULL,
  referred_email text NOT NULL,
  referred_phone text DEFAULT '',
  lead_id uuid REFERENCES crm_leads(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'lead',
  reward_type text DEFAULT 'discount',
  reward_amount text DEFAULT '10%',
  reward_claimed boolean DEFAULT false,
  reward_claimed_date timestamptz,
  project_value numeric DEFAULT 0,
  referral_link text,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create email_campaigns table
CREATE TABLE IF NOT EXISTS email_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text NOT NULL,
  template_type text NOT NULL,
  template_content text NOT NULL DEFAULT '',
  segment text NOT NULL DEFAULT 'all',
  recipient_count integer DEFAULT 0,
  scheduled_date timestamptz,
  sent_date timestamptz,
  status text NOT NULL DEFAULT 'draft',
  emails_sent integer DEFAULT 0,
  emails_opened integer DEFAULT 0,
  emails_clicked integer DEFAULT 0,
  unsubscribed integer DEFAULT 0,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lead_magnets table
CREATE TABLE IF NOT EXISTS lead_magnets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  magnet_type text NOT NULL,
  file_url text,
  landing_page_url text,
  capture_fields jsonb DEFAULT '[]',
  downloads integer DEFAULT 0,
  leads_generated integer DEFAULT 0,
  conversion_to_booking integer DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create partnerships table
CREATE TABLE IF NOT EXISTS partnerships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_name text NOT NULL,
  business_name text NOT NULL,
  partner_type text NOT NULL,
  contact_name text DEFAULT '',
  contact_email text DEFAULT '',
  contact_phone text DEFAULT '',
  partnership_type text DEFAULT 'referral',
  commission_structure text DEFAULT '',
  referrals_sent integer DEFAULT 0,
  referrals_received integer DEFAULT 0,
  revenue_generated numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create portfolio_pages table
CREATE TABLE IF NOT EXISTS portfolio_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type text NOT NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content jsonb DEFAULT '{}',
  meta_title text DEFAULT '',
  meta_description text DEFAULT '',
  keywords text[] DEFAULT '{}',
  featured_project_ids uuid[] DEFAULT '{}',
  view_count integer DEFAULT 0,
  contact_submissions integer DEFAULT 0,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create growth_metrics table
CREATE TABLE IF NOT EXISTS growth_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date date NOT NULL,
  new_leads integer DEFAULT 0,
  leads_contacted integer DEFAULT 0,
  proposals_sent integer DEFAULT 0,
  bookings_won integer DEFAULT 0,
  bookings_lost integer DEFAULT 0,
  revenue numeric DEFAULT 0,
  leads_by_source jsonb DEFAULT '{}',
  conversion_rate numeric DEFAULT 0,
  avg_lead_value numeric DEFAULT 0,
  social_followers integer DEFAULT 0,
  social_engagement_rate numeric DEFAULT 0,
  email_subscribers integer DEFAULT 0,
  website_visitors integer DEFAULT 0,
  portfolio_views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(metric_date)
);

-- Create marketing_workflows table
CREATE TABLE IF NOT EXISTS marketing_workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  trigger_type text NOT NULL,
  trigger_config jsonb DEFAULT '{}',
  actions jsonb DEFAULT '[]',
  status text NOT NULL DEFAULT 'inactive',
  executions integer DEFAULT 0,
  conversions integer DEFAULT 0,
  revenue_attributed numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create content_library table
CREATE TABLE IF NOT EXISTS content_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_type text NOT NULL,
  title text NOT NULL,
  file_url text,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  file_size text DEFAULT '',
  usage_count integer DEFAULT 0,
  is_favorite boolean DEFAULT false,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hashtag_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_magnets ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_library ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (public access for development)
CREATE POLICY "Allow public access to crm_leads"
  ON crm_leads FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to lead_activities"
  ON lead_activities FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to social_media_posts"
  ON social_media_posts FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to hashtag_library"
  ON hashtag_library FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to testimonials"
  ON testimonials FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to referrals"
  ON referrals FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to email_campaigns"
  ON email_campaigns FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to lead_magnets"
  ON lead_magnets FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to partnerships"
  ON partnerships FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to portfolio_pages"
  ON portfolio_pages FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to growth_metrics"
  ON growth_metrics FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to marketing_workflows"
  ON marketing_workflows FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to content_library"
  ON content_library FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_crm_leads_converted_to_project_id ON crm_leads(converted_to_project_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_stage ON crm_leads(stage);
CREATE INDEX IF NOT EXISTS idx_crm_leads_source ON crm_leads(source);
CREATE INDEX IF NOT EXISTS idx_crm_leads_score ON crm_leads(score);
CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_social_media_posts_project_id ON social_media_posts(project_id);
CREATE INDEX IF NOT EXISTS idx_social_media_posts_platform ON social_media_posts(platform);
CREATE INDEX IF NOT EXISTS idx_social_media_posts_status ON social_media_posts(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_project_id ON testimonials(project_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(approved);
CREATE INDEX IF NOT EXISTS idx_referrals_lead_id ON referrals(lead_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_growth_metrics_metric_date ON growth_metrics(metric_date);

-- Insert sample hashtags for UAE photography
INSERT INTO hashtag_library (tag, category, usage_count, avg_engagement) VALUES
('#DubaiPhotographer', 'location', 0, 0),
('#UAEWeddings', 'location', 0, 0),
('#AbuDhabiEvents', 'location', 0, 0),
('#DubaiWedding', 'location', 0, 0),
('#UAEPhotography', 'location', 0, 0),
('#WeddingPhotography', 'category', 0, 0),
('#CorporateVideo', 'category', 0, 0),
('#CorporatePhotography', 'category', 0, 0),
('#EventPhotography', 'category', 0, 0),
('#PortraitPhotography', 'category', 0, 0),
('#CommercialPhotography', 'category', 0, 0),
('#BehindTheScenes', 'content-type', 0, 0),
('#ClientLove', 'content-type', 0, 0),
('#TipTuesday', 'content-type', 0, 0),
('#PhotoOfTheDay', 'content-type', 0, 0)
ON CONFLICT (tag) DO NOTHING;