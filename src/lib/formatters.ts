/**
 * Format a price in rupees
 * @param price Price in rupees (without decimals)
 * @returns Formatted price string with ₹ symbol
 */
export const formatRupees = (price: number): string => {
  // Convert to string and add commas according to Indian numbering system
  // e.g., 123456 -> 1,23,456
  const priceString = price.toString();
  
  // For prices less than 1000, just return with ₹ symbol
  if (priceString.length <= 3) {
    return `₹${priceString}`;
  }
  
  // Format with Indian numbering system (comma after first 3 digits from right, then after every 2 digits)
  const lastThree = priceString.substring(priceString.length - 3);
  const otherNumbers = priceString.substring(0, priceString.length - 3);
  const formattedOtherNumbers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  
  return `₹${formattedOtherNumbers ? formattedOtherNumbers + ',' : ''}${lastThree}`;
};

/**
 * Fetches travel time in minutes between two coordinates using OpenRouteService Directions API.
 * @param {number} fromLat - User latitude
 * @param {number} fromLng - User longitude
 * @param {number} toLat - Experience latitude
 * @param {number} toLng - Experience longitude
 * @returns {Promise<number|null>} Travel time in minutes, or null if error
 */
export async function getTravelTimeMinutes(fromLat, fromLng, toLat, toLng) {
  // Use Haversine formula for straight-line distance
  function toRad(x) { return (x * Math.PI) / 180; }
  const R = 6371; // Earth radius in km
  const dLat = toRad(toLat - fromLat);
  const dLon = toRad(toLng - fromLng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(fromLat)) *
      Math.cos(toRad(toLat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  // Estimate travel time: 1 min per km (driving)
  return Math.round(distance);
}
