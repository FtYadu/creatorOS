'use client';

import { Header } from '@/components/layout/header';
import { StatsCard } from '@/components/dashboard/stats-card';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { useDashboardStore } from '@/lib/stores/dashboard-store';
import { FolderKanban, Mail, DollarSign, Calendar } from 'lucide-react';

export default function DashboardPage() {
  const { stats, activities } = useDashboardStore();

  return (
    <div className="min-h-screen">
      <Header title="Dashboard" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Active Projects"
            value={stats.activeProjects}
            change={stats.activeProjectsChange}
            icon={FolderKanban}
            delay={0}
          />
          <StatsCard
            title="Pending Leads"
            value={stats.pendingLeads}
            change={stats.pendingLeadsChange}
            icon={Mail}
            delay={100}
          />
          <StatsCard
            title="Monthly Revenue"
            value={stats.monthlyRevenue}
            change={stats.monthlyRevenueChange}
            icon={DollarSign}
            prefix="AED "
            delay={200}
          />
          <StatsCard
            title="Upcoming Shoots"
            value={stats.upcomingShootsCount}
            change={stats.upcomingShootsChange}
            icon={Calendar}
            delay={300}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity activities={activities} />

          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-4 glass-button hover:bg-white/10 transition-colors rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Schedule New Shoot</p>
                    <p className="text-sm text-muted-foreground">Book a photography session</p>
                  </div>
                  <Calendar className="w-5 h-5 text-[#00F5FF]" />
                </div>
              </button>
              <button className="w-full text-left p-4 glass-button hover:bg-white/10 transition-colors rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Review Leads</p>
                    <p className="text-sm text-muted-foreground">Check new client inquiries</p>
                  </div>
                  <Mail className="w-5 h-5 text-[#B026FF]" />
                </div>
              </button>
              <button className="w-full text-left p-4 glass-button hover:bg-white/10 transition-colors rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Update Projects</p>
                    <p className="text-sm text-muted-foreground">Move projects to next stage</p>
                  </div>
                  <FolderKanban className="w-5 h-5 text-green-400" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
