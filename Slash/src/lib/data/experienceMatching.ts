import { Category } from './categories';

export interface UserPreferences {
  preferredCategories: string[];
  budgetRange: {
    min: number;
    max: number;
  };
  preferredDuration: {
    min: number;
    max: number;
  };
  preferredTimeOfDay: ('morning' | 'afternoon' | 'evening')[];
  preferredDays: ('weekday' | 'weekend')[];
  groupSize: number;
  accessibilityNeeds: string[];
  interests: string[];
}

export interface Experience {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  availableTimeSlots: {
    timeOfDay: 'morning' | 'afternoon' | 'evening';
    days: ('weekday' | 'weekend')[];
  }[];
  groupSize: {
    min: number;
    max: number;
  };
  accessibilityFeatures: string[];
  tags: string[];
  rating: number;
  imageUrl: string;
}

export function calculateExperienceMatch(
  userPreferences: UserPreferences,
  experience: Experience
): number {
  let matchScore = 0;
  const totalFactors = 7; // Total number of matching factors

  // Category match
  if (userPreferences.preferredCategories.includes(experience.categoryId)) {
    matchScore += 1;
  }

  // Budget match
  if (
    experience.price >= userPreferences.budgetRange.min &&
    experience.price <= userPreferences.budgetRange.max
  ) {
    matchScore += 1;
  }

  // Duration match
  if (
    experience.duration >= userPreferences.preferredDuration.min &&
    experience.duration <= userPreferences.preferredDuration.max
  ) {
    matchScore += 1;
  }

  // Time of day match
  const timeMatch = experience.availableTimeSlots.some(slot =>
    userPreferences.preferredTimeOfDay.includes(slot.timeOfDay)
  );
  if (timeMatch) {
    matchScore += 1;
  }

  // Day preference match
  const dayMatch = experience.availableTimeSlots.some(slot =>
    slot.days.some(day => userPreferences.preferredDays.includes(day))
  );
  if (dayMatch) {
    matchScore += 1;
  }

  // Group size match
  if (
    userPreferences.groupSize >= experience.groupSize.min &&
    userPreferences.groupSize <= experience.groupSize.max
  ) {
    matchScore += 1;
  }

  // Accessibility match
  const accessibilityMatch = userPreferences.accessibilityNeeds.every(need =>
    experience.accessibilityFeatures.includes(need)
  );
  if (accessibilityMatch) {
    matchScore += 1;
  }

  // Calculate final match percentage
  return (matchScore / totalFactors) * 100;
}

export function getRecommendedExperiences(
  userPreferences: UserPreferences,
  experiences: Experience[],
  limit: number = 5
): Experience[] {
  return experiences
    .map(experience => ({
      ...experience,
      matchScore: calculateExperienceMatch(userPreferences, experience)
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
} 