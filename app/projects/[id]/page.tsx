'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Calendar, DollarSign, MapPin, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useProjectsStore } from '@/lib/stores/projects-store';
import { Project } from '@/types';
import { Header } from '@/components/layout/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PreProductionTools } from '@/components/projects/pre-production-tools';
import { PostProductionDashboard } from '@/components/post-production/post-production-dashboard';

const projectTypeColors: Record<string, string> = {
  Wedding: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  Corporate: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Event: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Portrait: 'bg-green-500/20 text-green-400 border-green-500/30',
  Product: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Commercial: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Real Estate': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  Fashion: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  Other: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const stageColors: Record<string, string> = {
  leads: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'pre-production': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  shooting: 'bg-green-500/20 text-green-400 border-green-500/30',
  'post-production': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  delivered: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
};

const stageLabels: Record<string, string> = {
  leads: 'Lead',
  'pre-production': 'Pre-Production',
  shooting: 'Shooting',
  'post-production': 'Post-Production',
  delivered: 'Delivered',
};

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { projects } = useProjectsStore();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const foundProject = projects.find((p) => p.id === id);
    if (!foundProject) {
      router.push('/projects');
      return;
    }
    setProject(foundProject);
  }, [id, projects, router]);

  if (!project) {
    return null;
  }

  const daysUntilDeadline = Math.ceil(
    (project.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const isUrgent = daysUntilDeadline <= 7;

  return (
    <div className="min-h-screen">
      <Header title="Project Details" />

      <div className="p-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/projects')}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>

        <div className="glass-card p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">
                {project.clientName}
              </h1>
              <div className="flex gap-2 items-center flex-wrap">
                <Badge className={`${projectTypeColors[project.projectType]} border`}>
                  {project.projectType}
                </Badge>
                <Badge className={`${stageColors[project.stage]} border`}>
                  {stageLabels[project.stage]}
                </Badge>
                {isUrgent && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 border">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    Urgent
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#00F5FF]/10">
                <DollarSign className="h-5 w-5 text-[#00F5FF]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="text-lg font-semibold text-[#00F5FF]">
                  AED {project.budget.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Calendar className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Deadline</p>
                <p className={`text-lg font-semibold ${isUrgent ? 'text-red-400' : ''}`}>
                  {formatDistanceToNow(project.deadline, { addSuffix: true })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <MapPin className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="text-lg font-semibold">{project.location}</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="glass-card border-white/10">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {project.stage === 'pre-production' && (
              <TabsTrigger value="pre-production">Pre-Production</TabsTrigger>
            )}
            {project.stage === 'post-production' && (
              <TabsTrigger value="post-production">Post-Production</TabsTrigger>
            )}
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4">Project Information</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Client Name</p>
                  <p className="font-medium">{project.clientName}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Project Type</p>
                  <p className="font-medium">{project.projectType}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Location</p>
                  <p className="font-medium">{project.location}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Deadline</p>
                  <p className="font-medium">{project.deadline.toLocaleDateString()}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Requirements</p>
                  <ul className="space-y-1">
                    {project.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-[#00F5FF] mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div>
                      <span>Created: </span>
                      <span>{project.createdAt.toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span>Updated: </span>
                      <span>{formatDistanceToNow(project.updatedAt, { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {project.stage === 'pre-production' && (
            <TabsContent value="pre-production" className="mt-6">
              <PreProductionTools projectId={project.id} />
            </TabsContent>
          )}

          {project.stage === 'post-production' && (
            <TabsContent value="post-production" className="mt-6">
              <PostProductionDashboard project={project} />
            </TabsContent>
          )}

          <TabsContent value="files" className="mt-6">
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4">Project Files</h2>
              <div className="text-center py-12 text-muted-foreground">
                <p>File management coming soon</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="mt-6">
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4">Project Timeline</h2>
              <div className="text-center py-12 text-muted-foreground">
                <p>Timeline view coming soon</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4">Activity Log</h2>
              <div className="text-center py-12 text-muted-foreground">
                <p>Activity tracking coming soon</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
