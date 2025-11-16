'use client';

import { useState } from 'react';
import { FileOrganization } from './file-organization';
import { EditProgressTracker } from './edit-progress-tracker';
import { ClientReviewPortal } from './client-review-portal';
import { RenderQueue } from './render-queue';
import { DeliveryChecklist } from './delivery-checklist';
import { DeliveryFolderGenerator } from './delivery-folder-generator';
import { BackupDashboard } from './backup-dashboard';
import { RevisionTracker } from './revision-tracker';
import { Project } from '@/types';

interface PostProductionDashboardProps {
  project: Project;
}

export function PostProductionDashboard({ project }: PostProductionDashboardProps) {
  const [showDeliveryGenerator, setShowDeliveryGenerator] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <FileOrganization projectId={project.id} />
        </div>

        <div className="lg:col-span-2">
          <EditProgressTracker projectId={project.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClientReviewPortal projectId={project.id} />
        <RenderQueue projectId={project.id} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeliveryChecklist
          projectId={project.id}
          onGenerateDelivery={() => setShowDeliveryGenerator(true)}
        />
        <BackupDashboard projectId={project.id} />
      </div>

      <RevisionTracker projectId={project.id} />

      <DeliveryFolderGenerator
        open={showDeliveryGenerator}
        onOpenChange={setShowDeliveryGenerator}
        projectId={project.id}
        clientName={project.clientName}
        projectType={project.projectType}
      />
    </div>
  );
}
