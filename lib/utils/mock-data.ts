import { Project, Inquiry, DashboardStats, Activity } from '@/types';

export const mockProjects: Project[] = [
  {
    id: '1',
    clientName: 'Sarah & Ahmed',
    projectType: 'Wedding',
    stage: 'shooting',
    deadline: new Date('2025-12-15'),
    budget: 25000,
    location: 'Dubai Marina',
    requirements: [
      'Full day coverage (12 hours)',
      'Drone footage of venue',
      'Traditional and modern shots',
      'Same-day teaser video'
    ],
    createdAt: new Date('2025-10-01'),
    updatedAt: new Date('2025-11-10'),
    urgent: true
  },
  {
    id: '2',
    clientName: 'Emirates Corp',
    projectType: 'Corporate',
    stage: 'pre-production',
    deadline: new Date('2025-12-20'),
    budget: 18000,
    location: 'Abu Dhabi',
    requirements: [
      'Annual conference coverage',
      'Speaker headshots',
      'Networking event photos',
      'Same-day social media content'
    ],
    createdAt: new Date('2025-10-15'),
    updatedAt: new Date('2025-11-12')
  },
  {
    id: '3',
    clientName: 'Luxe Fashion',
    projectType: 'Product',
    stage: 'post-production',
    deadline: new Date('2025-11-25'),
    budget: 12000,
    location: 'Studio - Dubai',
    requirements: [
      '50 product shots',
      'White background',
      'Lifestyle shots with models',
      'High-res files for e-commerce'
    ],
    createdAt: new Date('2025-09-20'),
    updatedAt: new Date('2025-11-08')
  },
  {
    id: '4',
    clientName: 'Palm Properties',
    projectType: 'Real Estate',
    stage: 'leads',
    deadline: new Date('2025-12-05'),
    budget: 15000,
    location: 'Palm Jumeirah',
    requirements: [
      'Luxury villa photography',
      'Aerial drone shots',
      'Twilight exterior photos',
      'Virtual tour creation'
    ],
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-13')
  },
  {
    id: '5',
    clientName: 'Vogue ME',
    projectType: 'Fashion',
    stage: 'pre-production',
    deadline: new Date('2025-11-30'),
    budget: 30000,
    location: 'Al Qudra Desert',
    requirements: [
      'Editorial fashion shoot',
      '3 model looks',
      'Desert location',
      'Behind-the-scenes video'
    ],
    createdAt: new Date('2025-10-10'),
    updatedAt: new Date('2025-11-11'),
    urgent: true
  }
];

export const mockInquiries: Inquiry[] = [
  {
    id: '1',
    emailText: `Hi there! My name is Fatima and I'm planning my wedding for next March at Atlantis The Palm. We're looking for a photographer who can capture both traditional and contemporary shots. Our budget is around AED 20,000-25,000. We need full day coverage from the morning preparations until the reception ends. Can you also provide a highlight video? Looking forward to hearing from you!`,
    status: 'unread',
    createdAt: new Date('2025-11-13')
  },
  {
    id: '2',
    emailText: `Hello, I run a boutique hotel in Jumeirah and need professional photography for our website and marketing materials. We're looking to shoot all 15 rooms, the restaurant, spa, and outdoor areas. Timeline is flexible but would prefer to complete within the next 2 weeks. Budget is approximately $8,000 USD. Please let me know your availability.`,
    status: 'unread',
    createdAt: new Date('2025-11-12')
  },
  {
    id: '3',
    emailText: `Hi, I'm launching an online fashion brand and need product photography. About 100 items total - clothing and accessories. Need clean white background shots and some styled lifestyle images. Located in Sharjah. What would be your pricing for this? Timeline is 3 weeks from now.`,
    status: 'unread',
    createdAt: new Date('2025-11-11')
  }
];

export const mockStats: DashboardStats = {
  activeProjects: 5,
  pendingLeads: 8,
  monthlyRevenue: 125000,
  upcomingShootsCount: 3,
  activeProjectsChange: 12.5,
  pendingLeadsChange: -5.2,
  monthlyRevenueChange: 18.3,
  upcomingShootsChange: 50.0
};

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'project_moved',
    message: 'Luxe Fashion moved to Post-Production',
    timestamp: new Date('2025-11-13T14:30:00'),
    projectId: '3'
  },
  {
    id: '2',
    type: 'lead_received',
    message: 'New inquiry from Fatima - Wedding',
    timestamp: new Date('2025-11-13T11:15:00')
  },
  {
    id: '3',
    type: 'project_created',
    message: 'New project: Palm Properties - Real Estate',
    timestamp: new Date('2025-11-13T09:00:00'),
    projectId: '4'
  },
  {
    id: '4',
    type: 'shoot_completed',
    message: 'Sarah & Ahmed - Wedding shoot completed',
    timestamp: new Date('2025-11-12T18:45:00'),
    projectId: '1'
  }
];
