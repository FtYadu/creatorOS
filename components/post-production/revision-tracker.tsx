'use client';

import { useState, useEffect } from 'react';
import { Clock, DollarSign, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { Revision } from '@/types';
import { usePostProductionStore } from '@/lib/stores/post-production-store';

interface RevisionTrackerProps {
  projectId: string;
}

export function RevisionTracker({ projectId }: RevisionTrackerProps) {
  const { revisions, setRevisions } = usePostProductionStore();
  const [contractRevisions] = useState(2);
  const [additionalCost] = useState(200);

  const projectRevisions = revisions[projectId] || [];

  useEffect(() => {
    loadRevisions();
  }, [projectId]);

  const loadRevisions = async () => {
    const { data, error } = await supabase
      .from('revisions')
      .select('*')
      .eq('project_id', projectId)
      .order('version_number');

    if (error) {
      console.error('Error loading revisions:', error);
      return;
    }

    if (data) {
      const loadedRevisions: Revision[] = data.map((rev: any) => ({
        id: rev.id,
        projectId: rev.project_id,
        versionNumber: rev.version_number,
        versionLabel: rev.version_label,
        changesMade: rev.changes_made || [],
        reason: rev.reason || '',
        timeSpentHours: parseFloat(rev.time_spent_hours) || 0,
        revisionDate: new Date(rev.revision_date),
        createdAt: new Date(rev.created_at),
        updatedAt: new Date(rev.updated_at),
      }));
      setRevisions(projectId, loadedRevisions);
    }
  };

  const totalTime = projectRevisions.reduce((sum, rev) => sum + rev.timeSpentHours, 0);
  const usedRevisions = projectRevisions.length - 1;
  const remainingRevisions = Math.max(0, contractRevisions - usedRevisions);
  const isOverLimit = usedRevisions > contractRevisions;

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle className="gradient-text">Revision Tracking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Contract Limit</p>
            <p className="text-2xl font-bold text-[#00F5FF]">{contractRevisions}</p>
            <p className="text-xs text-muted-foreground">rounds included</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Used</p>
            <p className={`text-2xl font-bold ${isOverLimit ? 'text-red-400' : 'text-green-400'}`}>
              {usedRevisions}
            </p>
            <p className="text-xs text-muted-foreground">rounds</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Remaining</p>
            <p className="text-2xl font-bold text-purple-400">{remainingRevisions}</p>
            <p className="text-xs text-muted-foreground">rounds</p>
          </div>
        </div>

        {isOverLimit && (
          <div className="glass-card p-4 border-2 border-yellow-500/30">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-yellow-400" />
              <div className="flex-1">
                <p className="font-semibold text-yellow-400">Additional Revisions</p>
                <p className="text-sm text-muted-foreground">
                  ${additionalCost}/round × {usedRevisions - contractRevisions} rounds = $
                  {additionalCost * (usedRevisions - contractRevisions)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-[#00F5FF]" />
            <span className="font-semibold">Total Revision Time</span>
          </div>
          <p className="text-2xl font-bold gradient-text">{totalTime} hours</p>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">Version History</h4>
          {projectRevisions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No revisions tracked yet
            </p>
          ) : (
            <div className="space-y-3">
              {projectRevisions.map((revision, index) => (
                <div key={revision.id} className="glass-card p-4 relative">
                  {index < projectRevisions.length - 1 && (
                    <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-white/10" />
                  )}
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        index === projectRevisions.length - 1
                          ? 'bg-green-500/20'
                          : 'bg-blue-500/20'
                      }`}
                    >
                      <CheckCircle2
                        className={`h-4 w-4 ${
                          index === projectRevisions.length - 1 ? 'text-green-400' : 'text-blue-400'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold">{revision.versionLabel}</h5>
                        <Badge
                          variant="outline"
                          className={
                            index === projectRevisions.length - 1
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                          }
                        >
                          {index === projectRevisions.length - 1 ? 'Current' : `V${revision.versionNumber}`}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {revision.revisionDate.toLocaleDateString()} • {revision.timeSpentHours}h spent
                      </p>
                      {revision.changesMade.length > 0 && (
                        <div className="space-y-1 mb-2">
                          <p className="text-sm font-medium">Changes Made:</p>
                          <ul className="space-y-1">
                            {revision.changesMade.map((change, changeIndex) => (
                              <li key={changeIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-[#00F5FF]">•</span>
                                <span>{change}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {revision.reason && (
                        <div className="p-2 bg-white/5 rounded text-sm">
                          <span className="text-muted-foreground">Reason: </span>
                          <span>{revision.reason}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
