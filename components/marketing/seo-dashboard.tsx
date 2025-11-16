'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  TrendingUp,
  Globe,
  Smartphone,
  Zap,
  Shield,
  Image as ImageIcon,
  MapPin,
  Star,
  Check,
  X,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useState } from 'react';

const keywordData = [
  { keyword: 'Dubai wedding photographer', volume: 2400, competition: 'High', difficulty: 'Hard', cpc: 'AED 12.50' },
  { keyword: 'UAE corporate videographer', volume: 720, competition: 'Medium', difficulty: 'Medium', cpc: 'AED 8.20' },
  { keyword: 'luxury wedding photos UAE', volume: 890, competition: 'Medium', difficulty: 'Medium', cpc: 'AED 10.30' },
  { keyword: 'professional event photographer', volume: 1200, competition: 'High', difficulty: 'Hard', cpc: 'AED 9.80' },
  { keyword: 'commercial photography Dubai', volume: 650, competition: 'Low', difficulty: 'Easy', cpc: 'AED 6.50' },
  { keyword: 'portrait photographer Abu Dhabi', volume: 480, competition: 'Low', difficulty: 'Easy', cpc: 'AED 5.20' },
];

const websiteChecklist = [
  { item: 'Mobile-friendly design', status: true, priority: 'Critical' },
  { item: 'Fast loading speed (<3s)', status: true, priority: 'Critical' },
  { item: 'HTTPS security enabled', status: true, priority: 'Critical' },
  { item: 'Meta descriptions on all pages', status: false, priority: 'High' },
  { item: 'Image alt text present', status: true, priority: 'High' },
  { item: 'XML sitemap submitted', status: true, priority: 'High' },
  { item: 'Robots.txt configured', status: true, priority: 'Medium' },
  { item: 'Structured data markup', status: false, priority: 'Medium' },
  { item: 'Social media meta tags', status: true, priority: 'Low' },
];

export function SEODashboard() {
  const [searchKeyword, setSearchKeyword] = useState('');

  const gmbStats = {
    completeness: 85,
    photos: 42,
    reviews: 45,
    averageRating: 4.8,
    postsThisMonth: 4,
    viewsThisMonth: 1240,
    callsThisMonth: 18,
  };

  const localSEOChecklist = [
    { item: 'Business name, address, phone (NAP) consistent', status: true },
    { item: 'Listed in UAE business directories', status: true },
    { item: 'Location pages created (Dubai, Abu Dhabi)', status: false },
    { item: 'Local keywords in content', status: true },
    { item: 'Backlinks from local UAE sites', status: false },
    { item: 'Google My Business fully optimized', status: false },
  ];

  const competitorComparisonDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-400';
      case 'Medium':
        return 'text-yellow-400';
      case 'Hard':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const competitionColor = (competition: string) => {
    switch (competition) {
      case 'Low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'High':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">SEO Dashboard</h2>
          <p className="text-muted-foreground">Optimize your online visibility and search rankings</p>
        </div>
        <Button className="bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-black">
          <ExternalLink className="w-4 h-4 mr-2" />
          Open Site
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">SEO Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold gradient-text">78/100</div>
            <div className="w-full bg-white/10 rounded-full h-2 mt-2">
              <div className="h-2 rounded-full bg-gradient-to-r from-[#00F5FF] to-[#B026FF]" style={{ width: '78%' }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Good - Room for improvement</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Page Speed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-bold text-green-400">2.3s</div>
              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                Fast
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Excellent loading time</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mobile Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#00F5FF]">92/100</div>
            <div className="w-full bg-white/10 rounded-full h-2 mt-2">
              <div className="h-2 rounded-full bg-gradient-to-r from-[#00F5FF] to-[#B026FF]" style={{ width: '92%' }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Mobile-optimized</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-[#00F5FF]" />
            Keyword Research Tool
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter keyword to research..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="glass-card border-white/10"
            />
            <Button className="bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-black">
              <Search className="w-4 h-4 mr-2" />
              Research
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Keyword</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Volume</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Competition</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Difficulty</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">CPC</th>
                </tr>
              </thead>
              <tbody>
                {keywordData.map((row, idx) => (
                  <tr key={idx} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-2 font-medium">{row.keyword}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-400" />
                        {row.volume.toLocaleString()}/mo
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant="outline" className={competitionColor(row.competition)}>
                        {row.competition}
                      </Badge>
                    </td>
                    <td className={`py-3 px-2 ${competitorComparisonDifficultyColor(row.difficulty)}`}>
                      {row.difficulty}
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">{row.cpc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Website Health Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {websiteChecklist.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                  <div className="flex items-center gap-3">
                    {item.status ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <X className="w-5 h-5 text-red-400" />
                    )}
                    <span className="text-sm">{item.item}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      item.priority === 'Critical'
                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                        : item.priority === 'High'
                        ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }
                  >
                    {item.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Google My Business Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Profile Completeness</span>
                <span className="text-lg font-bold gradient-text">{gmbStats.completeness}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="h-2 rounded-full bg-gradient-to-r from-[#00F5FF] to-[#B026FF]" style={{ width: `${gmbStats.completeness}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-xs">Photos</span>
                </div>
                <div className="text-xl font-bold">
                  {gmbStats.photos}
                  <span className="text-sm text-muted-foreground">/50+</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Star className="w-4 h-4" />
                  <span className="text-xs">Reviews</span>
                </div>
                <div className="text-xl font-bold">
                  {gmbStats.reviews}
                  <span className="text-sm text-yellow-400 ml-1">★{gmbStats.averageRating}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Globe className="w-4 h-4" />
                  <span className="text-xs">Posts (Month)</span>
                </div>
                <div className="text-xl font-bold">
                  {gmbStats.postsThisMonth}
                  <span className="text-sm text-muted-foreground">/8</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs">Monthly Views</span>
                </div>
                <div className="text-xl font-bold">{gmbStats.viewsThisMonth.toLocaleString()}</div>
              </div>
            </div>

            <Button className="w-full bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-black mt-4">
              Optimize GMB Profile
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#00F5FF]" />
            Local SEO Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {localSEOChecklist.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 glass-card border-white/10 rounded-lg">
                {item.status ? (
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                )}
                <span className="text-sm">{item.item}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 glass-card border-[#00F5FF]/30 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#00F5FF]" />
              Quick Wins for UAE Market
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Add location tags to all Instagram posts (Dubai, Abu Dhabi, UAE)</li>
              <li>• Create location-specific pages for each emirate you serve</li>
              <li>• Get listed in UAEPhotographers.com and local directories</li>
              <li>• Partner with UAE wedding venues for backlink opportunities</li>
              <li>• Use Arabic keywords for broader local reach</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
