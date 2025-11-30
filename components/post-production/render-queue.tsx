'use client';

import { useState, useEffect } from 'react';
import { Plus, Play, Trash2, ChevronUp, ChevronDown, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { RenderTask, RenderStatus } from '@/types';
import { usePostProductionStore } from '@/lib/stores/post-production-store';
import toast from 'react-hot-toast';

interface RenderQueueProps {
  projectId: string;
}

const renderPresets = {
  wedding: [
    { name: 'Master (4K MP4)', format: 'MP4', resolution: '4K', estimatedSize: '2.4 GB', estimatedTime: '15 mins' },
    { name: 'Web Optimized (1080p MP4)', format: 'MP4', resolution: '1080p', estimatedSize: '850 MB', estimatedTime: '8 mins' },
    { name: 'Highlight Reel (1080p MP4)', format: 'MP4', resolution: '1080p', estimatedSize: '450 MB', estimatedTime: '5 mins' },
    { name: 'Instagram Story (Vertical)', format: 'MP4', resolution: '1080x1920', estimatedSize: '200 MB', estimatedTime: '3 mins' },
  ],
  corporate: [
    { name: 'Master (1080p ProRes)', format: 'ProRes', resolution: '1080p', estimatedSize: '8.2 GB', estimatedTime: '20 mins' },
    { name: 'YouTube (1080p MP4)', format: 'MP4', resolution: '1080p', estimatedSize: '650 MB', estimatedTime: '7 mins' },
    { name: 'LinkedIn (720p MP4)', format: 'MP4', resolution: '720p', estimatedSize: '280 MB', estimatedTime: '4 mins' },
  ],
  social: [
    { name: 'Instagram Feed (Square)', format: 'MP4', resolution: '1080x1080', estimatedSize: '180 MB', estimatedTime: '3 mins' },
    { name: 'Instagram Story (Vertical)', format: 'MP4', resolution: '1080x1920', estimatedSize: '200 MB', estimatedTime: '3 mins' },
    { name: 'TikTok (Vertical)', format: 'MP4', resolution: '1080x1920', estimatedSize: '150 MB', estimatedTime: '2 mins' },
    { name: 'YouTube Shorts', format: 'MP4', resolution: '1080x1920', estimatedSize: '175 MB', estimatedTime: '2 mins' },
  ],
};

export function RenderQueue({ projectId }: RenderQueueProps) {
  const { renderTasks, setRenderTasks, addRenderTask, updateRenderTask, deleteRenderTask } =
    usePostProductionStore();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [format, setFormat] = useState('MP4');
  const [resolution, setResolution] = useState('1080p');
  const [presetCategory, setPresetCategory] = useState('wedding');
  const [priority, setPriority] = useState(3);

  const tasks = renderTasks[projectId] || [];

  useEffect(() => {
    loadRenderTasks();
  }, [projectId]);

  const loadRenderTasks = async () => {
    const { data, error } = await supabase
      .from('render_tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('priority', { ascending: false });

    if (error) {
      console.error('Error loading render tasks:', error);
      return;
    }

    if (data) {
      const loadedTasks: RenderTask[] = data.map((task: any) => ({
        id: task.id,
        projectId: task.project_id,
        taskName: task.task_name,
        format: task.format,
        resolution: task.resolution,
        codec: task.codec,
        estimatedSize: task.estimated_size || '',
        estimatedTime: task.estimated_time || '',
        status: task.status as RenderStatus,
        progress: parseFloat(task.progress) || 0,
        priority: task.priority,
        presetName: task.preset_name,
        errorMessage: task.error_message,
        completedAt: task.completed_at ? new Date(task.completed_at) : undefined,
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at),
      }));
      setRenderTasks(projectId, loadedTasks);
    }
  };

  const handleAddTask = async () => {
    if (!taskName.trim()) {
      toast.error('Please enter a task name');
      return;
    }

    const { data, error } = await supabase
      .from('render_tasks')
      .insert({
        project_id: projectId,
        task_name: taskName,
        format,
        resolution,
        codec: format === 'MP4' ? 'H.264' : 'ProRes 422',
        status: 'queued',
        progress: 0,
        priority,
      } as any)
      .select()
      .single();

    if (error || !data) {
      console.error('Error adding render task:', error);
      toast.error('Failed to add render task');
      return;
    }

    const record = data as any;
    const newTask: RenderTask = {
      id: record.id,
      projectId: record.project_id,
      taskName: record.task_name,
      format: record.format,
      resolution: record.resolution,
      codec: record.codec,
      estimatedSize: record.estimated_size || '',
      estimatedTime: record.estimated_time || '',
      status: record.status as RenderStatus,
      progress: 0,
      priority: record.priority,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
    };

    addRenderTask(projectId, newTask);
    setShowAddDialog(false);
    setTaskName('');
    toast.success('Render task added to queue');
  };

  const handleDeleteTask = async (taskId: string) => {
    const { error } = await supabase.from('render_tasks').delete().eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      return;
    }

    deleteRenderTask(projectId, taskId);
    toast.success('Task removed from queue');
  };

  const handleStartRender = async (taskId: string) => {
    const { error } = await supabase
      .from('render_tasks')
      // @ts-expect-error - Supabase type inference without generated types
      .update({ status: 'rendering', progress: 0 })
      .eq('id', taskId);

    if (error) {
      console.error('Error starting render:', error);
      toast.error('Failed to start render');
      return;
    }

    updateRenderTask(projectId, taskId, { status: 'rendering', progress: 0 });
    toast.success('Render started');

    simulateRenderProgress(taskId);
  };

  const simulateRenderProgress = (taskId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        clearInterval(interval);
        updateRenderTask(projectId, taskId, { status: 'complete', progress: 100 });
        (supabase as any)
          .from('render_tasks')
          .update({ status: 'complete', progress: 100, completed_at: new Date().toISOString() })
          .eq('id', taskId);
        toast.success('Render complete!');
      } else {
        updateRenderTask(projectId, taskId, { progress });
        (supabase as any).from('render_tasks').update({ progress }).eq('id', taskId);
      }
    }, 1000);
  };

  const handleLoadPreset = (preset: any) => {
    setTaskName(preset.name);
    setFormat(preset.format);
    setResolution(preset.resolution);
  };

  const getStatusColor = (status: RenderStatus) => {
    switch (status) {
      case 'complete':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rendering':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => b.priority - a.priority);

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="gradient-text">Render Queue</CardTitle>
          <Button size="sm" onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-8">
            <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No render tasks in queue</p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Task
            </Button>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <div key={task.id} className="glass-card p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{task.taskName}</h4>
                    <Badge className={`${getStatusColor(task.status)} border text-xs`}>
                      {task.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      {task.format} • {task.resolution}
                    </span>
                    {task.estimatedSize && <span>{task.estimatedSize}</span>}
                    {task.estimatedTime && <span>~{task.estimatedTime}</span>}
                    <span className="text-[#00F5FF]">Priority: {task.priority}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {task.status === 'queued' && (
                    <Button size="sm" onClick={() => handleStartRender(task.id)}>
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  {task.status !== 'rendering' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  )}
                </div>
              </div>

              {task.status === 'rendering' && (
                <div>
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <span className="text-muted-foreground">Rendering...</span>
                    <span className="text-[#00F5FF]">{task.progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-[#00F5FF] to-[#a855f7] transition-all duration-300"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {task.status === 'complete' && (
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Render complete</span>
                </div>
              )}

              {task.status === 'failed' && task.errorMessage && (
                <div className="flex items-center gap-2 text-sm text-red-400">
                  <XCircle className="h-4 w-4" />
                  <span>{task.errorMessage}</span>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="glass-card border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="gradient-text">Add Render Task</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Preset Templates</label>
              <Select value={presetCategory} onValueChange={setPresetCategory}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10">
                  <SelectItem value="wedding">Wedding Package</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                </SelectContent>
              </Select>

              <div className="grid grid-cols-2 gap-2 mt-3">
                {renderPresets[presetCategory as keyof typeof renderPresets].map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    onClick={() => handleLoadPreset(preset)}
                    className="justify-start"
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Task Name</label>
              <input
                type="text"
                placeholder="Master Export - 4K"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Format</label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/10">
                    <SelectItem value="MP4">MP4</SelectItem>
                    <SelectItem value="MOV">MOV</SelectItem>
                    <SelectItem value="ProRes">ProRes</SelectItem>
                    <SelectItem value="AVI">AVI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Resolution</label>
                <Select value={resolution} onValueChange={setResolution}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/10">
                    <SelectItem value="4K">4K (3840x2160)</SelectItem>
                    <SelectItem value="1080p">1080p (1920x1080)</SelectItem>
                    <SelectItem value="720p">720p (1280x720)</SelectItem>
                    <SelectItem value="1080x1920">1080x1920 (Vertical)</SelectItem>
                    <SelectItem value="1080x1080">1080x1080 (Square)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Priority: {priority}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            <Button onClick={handleAddTask} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add to Queue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
