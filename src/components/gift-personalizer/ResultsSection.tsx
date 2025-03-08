
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ExperienceCard from '@/components/ExperienceCard';
import { experiences } from '@/lib/data';
import { FormData } from '@/types/personalizerTypes';

interface ResultsSectionProps {
  suggestedExperiences: string[];
  formData: FormData;
}

const ResultsSection = ({ suggestedExperiences, formData }: ResultsSectionProps) => {
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
        <Link to="/experiences">
          <Button>
            View All Experiences
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ResultsSection;
