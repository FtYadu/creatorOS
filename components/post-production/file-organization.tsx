'use client';

import { useState } from 'react';
import { Upload, FolderOpen, HardDrive, FileVideo, FileImage, File, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface FileOrganizationProps {
  projectId: string;
}

interface FolderInfo {
  name: string;
  fileCount: number;
  size: string;
  icon: any;
}

export function FileOrganization({ projectId }: FileOrganizationProps) {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const folders: FolderInfo[] = [
    { name: 'Raw Footage', fileCount: 124, size: '45.2 GB', icon: FileVideo },
    { name: 'Selects', fileCount: 28, size: '12.1 GB', icon: FileImage },
    { name: 'Editing', fileCount: 1, size: '850 MB', icon: File },
    { name: 'Exports', fileCount: 3, size: '2.8 GB', icon: FileVideo },
    { name: 'Deliverables', fileCount: 0, size: '0 GB', icon: FolderOpen },
    { name: 'Backups', fileCount: 124, size: '45.2 GB', icon: CheckCircle2 },
  ];

  const fileTypes = [
    { type: 'RAW', count: 45, color: 'text-red-400' },
    { type: 'JPG', count: 230, color: 'text-blue-400' },
    { type: 'MP4', count: 12, color: 'text-green-400' },
    { type: 'CR3', count: 45, color: 'text-yellow-400' },
  ];

  const storageUsed = 60.1;
  const storageQuota = 100;
  const storagePercent = (storageUsed / storageQuota) * 100;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = () => {
    setShowUploadDialog(false);
    setSelectedFiles([]);
  };

  return (
    <div className="space-y-4">
      <Card className="glass-card border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="gradient-text">File Organization</CardTitle>
            <Button size="sm" onClick={() => setShowUploadDialog(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-[#00F5FF]" />
                <span className="text-sm font-medium">Storage</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {storageUsed} GB / {storageQuota} GB
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-[#00F5FF] to-[#a855f7] transition-all duration-300"
                style={{ width: `${storagePercent}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            {folders.map((folder) => {
              const Icon = folder.icon;
              return (
                <div
                  key={folder.name}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-[#00F5FF]" />
                    <div>
                      <p className="font-medium">{folder.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {folder.fileCount} files
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{folder.size}</span>
                </div>
              );
            })}
          </div>

          <div className="glass-card p-4">
            <p className="text-sm font-medium mb-3">Files by Type</p>
            <div className="grid grid-cols-2 gap-3">
              {fileTypes.map((type) => (
                <div key={type.type} className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${type.color}`}>{type.type}</span>
                  <span className="text-sm text-muted-foreground">{type.count} files</span>
                </div>
              ))}
            </div>
          </div>

          <Button variant="outline" className="w-full">
            <FolderOpen className="mr-2 h-4 w-4" />
            Auto-Organize Files
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="glass-card border-white/10">
          <DialogHeader>
            <DialogTitle className="gradient-text">Upload Files</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-[#00F5FF]/50 transition-colors">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop files here, or click to browse
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <span>Choose Files</span>
                </Button>
              </label>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected Files ({selectedFiles.length})</p>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-white/5 rounded text-sm"
                    >
                      <span className="truncate flex-1">{file.name}</span>
                      <span className="text-muted-foreground ml-2">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  ))}
                </div>

                <Button onClick={handleUpload} className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Start Upload
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
