'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { EditStage, EditStageStatus } from '@/types';
import { usePostProductionStore } from '@/lib/stores/post-production-store';
import toast from 'react-hot-toast';

interface EditProgressTrackerProps {
  projectId: string;
}

const defaultStages = [
  { name: 'Import & Organization', estimatedHours: 2 },
  { name: 'Rough Cut', estimatedHours: 8 },
  { name: 'Fine Cut', estimatedHours: 6 },
  { name: 'Color Grading', estimatedHours: 4 },
  { name: 'Sound Design', estimatedHours: 3 },
  { name: 'VFX/Retouching', estimatedHours: 4 },
  { name: 'Final Review', estimatedHours: 2 },
  { name: 'Export', estimatedHours: 1 },
];

export function EditProgressTracker({ projectId }: EditProgressTrackerProps) {
  const { editStages, setEditStages, updateEditStage, getOverallProgress } =
    usePostProductionStore();
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());
  const stages = editStages[projectId] || [];
  const overallProgress = getOverallProgress(projectId);

  useEffect(() => {
    loadEditStages();
  }, [projectId]);

  const loadEditStages = async () => {
    const { data, error } = await supabase
      .from('edit_stages')
      .select('*')
      .eq('project_id', projectId)
      .order('sort_order');

    if (error) {
      console.error('Error loading edit stages:', error);
      return;
    }

    if (data && data.length > 0) {
      const loadedStages: EditStage[] = data.map((stage: any) => ({
        id: stage.id,
        projectId: stage.project_id,
        stageName: stage.stage_name,
        status: stage.status as EditStageStatus,
        estimatedHours: parseFloat(stage.estimated_hours) || 0,
        actualHours: parseFloat(stage.actual_hours) || 0,
        notes: stage.notes || '',
        assignee: stage.assignee || '',
        sortOrder: stage.sort_order,
        createdAt: new Date(stage.created_at),
        updatedAt: new Date(stage.updated_at),
      }));
      setEditStages(projectId, loadedStages);
    } else {
      await initializeDefaultStages();
    }
  };

  const initializeDefaultStages = async () => {
    const stagesToInsert = defaultStages.map((stage, index) => ({
      project_id: projectId,
      stage_name: stage.name,
      status: 'not-started',
      estimated_hours: stage.estimatedHours,
      actual_hours: 0,
      notes: '',
      assignee: '',
      sort_order: index,
    }));

    const { data, error } = await supabase
      .from('edit_stages')
      .insert(stagesToInsert as any)
      .select();

    if (error) {
      console.error('Error initializing stages:', error);
      toast.error('Failed to initialize edit stages');
      return;
    }

    if (data) {
      const loadedStages: EditStage[] = data.map((stage: any) => ({
        id: stage.id,
        projectId: stage.project_id,
        stageName: stage.stage_name,
        status: stage.status as EditStageStatus,
        estimatedHours: parseFloat(stage.estimated_hours) || 0,
        actualHours: parseFloat(stage.actual_hours) || 0,
        notes: stage.notes || '',
        assignee: stage.assignee || '',
        sortOrder: stage.sort_order,
        createdAt: new Date(stage.created_at),
        updatedAt: new Date(stage.updated_at),
      }));
      setEditStages(projectId, loadedStages);
    }
  };

  const handleUpdateStage = async (stageId: string, updates: Partial<EditStage>) => {
    const dbUpdates: any = {};
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.actualHours !== undefined) dbUpdates.actual_hours = updates.actualHours;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

    const { error } = await supabase
      .from('edit_stages')
      // @ts-expect-error - Supabase type inference without generated types
      .update(dbUpdates)
      .eq('id', stageId);

    if (error) {
      console.error('Error updating stage:', error);
      toast.error('Failed to update stage');
      return;
    }

    updateEditStage(projectId, stageId, updates);
    toast.success('Stage updated');
  };

  const toggleExpanded = (stageId: string) => {
    const newExpanded = new Set(expandedStages);
    if (newExpanded.has(stageId)) {
      newExpanded.delete(stageId);
    } else {
      newExpanded.add(stageId);
    }
    setExpandedStages(newExpanded);
  };

  const getStatusIcon = (status: EditStageStatus) => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="h-5 w-5 text-green-400" />;
      case 'in-progress':
        return (
          <div className="relative">
            <Circle className="h-5 w-5 text-blue-400" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            </div>
          </div>
        );
      default:
        return <Circle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: EditStageStatus) => {
    switch (status) {
      case 'complete':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const completedCount = stages.filter((s) => s.status === 'complete').length;

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle className="gradient-text">Edit Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="glass-card p-4">
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-white/10"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - overallProgress / 100)}`}
                  className="transition-all duration-500"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00F5FF" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold gradient-text">{overallProgress}%</span>
                <span className="text-xs text-muted-foreground">Complete</span>
              </div>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            {completedCount} of {stages.length} stages complete
          </div>
        </div>

        <div className="space-y-2">
          {stages.map((stage) => {
            const isExpanded = expandedStages.has(stage.id);
            const stageProgress =
              stage.status === 'complete'
                ? 100
                : stage.status === 'in-progress'
                ? 50
                : 0;

            return (
              <div key={stage.id} className="glass-card p-4 space-y-3">
                <div className="flex items-start gap-3">
                  {getStatusIcon(stage.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{stage.stageName}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(stage.id)}
                        className="h-6 w-6 p-0"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${getStatusColor(stage.status)} border text-xs`}>
                        {stage.status.replace('-', ' ')}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          Est: {stage.estimatedHours}h | Actual: {stage.actualHours}h
                        </span>
                      </div>
                    </div>
                    {stage.status === 'in-progress' && (
                      <div className="w-full bg-white/10 rounded-full h-1">
                        <div
                          className="h-1 rounded-full bg-gradient-to-r from-[#00F5FF] to-[#a855f7] transition-all duration-300"
                          style={{ width: `${stageProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="space-y-3 pl-8 border-l-2 border-white/10">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">
                        Actual Hours
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={stage.actualHours}
                        onChange={(e) =>
                          handleUpdateStage(stage.id, {
                            actualHours: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-1 bg-white/5 border border-white/10 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Notes</label>
                      <Textarea
                        value={stage.notes}
                        onChange={(e) => handleUpdateStage(stage.id, { notes: e.target.value })}
                        placeholder="Add notes about this stage..."
                        className="bg-white/5 border-white/10 text-sm min-h-[60px]"
                      />
                    </div>
                    <div className="flex gap-2">
                      {stage.status !== 'complete' && (
                        <>
                          {stage.status === 'not-started' && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleUpdateStage(stage.id, { status: 'in-progress' })
                              }
                              className="flex-1"
                            >
                              Start Stage
                            </Button>
                          )}
                          {stage.status === 'in-progress' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStage(stage.id, { status: 'complete' })}
                              className="flex-1"
                            >
                              Mark Complete
                            </Button>
                          )}
                        </>
                      )}
                      {stage.status === 'complete' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStage(stage.id, { status: 'in-progress' })}
                          className="flex-1"
                        >
                          Reopen Stage
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
