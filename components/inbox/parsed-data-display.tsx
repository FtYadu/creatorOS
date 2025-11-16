'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useInboxStore } from '@/lib/stores/inbox-store';
import { LeadScore } from './lead-score';
import { toast } from 'react-hot-toast';

const projectTypes = [
  'Wedding',
  'Corporate',
  'Event',
  'Portrait',
  'Product',
  'Commercial',
  'Real Estate',
  'Fashion',
  'Other'
];

export function ParsedDataDisplay() {
  const { currentParsedData, currentLeadScore, generateClientBrief, currentBrief } = useInboxStore();
  const [copied, setCopied] = useState(false);
  const [editedData, setEditedData] = useState(currentParsedData);

  if (!currentParsedData) return null;

  const handleGenerateBrief = () => {
    generateClientBrief();
    toast.success('Brief generated successfully!');
  };

  const handleCopyBrief = async () => {
    if (currentBrief) {
      await navigator.clipboard.writeText(currentBrief);
      setCopied(true);
      toast.success('Brief copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveLead = () => {
    toast.success('Lead saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold mb-6">Extracted Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="clientName" className="text-sm text-muted-foreground mb-2 block">
              Client Name
            </Label>
            <Input
              id="clientName"
              value={editedData?.clientName}
              onChange={(e) => setEditedData({ ...editedData!, clientName: e.target.value })}
              className="glass-card border-white/20 focus:border-[#00F5FF]"
            />
          </div>

          <div>
            <Label htmlFor="projectType" className="text-sm text-muted-foreground mb-2 block">
              Project Type
            </Label>
            <Select
              value={editedData?.projectType}
              onValueChange={(value) => setEditedData({ ...editedData!, projectType: value as any })}
            >
              <SelectTrigger className="glass-card border-white/20 focus:border-[#00F5FF]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/10">
                {projectTypes.map((type) => (
                  <SelectItem key={type} value={type} className="hover:bg-white/10">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="budget" className="text-sm text-muted-foreground mb-2 block">
              Budget Range
            </Label>
            <Input
              id="budget"
              value={editedData?.budget}
              onChange={(e) => setEditedData({ ...editedData!, budget: e.target.value })}
              className="glass-card border-white/20 focus:border-[#00F5FF]"
            />
          </div>

          <div>
            <Label htmlFor="timeline" className="text-sm text-muted-foreground mb-2 block">
              Timeline
            </Label>
            <Input
              id="timeline"
              value={editedData?.timeline}
              onChange={(e) => setEditedData({ ...editedData!, timeline: e.target.value })}
              className="glass-card border-white/20 focus:border-[#00F5FF]"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="location" className="text-sm text-muted-foreground mb-2 block">
              Location
            </Label>
            <Input
              id="location"
              value={editedData?.location}
              onChange={(e) => setEditedData({ ...editedData!, location: e.target.value })}
              className="glass-card border-white/20 focus:border-[#00F5FF]"
            />
          </div>
        </div>

        <div className="mt-6">
          <Label className="text-sm text-muted-foreground mb-2 block">Requirements</Label>
          <ul className="space-y-2">
            {editedData?.requirements.map((req, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2 text-sm"
              >
                <span className="text-[#00F5FF] mt-1">•</span>
                <span>{req}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {currentLeadScore !== null && <LeadScore score={currentLeadScore} />}

      <div className="glass-card p-6">
        <h2 className="text-xl font-bold mb-4">Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleGenerateBrief}
            className="bg-gradient-to-r from-[#B026FF] to-[#00F5FF] hover:opacity-90 transition-opacity"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Brief
          </Button>
          <Button
            onClick={handleSaveLead}
            className="bg-[#00F5FF] hover:opacity-90 transition-opacity"
          >
            Save Lead
          </Button>
        </div>
      </div>

      {currentBrief && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Generated Brief</h2>
            <Button
              onClick={handleCopyBrief}
              variant="outline"
              size="sm"
              className="glass-button"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <pre className="whitespace-pre-wrap text-sm bg-black/30 p-4 rounded-lg border border-white/10 overflow-x-auto">
            {currentBrief}
          </pre>
        </motion.div>
      )}
    </div>
  );
}
