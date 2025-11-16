'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Globe,
  Eye,
  Download,
  Copy,
  Share2,
  Layout,
  Grid3x3,
  Image as ImageIcon,
  Search,
  Sparkles,
  Check,
  Plus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const layoutTemplates = [
  { id: 'minimal', name: 'Minimal', description: 'Clean, focused layout', preview: '📄' },
  { id: 'grid', name: 'Grid', description: 'Classic grid gallery', preview: '⊞' },
  { id: 'masonry', name: 'Masonry', description: 'Pinterest-style layout', preview: '▦' },
  { id: 'carousel', name: 'Carousel', description: 'Full-screen slider', preview: '→' },
];

const seoKeywords = [
  'Dubai wedding photographer',
  'UAE corporate videographer',
  'luxury wedding photography Dubai',
  'professional event photographer Abu Dhabi',
  'commercial photography UAE',
  'portrait photographer Dubai',
  'real estate photography Dubai',
  'destination wedding photographer',
];

export function PortfolioGenerator() {
  const [selectedLayout, setSelectedLayout] = useState('grid');
  const [portfolioData, setPortfolioData] = useState({
    title: 'Professional Photography Studio',
    tagline: 'Capturing Moments That Last Forever',
    about: '',
    metaTitle: '',
    metaDescription: '',
    keywords: [] as string[],
  });
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('layout');

  const mockProjects = [
    { id: 'p1', name: 'Sarah & Ahmed Wedding', type: 'Wedding', images: 45 },
    { id: 'p2', name: 'TechCorp Annual Event', type: 'Corporate', images: 32 },
    { id: 'p3', name: 'Dubai Marina Properties', type: 'Real Estate', images: 28 },
    { id: 'p4', name: 'Fashion Editorial Shoot', type: 'Fashion', images: 50 },
  ];

  const seoScore = {
    metaTitle: portfolioData.metaTitle.length > 0 && portfolioData.metaTitle.length <= 60,
    metaDescription: portfolioData.metaDescription.length > 0 && portfolioData.metaDescription.length <= 160,
    keywords: portfolioData.keywords.length >= 5,
    projects: selectedProjects.length >= 3,
  };

  const totalScore = Object.values(seoScore).filter(Boolean).length;
  const maxScore = Object.values(seoScore).length;

  const handleAddKeyword = (keyword: string) => {
    if (!portfolioData.keywords.includes(keyword)) {
      setPortfolioData({
        ...portfolioData,
        keywords: [...portfolioData.keywords, keyword],
      });
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setPortfolioData({
      ...portfolioData,
      keywords: portfolioData.keywords.filter((k) => k !== keyword),
    });
  };

  const handleToggleProject = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    );
  };

  const handleExportHTML = () => {
    toast.success('HTML code copied to clipboard!');
  };

  const handleGeneratePreview = () => {
    toast.success('Portfolio preview generated!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Portfolio Generator</h2>
          <p className="text-muted-foreground">Create a stunning portfolio website in minutes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleGeneratePreview} className="glass-card border-white/10">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleExportHTML} className="bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-black">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">SEO Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold gradient-text">
              {totalScore}/{maxScore}
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mt-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-[#00F5FF] to-[#B026FF]"
                style={{ width: `${(totalScore / maxScore) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{selectedProjects.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Featured in portfolio</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{portfolioData.keywords.length}</div>
            <p className="text-xs text-muted-foreground mt-1">SEO keywords added</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Preview Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">234</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="glass-card border-white/10">
          <TabsTrigger value="layout" className="data-[state=active]:bg-white/10">
            <Layout className="w-4 h-4 mr-2" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="projects" className="data-[state=active]:bg-white/10">
            <Grid3x3 className="w-4 h-4 mr-2" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-white/10">
            <ImageIcon className="w-4 h-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="seo" className="data-[state=active]:bg-white/10">
            <Search className="w-4 h-4 mr-2" />
            SEO
          </TabsTrigger>
        </TabsList>

        <TabsContent value="layout" className="space-y-4">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle>Choose Layout Template</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {layoutTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedLayout(template.id)}
                    className={cn(
                      'glass-card border-2 p-6 rounded-lg cursor-pointer transition-all hover:border-[#00F5FF]/50',
                      selectedLayout === template.id ? 'border-[#00F5FF] bg-[#00F5FF]/10' : 'border-white/10'
                    )}
                  >
                    <div className="text-4xl mb-3">{template.preview}</div>
                    <h3 className="font-semibold mb-1">{template.name}</h3>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                    {selectedLayout === template.id && (
                      <Badge className="mt-3 bg-[#00F5FF] text-black">
                        <Check className="w-3 h-3 mr-1" />
                        Selected
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle>Select Projects to Feature</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => handleToggleProject(project.id)}
                    className={cn(
                      'glass-card border p-4 rounded-lg cursor-pointer transition-all',
                      selectedProjects.includes(project.id)
                        ? 'border-[#00F5FF] bg-[#00F5FF]/10'
                        : 'border-white/10 hover:border-white/30'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{project.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {project.type} • {project.images} images
                        </p>
                      </div>
                      {selectedProjects.includes(project.id) && (
                        <Badge className="bg-[#00F5FF] text-black">
                          <Check className="w-3 h-3" />
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle>Portfolio Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Portfolio Title</Label>
                <Input
                  id="title"
                  value={portfolioData.title}
                  onChange={(e) => setPortfolioData({ ...portfolioData, title: e.target.value })}
                  placeholder="Your Studio Name"
                  className="glass-card border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={portfolioData.tagline}
                  onChange={(e) => setPortfolioData({ ...portfolioData, tagline: e.target.value })}
                  placeholder="Your memorable tagline"
                  className="glass-card border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">About Section</Label>
                <Textarea
                  id="about"
                  value={portfolioData.about}
                  onChange={(e) => setPortfolioData({ ...portfolioData, about: e.target.value })}
                  placeholder="Tell your story..."
                  className="glass-card border-white/10 min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#00F5FF]" />
                SEO Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">
                  Meta Title
                  <span className="text-xs text-muted-foreground ml-2">
                    ({portfolioData.metaTitle.length}/60)
                  </span>
                </Label>
                <Input
                  id="metaTitle"
                  value={portfolioData.metaTitle}
                  onChange={(e) => setPortfolioData({ ...portfolioData, metaTitle: e.target.value })}
                  placeholder="Professional Photography Dubai | Your Studio Name"
                  maxLength={60}
                  className={cn(
                    'glass-card border-white/10',
                    seoScore.metaTitle && 'border-green-500/50'
                  )}
                />
                {seoScore.metaTitle && (
                  <p className="text-xs text-green-400">✓ Good length for SEO</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">
                  Meta Description
                  <span className="text-xs text-muted-foreground ml-2">
                    ({portfolioData.metaDescription.length}/160)
                  </span>
                </Label>
                <Textarea
                  id="metaDescription"
                  value={portfolioData.metaDescription}
                  onChange={(e) => setPortfolioData({ ...portfolioData, metaDescription: e.target.value })}
                  placeholder="Award-winning photography and videography services in Dubai and UAE..."
                  maxLength={160}
                  className={cn(
                    'glass-card border-white/10',
                    seoScore.metaDescription && 'border-green-500/50'
                  )}
                />
                {seoScore.metaDescription && (
                  <p className="text-xs text-green-400">✓ Good length for SEO</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>SEO Keywords (Recommended: 5-10)</Label>
                <div className="glass-card border-white/10 p-3 rounded-lg">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {portfolioData.keywords.map((keyword) => (
                      <Badge
                        key={keyword}
                        variant="secondary"
                        className="cursor-pointer hover:bg-red-500/20"
                        onClick={() => handleRemoveKeyword(keyword)}
                      >
                        {keyword} ×
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">Suggested keywords:</div>
                  <div className="flex flex-wrap gap-2">
                    {seoKeywords
                      .filter((kw) => !portfolioData.keywords.includes(kw))
                      .slice(0, 5)
                      .map((keyword) => (
                        <Button
                          key={keyword}
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddKeyword(keyword)}
                          className="glass-card border-white/10 text-xs h-7"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          {keyword}
                        </Button>
                      ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/10">
                <h4 className="font-semibold text-sm">SEO Checklist</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {seoScore.metaTitle ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-white/30" />
                    )}
                    <span className="text-sm">Meta title optimized (50-60 characters)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {seoScore.metaDescription ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-white/30" />
                    )}
                    <span className="text-sm">Meta description set (150-160 characters)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {seoScore.keywords ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-white/30" />
                    )}
                    <span className="text-sm">Minimum 5 keywords added</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {seoScore.projects ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-white/30" />
                    )}
                    <span className="text-sm">At least 3 projects featured</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="glass-card border-[#00F5FF]/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Portfolio Preview Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Input
              value="https://portfolio.creatorosai.com/your-studio"
              readOnly
              className="glass-card border-white/10"
            />
            <Button variant="outline" className="glass-card border-white/10">
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="glass-card border-white/10">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Share this link to showcase your portfolio. Customize your URL in settings.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
