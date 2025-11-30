'use client';

import { useState, useEffect } from 'react';
import { Plus, Package, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { DeliveryChecklistItem } from '@/types';
import { usePostProductionStore } from '@/lib/stores/post-production-store';
import toast from 'react-hot-toast';

interface DeliveryChecklistProps {
  projectId: string;
  onGenerateDelivery: () => void;
}

const defaultChecklistItems = [
  'Color correction applied',
  'Audio levels normalized (-14 LUFS)',
  'Titles/graphics spell-checked',
  'Client logo added (if required)',
  'Correct aspect ratios exported',
  'Files named correctly',
  'Metadata embedded (copyright, client name)',
  'Preview sent to client for approval',
  'Final approval received',
  'Backups created (2 locations minimum)',
];

export function DeliveryChecklist({ projectId, onGenerateDelivery }: DeliveryChecklistProps) {
  const { checklistItems, setChecklistItems, toggleChecklistItem, addChecklistItem } =
    usePostProductionStore();
  const [newItemText, setNewItemText] = useState('');

  const items = checklistItems[projectId] || [];

  useEffect(() => {
    loadChecklistItems();
  }, [projectId]);

  const loadChecklistItems = async () => {
    const { data, error } = await supabase
      .from('delivery_checklist_items')
      .select('*')
      .eq('project_id', projectId)
      .order('sort_order');

    if (error) {
      console.error('Error loading checklist:', error);
      return;
    }

    if (data && data.length > 0) {
      const loadedItems: DeliveryChecklistItem[] = data.map((item: any) => ({
        id: item.id,
        projectId: item.project_id,
        itemText: item.item_text,
        completed: item.completed,
        isCustom: item.is_custom,
        sortOrder: item.sort_order,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
      }));
      setChecklistItems(projectId, loadedItems);
    } else {
      await initializeDefaultChecklist();
    }
  };

  const initializeDefaultChecklist = async () => {
    const itemsToInsert = defaultChecklistItems.map((text, index) => ({
      project_id: projectId,
      item_text: text,
      completed: false,
      is_custom: false,
      sort_order: index,
    }));

    const { data, error } = await supabase
      .from('delivery_checklist_items')
      .insert(itemsToInsert as any)
      .select();

    if (error) {
      console.error('Error initializing checklist:', error);
      return;
    }

    if (data) {
      const loadedItems: DeliveryChecklistItem[] = data.map((item: any) => ({
        id: item.id,
        projectId: item.project_id,
        itemText: item.item_text,
        completed: item.completed,
        isCustom: item.is_custom,
        sortOrder: item.sort_order,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
      }));
      setChecklistItems(projectId, loadedItems);
    }
  };

  const handleToggle = async (itemId: string, currentCompleted: boolean) => {
    const { error } = await supabase
      .from('delivery_checklist_items')
      // @ts-expect-error - Supabase type inference without generated types
      .update({ completed: !currentCompleted })
      .eq('id', itemId);

    if (error) {
      console.error('Error toggling item:', error);
      toast.error('Failed to update item');
      return;
    }

    toggleChecklistItem(projectId, itemId);
  };

  const handleAddCustomItem = async () => {
    if (!newItemText.trim()) return;

    const { data, error } = await supabase
      .from('delivery_checklist_items')
      .insert({
        project_id: projectId,
        item_text: newItemText,
        completed: false,
        is_custom: true,
        sort_order: items.length,
      } as any)
      .select()
      .single();

    if (error || !data) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
      return;
    }

    const record = data as any;
    const newItem: DeliveryChecklistItem = {
      id: record.id,
      projectId: record.project_id,
      itemText: record.item_text,
      completed: record.completed,
      isCustom: record.is_custom,
      sortOrder: record.sort_order,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
    };

    addChecklistItem(projectId, newItem);
    setNewItemText('');
    toast.success('Item added');
  };

  const completedCount = items.filter((item) => item.completed).length;
  const progressPercent = items.length > 0 ? (completedCount / items.length) * 100 : 0;
  const allComplete = items.length > 0 && completedCount === items.length;

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle className="gradient-text">Delivery Checklist</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedCount} of {items.length} complete
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-[#00F5FF] to-[#a855f7] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Checkbox
                checked={item.completed}
                onCheckedChange={() => handleToggle(item.id, item.completed)}
                className="mt-0.5"
              />
              <label
                className={`flex-1 text-sm cursor-pointer ${
                  item.completed ? 'line-through text-muted-foreground' : ''
                }`}
                onClick={() => handleToggle(item.id, item.completed)}
              >
                {item.itemText}
              </label>
            </div>
          ))}
        </div>

        <div className="glass-card p-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add custom checklist item..."
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomItem()}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-sm"
            />
            <Button size="sm" onClick={handleAddCustomItem}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button
          onClick={onGenerateDelivery}
          disabled={!allComplete}
          className="w-full"
          size="lg"
        >
          {allComplete ? (
            <>
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Generate Delivery Folder
            </>
          ) : (
            <>
              <Package className="mr-2 h-5 w-5" />
              Complete Checklist to Generate Delivery
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
