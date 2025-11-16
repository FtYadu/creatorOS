'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Handshake,
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  Users,
  DollarSign,
  Send,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';

const partnerTypes = [
  { id: 'all', label: 'All Partners', count: 18 },
  { id: 'venue', label: 'Venues', count: 5 },
  { id: 'planner', label: 'Wedding Planners', count: 4 },
  { id: 'makeup', label: 'Makeup Artists', count: 3 },
  { id: 'caterer', label: 'Caterers', count: 2 },
  { id: 'florist', label: 'Florists', count: 2 },
  { id: 'dj', label: 'DJs/Entertainment', count: 2 },
];

const partners = [
  {
    id: '1',
    name: 'Atlantis The Palm',
    type: 'venue',
    contactName: 'Sarah Johnson',
    email: 'events@atlantis.com',
    phone: '+971 4 426 2000',
    partnershipType: 'Preferred Vendor',
    referralsSent: 8,
    referralsReceived: 12,
    revenue: 180000,
    status: 'active',
    commission: '10% on bookings',
  },
  {
    id: '2',
    name: 'Elegant Events Dubai',
    type: 'planner',
    contactName: 'Fatima Al Mazrouei',
    email: 'fatima@elegantevents.ae',
    phone: '+971 50 123 4567',
    partnershipType: 'Referral Exchange',
    referralsSent: 15,
    referralsReceived: 10,
    revenue: 245000,
    status: 'active',
    commission: 'Mutual referrals',
  },
  {
    id: '3',
    name: 'Glam Squad UAE',
    type: 'makeup',
    contactName: 'Layla Hassan',
    email: 'hello@glamsquad.ae',
    phone: '+971 50 234 5678',
    partnershipType: 'Co-marketing',
    referralsSent: 6,
    referralsReceived: 8,
    revenue: 95000,
    status: 'active',
    commission: 'Package bundles',
  },
  {
    id: '4',
    name: 'Burj Al Arab',
    type: 'venue',
    contactName: 'Mohammed Ahmed',
    email: 'weddings@burjalarab.com',
    phone: '+971 4 301 7777',
    partnershipType: 'Preferred Vendor',
    referralsSent: 4,
    referralsReceived: 6,
    revenue: 150000,
    status: 'active',
    commission: '15% on bookings',
  },
];

export function PartnershipManager() {
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPartners = partners.filter((partner) => {
    const matchesType = selectedType === 'all' || partner.type === selectedType;
    const matchesSearch =
      searchQuery === '' ||
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.contactName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalStats = {
    partners: partners.length,
    referralsSent: partners.reduce((sum, p) => sum + p.referralsSent, 0),
    referralsReceived: partners.reduce((sum, p) => sum + p.referralsReceived, 0),
    revenue: partners.reduce((sum, p) => sum + p.revenue, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Partnership Management</h2>
          <p className="text-muted-foreground">Manage vendor partnerships and collaborations</p>
        </div>
        <Button className="bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-black">
          <Plus className="w-4 h-4 mr-2" />
          Add Partner
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold gradient-text">{totalStats.partners}</div>
            <p className="text-xs text-muted-foreground mt-1">Active partnerships</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Referrals Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{totalStats.referralsSent}</div>
            <p className="text-xs text-muted-foreground mt-1">To partner network</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Referrals Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-400">{totalStats.referralsReceived}</div>
            <p className="text-xs text-muted-foreground mt-1">From partners</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Partner Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-[#00F5FF]">
              {(totalStats.revenue / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground mt-1">Generated via partners</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search partners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-card border-white/10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {partnerTypes.map((type) => (
            <Button
              key={type.id}
              variant={selectedType === type.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(type.id)}
              className={
                selectedType === type.id
                  ? 'bg-[#00F5FF] hover:bg-[#00F5FF]/80 text-black'
                  : 'glass-card border-white/10'
              }
            >
              {type.label}
              <Badge variant="secondary" className="ml-2">
                {type.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredPartners.map((partner) => (
          <Card key={partner.id} className="glass-card border-white/10 hover:border-[#00F5FF]/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{partner.name}</h3>
                  <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    {partner.partnershipType}
                  </Badge>
                </div>
                <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                  {partner.status}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{partner.contactName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{partner.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{partner.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 glass-card border-white/10 rounded">
                  <div className="text-lg font-bold text-[#00F5FF]">{partner.referralsSent}</div>
                  <div className="text-xs text-muted-foreground">Sent</div>
                </div>
                <div className="text-center p-2 glass-card border-white/10 rounded">
                  <div className="text-lg font-bold text-green-400">{partner.referralsReceived}</div>
                  <div className="text-xs text-muted-foreground">Received</div>
                </div>
                <div className="text-center p-2 glass-card border-white/10 rounded">
                  <div className="text-lg font-bold">{(partner.revenue / 1000).toFixed(0)}K</div>
                  <div className="text-xs text-muted-foreground">Revenue</div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="text-xs text-muted-foreground mb-2">Commission Structure</div>
                <div className="text-sm font-medium mb-3">{partner.commission}</div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 glass-card border-white/10">
                    <Eye className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 glass-card border-white/10">
                    <Send className="w-3 h-3 mr-1" />
                    Contact
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card border-[#00F5FF]/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Handshake className="w-5 h-5 text-[#00F5FF]" />
            Partnership Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card border-white/10 p-4 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-400 mb-2" />
              <h4 className="font-semibold mb-1">Increased Referrals</h4>
              <p className="text-sm text-muted-foreground">
                Partners have referred {totalStats.referralsReceived} potential clients this year
              </p>
            </div>
            <div className="glass-card border-white/10 p-4 rounded-lg">
              <DollarSign className="w-8 h-8 text-[#00F5FF] mb-2" />
              <h4 className="font-semibold mb-1">Revenue Growth</h4>
              <p className="text-sm text-muted-foreground">
                AED {(totalStats.revenue / 1000).toFixed(0)}K generated through partner network
              </p>
            </div>
            <div className="glass-card border-white/10 p-4 rounded-lg">
              <Users className="w-8 h-8 text-purple-400 mb-2" />
              <h4 className="font-semibold mb-1">Network Expansion</h4>
              <p className="text-sm text-muted-foreground">
                {totalStats.partners} active partnerships across UAE wedding industry
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
