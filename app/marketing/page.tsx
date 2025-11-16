'use client';

import { Header } from '@/components/layout/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMarketingStore } from '@/lib/stores/marketing-store';
import { LeadPipeline } from '@/components/marketing/lead-pipeline';
import { ContentCalendar } from '@/components/marketing/content-calendar';
import { TestimonialManager } from '@/components/marketing/testimonial-manager';
import { ReferralTracker } from '@/components/marketing/referral-tracker';
import { EmailCampaignManager } from '@/components/marketing/email-campaign-manager';
import { GrowthAnalytics } from '@/components/marketing/growth-analytics';
import { PortfolioGenerator } from '@/components/marketing/portfolio-generator';
import { SEODashboard } from '@/components/marketing/seo-dashboard';
import { LeadMagnetBuilder } from '@/components/marketing/lead-magnet-builder';
import { MarketingWorkflows } from '@/components/marketing/marketing-workflows';
import { BrandMonitoring } from '@/components/marketing/brand-monitoring';
import { PartnershipManager } from '@/components/marketing/partnership-manager';
import { ContentLibrary } from '@/components/marketing/content-library';
import {
  Users,
  TrendingUp,
  Mail,
  Star,
  Share2,
  Target,
  Instagram,
  Calendar as CalendarIcon,
  Globe,
  Search,
  FileText,
  Workflow,
  Eye,
  Handshake,
  FolderOpen,
} from 'lucide-react';

export default function MarketingPage() {
  const { leads, testimonials, referrals, campaigns, getConversionRate } = useMarketingStore();

  const stats = [
    {
      title: 'New Leads',
      value: leads.filter(l => l.stage === 'new').length,
      change: '+12%',
      trend: 'up' as const,
      icon: Users,
      color: 'text-[#00F5FF]',
    },
    {
      title: 'Conversion Rate',
      value: `${getConversionRate().toFixed(1)}%`,
      change: '+5.2%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      title: 'Active Campaigns',
      value: campaigns.filter(c => c.status === 'scheduled').length,
      change: '2 scheduled',
      icon: Mail,
      color: 'text-purple-500',
    },
    {
      title: 'Testimonials',
      value: testimonials.filter(t => t.approved).length,
      change: `${testimonials.filter(t => !t.approved).length} pending`,
      icon: Star,
      color: 'text-yellow-500',
    },
    {
      title: 'Referrals',
      value: referrals.length,
      change: `${referrals.filter(r => r.status === 'booked').length} converted`,
      icon: Share2,
      color: 'text-pink-500',
    },
    {
      title: 'Social Reach',
      value: '15.2K',
      change: '+8.3%',
      trend: 'up' as const,
      icon: Instagram,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="min-h-screen">
      <Header title="Marketing & Growth" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="glass-card border-white/10">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="leads" className="space-y-6">
          <TabsList className="glass-card border-white/10 flex-wrap h-auto">
            <TabsTrigger value="leads" className="data-[state=active]:bg-white/10">
              <Users className="w-4 h-4 mr-2" />
              Leads & CRM
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-white/10">
              <Instagram className="w-4 h-4 mr-2" />
              Social Media
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-white/10">
              <Globe className="w-4 h-4 mr-2" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="seo" className="data-[state=active]:bg-white/10">
              <Search className="w-4 h-4 mr-2" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="lead-magnets" className="data-[state=active]:bg-white/10">
              <FileText className="w-4 h-4 mr-2" />
              Lead Magnets
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="data-[state=active]:bg-white/10">
              <Star className="w-4 h-4 mr-2" />
              Testimonials
            </TabsTrigger>
            <TabsTrigger value="referrals" className="data-[state=active]:bg-white/10">
              <Share2 className="w-4 h-4 mr-2" />
              Referrals
            </TabsTrigger>
            <TabsTrigger value="email" className="data-[state=active]:bg-white/10">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="workflows" className="data-[state=active]:bg-white/10">
              <Workflow className="w-4 h-4 mr-2" />
              Workflows
            </TabsTrigger>
            <TabsTrigger value="brand" className="data-[state=active]:bg-white/10">
              <Eye className="w-4 h-4 mr-2" />
              Brand
            </TabsTrigger>
            <TabsTrigger value="partners" className="data-[state=active]:bg-white/10">
              <Handshake className="w-4 h-4 mr-2" />
              Partners
            </TabsTrigger>
            <TabsTrigger value="library" className="data-[state=active]:bg-white/10">
              <FolderOpen className="w-4 h-4 mr-2" />
              Library
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white/10">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-4">
            <LeadPipeline />
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <ContentCalendar />
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-4">
            <PortfolioGenerator />
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <SEODashboard />
          </TabsContent>

          <TabsContent value="lead-magnets" className="space-y-4">
            <LeadMagnetBuilder />
          </TabsContent>

          <TabsContent value="testimonials" className="space-y-4">
            <TestimonialManager />
          </TabsContent>

          <TabsContent value="referrals" className="space-y-4">
            <ReferralTracker />
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <EmailCampaignManager />
          </TabsContent>

          <TabsContent value="workflows" className="space-y-4">
            <MarketingWorkflows />
          </TabsContent>

          <TabsContent value="brand" className="space-y-4">
            <BrandMonitoring />
          </TabsContent>

          <TabsContent value="partners" className="space-y-4">
            <PartnershipManager />
          </TabsContent>

          <TabsContent value="library" className="space-y-4">
            <ContentLibrary />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <GrowthAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
