'use client';

import { useState, useEffect } from 'react';
import { Plus, Download, Save, Trash2, GripVertical, Check } from 'lucide-react';
import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { Shot, ShotList } from '@/types';
import { shotListTemplates, lensOptions } from '@/lib/utils/pre-production-templates';
import { toast } from 'react-hot-toast';
import { useProjectsStore } from '@/lib/stores/projects-store';

interface ShotListCreatorProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SortableShotRowProps {
  shot: Shot;
  onUpdate: (id: string, field: string, value: any) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

function SortableShotRow({ shot, onUpdate, onDelete }: SortableShotRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: shot.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="glass-card p-3 mb-2"
    >
      <div className="flex items-center gap-3">
        <button
          {...listeners}
          {...attributes}
          className="cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>

        <div className="w-12 text-center">
          <span className="text-sm font-medium">#{shot.shotNumber}</span>
        </div>

        <div className="flex-1 grid grid-cols-4 gap-2">
          <input
            type="text"
            placeholder="Scene"
            value={shot.scene}
            onChange={(e) => onUpdate(shot.id, 'scene', e.target.value)}
            className="px-2 py-1 bg-white/5 border border-white/10 rounded text-sm"
          />

          <input
            type="text"
            placeholder="Subject"
            value={shot.subject}
            onChange={(e) => onUpdate(shot.id, 'subject', e.target.value)}
            className="px-2 py-1 bg-white/5 border border-white/10 rounded text-sm"
          />

          <Select
            value={shot.lensRecommendation}
            onValueChange={(value) => onUpdate(shot.id, 'lensRecommendation', value)}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-sm h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {lensOptions.map((lens) => (
                <SelectItem key={lens} value={lens}>
                  {lens}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <input
            type="text"
            placeholder="Lighting notes"
            value={shot.lightingNotes}
            onChange={(e) => onUpdate(shot.id, 'lightingNotes', e.target.value)}
            className="px-2 py-1 bg-white/5 border border-white/10 rounded text-sm"
          />
        </div>

        <Select
          value={shot.priority}
          onValueChange={(value) => onUpdate(shot.id, 'priority', value)}
        >
          <SelectTrigger className="w-28 bg-white/5 border-white/10 text-sm h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <button
          onClick={() => onUpdate(shot.id, 'captured', !shot.captured)}
          className="flex items-center gap-2"
        >
          <Checkbox checked={shot.captured} />
        </button>

        <button
          onClick={() => onDelete(shot.id)}
          className="p-1 hover:bg-red-500/20 rounded transition-colors"
        >
          <Trash2 className="h-4 w-4 text-red-400" />
        </button>
      </div>
    </div>
  );
}

export function ShotListCreator({ projectId, open, onOpenChange }: ShotListCreatorProps) {
  const { projects } = useProjectsStore();
  const project = projects.find((p) => p.id === projectId);
  const [shots, setShots] = useState<Shot[]>([]);
  const [shotListId, setShotListId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    if (open) {
      loadShotList();
    }
  }, [open, projectId]);

  const loadShotList = async () => {
    const { data: shotList } = await supabase
      .from('shot_lists')
      .select('*, shots(*)')
      .eq('project_id', projectId)
      .maybeSingle();

    if (shotList) {
      setShotListId(shotList.id);
      setSelectedTemplate(shotList.template_name || '');

      const loadedShots = (shotList.shots || []).map((s: any) => ({
        id: s.id,
        shotListId: s.shot_list_id,
        shotNumber: s.shot_number,
        scene: s.scene,
        subject: s.subject,
        lensRecommendation: s.lens_recommendation,
        lightingNotes: s.lighting_notes,
        priority: s.priority as 'high' | 'medium' | 'low',
        captured: s.captured,
        sortOrder: s.sort_order,
        createdAt: new Date(s.created_at),
        updatedAt: new Date(s.updated_at),
      }));
      setShots(loadedShots);
    }
  };

  const handleLoadTemplate = (templateName: string) => {
    setSelectedTemplate(templateName);
    const template = shotListTemplates[templateName as keyof typeof shotListTemplates];

    if (template) {
      const newShots: Shot[] = template.map((t, index) => ({
        id: `shot-${Date.now()}-${index}`,
        shotListId: shotListId || '',
        shotNumber: index + 1,
        scene: t.scene,
        subject: t.subject,
        lensRecommendation: t.lens,
        lightingNotes: t.lighting,
        priority: t.priority,
        captured: false,
        sortOrder: index,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      setShots(newShots);
      toast.success(`Loaded ${templateName} template`);
    }
  };

  const handleAddShot = () => {
    const newShot: Shot = {
      id: `shot-${Date.now()}`,
      shotListId: shotListId || '',
      shotNumber: shots.length + 1,
      scene: '',
      subject: '',
      lensRecommendation: 'Standard 50mm',
      lightingNotes: '',
      priority: 'medium',
      captured: false,
      sortOrder: shots.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setShots([...shots, newShot]);
  };

  const handleUpdateShot = (id: string, field: string, value: any) => {
    setShots((items) =>
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDeleteShot = (id: string) => {
    setShots((items) => {
      const filtered = items.filter((item) => item.id !== id);
      return filtered.map((item, index) => ({ ...item, shotNumber: index + 1, sortOrder: index }));
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setShots((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = [...items];
        const [movedItem] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, movedItem);

        return newItems.map((item, index) => ({
          ...item,
          shotNumber: index + 1,
          sortOrder: index,
        }));
      });
    }
  };

  const handleSave = async () => {
    try {
      let currentShotListId = shotListId;

      if (!currentShotListId) {
        const { data: newShotList, error: shotListError } = await supabase
          .from('shot_lists')
          .insert({
            project_id: projectId,
            template_name: selectedTemplate,
          })
          .select()
          .single();

        if (shotListError) throw shotListError;
        currentShotListId = newShotList.id;
        setShotListId(currentShotListId);
      } else {
        await supabase
          .from('shot_lists')
          .update({
            template_name: selectedTemplate,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentShotListId);
      }

      await supabase.from('shots').delete().eq('shot_list_id', currentShotListId);

      if (shots.length > 0) {
        const shotsToInsert = shots.map((shot) => ({
          shot_list_id: currentShotListId,
          shot_number: shot.shotNumber,
          scene: shot.scene,
          subject: shot.subject,
          lens_recommendation: shot.lensRecommendation,
          lighting_notes: shot.lightingNotes,
          priority: shot.priority,
          captured: shot.captured,
          sort_order: shot.sortOrder,
        }));

        await supabase.from('shots').insert(shotsToInsert);
      }

      toast.success('Shot list saved successfully!');
    } catch (error) {
      console.error('Error saving shot list:', error);
      toast.error('Failed to save shot list');
    }
  };

  const handleExport = () => {
    toast.success('Exporting shot list as PDF...');
  };

  const totalShots = shots.length;
  const capturedShots = shots.filter((s) => s.captured).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/10 max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">Shot List Creator</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Label>Load Template</Label>
              <Select value={selectedTemplate} onValueChange={handleLoadTemplate}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Select a template..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(shotListTemplates).map((template) => (
                    <SelectItem key={template} value={template}>
                      {template}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleAddShot} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Custom Shot
              </Button>
            </div>
          </div>

          {shots.length > 0 && (
            <>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Total Shots:</span>
                  <Badge variant="outline">{totalShots}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Captured:</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    {capturedShots}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Remaining:</span>
                  <Badge variant="outline">{totalShots - capturedShots}</Badge>
                </div>
              </div>

              <div className="glass-card p-3 grid grid-cols-[auto_48px_1fr_auto_auto_auto] gap-3 items-center text-xs font-medium text-muted-foreground">
                <div></div>
                <div className="text-center">#</div>
                <div className="grid grid-cols-4 gap-2">
                  <div>Scene</div>
                  <div>Subject</div>
                  <div>Lens</div>
                  <div>Lighting</div>
                </div>
                <div className="w-28">Priority</div>
                <div>Done</div>
                <div className="w-8"></div>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={shots.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                  <div>
                    {shots.map((shot) => (
                      <SortableShotRow
                        key={shot.id}
                        shot={shot}
                        onUpdate={handleUpdateShot}
                        onDelete={handleDeleteShot}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              <div className="flex gap-3">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  Save to Project
                </Button>
                <Button onClick={handleExport} variant="outline" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Export as PDF
                </Button>
              </div>
            </>
          )}

          {shots.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Load a template or add custom shots to get started</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
