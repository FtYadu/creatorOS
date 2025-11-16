'use client';

import { useState } from 'react';
import type { Lead } from '@/types';
import { useMarketingStore } from '@/lib/stores/marketing-store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  User,
  FileText,
  Clock,
  Tag,
  MessageSquare,
  Send,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeadDetailModalProps {
  lead: Lead;
  open: boolean;
  onClose: () => void;
}

export function LeadDetailModal({ lead, open, onClose }: LeadDetailModalProps) {
  const { addLeadActivity, leadActivities, updateLeadStage } = useMarketingStore();
  const [newNote, setNewNote] = useState('');

  const activities = leadActivities.filter((a) => a.leadId === lead.id);

  const scoreColor = lead.score >= 8 ? 'text-green-500' : lead.score >= 6 ? 'text-yellow-500' : 'text-gray-500';

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    addLeadActivity(lead.id, {
      activityType: 'note',
      description: newNote,
      metadata: {},
      createdBy: 'You',
    });

    setNewNote('');
  };

  const handleMarkAsBooked = () => {
    updateLeadStage(lead.id, 'booked');
    addLeadActivity(lead.id, {
      activityType: 'status-change',
      description: 'Lead marked as booked',
      metadata: { from: lead.stage, to: 'booked' },
      createdBy: 'You',
    });
  };

  const handleMarkAsLost = () => {
    updateLeadStage(lead.id, 'lost');
    addLeadActivity(lead.id, {
      activityType: 'status-change',
      description: 'Lead marked as lost',
      metadata: { from: lead.stage, to: 'lost' },
      createdBy: 'You',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/10 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <span>{lead.name}</span>
            <Badge variant="outline" className={cn('text-sm', scoreColor)}>
              Score: {lead.score}/10
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {lead.projectType} • {lead.source}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-sm">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a href={`mailto:${lead.email}`} className="hover:text-[#00F5FF] transition-colors">
                    {lead.email}
                  </a>
                </div>
                {lead.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a href={`tel:${lead.phone}`} className="hover:text-[#00F5FF] transition-colors">
                      {lead.phone}
                    </a>
                  </div>
                )}
                {lead.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{lead.location}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-sm">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {lead.budget && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-[#00F5FF]">{lead.budget}</span>
                  </div>
                )}
                {lead.timeline && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{lead.timeline}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="capitalize">{lead.stage.replace('-', ' ')}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-sm">Lead Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Budget</div>
                  <div className="text-lg font-bold text-green-500">{lead.budgetScore}/10</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Timeline</div>
                  <div className="text-lg font-bold text-blue-500">{lead.timelineScore}/10</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Engagement</div>
                  <div className="text-lg font-bold text-purple-500">{lead.engagementScore}/10</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {lead.requirements.length > 0 && (
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-sm">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {lead.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#00F5FF] mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {lead.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {lead.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="glass-card border-white/10">
              <TabsTrigger value="notes">Notes & Activity</TabsTrigger>
              <TabsTrigger value="actions">Quick Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  placeholder="Add a note or log an activity..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="glass-card border-white/10"
                  rows={3}
                />
                <Button onClick={handleAddNote} className="bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-black">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
              </div>

              <div className="space-y-3">
                {activities.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No activity yet. Add a note to get started.
                  </p>
                )}
                {activities.map((activity) => (
                  <Card key={activity.id} className="glass-card border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(activity.createdAt).toLocaleString()} • {activity.createdBy}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {activity.activityType}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="actions" className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="glass-card border-white/10 justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="glass-card border-white/10 justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Create Proposal
                </Button>
                <Button variant="outline" className="glass-card border-white/10 justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="glass-card border-white/10 justify-start">
                  <Clock className="w-4 h-4 mr-2" />
                  Set Follow-up
                </Button>
                <Button
                  onClick={handleMarkAsBooked}
                  className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark as Booked
                </Button>
                <Button
                  onClick={handleMarkAsLost}
                  variant="outline"
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Mark as Lost
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
