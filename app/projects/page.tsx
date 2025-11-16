'use client';

import { Header } from '@/components/layout/header';
import { KanbanBoard } from '@/components/projects/kanban-board';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen">
      <Header title="Projects" />

      <div className="p-6">
        <KanbanBoard />
      </div>
    </div>
  );
}
