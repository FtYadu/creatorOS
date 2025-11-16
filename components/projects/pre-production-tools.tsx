'use client';

import { useState } from 'react';
import { Palette, ClipboardList, MapPin, Package, Users, FileText } from 'lucide-react';
import { MoodBoardGenerator } from './mood-board-generator';
import { ShotListCreator } from './shot-list-creator';
import { LocationScout } from './location-scout';
import { EquipmentPlanner } from './equipment-planner';
import { CallSheetGenerator } from './call-sheet-generator';

interface PreProductionToolsProps {
  projectId: string;
}

interface ToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function ToolCard({ icon, title, description, onClick }: ToolCardProps) {
  return (
    <button
      onClick={onClick}
      className="glass-card p-6 hover:bg-white/10 transition-all text-left group"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-gradient-to-br from-[#00F5FF]/20 to-purple-500/20 group-hover:from-[#00F5FF]/30 group-hover:to-purple-500/30 transition-all">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1 gradient-text">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </button>
  );
}

export function PreProductionTools({ projectId }: PreProductionToolsProps) {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ToolCard
          icon={<Palette className="h-6 w-6 text-[#00F5FF]" />}
          title="Mood Board Generator"
          description="Create visual inspiration boards with AI-powered image suggestions"
          onClick={() => setActiveTool('moodboard')}
        />

        <ToolCard
          icon={<ClipboardList className="h-6 w-6 text-purple-400" />}
          title="Shot List Creator"
          description="Plan your shots with pre-built templates and custom additions"
          onClick={() => setActiveTool('shotlist')}
        />

        <ToolCard
          icon={<MapPin className="h-6 w-6 text-green-400" />}
          title="Location Scout"
          description="Manage shoot locations with maps, photos, and scouting notes"
          onClick={() => setActiveTool('location')}
        />

        <ToolCard
          icon={<Package className="h-6 w-6 text-yellow-400" />}
          title="Equipment Planner"
          description="Create comprehensive equipment checklists and pack lists"
          onClick={() => setActiveTool('equipment')}
        />

        <ToolCard
          icon={<Users className="h-6 w-6 text-pink-400" />}
          title="Crew Assignment"
          description="Manage crew roster with roles and contact information"
          onClick={() => setActiveTool('crew')}
        />

        <ToolCard
          icon={<FileText className="h-6 w-6 text-orange-400" />}
          title="Call Sheet Generator"
          description="Generate professional call sheets with all project details"
          onClick={() => setActiveTool('callsheet')}
        />
      </div>

      <MoodBoardGenerator
        projectId={projectId}
        open={activeTool === 'moodboard'}
        onOpenChange={(open) => setActiveTool(open ? 'moodboard' : null)}
      />

      <ShotListCreator
        projectId={projectId}
        open={activeTool === 'shotlist'}
        onOpenChange={(open) => setActiveTool(open ? 'shotlist' : null)}
      />

      <LocationScout
        projectId={projectId}
        open={activeTool === 'location'}
        onOpenChange={(open) => setActiveTool(open ? 'location' : null)}
      />

      <EquipmentPlanner
        projectId={projectId}
        open={activeTool === 'equipment'}
        onOpenChange={(open) => setActiveTool(open ? 'equipment' : null)}
      />

      <CallSheetGenerator
        projectId={projectId}
        open={activeTool === 'callsheet'}
        onOpenChange={(open) => setActiveTool(open ? 'callsheet' : null)}
      />
    </>
  );
}
