'use client';

import { useState } from 'react';
import { useMarketingStore } from '@/lib/stores/marketing-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LeadDetailModal } from './lead-detail-modal';
import { AddLeadDialog } from './add-lead-dialog';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { Lead, LeadStage } from '@/types';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  Plus,
  Filter,
  Search,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const stages: { id: LeadStage; label: string; color: string }[] = [
  { id: 'new', label: 'New Leads', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'contacted', label: 'Contacted', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'proposal-sent', label: 'Proposal Sent', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { id: 'negotiating', label: 'Negotiating', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { id: 'booked', label: 'Booked', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { id: 'lost', label: 'Lost', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
];

const sourceIcons: Record<string, string> = {
  instagram: '📸',
  google: '🔍',
  referral: '🤝',
  vendor: '🏢',
  website: '🌐',
  other: '📋',
};

function LeadCard({ lead, onClick }: { lead: Lead; onClick: () => void }) {
  const scoreColor = lead.score >= 8 ? 'text-green-500' : lead.score >= 6 ? 'text-yellow-500' : 'text-gray-500';
  const daysInStage = Math.floor((new Date().getTime() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card
      className="glass-card border-white/10 hover:border-[#00F5FF]/50 transition-all cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold group-hover:text-[#00F5FF] transition-colors">
              {lead.name}
            </h4>
            <p className="text-sm text-muted-foreground">{lead.projectType}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn('text-xs', scoreColor)}>
              {lead.score}/10
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{sourceIcons[lead.source]}</span>
          <span className="capitalize">{lead.source}</span>
        </div>

        {lead.budget && (
          <div className="text-sm font-medium text-[#00F5FF]">
            {lead.budget}
          </div>
        )}

        <div className="space-y-1 text-xs text-muted-foreground">
          {lead.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3" />
              <span>{lead.location}</span>
            </div>
          )}
          {lead.timeline && (
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              <span>{lead.timeline}</span>
            </div>
          )}
        </div>

        {lead.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {lead.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {lead.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{lead.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <span className="text-xs text-muted-foreground">
            {daysInStage}d in stage
          </span>
          {lead.lastContactDate && (
            <span className="text-xs text-muted-foreground">
              Last contact: {new Date(lead.lastContactDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StageColumn({ stage, leads, onLeadClick }: {
  stage: { id: LeadStage; label: string; color: string };
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
}) {
  return (
    <div className="flex-shrink-0 w-[320px] space-y-3">
      <div className={cn('glass-card border rounded-lg p-3', stage.color)}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{stage.label}</h3>
          <Badge variant="secondary" className="ml-2">
            {leads.length}
          </Badge>
        </div>
      </div>

      <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} onClick={() => onLeadClick(lead)} />
        ))}
        {leads.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No leads in this stage
          </div>
        )}
      </div>
    </div>
  );
}

export function LeadPipeline() {
  const { leads, updateLeadStage, setSelectedLeadId, selectedLeadId } = useMarketingStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [activeDragLead, setActiveDragLead] = useState<Lead | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const filteredLeads = leads.filter((lead) => {
    const query = searchQuery.toLowerCase();
    return (
      lead.name.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      lead.projectType.toLowerCase().includes(query)
    );
  });

  const leadsByStage = stages.reduce((acc, stage) => {
    acc[stage.id] = filteredLeads.filter((lead) => lead.stage === stage.id);
    return acc;
  }, {} as Record<LeadStage, Lead[]>);

  const totalValue = leads
    .filter((l) => l.budget)
    .reduce((sum, l) => {
      const match = l.budget.match(/[\d,]+/);
      return sum + (match ? parseInt(match[0].replace(/,/g, '')) : 0);
    }, 0);

  const conversionRate = leads.length > 0
    ? ((leads.filter((l) => l.stage === 'booked').length / leads.length) * 100).toFixed(1)
    : '0.0';

  const handleDragStart = (event: DragStartEvent) => {
    const lead = leads.find((l) => l.id === event.active.id);
    setActiveDragLead(lead || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragLead(null);

    if (!over) return;

    const leadId = active.id as string;
    const newStage = over.id as LeadStage;

    updateLeadStage(leadId, newStage);
  };

  const selectedLead = leads.find((l) => l.id === selectedLeadId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lead Pipeline</h2>
          <p className="text-muted-foreground">
            {leads.length} total leads • {conversionRate}% conversion rate • AED {totalValue.toLocaleString()} pipeline value
          </p>
        </div>
        <Button onClick={() => setAddLeadOpen(true)} className="bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-black">
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search leads by name, email, or project type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-card border-white/10"
          />
        </div>
        <Button variant="outline" className="glass-card border-white/10">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <StageColumn
              key={stage.id}
              stage={stage}
              leads={leadsByStage[stage.id]}
              onLeadClick={(lead) => setSelectedLeadId(lead.id)}
            />
          ))}
        </div>
      </DndContext>

      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          open={!!selectedLeadId}
          onClose={() => setSelectedLeadId(null)}
        />
      )}

      <AddLeadDialog open={addLeadOpen} onClose={() => setAddLeadOpen(false)} />
    </div>
  );
}
