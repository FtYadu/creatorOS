'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, Download, Save, Trash2, GripVertical } from 'lucide-react';
import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { MoodBoard, MoodBoardImage } from '@/types';
import { moodBoardStyles } from '@/lib/utils/pre-production-templates';
import { toast } from 'react-hot-toast';

interface MoodBoardGeneratorProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SortableImageProps {
  image: MoodBoardImage;
  onDelete: (id: string) => void;
  onNotesChange: (id: string, notes: string) => void;
}

function SortableImage({ image, onDelete, onNotesChange }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const gradients = [
    'from-pink-500 to-purple-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-teal-500',
    'from-yellow-500 to-orange-500',
    'from-purple-500 to-pink-500',
    'from-cyan-500 to-blue-500',
  ];

  const gradient = gradients[parseInt(image.id.slice(-1), 36) % gradients.length];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="glass-card overflow-hidden group"
      {...attributes}
    >
      <div className="relative">
        <div
          className={`aspect-square bg-gradient-to-br ${gradient} opacity-50 flex items-center justify-center`}
        >
          <Sparkles className="h-8 w-8 text-white/50" />
        </div>
        <button
          {...listeners}
          className="absolute top-2 left-2 p-1 bg-black/50 rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="h-4 w-4 text-white" />
        </button>
        <button
          onClick={() => onDelete(image.id)}
          className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="h-4 w-4 text-white" />
        </button>
      </div>
      <div className="p-2">
        <Textarea
          placeholder="Add notes..."
          value={image.notes}
          onChange={(e) => onNotesChange(image.id, e.target.value)}
          className="min-h-[60px] text-xs bg-white/5 border-white/10"
        />
      </div>
    </div>
  );
}

export function MoodBoardGenerator({ projectId, open, onOpenChange }: MoodBoardGeneratorProps) {
  const [style, setStyle] = useState('Modern');
  const [keywords, setKeywords] = useState('');
  const [colors, setColors] = useState<string[]>(['#00F5FF', '#9D4EDD', '#FF006E']);
  const [images, setImages] = useState<MoodBoardImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [moodBoardId, setMoodBoardId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    if (open) {
      loadMoodBoard();
    }
  }, [open, projectId]);

  const loadMoodBoard = async () => {
    const { data: moodBoard } = await supabase
      .from('mood_boards')
      .select('*, mood_board_images(*)')
      .eq('project_id', projectId)
      .maybeSingle();

    const record = moodBoard as any;
    if (record) {
      setMoodBoardId(record.id);
      setStyle(record.style);
      setKeywords(record.keywords);
      setColors(record.colors || []);

      const loadedImages = (record.mood_board_images || []).map((img: any) => ({
        id: img.id,
        moodBoardId: img.mood_board_id,
        imageUrl: img.image_url,
        notes: img.notes || '',
        sortOrder: img.sort_order,
        createdAt: new Date(img.created_at),
        updatedAt: new Date(img.updated_at),
      }));
      setImages(loadedImages);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newImages: MoodBoardImage[] = Array.from({ length: 9 }, (_, i) => ({
      id: `img-${Date.now()}-${i}`,
      moodBoardId: moodBoardId || '',
      notes: '',
      sortOrder: i,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    setImages(newImages);
    setIsGenerating(false);
    toast.success('Mood board generated!');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = [...items];
        const [movedItem] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, movedItem);

        return newItems.map((item, index) => ({ ...item, sortOrder: index }));
      });
    }
  };

  const handleDelete = (id: string) => {
    setImages((items) => items.filter((item) => item.id !== id));
  };

  const handleNotesChange = (id: string, notes: string) => {
    setImages((items) =>
      items.map((item) => (item.id === id ? { ...item, notes } : item))
    );
  };

  const handleSave = async () => {
    try {
      let currentMoodBoardId = moodBoardId;

      if (!currentMoodBoardId) {
        const { data: newMoodBoard, error: moodBoardError } = await supabase
          .from('mood_boards')
          .insert({
            project_id: projectId,
            style,
            keywords,
            colors,
          } as any)
          .select()
          .single();

        if (moodBoardError) throw moodBoardError;
        const moodBoardRecord = newMoodBoard as any;
        currentMoodBoardId = moodBoardRecord.id;
        setMoodBoardId(currentMoodBoardId);
      } else {
        await supabase
          .from('mood_boards')
          // @ts-expect-error - Supabase type inference without generated types
          .update({
            style,
            keywords,
            colors,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentMoodBoardId);
      }

      if (!currentMoodBoardId) throw new Error('Mood board ID is required');

      await supabase
        .from('mood_board_images')
        .delete()
        .eq('mood_board_id', currentMoodBoardId);

      if (images.length > 0) {
        const imagesToInsert = images.map((img) => ({
          mood_board_id: currentMoodBoardId,
          image_url: img.imageUrl,
          notes: img.notes,
          sort_order: img.sortOrder,
        }));

        await supabase.from('mood_board_images').insert(imagesToInsert as any);
      }

      toast.success('Mood board saved successfully!');
    } catch (error) {
      console.error('Error saving mood board:', error);
      toast.error('Failed to save mood board');
    }
  };

  const handleExport = () => {
    toast.success('Exporting mood board as PDF...');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/10 max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">Mood Board Generator</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="style">Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger id="style" className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {moodBoardStyles.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="keywords">Keywords</Label>
              <input
                id="keywords"
                type="text"
                placeholder="e.g., golden hour, intimate, luxury"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-sm"
              />
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-[#00F5FF] to-purple-500 hover:opacity-90"
          >
            {isGenerating ? (
              <>Generating...</>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Mood Board
              </>
            )}
          </Button>

          {images.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Your Mood Board</h3>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={images.map((img) => img.id)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-3 gap-4">
                    {images.map((image) => (
                      <SortableImage
                        key={image.id}
                        image={image}
                        onDelete={handleDelete}
                        onNotesChange={handleNotesChange}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              <div className="flex gap-3 mt-6">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  Save to Project
                </Button>
                <Button onClick={handleExport} variant="outline" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Export as PDF
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
