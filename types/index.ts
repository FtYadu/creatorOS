export type ProjectStage = 'leads' | 'pre-production' | 'shooting' | 'post-production' | 'delivered';

export type ProjectType = 'Wedding' | 'Corporate' | 'Event' | 'Portrait' | 'Product' | 'Commercial' | 'Real Estate' | 'Fashion' | 'Other';

export interface Project {
  id: string;
  clientName: string;
  projectType: ProjectType;
  stage: ProjectStage;
  deadline: Date;
  budget: number;
  location: string;
  requirements: string[];
  createdAt: Date;
  updatedAt: Date;
  urgent?: boolean;
}

export interface ParsedData {
  clientName: string;
  projectType: ProjectType;
  budget: string;
  timeline: string;
  location: string;
  requirements: string[];
  rawText: string;
}

export interface Inquiry {
  id: string;
  emailText: string;
  parsedData?: ParsedData;
  leadScore?: number;
  status: 'unread' | 'analyzed' | 'converted';
  createdAt: Date;
}

export interface DashboardStats {
  activeProjects: number;
  pendingLeads: number;
  monthlyRevenue: number;
  upcomingShootsCount: number;
  activeProjectsChange: number;
  pendingLeadsChange: number;
  monthlyRevenueChange: number;
  upcomingShootsChange: number;
}

export interface Activity {
  id: string;
  type: 'project_created' | 'project_moved' | 'lead_received' | 'shoot_completed';
  message: string;
  timestamp: Date;
  projectId?: string;
}

export interface LeadScoreBreakdown {
  budget: number;
  timeline: number;
  requirements: number;
  location: number;
  total: number;
}

export interface MoodBoardImage {
  id: string;
  moodBoardId: string;
  imageUrl?: string;
  notes: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MoodBoard {
  id: string;
  projectId: string;
  style: string;
  colors: string[];
  keywords: string;
  images?: MoodBoardImage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Shot {
  id: string;
  shotListId: string;
  shotNumber: number;
  scene: string;
  subject: string;
  lensRecommendation: string;
  lightingNotes: string;
  priority: 'high' | 'medium' | 'low';
  captured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShotList {
  id: string;
  projectId: string;
  templateName: string;
  shots?: Shot[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  id: string;
  projectId: string;
  name: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  parkingInfo: string;
  permitRequired: boolean;
  bestTimeOfDay: string;
  lightingConditions: string;
  weatherConsiderations: string;
  backupLocation: string;
  isPrimary: boolean;
  photos: string[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EquipmentItem {
  id: string;
  equipmentListId: string;
  category: string;
  itemName: string;
  quantity: number;
  packed: boolean;
  notes: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EquipmentList {
  id: string;
  projectId: string;
  items?: EquipmentItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CrewAssignment {
  id: string;
  projectId: string;
  role: string;
  name: string;
  phone: string;
  email: string;
  responsibilities: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CallSheetScheduleItem {
  id: string;
  callSheetId: string;
  time: string;
  activity: string;
  location: string;
  duration: number;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CallSheet {
  id: string;
  projectId: string;
  shootDate?: Date;
  mainContactName: string;
  mainContactPhone: string;
  mainContactEmail: string;
  emergencyContacts: Array<{ name: string; phone: string; role?: string }>;
  notes: string;
  version: number;
  scheduleItems?: CallSheetScheduleItem[];
  createdAt: Date;
  updatedAt: Date;
}

export type EditStageStatus = 'not-started' | 'in-progress' | 'complete';
export type ReviewStatus = 'pending' | 'approved' | 'needs-revision';
export type RenderStatus = 'queued' | 'rendering' | 'complete' | 'failed';
export type CommentType = 'change' | 'suggestion' | 'compliment';
export type BackupStatus = 'pending' | 'in-progress' | 'complete' | 'failed';

export interface FileOrganization {
  id: string;
  projectId: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  folderPath: string;
  storageLocation: string;
  uploadDate: Date;
  shootDate?: Date;
  cameraUsed?: string;
  priority: string;
  tags: string[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EditStage {
  id: string;
  projectId: string;
  stageName: string;
  status: EditStageStatus;
  estimatedHours: number;
  actualHours: number;
  notes: string;
  assignee: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewVersion {
  id: string;
  projectId: string;
  versionName: string;
  fileUrl?: string;
  fileSize?: string;
  resolution?: string;
  duration?: string;
  uploadDate: Date;
  status: ReviewStatus;
  approvedDate?: Date;
  comments?: ReviewComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewComment {
  id: string;
  reviewVersionId: string;
  timecode?: string;
  comment: string;
  commentType: CommentType;
  resolved: boolean;
  commenterName: string;
  parentCommentId?: string;
  replies?: ReviewComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RenderTask {
  id: string;
  projectId: string;
  taskName: string;
  format: string;
  resolution: string;
  codec: string;
  estimatedSize: string;
  estimatedTime: string;
  status: RenderStatus;
  progress: number;
  priority: number;
  presetName?: string;
  errorMessage?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Deliverable {
  id: string;
  projectId: string;
  deliveryMethod: string;
  shareableLink?: string;
  folderStructure: any;
  namingConvention: string;
  totalSize: string;
  deliveryDate?: Date;
  confirmed: boolean;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeliveryChecklistItem {
  id: string;
  projectId: string;
  itemText: string;
  completed: boolean;
  isCustom: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Revision {
  id: string;
  projectId: string;
  versionNumber: number;
  versionLabel: string;
  changesMade: string[];
  reason: string;
  timeSpentHours: number;
  revisionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BackupLocation {
  id: string;
  projectId: string;
  locationName: string;
  locationType: string;
  status: BackupStatus;
  lastBackupDate?: Date;
  backupSize: string;
  verificationHash?: string;
  errorMessage?: string;
  retentionDays: number;
  autoArchive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StorageQuota {
  id: string;
  projectId: string;
  storageUsedGb: number;
  storageQuotaGb: number;
  filesCount: number;
  organizedFilesCount: number;
  updatedAt: Date;
}

// Marketing & Growth Types
export type LeadStage = 'new' | 'contacted' | 'proposal-sent' | 'negotiating' | 'booked' | 'lost';
export type LeadSource = 'instagram' | 'google' | 'referral' | 'vendor' | 'website' | 'other';
export type SocialPlatform = 'instagram' | 'tiktok' | 'youtube' | 'linkedin';
export type PostStatus = 'draft' | 'scheduled' | 'published';
export type CampaignStatus = 'draft' | 'scheduled' | 'sent';
export type ReferralStatus = 'lead' | 'booked' | 'completed';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  timeline: string;
  source: LeadSource;
  stage: LeadStage;
  score: number;
  budgetScore: number;
  timelineScore: number;
  engagementScore: number;
  location: string;
  requirements: string[];
  tags: string[];
  referredBy: string;
  lastContactDate?: Date;
  followUpDate?: Date;
  convertedToProjectId?: string;
  lostReason: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  activityType: 'email' | 'call' | 'proposal' | 'meeting' | 'note' | 'status-change';
  description: string;
  metadata: any;
  createdBy: string;
  createdAt: Date;
}

export interface SocialPost {
  id: string;
  platform: SocialPlatform;
  caption: string;
  hashtags: string[];
  mediaUrls: string[];
  scheduledDate?: Date;
  publishedDate?: Date;
  status: PostStatus;
  projectId?: string;
  postType: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Hashtag {
  id: string;
  tag: string;
  category: string;
  usageCount: number;
  avgEngagement: number;
  isTrending: boolean;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientEmail: string;
  projectId?: string;
  rating: number;
  review: string;
  platform: string;
  approved: boolean;
  featured: boolean;
  canUseOnWebsite: boolean;
  canUseOnSocial: boolean;
  clientPhotoUrl?: string;
  response: string;
  requestedDate: Date;
  submittedDate?: Date;
  approvedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Referral {
  id: string;
  referrerName: string;
  referrerEmail: string;
  referrerClientId?: string;
  referredName: string;
  referredEmail: string;
  referredPhone: string;
  leadId?: string;
  status: ReferralStatus;
  rewardType: string;
  rewardAmount: string;
  rewardClaimed: boolean;
  rewardClaimedDate?: Date;
  projectValue: number;
  referralLink?: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  templateType: string;
  templateContent: string;
  segment: string;
  recipientCount: number;
  scheduledDate?: Date;
  sentDate?: Date;
  status: CampaignStatus;
  emailsSent: number;
  emailsOpened: number;
  emailsClicked: number;
  unsubscribed: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeadMagnet {
  id: string;
  title: string;
  description: string;
  magnetType: string;
  fileUrl?: string;
  landingPageUrl?: string;
  captureFields: any[];
  downloads: number;
  leadsGenerated: number;
  conversionToBooking: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Partnership {
  id: string;
  partnerName: string;
  businessName: string;
  partnerType: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  partnershipType: string;
  commissionStructure: string;
  referralsSent: number;
  referralsReceived: number;
  revenueGenerated: number;
  status: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioPage {
  id: string;
  pageType: string;
  title: string;
  slug: string;
  content: any;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  featuredProjectIds: string[];
  viewCount: number;
  contactSubmissions: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GrowthMetrics {
  id: string;
  metricDate: Date;
  newLeads: number;
  leadsContacted: number;
  proposalsSent: number;
  bookingsWon: number;
  bookingsLost: number;
  revenue: number;
  leadsBySource: Record<string, number>;
  conversionRate: number;
  avgLeadValue: number;
  socialFollowers: number;
  socialEngagementRate: number;
  emailSubscribers: number;
  websiteVisitors: number;
  portfolioViews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketingWorkflow {
  id: string;
  name: string;
  description: string;
  triggerType: string;
  triggerConfig: any;
  actions: any[];
  status: string;
  executions: number;
  conversions: number;
  revenueAttributed: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentAsset {
  id: string;
  assetType: string;
  title: string;
  fileUrl?: string;
  category: string;
  tags: string[];
  fileSize: string;
  usageCount: number;
  isFavorite: boolean;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}
