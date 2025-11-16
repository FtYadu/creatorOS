import { ParsedData, ProjectType, LeadScoreBreakdown } from '@/types';

const projectTypeKeywords: Record<string, ProjectType> = {
  wedding: 'Wedding',
  bride: 'Wedding',
  groom: 'Wedding',
  marriage: 'Wedding',
  corporate: 'Corporate',
  conference: 'Corporate',
  business: 'Corporate',
  company: 'Corporate',
  event: 'Event',
  party: 'Event',
  portrait: 'Portrait',
  headshot: 'Portrait',
  product: 'Product',
  ecommerce: 'Product',
  'e-commerce': 'Product',
  commercial: 'Commercial',
  advertising: 'Commercial',
  'real estate': 'Real Estate',
  property: 'Real Estate',
  villa: 'Real Estate',
  apartment: 'Real Estate',
  fashion: 'Fashion',
  editorial: 'Fashion',
  model: 'Fashion'
};

const uaeLocations = [
  'Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain',
  'Dubai Marina', 'Downtown Dubai', 'Palm Jumeirah', 'JBR', 'Business Bay', 'DIFC',
  'Atlantis', 'Burj Al Arab', 'Emirates Palace'
];

export function parseInquiry(text: string): ParsedData {
  const lowerText = text.toLowerCase();

  const nameMatch = text.match(/(?:my name is|i'm|i am|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  const clientName = nameMatch ? nameMatch[1] : 'Unknown Client';

  let projectType: ProjectType = 'Other';
  for (const [keyword, type] of Object.entries(projectTypeKeywords)) {
    if (lowerText.includes(keyword)) {
      projectType = type;
      break;
    }
  }

  const budgetPatterns = [
    /(?:budget|price|cost).*?(?:AED|aed|)\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i,
    /(?:AED|aed)\s*(\d{1,3}(?:,\d{3})*)/i,
    /\$\s*(\d{1,3}(?:,\d{3})*)/i,
    /(\d{1,3}(?:,\d{3})*)\s*(?:AED|aed|dollars?|USD)/i
  ];

  let budget = 'Not specified';
  for (const pattern of budgetPatterns) {
    const match = text.match(pattern);
    if (match) {
      const amount = match[1].replace(/,/g, '');
      const currency = text.match(/USD|\$/i) ? 'USD' : 'AED';
      budget = `${currency} ${parseInt(amount).toLocaleString()}`;
      break;
    }
  }

  const timelinePatterns = [
    /(?:next|in)\s+(january|february|march|april|may|june|july|august|september|october|november|december)/i,
    /(?:in|within|next)\s+(\d+)\s+(day|days|week|weeks|month|months)/i,
    /(?:timeline|timeframe|deadline).*?(\d+)\s+(day|days|week|weeks|month|months)/i,
    /(urgent|asap|immediately|soon)/i
  ];

  let timeline = 'Flexible';
  for (const pattern of timelinePatterns) {
    const match = text.match(pattern);
    if (match) {
      timeline = match[0];
      break;
    }
  }

  let location = 'Not specified';
  for (const loc of uaeLocations) {
    if (text.includes(loc)) {
      location = loc;
      break;
    }
  }

  const requirements: string[] = [];

  if (lowerText.includes('full day') || lowerText.includes('all day')) {
    requirements.push('Full day coverage');
  }
  if (lowerText.includes('video') || lowerText.includes('videography')) {
    requirements.push('Video coverage');
  }
  if (lowerText.includes('drone') || lowerText.includes('aerial')) {
    requirements.push('Drone/aerial shots');
  }
  if (lowerText.includes('edit') || lowerText.includes('post-production')) {
    requirements.push('Editing and post-production');
  }
  if (lowerText.includes('traditional')) {
    requirements.push('Traditional photography style');
  }
  if (lowerText.includes('modern') || lowerText.includes('contemporary')) {
    requirements.push('Modern/contemporary style');
  }
  if (lowerText.includes('white background')) {
    requirements.push('White background shots');
  }
  if (lowerText.includes('lifestyle')) {
    requirements.push('Lifestyle photography');
  }

  const sentences = text.split(/[.!?]\s+/);
  for (const sentence of sentences) {
    if (sentence.toLowerCase().includes('need') || sentence.toLowerCase().includes('require')) {
      if (sentence.length > 20 && sentence.length < 150) {
        const cleaned = sentence.trim().replace(/^(we|i|they)\s+(need|require|want)\s+/i, '');
        if (cleaned && !requirements.includes(cleaned)) {
          requirements.push(cleaned);
        }
      }
    }
  }

  if (requirements.length === 0) {
    requirements.push('Details to be discussed');
  }

  return {
    clientName,
    projectType,
    budget,
    timeline,
    location,
    requirements: requirements.slice(0, 5),
    rawText: text
  };
}

export function calculateLeadScore(data: ParsedData): LeadScoreBreakdown {
  let budgetScore = 0;
  let timelineScore = 0;
  let requirementsScore = 0;
  let locationScore = 0;

  const budgetMatch = data.budget.match(/(\d+)/);
  if (budgetMatch) {
    const amount = parseInt(budgetMatch[1].replace(/,/g, ''));
    if (amount >= 20000) budgetScore = 3;
    else if (amount >= 10000) budgetScore = 2;
    else if (amount >= 5000) budgetScore = 1;
  }

  const timelineLower = data.timeline.toLowerCase();
  if (timelineLower.includes('month') || timelineLower.includes('week')) {
    const numberMatch = data.timeline.match(/(\d+)/);
    if (numberMatch) {
      const value = parseInt(numberMatch[1]);
      if (timelineLower.includes('month') && value >= 1) {
        timelineScore = 2;
      } else if (timelineLower.includes('week') && value >= 2) {
        timelineScore = 2;
      } else if (timelineLower.includes('week') && value >= 1) {
        timelineScore = 1;
      }
    }
  } else if (timelineLower.includes('flexible')) {
    timelineScore = 2;
  } else if (timelineLower.includes('urgent') || timelineLower.includes('asap')) {
    timelineScore = 1;
  }

  if (data.requirements.length >= 4) requirementsScore = 2;
  else if (data.requirements.length >= 2) requirementsScore = 1;

  if (uaeLocations.some(loc => data.location.includes(loc))) {
    locationScore = 2;
  } else if (data.location !== 'Not specified') {
    locationScore = 1;
  }

  const total = budgetScore + timelineScore + requirementsScore + locationScore;

  return {
    budget: budgetScore,
    timeline: timelineScore,
    requirements: requirementsScore,
    location: locationScore,
    total: Math.min(total, 10)
  };
}

export function generateBrief(data: ParsedData): string {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `# Client Brief - ${data.clientName}

**Date:** ${date}

## Project Overview

- **Type:** ${data.projectType}
- **Budget:** ${data.budget}
- **Timeline:** ${data.timeline}
- **Location:** ${data.location}

## Requirements

${data.requirements.map(r => `- ${r}`).join('\n')}

## Proposed Deliverables

${getDeliverablesByType(data.projectType)}

## Next Steps

1. **Discovery Call** - Schedule 30-minute consultation to discuss vision and details
2. **Detailed Quote** - Provide itemized pricing based on requirements
3. **Portfolio Review** - Share relevant portfolio samples from similar projects
4. **Location Scout** - Visit and assess shooting location if needed
5. **Contract & Deposit** - Finalize agreement and secure booking with 50% deposit

## Notes

- All high-resolution images delivered via secure online gallery
- Turnaround time: 2-3 weeks for final edited photos
- Additional editing requests included in package
- Travel within UAE included in quoted price

---

*Generated by CreatorOS AI*`;
}

function getDeliverablesByType(projectType: ProjectType): string {
  const deliverables: Record<ProjectType, string[]> = {
    'Wedding': [
      '300-500 edited high-resolution photos',
      '3-5 minute highlight video',
      'Online gallery for guest access',
      'Print-ready files for albums'
    ],
    'Corporate': [
      '150-200 edited photos',
      'Headshots of key personnel',
      'Event documentation',
      'Social media ready content'
    ],
    'Product': [
      'Number of shots as specified',
      'White background variants',
      'Lifestyle/contextual shots',
      'Web-optimized and print-ready files'
    ],
    'Real Estate': [
      '25-35 interior and exterior shots',
      'Aerial drone photography',
      'Twilight exterior photos',
      'Virtual tour (if applicable)'
    ],
    'Fashion': [
      '100-150 edited images',
      'Behind-the-scenes content',
      'Raw files available',
      'Social media teasers'
    ],
    'Portrait': [
      '20-30 edited portraits',
      'Multiple outfit/background variations',
      'Retouched headshots',
      'Print and digital formats'
    ],
    'Event': [
      '200-300 edited photos',
      'Full event coverage',
      'Candid and posed shots',
      'Online gallery delivery'
    ],
    'Commercial': [
      'As per project scope',
      'Usage rights documentation',
      'Multiple format exports',
      'Revision rounds included'
    ],
    'Other': [
      'Custom deliverables based on project scope',
      'High-resolution edited images',
      'Online gallery access',
      'Print-ready files'
    ]
  };

  return deliverables[projectType].map(d => `- ${d}`).join('\n');
}
