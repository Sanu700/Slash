import React from 'react';
import { TravelInfoDisplay } from '@/components/TravelInfoDisplay';
import { sampleExperiences } from '@/lib/data/sampleData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TravelDemo() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Travel Information Demo</h1>
        <p className="text-muted-foreground mb-8">
          This demo shows how the travel information feature works. Hover over the cards to see distance and travel time calculations.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleExperiences.map((experience) => (
            <Card key={experience.id} className="overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={experience.imageUrl}
                  alt={experience.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{experience.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{experience.location}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{experience.description}</p>
                
                {experience.coordinates && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Travel Information</h4>
                    <TravelInfoDisplay 
                      experienceLocation={experience.coordinates}
                      className="bg-gray-50"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 