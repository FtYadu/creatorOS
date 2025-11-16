'use client';

import { useMarketingStore } from '@/lib/stores/marketing-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Check, X, Eye, Globe, Instagram } from 'lucide-react';
import toast from 'react-hot-toast';

export function TestimonialManager() {
  const { testimonials, approveTestimonial, toggleFeaturedTestimonial } = useMarketingStore();

  const pendingTestimonials = testimonials.filter(t => !t.approved);
  const approvedTestimonials = testimonials.filter(t => t.approved);
  const featuredTestimonials = testimonials.filter(t => t.featured);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Testimonial Manager</h2>
        <p className="text-muted-foreground">
          {approvedTestimonials.length} approved • {pendingTestimonials.length} pending review • {featuredTestimonials.length} featured
        </p>
      </div>

      {pendingTestimonials.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Pending Approval</h3>
          {pendingTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="glass-card border-yellow-500/30">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold">{testimonial.clientName}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.clientEmail}</p>
                  </div>
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-sm mb-4">{testimonial.review}</p>
                <div className="flex items-center gap-2 mb-4">
                  {testimonial.canUseOnWebsite && (
                    <Badge variant="secondary" className="text-xs">
                      <Globe className="w-3 h-3 mr-1" />
                      Website OK
                    </Badge>
                  )}
                  {testimonial.canUseOnSocial && (
                    <Badge variant="secondary" className="text-xs">
                      <Instagram className="w-3 h-3 mr-1" />
                      Social OK
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      approveTestimonial(testimonial.id);
                      toast.success('Testimonial approved!');
                    }}
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Approved Testimonials</h3>
        {approvedTestimonials.map((testimonial) => (
          <Card key={testimonial.id} className="glass-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold">{testimonial.clientName}</h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.platform} • Approved {testimonial.approvedDate ? new Date(testimonial.approvedDate).toLocaleDateString() : 'recently'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {renderStars(testimonial.rating)}
                  {testimonial.featured && (
                    <Badge className="bg-[#00F5FF]/20 text-[#00F5FF] border-[#00F5FF]/30">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-sm mb-4">{testimonial.review}</p>
              {testimonial.response && (
                <div className="glass-card border-white/10 p-3 rounded-lg mb-4">
                  <p className="text-xs text-muted-foreground mb-1">Your Response:</p>
                  <p className="text-sm">{testimonial.response}</p>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    toggleFeaturedTestimonial(testimonial.id);
                    toast.success(testimonial.featured ? 'Removed from featured' : 'Added to featured!');
                  }}
                  className="glass-card border-white/10"
                >
                  <Star className="w-4 h-4 mr-1" />
                  {testimonial.featured ? 'Unfeature' : 'Feature'}
                </Button>
                <Button size="sm" variant="outline" className="glass-card border-white/10">
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {approvedTestimonials.length === 0 && (
          <Card className="glass-card border-white/10">
            <CardContent className="p-8 text-center text-muted-foreground">
              No approved testimonials yet
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
