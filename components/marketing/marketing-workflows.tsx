'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Workflow,
  Play,
  Pause,
  Edit,
  Copy,
  Trash2,
  Plus,
  Mail,
  Clock,
  Users,
  Tag,
  CheckCircle,
  TrendingUp,
  GitBranch,
} from 'lucide-react';
import toast from 'react-hot-toast';

const workflowTemplates = [
  {
    id: 'new-lead',
    name: 'New Lead Nurture',
    description: 'Automated follow-up sequence for new leads',
    trigger: 'New lead created',
    steps: 5,
    conversionRate: 24,
  },
  {
    id: 'post-delivery',
    name: 'Post-Delivery Follow-up',
    description: 'Request testimonials and referrals after project delivery',
    trigger: 'Project marked as delivered',
    steps: 4,
    conversionRate: 38,
  },
  {
    id: 're-engagement',
    name: 'Re-engagement Campaign',
    description: 'Win back inactive leads after 30 days',
    trigger: 'Lead inactive for 30 days',
    steps: 3,
    conversionRate: 15,
  },
  {
    id: 'referral-promo',
    name: 'Referral Program Promotion',
    description: 'Promote referral program to happy clients',
    trigger: 'Positive testimonial received',
    steps: 2,
    conversionRate: 42,
  },
];

const activeWorkflows = [
  {
    id: '1',
    name: 'New Lead Nurture Sequence',
    trigger: 'New lead created',
    status: 'active',
    triggered: 124,
    completed: 87,
    conversions: 21,
    revenueAttributed: 245000,
  },
  {
    id: '2',
    name: 'Post-Project Testimonial Request',
    trigger: 'Project delivered',
    status: 'active',
    triggered: 45,
    completed: 38,
    conversions: 14,
    revenueAttributed: 0,
  },
  {
    id: '3',
    name: 'Seasonal Wedding Promotion',
    trigger: 'Specific date (Dec 1)',
    status: 'paused',
    triggered: 0,
    completed: 0,
    conversions: 0,
    revenueAttributed: 0,
  },
];

export function MarketingWorkflows() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  const handleToggleWorkflow = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    toast.success(`Workflow ${newStatus === 'active' ? 'activated' : 'paused'}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Marketing Automation Workflows</h2>
          <p className="text-muted-foreground">Automate your marketing with intelligent workflows</p>
        </div>
        <Button className="bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-black">
          <Plus className="w-4 h-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold gradient-text">
              {activeWorkflows.filter((w) => w.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Running automation</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Executions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">169</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-400">35</div>
            <p className="text-xs text-muted-foreground mt-1">20.7% conversion rate</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#00F5FF]">AED 245K</div>
            <p className="text-xs text-muted-foreground mt-1">From workflows</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold">Active Workflows</h3>
          {activeWorkflows.map((workflow) => (
            <Card key={workflow.id} className="glass-card border-white/10">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{workflow.name}</h3>
                      <Badge
                        variant="outline"
                        className={
                          workflow.status === 'active'
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        }
                      >
                        {workflow.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GitBranch className="w-4 h-4" />
                      <span>Trigger: {workflow.trigger}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleWorkflow(workflow.id, workflow.status)}
                      className="glass-card border-white/10"
                    >
                      {workflow.status === 'active' ? (
                        <>
                          <Pause className="w-3 h-3 mr-1" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 mr-1" />
                          Activate
                        </>
                      )}
                    </Button>
                    <Button size="sm" variant="outline" className="glass-card border-white/10">
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 glass-card border-white/10 rounded-lg">
                    <div className="text-xl font-bold">{workflow.triggered}</div>
                    <div className="text-xs text-muted-foreground">Triggered</div>
                  </div>
                  <div className="text-center p-3 glass-card border-white/10 rounded-lg">
                    <div className="text-xl font-bold text-blue-400">{workflow.completed}</div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                  <div className="text-center p-3 glass-card border-white/10 rounded-lg">
                    <div className="text-xl font-bold text-green-400">{workflow.conversions}</div>
                    <div className="text-xs text-muted-foreground">Conversions</div>
                  </div>
                  <div className="text-center p-3 glass-card border-white/10 rounded-lg">
                    <div className="text-lg font-bold text-[#00F5FF]">
                      {workflow.revenueAttributed > 0 ? `${(workflow.revenueAttributed / 1000).toFixed(0)}K` : '-'}
                    </div>
                    <div className="text-xs text-muted-foreground">Revenue</div>
                  </div>
                </div>

                {workflow.status === 'active' && workflow.triggered > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Completion Rate</span>
                      <span className="font-semibold">
                        {((workflow.completed / workflow.triggered) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-[#00F5FF] to-[#B026FF]"
                        style={{ width: `${(workflow.completed / workflow.triggered) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Workflow Templates</h3>
          {workflowTemplates.map((template) => (
            <Card
              key={template.id}
              className="glass-card border-white/10 hover:border-[#00F5FF]/50 transition-all cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{template.name}</h4>
                  <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    {template.steps} steps
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{template.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <GitBranch className="w-3 h-3" />
                    {template.trigger}
                  </span>
                  <span className="flex items-center gap-1 text-green-400">
                    <TrendingUp className="w-3 h-3" />
                    {template.conversionRate}% CVR
                  </span>
                </div>
                <Button size="sm" className="w-full mt-3 bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-black">
                  Use Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="glass-card border-[#00F5FF]/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="w-5 h-5 text-[#00F5FF]" />
            Example Workflow: New Lead Nurture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 glass-card border-white/10 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-[#00F5FF]/20 flex items-center justify-center flex-shrink-0">
                <GitBranch className="w-4 h-4 text-[#00F5FF]" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Trigger: New Lead Created</div>
                <div className="text-xs text-muted-foreground">When a new lead is added to the CRM</div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-px h-6 bg-white/20"></div>
            </div>

            <div className="flex items-start gap-3 p-3 glass-card border-white/10 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Send: Welcome Email</div>
                <div className="text-xs text-muted-foreground">Introduce your services and portfolio</div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-px h-6 bg-white/20"></div>
            </div>

            <div className="flex items-start gap-3 p-3 glass-card border-white/10 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Wait: 2 Days</div>
                <div className="text-xs text-muted-foreground">Give them time to review</div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-px h-6 bg-white/20"></div>
            </div>

            <div className="flex items-start gap-3 p-3 glass-card border-white/10 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-green-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Send: Portfolio Showcase</div>
                <div className="text-xs text-muted-foreground">Share your best work relevant to their project</div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-px h-6 bg-white/20"></div>
            </div>

            <div className="flex items-start gap-3 p-3 glass-card border-white/10 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Wait: 3 Days</div>
                <div className="text-xs text-muted-foreground">Allow time for consideration</div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-px h-6 bg-white/20"></div>
            </div>

            <div className="flex items-start gap-3 p-3 glass-card border-white/10 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Action: Create Follow-up Reminder</div>
                <div className="text-xs text-muted-foreground">Remind to make a personal follow-up call</div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-px h-6 bg-white/20"></div>
            </div>

            <div className="flex items-start gap-3 p-3 glass-card border-green-500/30 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Complete</div>
                <div className="text-xs text-muted-foreground">Workflow completes when lead is converted or marked as lost</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
