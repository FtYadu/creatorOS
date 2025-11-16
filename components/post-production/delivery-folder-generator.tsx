'use client';

import { useState } from 'react';
import { Download, Link as LinkIcon, FolderOpen, File, Copy, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from 'react-hot-toast';

interface DeliveryFolderGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  clientName: string;
  projectType: string;
}

export function DeliveryFolderGenerator({
  open,
  onOpenChange,
  clientName,
  projectType,
}: DeliveryFolderGeneratorProps) {
  const [deliveryMethod, setDeliveryMethod] = useState('google-drive');
  const [namingTemplate, setNamingTemplate] = useState('{ClientName}_{ProjectType}_{Date}_{Version}');
  const [includeRaw, setIncludeRaw] = useState(false);
  const [includeProjects, setIncludeProjects] = useState(false);

  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const exampleName = namingTemplate
    .replace('{ClientName}', clientName.replace(/\s/g, ''))
    .replace('{ProjectType}', projectType)
    .replace('{Date}', date)
    .replace('{Version}', 'Final');

  const folderStructure = [
    { name: 'Final_Edits/', files: ['Master_4K.mp4', 'Web_Optimized.mp4'], size: '3.2 GB' },
    { name: 'Social_Media_Cuts/', files: ['Instagram_Square.mp4', 'Instagram_Story.mp4'], size: '380 MB' },
    { name: 'High_Res_Photos/', files: ['Photo_001.jpg', '...Photo_030.jpg'], size: '450 MB' },
  ];

  if (includeRaw) {
    folderStructure.push({ name: 'Raw_Files/', files: ['RAW_001.CR3', '...'], size: '45.2 GB' });
  }

  if (includeProjects) {
    folderStructure.push({ name: 'Project_Files/', files: ['Edit.prproj', 'Assets/'], size: '2.1 GB' });
  }

  folderStructure.push({ name: 'README.txt', files: [], size: '2 KB' });

  const totalSize = '4.8 GB';

  const handleGenerateFolder = () => {
    toast.success('Delivery folder structure generated!');
    onOpenChange(false);
  };

  const handleDownloadZip = () => {
    toast.success('Preparing ZIP download...');
  };

  const handleCopyLink = () => {
    const mockLink = `https://drive.google.com/drive/folders/${Math.random().toString(36).substr(2, 20)}`;
    navigator.clipboard.writeText(mockLink);
    toast.success('Shareable link copied to clipboard!');
  };

  const handleGenerateEmail = () => {
    toast.success('Email template generated!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/10 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="gradient-text">Generate Delivery Folder</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="glass-card p-4">
            <h4 className="font-semibold mb-3">Naming Convention</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Template</label>
                <Select value={namingTemplate} onValueChange={setNamingTemplate}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/10">
                    <SelectItem value="{ClientName}_{ProjectType}_{Date}_{Version}">
                      ClientName_ProjectType_Date_Version
                    </SelectItem>
                    <SelectItem value="{Date}_{ClientName}_{ProjectType}">
                      Date_ClientName_ProjectType
                    </SelectItem>
                    <SelectItem value="{ProjectType}_{ClientName}_{Version}">
                      ProjectType_ClientName_Version
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 bg-white/5 rounded text-sm">
                <span className="text-muted-foreground">Preview: </span>
                <span className="text-[#00F5FF]">{exampleName}.mp4</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-4">
            <h4 className="font-semibold mb-3">Folder Structure</h4>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex items-center gap-2 text-[#00F5FF]">
                <FolderOpen className="h-4 w-4" />
                <span>{exampleName}/</span>
              </div>
              {folderStructure.map((folder, index) => (
                <div key={index} className="pl-6 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {folder.files.length > 0 ? (
                        <FolderOpen className="h-4 w-4 text-purple-400" />
                      ) : (
                        <File className="h-4 w-4 text-gray-400" />
                      )}
                      <span>{folder.name}</span>
                    </div>
                    <span className="text-muted-foreground text-xs">{folder.size}</span>
                  </div>
                  {folder.files.slice(0, 2).map((file, fileIndex) => (
                    <div key={fileIndex} className="pl-6 flex items-center gap-2 text-muted-foreground text-xs">
                      <File className="h-3 w-3" />
                      <span>{file}</span>
                    </div>
                  ))}
                  {folder.files.length > 2 && (
                    <div className="pl-6 text-muted-foreground text-xs">
                      ...and {folder.files.length - 2} more files
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-2 border-t border-white/10 text-xs text-muted-foreground">
                Total Size: <span className="text-[#00F5FF]">{totalSize}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-4">
            <h4 className="font-semibold mb-3">Include Options</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeRaw}
                  onChange={(e) => setIncludeRaw(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Include Raw Files (if in contract)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeProjects}
                  onChange={(e) => setIncludeProjects(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Include Project Files (if in contract)</span>
              </label>
            </div>
          </div>

          <div className="glass-card p-4">
            <h4 className="font-semibold mb-3">Delivery Method</h4>
            <Select value={deliveryMethod} onValueChange={setDeliveryMethod}>
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/10">
                <SelectItem value="google-drive">Google Drive</SelectItem>
                <SelectItem value="dropbox">Dropbox</SelectItem>
                <SelectItem value="wetransfer">WeTransfer</SelectItem>
                <SelectItem value="usb">USB Drive (Physical)</SelectItem>
                <SelectItem value="client-portal">Client Portal Upload</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handleGenerateFolder} className="w-full">
              <FolderOpen className="mr-2 h-4 w-4" />
              Generate Structure
            </Button>
            <Button onClick={handleDownloadZip} variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download as ZIP
            </Button>
            <Button onClick={handleCopyLink} variant="outline" className="w-full">
              <Copy className="mr-2 h-4 w-4" />
              Copy Shareable Link
            </Button>
            <Button onClick={handleGenerateEmail} variant="outline" className="w-full">
              <Mail className="mr-2 h-4 w-4" />
              Generate Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
