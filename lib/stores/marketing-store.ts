import { create } from 'zustand';
import type {
  Lead,
  LeadActivity,
  SocialPost,
  Hashtag,
  Testimonial,
  Referral,
  EmailCampaign,
  LeadMagnet,
  Partnership,
  PortfolioPage,
  GrowthMetrics,
  MarketingWorkflow,
  ContentAsset,
  LeadStage,
  LeadSource,
} from '@/types';

interface MarketingStore {
  leads: Lead[];
  leadActivities: LeadActivity[];
  socialPosts: SocialPost[];
  hashtags: Hashtag[];
  testimonials: Testimonial[];
  referrals: Referral[];
  campaigns: EmailCampaign[];
  leadMagnets: LeadMagnet[];
  partnerships: Partnership[];
  portfolioPages: PortfolioPage[];
  growthMetrics: GrowthMetrics[];
  workflows: MarketingWorkflow[];
  contentAssets: ContentAsset[];

  selectedLeadId: string | null;
  setSelectedLeadId: (id: string | null) => void;

  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLeadStage: (id: string, stage: LeadStage) => void;
  addLeadActivity: (leadId: string, activity: Omit<LeadActivity, 'id' | 'leadId' | 'createdAt'>) => void;

  addSocialPost: (post: Omit<SocialPost, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePostStatus: (id: string, status: 'draft' | 'scheduled' | 'published') => void;

  addTestimonial: (testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>) => void;
  approveTestimonial: (id: string) => void;
  toggleFeaturedTestimonial: (id: string) => void;

  addReferral: (referral: Omit<Referral, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateReferralStatus: (id: string, status: 'lead' | 'booked' | 'completed') => void;

  addCampaign: (campaign: Omit<EmailCampaign, 'id' | 'createdAt' | 'updatedAt'>) => void;

  getConversionRate: () => number;
  getLeadsBySource: () => Record<string, number>;
  getLeadsByStage: () => Record<string, number>;
}

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Sarah Ahmed',
    email: 'sarah@example.com',
    phone: '+971 50 123 4567',
    projectType: 'Wedding',
    budget: 'AED 25,000 - 35,000',
    timeline: '6 months',
    source: 'instagram',
    stage: 'new',
    score: 8,
    budgetScore: 8,
    timelineScore: 9,
    engagementScore: 7,
    location: 'Dubai',
    requirements: ['Full day coverage', 'Drone shots', 'Same day edit'],
    tags: ['high-priority', 'destination-wedding'],
    referredBy: '',
    lastContactDate: new Date('2025-11-15'),
    lostReason: '',
    notes: 'Getting married at Atlantis The Palm. Very engaged on Instagram.',
    createdAt: new Date('2025-11-10'),
    updatedAt: new Date('2025-11-15'),
  },
  {
    id: '2',
    name: 'Mohammed Al Rashid',
    email: 'mohammed@techcorp.ae',
    phone: '+971 50 234 5678',
    projectType: 'Corporate',
    budget: 'AED 15,000',
    timeline: '2 months',
    source: 'google',
    stage: 'contacted',
    score: 7,
    budgetScore: 7,
    timelineScore: 7,
    engagementScore: 7,
    location: 'Abu Dhabi',
    requirements: ['Corporate event coverage', 'Professional headshots', 'Video highlights'],
    tags: ['corporate', 'recurring-client'],
    referredBy: '',
    lastContactDate: new Date('2025-11-14'),
    followUpDate: new Date('2025-11-20'),
    lostReason: '',
    notes: 'CEO wants photos for annual report. Looking for long-term partnership.',
    createdAt: new Date('2025-11-12'),
    updatedAt: new Date('2025-11-14'),
  },
  {
    id: '3',
    name: 'Fatima Hassan',
    email: 'fatima@events.ae',
    phone: '+971 50 345 6789',
    projectType: 'Event',
    budget: 'AED 8,000',
    timeline: '1 month',
    source: 'referral',
    stage: 'proposal-sent',
    score: 9,
    budgetScore: 6,
    timelineScore: 6,
    engagementScore: 10,
    location: 'Dubai',
    requirements: ['Product launch event', '3 hour coverage', 'Social media content'],
    tags: ['event-planner', 'potential-partner'],
    referredBy: 'Layla Events Dubai',
    lastContactDate: new Date('2025-11-13'),
    followUpDate: new Date('2025-11-18'),
    lostReason: '',
    notes: 'Referred by Layla Events. Wants fast turnaround for social media.',
    createdAt: new Date('2025-11-08'),
    updatedAt: new Date('2025-11-13'),
  },
  {
    id: '4',
    name: 'John Smith',
    email: 'john@realty.com',
    phone: '+971 50 456 7890',
    projectType: 'Real Estate',
    budget: 'AED 5,000',
    timeline: 'Ongoing',
    source: 'website',
    stage: 'negotiating',
    score: 6,
    budgetScore: 5,
    timelineScore: 8,
    engagementScore: 5,
    location: 'Dubai Marina',
    requirements: ['Property photography', 'Monthly retainer', 'Drone footage'],
    tags: ['real-estate', 'retainer'],
    referredBy: '',
    lastContactDate: new Date('2025-11-11'),
    followUpDate: new Date('2025-11-17'),
    lostReason: '',
    notes: 'Negotiating monthly retainer for 5 properties per month.',
    createdAt: new Date('2025-11-05'),
    updatedAt: new Date('2025-11-11'),
  },
];

const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    clientName: 'Aisha & Omar',
    clientEmail: 'aisha@example.com',
    projectId: 'proj-1',
    rating: 5,
    review: 'Absolutely stunning photos! The team captured every special moment of our wedding day. We couldn\'t be happier with the results. Highly recommend for any couple looking for professional photography in Dubai.',
    platform: 'website',
    approved: true,
    featured: true,
    canUseOnWebsite: true,
    canUseOnSocial: true,
    response: 'Thank you so much! It was an honor to be part of your special day.',
    requestedDate: new Date('2025-10-20'),
    submittedDate: new Date('2025-10-25'),
    approvedDate: new Date('2025-10-26'),
    createdAt: new Date('2025-10-20'),
    updatedAt: new Date('2025-10-26'),
  },
  {
    id: '2',
    clientName: 'TechCorp UAE',
    clientEmail: 'events@techcorp.ae',
    rating: 5,
    review: 'Professional, punctual, and produced exceptional corporate event photos. Our CEO was extremely pleased with the quality. Will definitely use again for future events.',
    platform: 'google',
    approved: true,
    featured: false,
    canUseOnWebsite: true,
    canUseOnSocial: true,
    response: 'We appreciate your business and look forward to working together again!',
    requestedDate: new Date('2025-10-15'),
    submittedDate: new Date('2025-10-18'),
    approvedDate: new Date('2025-10-18'),
    createdAt: new Date('2025-10-15'),
    updatedAt: new Date('2025-10-18'),
  },
  {
    id: '3',
    clientName: 'Sarah Thompson',
    clientEmail: 'sarah.t@example.com',
    rating: 4,
    review: 'Great experience overall. The photographer was creative and made us feel comfortable. Minor delay in delivery but final photos were worth the wait.',
    platform: 'website',
    approved: false,
    featured: false,
    canUseOnWebsite: true,
    canUseOnSocial: false,
    response: '',
    requestedDate: new Date('2025-11-10'),
    submittedDate: new Date('2025-11-12'),
    createdAt: new Date('2025-11-10'),
    updatedAt: new Date('2025-11-12'),
  },
];

const mockReferrals: Referral[] = [
  {
    id: '1',
    referrerName: 'Aisha & Omar',
    referrerEmail: 'aisha@example.com',
    referrerClientId: 'client-1',
    referredName: 'Layla Ahmed',
    referredEmail: 'layla@example.com',
    referredPhone: '+971 50 555 1234',
    leadId: '5',
    status: 'booked',
    rewardType: 'discount',
    rewardAmount: '10%',
    rewardClaimed: false,
    projectValue: 28000,
    referralLink: 'https://creatorosai.com/ref/aisha-omar',
    notes: 'Booked wedding package for June 2026',
    createdAt: new Date('2025-10-28'),
    updatedAt: new Date('2025-11-08'),
  },
  {
    id: '2',
    referrerName: 'TechCorp UAE',
    referrerEmail: 'events@techcorp.ae',
    referredName: 'InnovateCo',
    referredEmail: 'events@innovateco.ae',
    referredPhone: '+971 50 555 5678',
    status: 'lead',
    rewardType: 'gift-card',
    rewardAmount: 'AED 500',
    rewardClaimed: false,
    projectValue: 0,
    referralLink: 'https://creatorosai.com/ref/techcorp',
    notes: 'Currently in negotiation stage',
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-10'),
  },
];

const mockSocialPosts: SocialPost[] = [
  {
    id: '1',
    platform: 'instagram',
    caption: '✨ Captured magic at Atlantis The Palm last weekend. Swipe to see the breathtaking sunset ceremony. Congratulations Aisha & Omar! 💕',
    hashtags: ['#DubaiWedding', '#UAEWeddings', '#AtlantisWedding', '#WeddingPhotography', '#DubaiPhotographer'],
    mediaUrls: [],
    scheduledDate: new Date('2025-11-18T18:00:00'),
    status: 'scheduled',
    projectId: 'proj-1',
    postType: 'showcase',
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    createdAt: new Date('2025-11-15'),
    updatedAt: new Date('2025-11-15'),
  },
  {
    id: '2',
    platform: 'linkedin',
    caption: 'Professional corporate event photography for TechCorp UAE. Creating compelling visual stories that showcase your brand\'s excellence. 📸 #CorporatePhotography #UAEBusiness',
    hashtags: ['#CorporatePhotography', '#UAEBusiness', '#DubaiEvents', '#ProfessionalPhotography'],
    mediaUrls: [],
    publishedDate: new Date('2025-11-10T10:00:00'),
    status: 'published',
    postType: 'showcase',
    views: 2450,
    likes: 87,
    comments: 12,
    shares: 23,
    createdAt: new Date('2025-11-09'),
    updatedAt: new Date('2025-11-10'),
  },
];

export const useMarketingStore = create<MarketingStore>((set, get) => ({
  leads: mockLeads,
  leadActivities: [],
  socialPosts: mockSocialPosts,
  hashtags: [],
  testimonials: mockTestimonials,
  referrals: mockReferrals,
  campaigns: [],
  leadMagnets: [],
  partnerships: [],
  portfolioPages: [],
  growthMetrics: [],
  workflows: [],
  contentAssets: [],

  selectedLeadId: null,
  setSelectedLeadId: (id) => set({ selectedLeadId: id }),

  addLead: (leadData) => set((state) => ({
    leads: [
      ...state.leads,
      {
        ...leadData,
        id: Math.random().toString(36).substring(7),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  })),

  updateLeadStage: (id, stage) => set((state) => ({
    leads: state.leads.map((lead) =>
      lead.id === id ? { ...lead, stage, updatedAt: new Date() } : lead
    ),
  })),

  addLeadActivity: (leadId, activityData) => set((state) => ({
    leadActivities: [
      ...state.leadActivities,
      {
        ...activityData,
        id: Math.random().toString(36).substring(7),
        leadId,
        createdAt: new Date(),
      },
    ],
  })),

  addSocialPost: (postData) => set((state) => ({
    socialPosts: [
      ...state.socialPosts,
      {
        ...postData,
        id: Math.random().toString(36).substring(7),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  })),

  updatePostStatus: (id, status) => set((state) => ({
    socialPosts: state.socialPosts.map((post) =>
      post.id === id ? { ...post, status, updatedAt: new Date() } : post
    ),
  })),

  addTestimonial: (testimonialData) => set((state) => ({
    testimonials: [
      ...state.testimonials,
      {
        ...testimonialData,
        id: Math.random().toString(36).substring(7),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  })),

  approveTestimonial: (id) => set((state) => ({
    testimonials: state.testimonials.map((testimonial) =>
      testimonial.id === id
        ? { ...testimonial, approved: true, approvedDate: new Date(), updatedAt: new Date() }
        : testimonial
    ),
  })),

  toggleFeaturedTestimonial: (id) => set((state) => ({
    testimonials: state.testimonials.map((testimonial) =>
      testimonial.id === id
        ? { ...testimonial, featured: !testimonial.featured, updatedAt: new Date() }
        : testimonial
    ),
  })),

  addReferral: (referralData) => set((state) => ({
    referrals: [
      ...state.referrals,
      {
        ...referralData,
        id: Math.random().toString(36).substring(7),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  })),

  updateReferralStatus: (id, status) => set((state) => ({
    referrals: state.referrals.map((referral) =>
      referral.id === id ? { ...referral, status, updatedAt: new Date() } : referral
    ),
  })),

  addCampaign: (campaignData) => set((state) => ({
    campaigns: [
      ...state.campaigns,
      {
        ...campaignData,
        id: Math.random().toString(36).substring(7),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  })),

  getConversionRate: () => {
    const { leads } = get();
    const totalLeads = leads.length;
    const bookedLeads = leads.filter((l) => l.stage === 'booked').length;
    return totalLeads > 0 ? (bookedLeads / totalLeads) * 100 : 0;
  },

  getLeadsBySource: () => {
    const { leads } = get();
    return leads.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  },

  getLeadsByStage: () => {
    const { leads } = get();
    return leads.reduce((acc, lead) => {
      acc[lead.stage] = (acc[lead.stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  },
}));
