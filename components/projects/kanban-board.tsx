'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { ProjectStage, Project } from '@/types';
import { useProjectsStore } from '@/lib/stores/projects-store';
import { KanbanColumn } from './kanban-column';
import { ProjectCard } from './project-card';
import { toast } from 'react-hot-toast';

const stages: { id: ProjectStage; label: string }[] = [
  { id: 'leads', label: 'Leads' },
  { id: 'pre-production', label: 'Pre-Production' },
  { id: 'shooting', label: 'Shooting' },
  { id: 'post-production', label: 'Post-Production' },
  { id: 'delivered', label: 'Delivered' },
];

export function KanbanBoard() {
  const { projects, moveProject, setSelectedProject } = useProjectsStore();
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const project = projects.find((p) => p.id === event.active.id);
    if (project) {
      setActiveProject(project);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveProject(null);

    if (!over) return;

    const projectId = active.id as string;
    const newStage = over.id as ProjectStage;

    const project = projects.find((p) => p.id === projectId);
    if (project && project.stage !== newStage) {
      moveProject(projectId, newStage);
      toast.success(`Moved ${project.clientName} to ${stages.find(s => s.id === newStage)?.label}`);
    }
  };

  const getProjectsByStage = (stage: ProjectStage) => {
    return projects.filter((p) => p.stage === stage);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage.id}
            title={stage.label}
            projects={getProjectsByStage(stage.id)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeProject ? (
          <div className="opacity-80 rotate-3">
            <ProjectCard project={activeProject} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
