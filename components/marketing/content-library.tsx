'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  FolderOpen,
  Image as ImageIcon,
  Video,
  FileText,
  Music,
  Palette,
  Upload,
  Search,
  Star,
  Download,
  Copy,
  Eye,
  Plus,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const assetCategories = [
  { id: 'all', label: 'All Assets', icon: FolderOpen, count: 45 },
  { id: 'brand', label: 'Brand Kit', icon: Palette, count: 8 },
  { id: 'images', label: 'Images', icon: ImageIcon, count: 18 },
  { id: 'videos', label: 'Videos', icon: Video, count: 12 },
  { id: 'templates', label: 'Templates', icon: FileText, count: 5 },
  { id: 'music', label: 'Music', icon: Music, count: 2 },
];

const brandKitAssets = [
  {
    id: '1',
    name: 'Primary Logo',
    type: 'Logo',
    format: 'SVG, PNG',
    size: '245 KB',
    usageCount: 124,
    favorite: true,
  },
  {
    id: '2',
    name: 'Color Palette',
    type: 'Colors',
    format: 'HEX, RGB',
    colors: ['#00F5FF', '#B026FF', '#1A1A1A', '#FFFFFF'],
    usageCount: 89,
    favorite: true,
  },
  {
    id: '3',
    name: 'Typography',
    type: 'Fonts',
    format: 'TTF, WOFF2',
    fonts: ['Inter', 'Playfair Display'],
    usageCount: 67,
    favorite: false,
  },
];

const imageAssets = [
  {
    id: '1',
    name: 'Dubai Skyline Sunset',
    category: 'Stock Photos',
    dimensions: '4000x3000',
    size: '3.2 MB',
    usageCount: 15,
    favorite: true,
    tags: ['Dubai', 'Sunset', 'Skyline', 'Background'],
  },
  {
    id: '2',
    name: 'Wedding Setup Template',
    category: 'Templates',
    dimensions: '1920x1080',
    size: '1.8 MB',
    usageCount: 28,
    favorite: true,
    tags: ['Wedding', 'Template', 'Social Media'],
  },
  {
    id: '3',
    name: 'Behind the Scenes Photo',
    category: 'Content',
    dimensions: '3000x2000',
    size: '2.4 MB',
    usageCount: 12,
    favorite: false,
    tags: ['BTS', 'Behind the Scenes', 'Studio'],
  },
];

const captionTemplates = [
  {
    id: '1',
    name: 'Wedding Showcase',
    content: '✨ Captured magic at {location} last weekend. Every moment was filled with love...',
    category: 'Wedding',
    usageCount: 34,
    favorite: true,
  },
  {
    id: '2',
    name: 'Corporate Event',
    content: 'Professional corporate event photography for {client}. Creating compelling visual stories...',
    category: 'Corporate',
    usageCount: 18,
    favorite: false,
  },
  {
    id: '3',
    name: 'Behind the Scenes',
    content: 'Behind the scenes from our latest shoot! Love what we do and the amazing people...',
    category: 'BTS',
    usageCount: 22,
    favorite: true,
  },
];

const hashtagSets = [
  {
    id: '1',
    name: 'Dubai Wedding Photography',
    tags: ['#DubaiWedding', '#UAEWeddings', '#DubaiPhotographer', '#LuxuryWedding', '#WeddingPhotography'],
    usageCount: 45,
    avgEngagement: 4.2,
  },
  {
    id: '2',
    name: 'Corporate Events UAE',
    tags: ['#CorporatePhotography', '#UAEBusiness', '#DubaiEvents', '#ProfessionalPhotography', '#EventPhotographer'],
    usageCount: 28,
    avgEngagement: 3.8,
  },
  {
    id: '3',
    name: 'General Photography',
    tags: ['#Photography', '#PhotoOfTheDay', '#InstaGood', '#PicOfTheDay', '#Photographer'],
    usageCount: 67,
    avgEngagement: 5.1,
  },
];

export function ContentLibrary() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopyAsset = (name: string) => {
    toast.success(`${name} copied to clipboard!`);
  };

  const handleToggleFavorite = (assetId: string) => {
    toast.success('Favorite updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Library</h2>
          <p className="text-muted-foreground">Manage your marketing assets and templates</p>
        </div>
        <Button className="bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-black">
          <Upload className="w-4 h-4 mr-2" />
          Upload Asset
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {assetCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                'glass-card cursor-pointer transition-all hover:border-[#00F5FF]/50',
                selectedCategory === category.id ? 'border-[#00F5FF] bg-[#00F5FF]/10' : 'border-white/10'
              )}
            >
              <CardContent className="p-4 text-center">
                <Icon className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">{category.label}</div>
                <Badge variant="secondary" className="mt-1">
                  {category.count}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search assets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 glass-card border-white/10"
        />
      </div>

      <Tabs defaultValue="brand" className="space-y-4">
        <TabsList className="glass-card border-white/10">
          <TabsTrigger value="brand" className="data-[state=active]:bg-white/10">
            <Palette className="w-4 h-4 mr-2" />
            Brand Kit
          </TabsTrigger>
          <TabsTrigger value="images" className="data-[state=active]:bg-white/10">
            <ImageIcon className="w-4 h-4 mr-2" />
            Images
          </TabsTrigger>
          <TabsTrigger value="captions" className="data-[state=active]:bg-white/10">
            <FileText className="w-4 h-4 mr-2" />
            Captions
          </TabsTrigger>
          <TabsTrigger value="hashtags" className="data-[state=active]:bg-white/10">
            #️⃣ Hashtag Sets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="brand" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {brandKitAssets.map((asset) => (
              <Card key={asset.id} className="glass-card border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{asset.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {asset.type}
                      </Badge>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleToggleFavorite(asset.id)}
                      className="h-8 w-8"
                    >
                      <Star
                        className={cn('w-4 h-4', asset.favorite && 'fill-yellow-400 text-yellow-400')}
                      />
                    </Button>
                  </div>

                  {asset.colors && (
                    <div className="flex gap-2 mb-4">
                      {asset.colors.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-10 h-10 rounded border border-white/20"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  )}

                  {asset.fonts && (
                    <div className="mb-4 space-y-1">
                      {asset.fonts.map((font, idx) => (
                        <div key={idx} className="text-sm glass-card border-white/10 p-2 rounded">
                          {font}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground mb-3">
                    {asset.format} • Used {asset.usageCount} times
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 glass-card border-white/10"
                      onClick={() => handleCopyAsset(asset.name)}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 glass-card border-white/10">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {imageAssets.map((asset) => (
              <Card key={asset.id} className="glass-card border-white/10">
                <CardContent className="p-4">
                  <div className="aspect-video bg-gradient-to-br from-[#00F5FF]/20 to-[#B026FF]/20 rounded-lg mb-3 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-white/40" />
                  </div>

                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{asset.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {asset.category}
                      </Badge>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleToggleFavorite(asset.id)}
                      className="h-7 w-7"
                    >
                      <Star
                        className={cn('w-3 h-3', asset.favorite && 'fill-yellow-400 text-yellow-400')}
                      />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {asset.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="text-xs text-muted-foreground mb-3">
                    {asset.dimensions} • {asset.size} • Used {asset.usageCount}x
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 glass-card border-white/10">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 glass-card border-white/10">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="captions" className="space-y-4">
          <div className="space-y-3">
            {captionTemplates.map((template) => (
              <Card key={template.id} className="glass-card border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{template.name}</h4>
                        <Badge variant="outline">{template.category}</Badge>
                        {template.favorite && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{template.content}</p>
                      <div className="text-xs text-muted-foreground">Used {template.usageCount} times</div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyAsset(template.name)}
                        className="glass-card border-white/10"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleToggleFavorite(template.id)}
                        className="h-8 w-8"
                      >
                        <Star
                          className={cn('w-4 h-4', template.favorite && 'fill-yellow-400 text-yellow-400')}
                        />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="hashtags" className="space-y-4">
          <div className="space-y-3">
            {hashtagSets.map((set) => (
              <Card key={set.id} className="glass-card border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold mb-1">{set.name}</h4>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Used {set.usageCount} times</span>
                        <span>•</span>
                        <span className="text-green-400">{set.avgEngagement}% avg engagement</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleCopyAsset(set.name)}
                      className="bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-black"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy All
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {set.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
