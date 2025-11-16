'use client';

import { useState, useEffect } from 'react';
import { Plus, Save, Trash2, MapPin, Clock, Sun, CloudRain, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { Location } from '@/types';
import { lightingConditions } from '@/lib/utils/pre-production-templates';
import { toast } from 'react-hot-toast';

interface LocationScoutProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LocationScout({ projectId, open, onOpenChange }: LocationScoutProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (open) {
      loadLocations();
    }
  }, [open, projectId]);

  const loadLocations = async () => {
    const { data } = await supabase
      .from('locations')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (data) {
      const loadedLocations = data.map((loc: any) => ({
        id: loc.id,
        projectId: loc.project_id,
        name: loc.name,
        address: loc.address,
        coordinates: loc.coordinates,
        parkingInfo: loc.parking_info,
        permitRequired: loc.permit_required,
        bestTimeOfDay: loc.best_time_of_day,
        lightingConditions: loc.lighting_conditions,
        weatherConsiderations: loc.weather_considerations,
        backupLocation: loc.backup_location,
        isPrimary: loc.is_primary,
        photos: loc.photos || [],
        notes: loc.notes,
        createdAt: new Date(loc.created_at),
        updatedAt: new Date(loc.updated_at),
      }));
      setLocations(loadedLocations);
    }
  };

  const handleAddLocation = () => {
    const newLocation: Location = {
      id: `location-${Date.now()}`,
      projectId,
      name: '',
      address: '',
      parkingInfo: '',
      permitRequired: false,
      bestTimeOfDay: '',
      lightingConditions: 'Natural',
      weatherConsiderations: '',
      backupLocation: '',
      isPrimary: locations.length === 0,
      photos: [],
      notes: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setLocations([...locations, newLocation]);
    setSelectedLocation(newLocation);
    setIsAdding(true);
  };

  const handleUpdateLocation = (field: string, value: any) => {
    if (!selectedLocation) return;

    const updated = { ...selectedLocation, [field]: value };
    setSelectedLocation(updated);
    setLocations((locs) =>
      locs.map((loc) => (loc.id === selectedLocation.id ? updated : loc))
    );
  };

  const handleSetPrimary = (locationId: string) => {
    setLocations((locs) =>
      locs.map((loc) => ({
        ...loc,
        isPrimary: loc.id === locationId,
      }))
    );
  };

  const handleDeleteLocation = (locationId: string) => {
    setLocations((locs) => locs.filter((loc) => loc.id !== locationId));
    if (selectedLocation?.id === locationId) {
      setSelectedLocation(null);
    }
    toast.success('Location deleted');
  };

  const handleSave = async () => {
    try {
      await supabase.from('locations').delete().eq('project_id', projectId);

      if (locations.length > 0) {
        const locationsToInsert = locations.map((loc) => ({
          project_id: projectId,
          name: loc.name,
          address: loc.address,
          coordinates: loc.coordinates,
          parking_info: loc.parkingInfo,
          permit_required: loc.permitRequired,
          best_time_of_day: loc.bestTimeOfDay,
          lighting_conditions: loc.lightingConditions,
          weather_considerations: loc.weatherConsiderations,
          backup_location: loc.backupLocation,
          is_primary: loc.isPrimary,
          photos: loc.photos,
          notes: loc.notes,
        }));

        await supabase.from('locations').insert(locationsToInsert);
      }

      toast.success('Locations saved successfully!');
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving locations:', error);
      toast.error('Failed to save locations');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/10 max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">Location Scout</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex gap-2 mb-6">
            <Button onClick={handleAddLocation} className="flex-1">
              <Plus className="mr-2 h-4 w-4" />
              Add Location
            </Button>
            {locations.length > 0 && (
              <Button onClick={handleSave} variant="outline">
                <Save className="mr-2 h-4 w-4" />
                Save All
              </Button>
            )}
          </div>

          {locations.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No locations added yet</p>
              <p className="text-sm mt-2">Add your first location to start scouting</p>
            </div>
          )}

          {locations.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1 space-y-2">
                <Label className="text-sm text-muted-foreground">Locations</Label>
                {locations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => {
                      setSelectedLocation(location);
                      setIsAdding(false);
                    }}
                    className={`w-full glass-card p-3 text-left hover:bg-white/10 transition-colors ${
                      selectedLocation?.id === location.id ? 'ring-2 ring-[#00F5FF]' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">
                          {location.name || 'Unnamed Location'}
                        </h4>
                        {location.address && (
                          <p className="text-xs text-muted-foreground truncate">{location.address}</p>
                        )}
                      </div>
                      {location.isPrimary && (
                        <Badge className="bg-[#00F5FF]/20 text-[#00F5FF] border-[#00F5FF]/30 border ml-2">
                          <Star className="h-3 w-3" />
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="lg:col-span-2">
                {selectedLocation && (
                  <div className="glass-card p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Location Details</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteLocation(selectedLocation.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Location Name</Label>
                        <input
                          type="text"
                          placeholder="e.g., Downtown Studio, Beach Location"
                          value={selectedLocation.name}
                          onChange={(e) => handleUpdateLocation('name', e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm mt-1"
                        />
                      </div>

                      <div>
                        <Label>Address</Label>
                        <input
                          type="text"
                          placeholder="Full address"
                          value={selectedLocation.address}
                          onChange={(e) => handleUpdateLocation('address', e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm mt-1"
                        />
                      </div>

                      <div className="glass-card p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-cyan-400" />
                          <span className="text-sm font-medium">Map Preview</span>
                        </div>
                        <div className="aspect-video rounded bg-white/5 flex items-center justify-center text-muted-foreground text-sm">
                          Map integration placeholder
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Best Time of Day</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <input
                              type="time"
                              value={selectedLocation.bestTimeOfDay}
                              onChange={(e) => handleUpdateLocation('bestTimeOfDay', e.target.value)}
                              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Lighting Conditions</Label>
                          <Select
                            value={selectedLocation.lightingConditions}
                            onValueChange={(value) => handleUpdateLocation('lightingConditions', value)}
                          >
                            <SelectTrigger className="bg-white/5 border-white/10 mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {lightingConditions.map((condition) => (
                                <SelectItem key={condition} value={condition}>
                                  {condition}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label>Parking Information</Label>
                        <Textarea
                          placeholder="e.g., Street parking available, paid lot nearby"
                          value={selectedLocation.parkingInfo}
                          onChange={(e) => handleUpdateLocation('parkingInfo', e.target.value)}
                          className="bg-white/5 border-white/10 mt-1"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedLocation.permitRequired}
                          onCheckedChange={(checked) => handleUpdateLocation('permitRequired', checked)}
                        />
                        <Label>Filming Permit Required</Label>
                      </div>

                      <div>
                        <Label>Weather Considerations</Label>
                        <Textarea
                          placeholder="e.g., Exposed to wind, needs rain backup plan"
                          value={selectedLocation.weatherConsiderations}
                          onChange={(e) => handleUpdateLocation('weatherConsiderations', e.target.value)}
                          className="bg-white/5 border-white/10 mt-1"
                        />
                      </div>

                      <div>
                        <Label>Backup Location</Label>
                        <input
                          type="text"
                          placeholder="Alternative location if needed"
                          value={selectedLocation.backupLocation}
                          onChange={(e) => handleUpdateLocation('backupLocation', e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm mt-1"
                        />
                      </div>

                      <div>
                        <Label>Scouting Notes</Label>
                        <Textarea
                          placeholder="Additional notes from location scouting"
                          value={selectedLocation.notes}
                          onChange={(e) => handleUpdateLocation('notes', e.target.value)}
                          className="bg-white/5 border-white/10 mt-1 min-h-[100px]"
                        />
                      </div>

                      {!selectedLocation.isPrimary && (
                        <Button
                          onClick={() => handleSetPrimary(selectedLocation.id)}
                          variant="outline"
                          className="w-full"
                        >
                          <Star className="mr-2 h-4 w-4" />
                          Set as Primary Location
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
