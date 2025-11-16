'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Project, ProjectStage } from '@/types';
import { ProjectCard } from './project-card';
import { Badge } from '@/components/ui/badge';

interface KanbanColumnProps {
  stage: ProjectStage;
  title: string;
  projects: Project[];
}

export function KanbanColumn({ stage, title, projects }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
  });

  return (
    <div className="flex-shrink-0 w-80">
      <div className="glass-card p-4 h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">{title}</h3>
          <Badge
            variant="secondary"
            className="bg-white/10 text-white border-white/20"
          >
            {projects.length}
          </Badge>
        </div>

        <SortableContext
          items={projects.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            ref={setNodeRef}
            className={`space-y-3 min-h-[500px] rounded-lg p-2 transition-colors ${
              isOver ? 'bg-[#00F5FF]/10 ring-2 ring-[#00F5FF]/50' : ''
            }`}
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}

            {projects.length === 0 && (
              <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                Drop projects here
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
