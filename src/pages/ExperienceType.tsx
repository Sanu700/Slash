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

  // Get selected location from localStorage
  const selectedAddressRaw = typeof window !== 'undefined' ? localStorage.getItem('selected_address') : null;
  let selectedAddress = null;
  try {
    selectedAddress = selectedAddressRaw ? JSON.parse(selectedAddressRaw) : selectedAddressRaw;
  } catch {
    selectedAddress = selectedAddressRaw;
  }
  const isCityOnly = selectedAddress && typeof selectedAddress === 'object' &&
    (!selectedAddress.lat || !selectedAddress.lon || isNaN(Number(selectedAddress.lat)) || isNaN(Number(selectedAddress.lon)));
  const DEFAULT_RADIUS_KM = 40;
  function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  // Filter experiences by exp_type (first value) and location
  let filtered = experiences.filter(
    exp => Array.isArray(exp.exp_type) && exp.exp_type[0] === type
  );
  if (selectedAddress && typeof selectedAddress === 'object' && selectedAddress.lat && selectedAddress.lon && !isCityOnly) {
    // Proximity filtering (address with coordinates)
    const lat = parseFloat(selectedAddress.lat);
    const lon = parseFloat(selectedAddress.lon);
    const normalizedCity = selectedAddress.address ? selectedAddress.address.trim().toLowerCase() : null;
    filtered = filtered
      .map(exp => {
        if (typeof exp.latitude === 'number' && typeof exp.longitude === 'number') {
          const distance = haversineDistance(lat, lon, exp.latitude, exp.longitude);
          return { ...exp, _distance: distance };
        }
        return { ...exp, _distance: Infinity };
      })
      .filter(exp => exp._distance <= DEFAULT_RADIUS_KM)
      .filter(exp => {
        if (!normalizedCity) return true;
        const expLoc = (exp.location || '').trim().toLowerCase();
        return expLoc.includes(normalizedCity);
      })
      .sort((a, b) => (a._distance || 0) - (b._distance || 0));
  } else if (selectedAddress && typeof selectedAddress === 'object' && selectedAddress.address && isCityOnly) {
    // City-only selection: string match on location column
    const normalizedCity = selectedAddress.address.trim().toLowerCase();
    filtered = filtered.filter(exp => {
      const expLoc = (exp.location || '').trim().toLowerCase();
      return expLoc === normalizedCity || expLoc.includes(normalizedCity) || normalizedCity.includes(expLoc);
    });
  }

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