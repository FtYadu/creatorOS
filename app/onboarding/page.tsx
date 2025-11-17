'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Camera, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const STEPS = [
  { id: 'welcome', title: 'Welcome', description: 'Get started with CreatorOS' },
  { id: 'business', title: 'Business Info', description: 'Tell us about your studio' },
  { id: 'services', title: 'Services', description: 'What services do you offer?' },
  { id: 'complete', title: 'Complete', description: "You're all set!" },
];

const PROJECT_TYPES = [
  'Wedding',
  'Corporate',
  'Event',
  'Portrait',
  'Product',
  'Commercial',
  'Real Estate',
  'Fashion',
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    studioName: '',
    businessType: 'Solo Photographer',
    services: [] as string[],
    teamSize: '1',
  });
  const { user } = useAuth();
  const router = useRouter();

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep === 1 && !formData.studioName) {
      toast.error('Please enter your studio name');
      return;
    }

    if (currentStep === 2 && formData.services.length === 0) {
      toast.error('Please select at least one service');
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // Save profile data
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studioName: formData.studioName,
          businessType: formData.businessType,
          onboardingCompleted: true,
        }),
      });

      if (!response.ok) throw new Error('Failed to save profile');

      toast.success('Welcome to CreatorOS! 🎉');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to complete onboarding');
    }
  };

  const toggleService = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a]">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{STEPS[currentStep].title}</h2>
                <p className="text-gray-400 text-sm">{STEPS[currentStep].description}</p>
              </div>
            </div>
            <span className="text-gray-400 text-sm">
              Step {currentStep + 1} of {STEPS.length}
            </span>
          </div>
          {/* Simple progress bar without Radix UI */}
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <Card className="glass-card border-white/10 p-8">
          {currentStep === 0 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                <Camera className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-3">
                  Welcome to CreatorOS!
                </h1>
                <p className="text-gray-400 text-lg">
                  Your all-in-one platform for managing photography and videography projects.
                  Let's get you set up in just a few steps.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4">
                {['Pre-Production', 'Production', 'Post-Production'].map((feature, i) => (
                  <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <Check className="w-5 h-5 text-cyan-400 mb-2" />
                    <p className="text-white text-sm font-semibold">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Business Information</h3>
                <p className="text-gray-400">Tell us about your photography business</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="studioName" className="text-white">
                    Studio/Business Name *
                  </Label>
                  <Input
                    id="studioName"
                    value={formData.studioName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, studioName: e.target.value }))
                    }
                    placeholder="e.g., Smith Photography Studio"
                    className="bg-white/5 border-white/10 text-white mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="businessType" className="text-white">
                    Business Type
                  </Label>
                  <select
                    id="businessType"
                    value={formData.businessType}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, businessType: e.target.value }))
                    }
                    className="w-full mt-2 p-2 rounded-md bg-white/5 border border-white/10 text-white"
                  >
                    <option value="Solo Photographer">Solo Photographer</option>
                    <option value="Studio">Studio (2-10 people)</option>
                    <option value="Agency">Agency (10+ people)</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="teamSize" className="text-white">
                    Team Size
                  </Label>
                  <Input
                    id="teamSize"
                    type="number"
                    value={formData.teamSize}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, teamSize: e.target.value }))
                    }
                    className="bg-white/5 border-white/10 text-white mt-2"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Services Offered</h3>
                <p className="text-gray-400">Select the types of projects you typically work on</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {PROJECT_TYPES.map((service) => (
                  <button
                    key={service}
                    onClick={() => toggleService(service)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.services.includes(service)
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold">{service}</span>
                      {formData.services.includes(service) && (
                        <Check className="w-5 h-5 text-cyan-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                <Check className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">You're All Set!</h3>
                <p className="text-gray-400 text-lg">
                  Your CreatorOS workspace is ready. Start managing your projects like a pro!
                </p>
              </div>
              <div className="pt-4 space-y-3">
                <p className="text-white font-semibold">{formData.studioName}</p>
                <p className="text-gray-400">
                  {formData.businessType} • {formData.services.length} services
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            {currentStep > 0 && currentStep < STEPS.length - 1 && (
              <Button variant="outline" onClick={handleBack} className="border-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}

            {currentStep < STEPS.length - 1 ? (
              <Button
                onClick={handleNext}
                className="ml-auto bg-gradient-to-r from-cyan-500 to-purple-600"
              >
                {currentStep === 0 ? 'Get Started' : 'Continue'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="mx-auto bg-gradient-to-r from-cyan-500 to-purple-600"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
