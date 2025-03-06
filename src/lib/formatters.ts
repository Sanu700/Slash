
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
