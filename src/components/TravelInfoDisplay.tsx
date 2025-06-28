import React, { useState, useEffect } from 'react';
import { MapPin, Car, Footprints, Bike, Clock, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  getTravelInfo, 
  getUserLocation, 
  formatDistance, 
  formatDuration,
  type Location,
  type TravelInfo 
} from '@/lib/distanceUtils';

interface TravelInfoDisplayProps {
  experienceLocation: Location;
  className?: string;
}

const transportModes = [
  { id: 'driving', label: 'Car', icon: Car, color: 'bg-blue-100 text-blue-700' },
  { id: 'walking', label: 'Walk', icon: Footprints, color: 'bg-green-100 text-green-700' },
  { id: 'cycling', label: 'Bike', icon: Bike, color: 'bg-orange-100 text-orange-700' },
] as const;

export function TravelInfoDisplay({ experienceLocation, className = '' }: TravelInfoDisplayProps) {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [selectedMode, setSelectedMode] = useState<'driving' | 'walking' | 'cycling'>('driving');
  const [travelInfo, setTravelInfo] = useState<TravelInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user location on component mount
  useEffect(() => {
    getUserLocation()
      .then(setUserLocation)
      .catch((err) => {
        console.error('Failed to get user location:', err);
        setError('Location access denied. Please enable location services.');
      });
  }, []);

  // Calculate travel info when user location or mode changes
  useEffect(() => {
    if (!userLocation) return;

    setLoading(true);
    setError(null);

    getTravelInfo(userLocation, experienceLocation, selectedMode)
      .then((info) => {
        setTravelInfo(info);
      })
      .catch((err) => {
        console.error('Failed to get travel info:', err);
        setError('Unable to calculate travel time');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userLocation, experienceLocation, selectedMode]);

  if (!userLocation) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">
              {error || 'Getting your location...'}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Transport Mode Selector */}
          <div className="flex gap-2">
            {transportModes.map((mode) => {
              const Icon = mode.icon;
              const isSelected = selectedMode === mode.id;
              
              return (
                <Button
                  key={mode.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMode(mode.id as any)}
                  className={`flex items-center gap-1.5 ${
                    isSelected ? mode.color : 'hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">{mode.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Travel Information */}
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span className="text-sm">Calculating...</span>
            </div>
          ) : travelInfo ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Distance</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {formatDistance(travelInfo.distance)}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Travel Time</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {formatDuration(travelInfo.duration)}
                </Badge>
              </div>
            </div>
          ) : error ? (
            <div className="text-sm text-destructive">
              {error}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
} 