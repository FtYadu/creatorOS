'use client';

import { useMarketingStore } from '@/lib/stores/marketing-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Share2, Gift, Trophy, TrendingUp } from 'lucide-react';

export function ReferralTracker() {
  const { referrals } = useMarketingStore();

  const totalReferrals = referrals.length;
  const bookedReferrals = referrals.filter(r => r.status === 'booked').length;
  const totalValue = referrals.reduce((sum, r) => sum + r.projectValue, 0);
  const conversionRate = totalReferrals > 0 ? ((bookedReferrals / totalReferrals) * 100).toFixed(1) : '0';

  const statusColors = {
    lead: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    booked: 'bg-green-500/20 text-green-400 border-green-500/30',
    completed: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Referral Program</h2>
        <p className="text-muted-foreground">Track and reward your top referrers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Referrals</CardTitle>
            <Share2 className="w-5 h-5 text-[#00F5FF]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalReferrals}</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Booked</CardTitle>
            <Trophy className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{bookedReferrals}</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
            <TrendingUp className="w-5 h-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{conversionRate}%</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
            <Gift className="w-5 h-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">AED {totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle>Referral List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {referrals.map((referral) => (
            <div key={referral.id} className="glass-card border-white/10 p-4 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold">{referral.referredName}</h4>
                  <p className="text-sm text-muted-foreground">Referred by {referral.referrerName}</p>
                </div>
                <Badge variant="outline" className={statusColors[referral.status]}>
                  {referral.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p>{referral.referredEmail}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Reward:</span>
                  <p className="font-medium text-[#00F5FF]">{referral.rewardAmount} {referral.rewardType}</p>
                </div>
              </div>

              {referral.projectValue > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <span className="text-sm text-muted-foreground">Project Value: </span>
                  <span className="text-sm font-semibold text-green-400">AED {referral.projectValue.toLocaleString()}</span>
                </div>
              )}

              {referral.status === 'booked' && !referral.rewardClaimed && (
                <Button size="sm" className="mt-3 w-full bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-black">
                  <Gift className="w-4 h-4 mr-2" />
                  Mark Reward as Claimed
                </Button>
              )}
            </div>
          ))}
          {referrals.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No referrals yet. Share your referral program with past clients!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
