import React from "react";
import { useParams } from "react-router-dom";
import { useExperiencesManager } from "@/lib/data";
import ExperienceCard from "@/components/ExperienceCard";

const ExperienceType = () => {
  const { type } = useParams();
  const { experiences, isLoading } = useExperiencesManager();

  // Filter experiences by exp_type (first value)
  const filtered = experiences.filter(
    exp => Array.isArray(exp.exp_type) && exp.exp_type[0] === type
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">{type} Experiences</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(exp => (
          <ExperienceCard key={exp.id} experience={exp} />
        ))}
      </div>
      {filtered.length === 0 && <div>No experiences found for this type.</div>}
    </div>
  );
};

export default ExperienceType; 