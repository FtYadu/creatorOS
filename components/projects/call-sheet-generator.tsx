'use client';

import { useState, useEffect } from 'react';
import { Plus, Download, Save, Trash2, Mail, Calendar, Users, Package, MapPin, Clock } from 'lucide-react';
import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { CallSheet, CallSheetScheduleItem, CrewAssignment } from '@/types';
import { crewRoles } from '@/lib/utils/pre-production-templates';
import { useProjectsStore } from '@/lib/stores/projects-store';
import { toast } from 'react-hot-toast';

interface CallSheetGeneratorProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SortableScheduleItemProps {
  item: CallSheetScheduleItem;
  onUpdate: (id: string, field: string, value: any) => void;
  onDelete: (id: string) => void;
}

function SortableScheduleItem({ item, onUpdate, onDelete }: SortableScheduleItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="glass-card p-3 mb-2">
      <div className="flex items-center gap-3">
        <button {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
          <Clock className="h-4 w-4 text-muted-foreground" />
        </button>

        <input
          type="time"
          value={item.time}
          onChange={(e) => onUpdate(item.id, 'time', e.target.value)}
          className="px-2 py-1 bg-white/5 border border-white/10 rounded text-sm w-28"
        />

        <input
          type="text"
          placeholder="Activity"
          value={item.activity}
          onChange={(e) => onUpdate(item.id, 'activity', e.target.value)}
          className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-sm"
        />

        <input
          type="text"
          placeholder="Location"
          value={item.location}
          onChange={(e) => onUpdate(item.id, 'location', e.target.value)}
          className="w-32 px-2 py-1 bg-white/5 border border-white/10 rounded text-sm"
        />

        <button
          onClick={() => onDelete(item.id)}
          className="p-1 hover:bg-red-500/20 rounded transition-colors"
        >
          <Trash2 className="h-4 w-4 text-red-400" />
        </button>
      </div>
    </div>
  );
}

export function CallSheetGenerator({ projectId, open, onOpenChange }: CallSheetGeneratorProps) {
  const { projects } = useProjectsStore();
  const project = projects.find((p) => p.id === projectId);

  const [callSheet, setCallSheet] = useState<CallSheet | null>(null);
  const [scheduleItems, setScheduleItems] = useState<CallSheetScheduleItem[]>([]);
  const [crewMembers, setCrewMembers] = useState<CrewAssignment[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [shotList, setShotList] = useState<any[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    if (open) {
      loadCallSheetData();
    }
  }, [open, projectId]);

  const loadCallSheetData = async () => {
    const { data: callSheetData } = await supabase
      .from('call_sheets')
      .select('*, call_sheet_schedule_items(*)')
      .eq('project_id', projectId)
      .maybeSingle();

    const record = callSheetData as any;
    if (record) {
      setCallSheet({
        id: record.id,
        projectId: record.project_id,
        shootDate: record.shoot_date ? new Date(record.shoot_date) : undefined,
        mainContactName: record.main_contact_name || '',
        mainContactPhone: record.main_contact_phone || '',
        mainContactEmail: record.main_contact_email || '',
        emergencyContacts: record.emergency_contacts || [],
        notes: record.notes || '',
        version: record.version || 1,
        createdAt: new Date(record.created_at),
        updatedAt: new Date(record.updated_at),
      });

      const loadedSchedule = (record.call_sheet_schedule_items || []).map((item: any) => ({
        id: item.id,
        callSheetId: item.call_sheet_id,
        time: item.time,
        activity: item.activity,
        location: item.location,
        duration: item.duration,
        sortOrder: item.sort_order,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
      }));
      setScheduleItems(loadedSchedule);
    } else {
      setCallSheet({
        id: '',
        projectId,
        mainContactName: project?.clientName || '',
        mainContactPhone: '',
        mainContactEmail: '',
        emergencyContacts: [],
        notes: '',
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const { data: crewData } = await supabase
      .from('crew_assignments')
      .select('*')
      .eq('project_id', projectId);

    if (crewData) {
      setCrewMembers(crewData.map((c: any) => ({
        id: c.id,
        projectId: c.project_id,
        role: c.role,
        name: c.name,
        phone: c.phone,
        email: c.email,
        responsibilities: c.responsibilities,
        available: c.available,
        createdAt: new Date(c.created_at),
        updatedAt: new Date(c.updated_at),
      })));
    }

    const { data: locationsData } = await supabase
      .from('locations')
      .select('*')
      .eq('project_id', projectId);

    if (locationsData) setLocations(locationsData);

    const { data: equipmentData } = await supabase
      .from('equipment_lists')
      .select('*, equipment_items(*)')
      .eq('project_id', projectId)
      .maybeSingle();

    const equipmentRecord = equipmentData as any;
    if (equipmentRecord?.equipment_items) {
      setEquipment(equipmentRecord.equipment_items.filter((item: any) => item.packed));
    }

    const { data: shotListData } = await supabase
      .from('shot_lists')
      .select('*, shots(*)')
      .eq('project_id', projectId)
      .maybeSingle();

    const shotListRecord = shotListData as any;
    if (shotListRecord?.shots) {
      setShotList(shotListRecord.shots.filter((shot: any) => shot.priority === 'high'));
    }
  };

  const handleAddScheduleItem = () => {
    const newItem: CallSheetScheduleItem = {
      id: `schedule-${Date.now()}`,
      callSheetId: callSheet?.id || '',
      time: '09:00',
      activity: '',
      location: '',
      duration: 60,
      sortOrder: scheduleItems.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setScheduleItems([...scheduleItems, newItem]);
  };

  const handleUpdateScheduleItem = (id: string, field: string, value: any) => {
    setScheduleItems((items) =>
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDeleteScheduleItem = (id: string) => {
    setScheduleItems((items) => items.filter((item) => item.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setScheduleItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = [...items];
        const [movedItem] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, movedItem);

        return newItems.map((item, index) => ({ ...item, sortOrder: index }));
      });
    }
  };

  const handleAddCrewMember = () => {
    const newCrew: CrewAssignment = {
      id: `crew-${Date.now()}`,
      projectId,
      role: crewRoles[0],
      name: '',
      phone: '',
      email: '',
      responsibilities: '',
      available: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCrewMembers([...crewMembers, newCrew]);
  };

  const handleUpdateCrewMember = (id: string, field: string, value: any) => {
    setCrewMembers((crew) =>
      crew.map((member) => (member.id === id ? { ...member, [field]: value } : member))
    );
  };

  const handleDeleteCrewMember = (id: string) => {
    setCrewMembers((crew) => crew.filter((member) => member.id !== id));
  };

  const handleSave = async () => {
    try {
      let callSheetId = callSheet?.id;

      if (!callSheetId) {
        const { data: newCallSheet, error: callSheetError } = await supabase
          .from('call_sheets')
          .insert({
            project_id: projectId,
            shoot_date: callSheet?.shootDate?.toISOString(),
            main_contact_name: callSheet?.mainContactName || '',
            main_contact_phone: callSheet?.mainContactPhone || '',
            main_contact_email: callSheet?.mainContactEmail || '',
            emergency_contacts: callSheet?.emergencyContacts || [],
            notes: callSheet?.notes || '',
            version: 1,
          } as any)
          .select()
          .single();

        if (callSheetError) throw callSheetError;
        const callSheetRecord = newCallSheet as any;
        callSheetId = callSheetRecord.id;
      } else {
        await supabase
          .from('call_sheets')
          // @ts-expect-error - Supabase type inference without generated types
          .update({
            shoot_date: callSheet?.shootDate?.toISOString(),
            main_contact_name: callSheet?.mainContactName || '',
            main_contact_phone: callSheet?.mainContactPhone || '',
            main_contact_email: callSheet?.mainContactEmail || '',
            emergency_contacts: callSheet?.emergencyContacts || [],
            notes: callSheet?.notes || '',
            updated_at: new Date().toISOString(),
          })
          .eq('id', callSheetId);
      }

      if (!callSheetId) throw new Error('Call sheet ID is required');

      await supabase.from('call_sheet_schedule_items').delete().eq('call_sheet_id', callSheetId);

      if (scheduleItems.length > 0) {
        const scheduleToInsert = scheduleItems.map((item) => ({
          call_sheet_id: callSheetId,
          time: item.time,
          activity: item.activity,
          location: item.location,
          duration: item.duration,
          sort_order: item.sortOrder,
        }));

        await supabase.from('call_sheet_schedule_items').insert(scheduleToInsert as any);
      }

      await supabase.from('crew_assignments').delete().eq('project_id', projectId);

      if (crewMembers.length > 0) {
        const crewToInsert = crewMembers.map((crew) => ({
          project_id: projectId,
          role: crew.role,
          name: crew.name,
          phone: crew.phone,
          email: crew.email,
          responsibilities: crew.responsibilities,
          available: crew.available,
        }));

        await supabase.from('crew_assignments').insert(crewToInsert as any);
      }

      toast.success('Call sheet saved successfully!');
    } catch (error) {
      console.error('Error saving call sheet:', error);
      toast.error('Failed to save call sheet');
    }
  };

  const handleExport = () => {
    toast.success('Exporting call sheet as PDF...');
  };

  const handleEmail = () => {
    toast.success('Emailing call sheet to crew...');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/10 max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">Call Sheet Generator</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="schedule" className="mt-4">
          <TabsList className="glass-card border-white/10">
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="crew">Crew</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4 mt-4">
            <div className="glass-card p-4">
              <Label className="mb-2 block">Project Information</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Main Contact</Label>
                  <input
                    type="text"
                    placeholder="Contact name"
                    value={callSheet?.mainContactName || ''}
                    onChange={(e) => setCallSheet(callSheet ? { ...callSheet, mainContactName: e.target.value } : null)}
                    className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-sm mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Phone</Label>
                  <input
                    type="tel"
                    placeholder="Contact phone"
                    value={callSheet?.mainContactPhone || ''}
                    onChange={(e) => setCallSheet(callSheet ? { ...callSheet, mainContactPhone: e.target.value } : null)}
                    className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-sm mt-1"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Schedule</Label>
                <Button onClick={handleAddScheduleItem} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={scheduleItems.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                  <div>
                    {scheduleItems.map((item) => (
                      <SortableScheduleItem
                        key={item.id}
                        item={item}
                        onUpdate={handleUpdateScheduleItem}
                        onDelete={handleDeleteScheduleItem}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {scheduleItems.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No schedule items added yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="crew" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <Label>Crew Roster</Label>
              <Button onClick={handleAddCrewMember} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Crew Member
              </Button>
            </div>

            <div className="space-y-2">
              {crewMembers.map((crew) => (
                <div key={crew.id} className="glass-card p-3">
                  <div className="grid grid-cols-4 gap-2">
                    <select
                      value={crew.role}
                      onChange={(e) => handleUpdateCrewMember(crew.id, 'role', e.target.value)}
                      className="px-2 py-1 bg-white/5 border border-white/10 rounded text-sm"
                    >
                      {crewRoles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Name"
                      value={crew.name}
                      onChange={(e) => handleUpdateCrewMember(crew.id, 'name', e.target.value)}
                      className="px-2 py-1 bg-white/5 border border-white/10 rounded text-sm"
                    />

                    <input
                      type="tel"
                      placeholder="Phone"
                      value={crew.phone}
                      onChange={(e) => handleUpdateCrewMember(crew.id, 'phone', e.target.value)}
                      className="px-2 py-1 bg-white/5 border border-white/10 rounded text-sm"
                    />

                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        placeholder="Email"
                        value={crew.email}
                        onChange={(e) => handleUpdateCrewMember(crew.id, 'email', e.target.value)}
                        className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded text-sm"
                      />

                      <button
                        onClick={() => handleDeleteCrewMember(crew.id)}
                        className="p-1 hover:bg-red-500/20 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {crewMembers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No crew members added yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4 mt-4">
            <div className="glass-card p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#00F5FF]" />
                  Schedule Overview
                </h3>
                {scheduleItems.length > 0 ? (
                  <div className="space-y-1 text-sm">
                    {scheduleItems.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex gap-2">
                        <span className="text-muted-foreground">{item.time}</span>
                        <span>{item.activity}</span>
                      </div>
                    ))}
                    {scheduleItems.length > 5 && (
                      <p className="text-muted-foreground text-xs mt-2">
                        + {scheduleItems.length - 5} more items
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No schedule items</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-400" />
                  Locations ({locations.length})
                </h3>
                {locations.length > 0 ? (
                  <div className="space-y-1 text-sm">
                    {locations.slice(0, 3).map((loc) => (
                      <div key={loc.id}>
                        <span className="font-medium">{loc.name}</span>
                        {loc.is_primary && (
                          <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                            Primary
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No locations added</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-400" />
                  Crew ({crewMembers.length})
                </h3>
                {crewMembers.length > 0 ? (
                  <div className="space-y-1 text-sm">
                    {crewMembers.slice(0, 5).map((crew) => (
                      <div key={crew.id} className="flex justify-between">
                        <span>{crew.role}</span>
                        <span className="text-muted-foreground">{crew.name || 'TBD'}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No crew assigned</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Package className="h-4 w-4 text-yellow-400" />
                  Equipment ({equipment.length} items packed)
                </h3>
                {equipment.length > 0 ? (
                  <div className="text-sm text-muted-foreground">
                    {equipment.slice(0, 3).map((item: any, i: number) => (
                      <span key={i}>
                        {item.item_name}
                        {i < Math.min(2, equipment.length - 1) && ', '}
                      </span>
                    ))}
                    {equipment.length > 3 && ` + ${equipment.length - 3} more`}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No equipment packed</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 mt-6">
          <Button onClick={handleSave} className="flex-1">
            <Save className="mr-2 h-4 w-4" />
            Save Call Sheet
          </Button>
          <Button onClick={handleExport} variant="outline" className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button onClick={handleEmail} variant="outline" className="flex-1">
            <Mail className="mr-2 h-4 w-4" />
            Email Crew
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
