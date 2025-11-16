'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Send, Calendar, Users, Eye, MousePointer, Plus } from 'lucide-react';

const mockCampaigns = [
  {
    id: '1',
    name: 'Monthly Newsletter - November',
    subject: 'Behind the Lens: Our Best Work This Month',
    segment: 'all',
    status: 'sent',
    sentDate: '2025-11-01',
    stats: { sent: 450, opened: 315, clicked: 87 },
  },
  {
    id: '2',
    name: 'Wedding Season Promotion',
    subject: '🎉 Book Your 2026 Wedding Now - Special Offer',
    segment: 'leads',
    status: 'scheduled',
    scheduledDate: '2025-11-25',
    recipientCount: 234,
  },
  {
    id: '3',
    name: 'Anniversary Follow-up',
    subject: 'Happy Anniversary! Relive Your Special Day ✨',
    segment: 'past-clients',
    status: 'draft',
    recipientCount: 0,
  },
];

const templates = [
  { name: 'Newsletter', description: 'Monthly updates and featured work' },
  { name: 'Seasonal Promotion', description: 'Holiday or season-specific offers' },
  { name: 'Re-engagement', description: 'Reach out to inactive leads' },
  { name: 'Anniversary', description: 'Celebrate client milestones' },
  { name: 'Referral Request', description: 'Ask happy clients for referrals' },
];

export function EmailCampaignManager() {
  const statusColors: Record<string, string> = {
    draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    scheduled: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    sent: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Campaigns</h2>
          <p className="text-muted-foreground">Manage your email marketing campaigns</p>
        </div>
        <Button className="bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-black">
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Campaigns Sent</CardTitle>
            <Send className="w-5 h-5 text-[#00F5FF]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-sm text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reach</CardTitle>
            <Users className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5,420</div>
            <p className="text-sm text-muted-foreground mt-1">Subscribers</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Open Rate</CardTitle>
            <Eye className="w-5 h-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">68%</div>
            <p className="text-sm text-muted-foreground mt-1">Above industry avg</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-lg font-semibold">Recent Campaigns</h3>
          {mockCampaigns.map((campaign) => (
            <Card key={campaign.id} className="glass-card border-white/10">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold">{campaign.name}</h4>
                    <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                  </div>
                  <Badge variant="outline" className={statusColors[campaign.status]}>
                    {campaign.status}
                  </Badge>
                </div>

                {campaign.stats && (
                  <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-white/10">
                    <div>
                      <div className="text-xs text-muted-foreground">Sent</div>
                      <div className="text-lg font-semibold">{campaign.stats.sent}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Opened</div>
                      <div className="text-lg font-semibold text-green-400">
                        {campaign.stats.opened} ({((campaign.stats.opened / campaign.stats.sent) * 100).toFixed(0)}%)
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Clicked</div>
                      <div className="text-lg font-semibold text-blue-400">
                        {campaign.stats.clicked} ({((campaign.stats.clicked / campaign.stats.sent) * 100).toFixed(0)}%)
                      </div>
                    </div>
                  </div>
                )}

                {campaign.status === 'scheduled' && campaign.scheduledDate && (
                  <div className="mt-3 pt-3 border-t border-white/10 text-sm">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Scheduled for {new Date(campaign.scheduledDate).toLocaleDateString()}
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="glass-card border-white/10">
                    {campaign.status === 'draft' ? 'Edit' : 'View'}
                  </Button>
                  {campaign.status === 'draft' && (
                    <Button size="sm" className="bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-black">
                      <Send className="w-3 h-3 mr-1" />
                      Send Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Email Templates</h3>
          <div className="space-y-2">
            {templates.map((template) => (
              <Card key={template.name} className="glass-card border-white/10 hover:border-[#00F5FF]/50 transition-all cursor-pointer">
                <CardContent className="p-4">
                  <h4 className="font-medium text-sm">{template.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
