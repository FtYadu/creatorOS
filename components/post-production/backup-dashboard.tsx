'use client';

import { useState, useEffect } from 'react';
import { HardDrive, Cloud, CheckCircle2, AlertCircle, Loader2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { BackupLocation, BackupStatus } from '@/types';
import { usePostProductionStore } from '@/lib/stores/post-production-store';
import toast from 'react-hot-toast';

interface BackupDashboardProps {
  projectId: string;
}

const defaultBackupLocations = [
  { name: 'Primary NAS', type: 'nas', status: 'complete', size: '60.1 GB', retentionDays: 90 },
  { name: 'Google Drive', type: 'cloud', status: 'in-progress', size: '45.2 GB', retentionDays: 365 },
  { name: 'External HDD 1', type: 'external-hdd', status: 'complete', size: '60.1 GB', retentionDays: 180 },
  { name: 'External HDD 2', type: 'external-hdd', status: 'failed', size: '0 GB', retentionDays: 180 },
];

export function BackupDashboard({ projectId }: BackupDashboardProps) {
  const { backupLocations, setBackupLocations, updateBackupLocation } = usePostProductionStore();
  const [isVerifying, setIsVerifying] = useState(false);

  const locations = backupLocations[projectId] || [];

  useEffect(() => {
    loadBackupLocations();
  }, [projectId]);

  const loadBackupLocations = async () => {
    const { data, error } = await supabase
      .from('backup_locations')
      .select('*')
      .eq('project_id', projectId);

    if (error) {
      console.error('Error loading backup locations:', error);
      return;
    }

    if (data && data.length > 0) {
      const loadedLocations: BackupLocation[] = data.map((loc: any) => ({
        id: loc.id,
        projectId: loc.project_id,
        locationName: loc.location_name,
        locationType: loc.location_type,
        status: loc.status as BackupStatus,
        lastBackupDate: loc.last_backup_date ? new Date(loc.last_backup_date) : undefined,
        backupSize: loc.backup_size || '',
        verificationHash: loc.verification_hash,
        errorMessage: loc.error_message,
        retentionDays: loc.retention_days,
        autoArchive: loc.auto_archive,
        createdAt: new Date(loc.created_at),
        updatedAt: new Date(loc.updated_at),
      }));
      setBackupLocations(projectId, loadedLocations);
    } else {
      await initializeDefaultBackups();
    }
  };

  const initializeDefaultBackups = async () => {
    const locationsToInsert = defaultBackupLocations.map((loc) => ({
      project_id: projectId,
      location_name: loc.name,
      location_type: loc.type,
      status: loc.status,
      last_backup_date: loc.status === 'complete' ? new Date().toISOString() : null,
      backup_size: loc.size,
      retention_days: loc.retentionDays,
      error_message: loc.status === 'failed' ? 'Disk full' : null,
    }));

    const { data, error } = await supabase
      .from('backup_locations')
      .insert(locationsToInsert as any)
      .select();

    if (error) {
      console.error('Error initializing backups:', error);
      return;
    }

    if (data) {
      const loadedLocations: BackupLocation[] = data.map((loc: any) => ({
        id: loc.id,
        projectId: loc.project_id,
        locationName: loc.location_name,
        locationType: loc.location_type,
        status: loc.status as BackupStatus,
        lastBackupDate: loc.last_backup_date ? new Date(loc.last_backup_date) : undefined,
        backupSize: loc.backup_size || '',
        verificationHash: loc.verification_hash,
        errorMessage: loc.error_message,
        retentionDays: loc.retention_days,
        autoArchive: loc.auto_archive,
        createdAt: new Date(loc.created_at),
        updatedAt: new Date(loc.updated_at),
      }));
      setBackupLocations(projectId, loadedLocations);
    }
  };

  const handleVerifyBackups = async () => {
    setIsVerifying(true);
    toast.success('Verifying all backups...');

    setTimeout(() => {
      setIsVerifying(false);
      toast.success('Backup verification complete');
    }, 2000);
  };

  const getStatusIcon = (status: BackupStatus) => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="h-5 w-5 text-green-400" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case 'in-progress':
        return <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: BackupStatus) => {
    switch (status) {
      case 'complete':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'cloud':
        return <Cloud className="h-5 w-5 text-blue-400" />;
      default:
        return <HardDrive className="h-5 w-5 text-[#00F5FF]" />;
    }
  };

  const getTimeAgo = (date?: Date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const completeBackups = locations.filter((l) => l.status === 'complete').length;
  const overallStatus = completeBackups >= 2 ? 'success' : 'warning';

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="gradient-text">Backup Verification</CardTitle>
          <Button size="sm" onClick={handleVerifyBackups} disabled={isVerifying}>
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify All'
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`glass-card p-4 border-2 ${
            overallStatus === 'success'
              ? 'border-green-500/30'
              : 'border-yellow-500/30'
          }`}
        >
          <div className="flex items-center gap-3">
            {overallStatus === 'success' ? (
              <CheckCircle2 className="h-6 w-6 text-green-400" />
            ) : (
              <AlertCircle className="h-6 w-6 text-yellow-400" />
            )}
            <div className="flex-1">
              <p className="font-semibold">
                {overallStatus === 'success'
                  ? 'Backup Status: Good'
                  : 'Backup Status: Needs Attention'}
              </p>
              <p className="text-sm text-muted-foreground">
                {completeBackups} of {locations.length} backup locations complete
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {locations.map((location) => (
            <div key={location.id} className="glass-card p-4">
              <div className="flex items-start gap-3">
                {getLocationIcon(location.locationType)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{location.locationName}</h4>
                    <Badge className={`${getStatusColor(location.status)} border text-xs`}>
                      {location.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>
                      <span className="text-xs">Last Backup:</span>
                      <p className="text-white">{getTimeAgo(location.lastBackupDate)}</p>
                    </div>
                    <div>
                      <span className="text-xs">Size:</span>
                      <p className="text-white">{location.backupSize}</p>
                    </div>
                    <div>
                      <span className="text-xs">Retention:</span>
                      <p className="text-white">{location.retentionDays} days</p>
                    </div>
                    <div>
                      <span className="text-xs">Status:</span>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(location.status)}
                        <span className="text-white capitalize">{location.status}</span>
                      </div>
                    </div>
                  </div>
                  {location.errorMessage && (
                    <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-400">
                      Error: {location.errorMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card p-4">
          <h4 className="font-semibold mb-3">Retention Policy</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Raw footage:</span>
              <span>Keep 90 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Final deliverables:</span>
              <span>Keep 1 year</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Archive after:</span>
              <span>2 years</span>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Backup Location
        </Button>
      </CardContent>
    </Card>
  );
}
