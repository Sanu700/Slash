import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useExperiencesManager } from "@/lib/data";
import ExperienceCard from "@/components/ExperienceCard";
import { useWishlistExperiences } from '@/hooks/useDataLoaders';
import { useAuth } from '@/lib/auth';

const ExperienceType = () => {
  const { type } = useParams();
  const { experiences, isLoading } = useExperiencesManager();
  const { user } = useAuth();
  const { wishlistExperiences } = useWishlistExperiences(user?.id);
  const [localWishlist, setLocalWishlist] = useState<string[]>([]);

  useEffect(() => {
    if (wishlistExperiences) {
      setLocalWishlist(wishlistExperiences.map(exp => exp.id));
    }
  }, [wishlistExperiences]);

  const handleWishlistChange = (experienceId: string, isNowInWishlist: boolean) => {
    setLocalWishlist(prev => {
      if (isNowInWishlist) {
        if (!prev.includes(experienceId)) return [...prev, experienceId];
        return prev;
      } else {
        return prev.filter(id => id !== experienceId);
      }
    });
  };

  useEffect(() => {
    // Use a timeout to ensure content is rendered before scrolling
    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timeout);
  }, [type]);

  // Filter experiences by exp_type (first value)
  const filtered = experiences.filter(
    exp => Array.isArray(exp.exp_type) && exp.exp_type[0] === type
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container max-w-6xl mx-auto px-4 md:px-10 py-12 pt-28">
      <h1 className="text-4xl font-extrabold mb-6 text-center capitalize">
        {type ? `${type} Experiences` : "Experiences"}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch stagger-children">
        {filtered.map(exp => (
          <ExperienceCard
            key={exp.id}
            experience={exp}
            isInWishlist={localWishlist.includes(exp.id)}
            onWishlistChange={handleWishlistChange}
          />
        ))}
      </div>
      {filtered.length === 0 && <div>No experiences found for this type.</div>}
    </div>
  );
};

export default ExperienceType; 