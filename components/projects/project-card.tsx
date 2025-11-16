'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Project, ProjectType } from '@/types';
import { Badge } from '@/components/ui/badge';

interface ProjectCardProps {
  project: Project;
  isDragging?: boolean;
}

const projectTypeColors: Record<ProjectType, string> = {
  Wedding: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  Corporate: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Event: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Portrait: 'bg-green-500/20 text-green-400 border-green-500/30',
  Product: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Commercial: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Real Estate': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  Fashion: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  Other: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export function ProjectCard({ project, isDragging = false }: ProjectCardProps) {
  const router = useRouter();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const daysUntilDeadline = Math.ceil(
    (project.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const isUrgent = daysUntilDeadline <= 7;

  const handleClick = (e: React.MouseEvent) => {
    if (!isSortableDragging) {
      router.push(`/projects/${project.id}`);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`glass-card p-4 cursor-pointer hover:bg-white/10 transition-all ${
        isSortableDragging || isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-bold gradient-text text-lg">{project.clientName}</h4>
        {isUrgent && (
          <div className="text-red-400" title="Urgent">
            <AlertCircle size={18} />
          </div>
        )}
      </div>

      <Badge className={`${projectTypeColors[project.projectType]} border mb-3`}>
        {project.projectType}
      </Badge>

      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          <span className={isUrgent ? 'text-red-400 font-medium' : ''}>
            {formatDistanceToNow(project.deadline, { addSuffix: true })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={14} />
          <span>{project.location}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Budget</span>
          <span className="font-semibold text-[#00F5FF]">
            AED {project.budget.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
