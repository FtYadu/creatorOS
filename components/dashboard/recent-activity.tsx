'use client';

import { motion } from 'framer-motion';
import { Activity } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { FolderKanban, Mail, Plus, CheckCircle } from 'lucide-react';

interface RecentActivityProps {
  activities: Activity[];
}

const activityIcons = {
  project_created: Plus,
  project_moved: FolderKanban,
  lead_received: Mail,
  shoot_completed: CheckCircle
};

const activityColors = {
  project_created: 'text-green-400',
  project_moved: 'text-blue-400',
  lead_received: 'text-[#00F5FF]',
  shoot_completed: 'text-[#B026FF]'
};

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activityIcons[activity.type];
          const colorClass = activityColors[activity.type];

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1
              }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className={`mt-0.5 ${colorClass}`}>
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {activity.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
