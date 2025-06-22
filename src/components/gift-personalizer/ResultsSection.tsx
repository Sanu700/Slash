import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ExperienceCard from '@/components/ExperienceCard';
import { getAllExperiences } from '@/lib/data';
import { FormData } from '@/types/personalizerTypes';
import { Experience } from '@/lib/data';
import { ArrowLeft } from 'lucide-react';

interface ResultsSectionProps {
  suggestedExperiences: string[];
  formData: FormData;
  onBack: () => void;
}

const ResultsSection = ({ suggestedExperiences, formData, onBack }: ResultsSectionProps) => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [giftMessage, setGiftMessage] = useState('');
  
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
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-medium">Your Personalized Recommendations</h2>
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Questionnaire
        </Button>
      </div>

      <Textarea
        value={giftMessage}
        onChange={(e) => setGiftMessage(e.target.value)}
        placeholder="Add a personal message to accompany your gift..."
        className="min-h-[120px] text-lg"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {suggestedExperiences.map(id => {
          const experience = experiences.find(exp => exp.id === id);
          return experience ? (
            <div key={id} className="w-[341.34px] h-[256px]">
              <ExperienceCard experience={experience} />
            </div>
          ) : null;
        })}
      </div>
      
      <div className="text-center">
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