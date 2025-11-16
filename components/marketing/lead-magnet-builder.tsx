'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FileText,
  Download,
  Users,
  TrendingUp,
  Link2,
  QrCode,
  Settings,
  Eye,
  Copy,
  Plus,
  CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const templates = [
  {
    id: 'wedding-guide',
    name: 'Wedding Photography Guide',
    description: 'Complete guide for couples planning their wedding photography',
    category: 'Wedding',
    pages: 12,
    conversionRate: 32,
  },
  {
    id: 'corporate-checklist',
    name: 'Corporate Event Checklist',
    description: 'Essential checklist for corporate event photography',
    category: 'Corporate',
    pages: 8,
    conversionRate: 28,
  },
  {
    id: 'pricing-calculator',
    name: 'Photography Pricing Calculator',
    description: 'Interactive tool to estimate photography project costs',
    category: 'General',
    pages: 1,
    conversionRate: 45,
  },
  {
    id: 'photo-tips',
    name: '10 Tips for Great Photos',
    description: 'Professional tips for looking your best on camera',
    category: 'Tips',
    pages: 6,
    conversionRate: 38,
  },
  {
    id: 'dubai-locations',
    name: 'Best Dubai Photo Locations',
    description: 'Guide to the most photogenic spots in Dubai',
    category: 'Location',
    pages: 15,
    conversionRate: 41,
  },
];

const mockLeadMagnets = [
  {
    id: '1',
    title: 'Wedding Photography Planning Guide',
    downloads: 234,
    leads: 187,
    bookings: 12,
    status: 'active',
  },
  {
    id: '2',
    title: 'Corporate Event Checklist',
    downloads: 156,
    leads: 124,
    bookings: 8,
    status: 'active',
  },
];

export function LeadMagnetBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [magnetData, setMagnetData] = useState({
    title: '',
    description: '',
    deliveryMethod: 'instant',
    captureFields: ['name', 'email'],
  });

  const handleFieldToggle = (field: string) => {
    setMagnetData({
      ...magnetData,
      captureFields: magnetData.captureFields.includes(field)
        ? magnetData.captureFields.filter((f) => f !== field)
        : [...magnetData.captureFields, field],
    });
  };

  const handleCreateMagnet = () => {
    toast.success('Lead magnet created successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lead Magnet Builder</h2>
          <p className="text-muted-foreground">Create valuable resources to capture leads</p>
        </div>
        <Button className="bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-black">
          <Plus className="w-4 h-4 mr-2" />
          New Lead Magnet
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold gradient-text">390</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Leads Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">311</div>
            <p className="text-xs text-muted-foreground mt-1">80% conversion</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-400">20</div>
            <p className="text-xs text-muted-foreground mt-1">6.4% booking rate</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#00F5FF]">AED 320K</div>
            <p className="text-xs text-muted-foreground mt-1">From lead magnets</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList className="glass-card border-white/10">
          <TabsTrigger value="templates" className="data-[state=active]:bg-white/10">
            <FileText className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-white/10">
            <CheckCircle className="w-4 h-4 mr-2" />
            Active Magnets
          </TabsTrigger>
          <TabsTrigger value="builder" className="data-[state=active]:bg-white/10">
            <Settings className="w-4 h-4 mr-2" />
            Builder
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle>Choose a Template</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={cn(
                      'glass-card border p-4 rounded-lg cursor-pointer transition-all hover:border-[#00F5FF]/50',
                      selectedTemplate === template.id ? 'border-[#00F5FF] bg-[#00F5FF]/10' : 'border-white/10'
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                      </div>
                      {selectedTemplate === template.id && (
                        <Badge className="bg-[#00F5FF] text-black">Selected</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {template.pages} pages
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-400" />
                        {template.conversionRate}% conversion
                      </span>
                    </div>
                    <Badge variant="outline" className="mt-2">
                      {template.category}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {mockLeadMagnets.map((magnet) => (
            <Card key={magnet.id} className="glass-card border-white/10">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{magnet.title}</h3>
                    <Badge variant="outline" className="mt-2 bg-green-500/20 text-green-400 border-green-500/30">
                      {magnet.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="glass-card border-white/10">
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" variant="outline" className="glass-card border-white/10">
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 glass-card border-white/10 rounded-lg">
                    <Download className="w-5 h-5 mx-auto mb-1 text-[#00F5FF]" />
                    <div className="text-2xl font-bold">{magnet.downloads}</div>
                    <div className="text-xs text-muted-foreground">Downloads</div>
                  </div>
                  <div className="text-center p-3 glass-card border-white/10 rounded-lg">
                    <Users className="w-5 h-5 mx-auto mb-1 text-purple-400" />
                    <div className="text-2xl font-bold">{magnet.leads}</div>
                    <div className="text-xs text-muted-foreground">Leads</div>
                  </div>
                  <div className="text-center p-3 glass-card border-white/10 rounded-lg">
                    <CheckCircle className="w-5 h-5 mx-auto mb-1 text-green-400" />
                    <div className="text-2xl font-bold">{magnet.bookings}</div>
                    <div className="text-xs text-muted-foreground">Bookings</div>
                  </div>
                  <div className="text-center p-3 glass-card border-white/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
                    <div className="text-2xl font-bold">{((magnet.bookings / magnet.leads) * 100).toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">Conversion</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Link2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Landing Page URL</span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={`https://leads.creatorosai.com/${magnet.id}`}
                      readOnly
                      className="glass-card border-white/10"
                    />
                    <Button variant="outline" size="icon" className="glass-card border-white/10">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="glass-card border-white/10">
                      <QrCode className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="builder" className="space-y-4">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle>Lead Magnet Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="magnetTitle">Lead Magnet Title</Label>
                <Input
                  id="magnetTitle"
                  value={magnetData.title}
                  onChange={(e) => setMagnetData({ ...magnetData, title: e.target.value })}
                  placeholder="e.g., Wedding Photography Planning Guide"
                  className="glass-card border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="magnetDescription">Description</Label>
                <Textarea
                  id="magnetDescription"
                  value={magnetData.description}
                  onChange={(e) => setMagnetData({ ...magnetData, description: e.target.value })}
                  placeholder="Describe what users will receive..."
                  className="glass-card border-white/10 min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Template</Label>
                <Select>
                  <SelectTrigger className="glass-card border-white/10">
                    <SelectValue placeholder="Choose a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Lead Capture Fields</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="field-name"
                      checked={magnetData.captureFields.includes('name')}
                      onCheckedChange={() => handleFieldToggle('name')}
                    />
                    <Label htmlFor="field-name" className="font-normal cursor-pointer">
                      Name (Required)
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="field-email"
                      checked={magnetData.captureFields.includes('email')}
                      onCheckedChange={() => handleFieldToggle('email')}
                    />
                    <Label htmlFor="field-email" className="font-normal cursor-pointer">
                      Email (Required)
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="field-phone"
                      checked={magnetData.captureFields.includes('phone')}
                      onCheckedChange={() => handleFieldToggle('phone')}
                    />
                    <Label htmlFor="field-phone" className="font-normal cursor-pointer">
                      Phone Number
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="field-projectType"
                      checked={magnetData.captureFields.includes('projectType')}
                      onCheckedChange={() => handleFieldToggle('projectType')}
                    />
                    <Label htmlFor="field-projectType" className="font-normal cursor-pointer">
                      Project Type
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="field-timeline"
                      checked={magnetData.captureFields.includes('timeline')}
                      onCheckedChange={() => handleFieldToggle('timeline')}
                    />
                    <Label htmlFor="field-timeline" className="font-normal cursor-pointer">
                      Timeline
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Delivery Method</Label>
                <Select
                  value={magnetData.deliveryMethod}
                  onValueChange={(value) => setMagnetData({ ...magnetData, deliveryMethod: value })}
                >
                  <SelectTrigger className="glass-card border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant Download</SelectItem>
                    <SelectItem value="email">Email Delivery</SelectItem>
                    <SelectItem value="manual">Manual Approval</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thankYouMessage">Thank You Message</Label>
                <Textarea
                  id="thankYouMessage"
                  placeholder="Thank you! Check your email for your free guide..."
                  className="glass-card border-white/10"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <Button onClick={handleCreateMagnet} className="bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-black flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Lead Magnet
                </Button>
                <Button variant="outline" className="glass-card border-white/10">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
