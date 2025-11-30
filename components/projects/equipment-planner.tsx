'use client';

import { useState, useEffect } from 'react';
import { Plus, Download, Save, Trash2, Package } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { supabase } from '@/lib/supabase';
import { EquipmentItem, EquipmentList } from '@/types';
import { equipmentCategories } from '@/lib/utils/pre-production-templates';
import { toast } from 'react-hot-toast';

function SimpleProgress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={`h-2 w-full bg-white/10 rounded-full overflow-hidden ${className || ''}`}>
      <div
        className="h-full bg-gradient-to-r from-[#00F5FF] to-purple-500 transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

interface EquipmentPlannerProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EquipmentPlanner({ projectId, open, onOpenChange }: EquipmentPlannerProps) {
  const [items, setItems] = useState<EquipmentItem[]>([]);
  const [equipmentListId, setEquipmentListId] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Cameras');

  useEffect(() => {
    if (open) {
      loadEquipmentList();
    }
  }, [open, projectId]);

  const loadEquipmentList = async () => {
    const { data: equipmentList } = await supabase
      .from('equipment_lists')
      .select('*, equipment_items(*)')
      .eq('project_id', projectId)
      .maybeSingle();

    const record = equipmentList as any;
    if (record) {
      setEquipmentListId(record.id);

      const loadedItems = (record.equipment_items || []).map((item: any) => ({
        id: item.id,
        equipmentListId: item.equipment_list_id,
        category: item.category,
        itemName: item.item_name,
        quantity: item.quantity,
        packed: item.packed,
        notes: item.notes || '',
        sortOrder: item.sort_order,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
      }));
      setItems(loadedItems);
    }
  };

  const handleLoadDefaults = () => {
    const defaultItems: EquipmentItem[] = [];
    let sortOrder = 0;

    Object.entries(equipmentCategories).forEach(([key, categoryItems]) => {
      categoryItems.forEach((item) => {
        defaultItems.push({
          id: `item-${Date.now()}-${sortOrder}`,
          equipmentListId: equipmentListId || '',
          category: item.category,
          itemName: item.name,
          quantity: 1,
          packed: false,
          notes: '',
          sortOrder: sortOrder++,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    });

    setItems(defaultItems);
    toast.success('Loaded default equipment list');
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) return;

    const newItem: EquipmentItem = {
      id: `item-${Date.now()}`,
      equipmentListId: equipmentListId || '',
      category: newItemCategory,
      itemName: newItemName,
      quantity: 1,
      packed: false,
      notes: '',
      sortOrder: items.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setItems([...items, newItem]);
    setNewItemName('');
    toast.success('Item added');
  };

  const handleUpdateItem = (id: string, field: string, value: any) => {
    setItems((items) =>
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems((items) => items.filter((item) => item.id !== id));
  };

  const handleSave = async () => {
    try {
      let currentEquipmentListId = equipmentListId;

      if (!currentEquipmentListId) {
        const { data: newEquipmentList, error: listError } = await supabase
          .from('equipment_lists')
          .insert({ project_id: projectId } as any)
          .select()
          .single();

        if (listError) throw listError;
        const listRecord = newEquipmentList as any;
        currentEquipmentListId = listRecord.id;
        setEquipmentListId(currentEquipmentListId);
      }

      if (!currentEquipmentListId) throw new Error('Equipment list ID is required');

      await supabase
        .from('equipment_items')
        .delete()
        .eq('equipment_list_id', currentEquipmentListId);

      if (items.length > 0) {
        const itemsToInsert = items.map((item) => ({
          equipment_list_id: currentEquipmentListId,
          category: item.category,
          item_name: item.itemName,
          quantity: item.quantity,
          packed: item.packed,
          notes: item.notes,
          sort_order: item.sortOrder,
        }));

        await supabase.from('equipment_items').insert(itemsToInsert as any);
      }

      toast.success('Equipment list saved successfully!');
    } catch (error) {
      console.error('Error saving equipment list:', error);
      toast.error('Failed to save equipment list');
    }
  };

  const handleExport = () => {
    toast.success('Generating pack list PDF...');
  };

  const categories = Array.from(new Set(items.map((item) => item.category)));
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const packedItems = items.filter((item) => item.packed).reduce((sum, item) => sum + item.quantity, 0);
  const progressPercent = totalItems > 0 ? (packedItems / totalItems) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/10 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">Equipment Planner</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {items.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No equipment added yet</p>
              <Button onClick={handleLoadDefaults} variant="outline">
                Load Default Equipment List
              </Button>
            </div>
          )}

          {items.length > 0 && (
            <>
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Pack Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {packedItems} / {totalItems} items
                  </span>
                </div>
                <SimpleProgress value={progressPercent} />
              </div>

              <Accordion type="multiple" className="w-full">
                {categories.map((category) => {
                  const categoryItems = items.filter((item) => item.category === category);
                  const categoryPacked = categoryItems.filter((item) => item.packed).length;

                  return (
                    <AccordionItem key={category} value={category} className="glass-card px-4 mb-2">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center justify-between w-full pr-4">
                          <span className="font-semibold">{category}</span>
                          <span className="text-sm text-muted-foreground">
                            {categoryPacked} / {categoryItems.length}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-2">
                          {categoryItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 p-2 bg-white/5 rounded">
                              <Checkbox
                                checked={item.packed}
                                onCheckedChange={(checked) =>
                                  handleUpdateItem(item.id, 'packed', checked)
                                }
                              />

                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={item.itemName}
                                  onChange={(e) => handleUpdateItem(item.id, 'itemName', e.target.value)}
                                  className="w-full bg-transparent border-none text-sm font-medium focus:outline-none"
                                />
                              </div>

                              <div className="flex items-center gap-2">
                                <Label className="text-xs text-muted-foreground">Qty:</Label>
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleUpdateItem(item.id, 'quantity', parseInt(e.target.value) || 1)
                                  }
                                  className="w-16 px-2 py-1 bg-white/5 border border-white/10 rounded text-sm text-center"
                                />
                              </div>

                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-1 hover:bg-red-500/20 rounded transition-colors"
                              >
                                <Trash2 className="h-4 w-4 text-red-400" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>

              <div className="glass-card p-4">
                <Label className="mb-2 block">Add Custom Item</Label>
                <div className="flex gap-2">
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="px-3 py-2 bg-white/5 border border-white/10 rounded text-sm"
                  >
                    <option value="Cameras">Cameras</option>
                    <option value="Lenses">Lenses</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Audio">Audio</option>
                    <option value="Accessories">Accessories</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Item name"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-sm"
                  />

                  <Button onClick={handleAddItem} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  Save to Project
                </Button>
                <Button onClick={handleExport} variant="outline" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Generate Pack List PDF
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
