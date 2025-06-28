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
  const apiKey = '5b3ce3597851110001cf6248a8b5672fb44148a89cc73498624eae7b';
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}`;
  const body = {
    coordinates: [
      [fromLng, fromLat],
      [toLng, toLat]
    ]
  };
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) return null;
    const data = await res.json();
    const seconds = data.routes?.[0]?.summary?.duration;
    if (!seconds) return null;
    return Math.round(seconds / 60);
  } catch (e) {
    console.error('Error fetching travel time:', e);
    return null;
  }
}
