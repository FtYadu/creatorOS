'use client';

import { useMarketingStore } from '@/lib/stores/marketing-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  DollarSign,
  Instagram,
  Mail,
  Globe,
  Eye,
} from 'lucide-react';

export function GrowthAnalytics() {
  const { leads, testimonials, referrals, getConversionRate, getLeadsBySource } = useMarketingStore();

  const leadsBySource = getLeadsBySource();
  const conversionRate = getConversionRate();
  const totalValue = leads.reduce((sum, lead) => {
    const match = lead.budget?.match(/[\d,]+/);
    return sum + (match ? parseInt(match[0].replace(/,/g, '')) : 0);
  }, 0);

  const metrics = [
    {
      title: 'New Leads (Nov)',
      value: leads.length,
      change: '+15%',
      trend: 'up' as const,
      icon: Users,
      color: 'text-[#00F5FF]',
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate.toFixed(1)}%`,
      change: '+3.2%',
      trend: 'up' as const,
      icon: Target,
      color: 'text-green-500',
    },
    {
      title: 'Pipeline Value',
      value: `AED ${(totalValue / 1000).toFixed(0)}K`,
      change: '+28%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-yellow-500',
    },
    {
      title: 'Avg Lead Value',
      value: `AED ${(totalValue / leads.length || 0).toFixed(0)}`,
      change: '+8%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'text-purple-500',
    },
  ];

  const channels = [
    { name: 'Instagram', leads: leadsBySource.instagram || 0, color: 'text-pink-500', icon: Instagram },
    { name: 'Google Search', leads: leadsBySource.google || 0, color: 'text-blue-500', icon: Globe },
    { name: 'Referrals', leads: leadsBySource.referral || 0, color: 'text-green-500', icon: Users },
    { name: 'Website', leads: leadsBySource.website || 0, color: 'text-[#00F5FF]', icon: Globe },
    { name: 'Vendor Partners', leads: leadsBySource.vendor || 0, color: 'text-yellow-500', icon: Target },
  ];

  const socialMetrics = {
    followers: 15200,
    growthRate: 8.3,
    avgEngagement: 4.2,
    reachThisMonth: 45600,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Growth Analytics</h2>
        <p className="text-muted-foreground">Track your business growth and marketing performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <Card key={metric.title} className="glass-card border-white/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <Icon className={`w-5 h-5 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{metric.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendIcon className={`w-3 h-3 ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-sm ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {metric.change}
                  </span>
                  <span className="text-sm text-muted-foreground">vs last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle>Leads by Source</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {channels.map((channel) => {
              const Icon = channel.icon;
              const percentage = leads.length > 0 ? ((channel.leads / leads.length) * 100).toFixed(0) : 0;
              return (
                <div key={channel.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${channel.color}`} />
                      <span className="text-sm font-medium">{channel.name}</span>
                    </div>
                    <span className="text-sm font-bold">{channel.leads} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-[#00F5FF] to-[#B026FF]"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle>Social Media Growth</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Total Followers</div>
                <div className="text-2xl font-bold">{socialMetrics.followers.toLocaleString()}</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-500">+{socialMetrics.growthRate}%</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Avg Engagement</div>
                <div className="text-2xl font-bold">{socialMetrics.avgEngagement}%</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-500">+0.8%</span>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Month Reach</span>
                <span className="text-lg font-semibold text-[#00F5FF]">
                  {socialMetrics.reachThisMonth.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-sm">Client Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {testimonials.length > 0
                ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
                : '0.0'}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Average rating from {testimonials.length} reviews
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-sm">Referral Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{referrals.length}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {referrals.filter(r => r.status === 'booked').length} converted to bookings
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-sm">Portfolio Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3,240</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-sm text-green-500">+22%</span>
              <span className="text-sm text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
