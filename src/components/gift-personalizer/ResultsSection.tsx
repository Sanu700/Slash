
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ExperienceCard from '@/components/ExperienceCard';
import { getAllExperiences } from '@/lib/data';
import { FormData } from '@/types/personalizerTypes';
import { Experience } from '@/lib/data';

interface ResultsSectionProps {
  suggestedExperiences: string[];
  formData: FormData;
}

const ResultsSection = ({ suggestedExperiences, formData }: ResultsSectionProps) => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadExperiences = async () => {
      try {
        const data = await getAllExperiences();
        setExperiences(data);
      } catch (error) {
        console.error('Error loading experiences:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadExperiences();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-medium mb-2">Your Personalized Recommendations</h2>
        <p className="text-muted-foreground">
          Based on your answers, we've curated these experiences for {formData.recipient || 'your recipient'}.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suggestedExperiences.map(id => {
          const experience = experiences.find(exp => exp.id === id);
          return experience ? (
            <ExperienceCard key={id} experience={experience} />
          ) : null;
        })}
      </div>
      
      <div className="mt-10 text-center">
        <p className="text-muted-foreground mb-6">
          Not seeing the perfect gift? Browse our complete collection of experiences.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/experiences">
            <Button>
              View All Experiences
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;
