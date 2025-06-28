import { useState, useEffect, useCallback } from 'react';

const SEARCH_HISTORY_KEY = 'slash_search_history';
const MAX_HISTORY_ITEMS = 10;

export const useSearchHistory = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load search history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
          setRecentSearches(parsedHistory);
        }
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  }, []);

  // Save search history to localStorage
  const saveSearchHistory = useCallback((history: string[]) => {
    try {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }, []);

  // Add a new search to history
  const addToSearchHistory = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const trimmedQuery = searchQuery.trim();
    
    setRecentSearches(prevHistory => {
      // Remove the query if it already exists (to avoid duplicates)
      const filteredHistory = prevHistory.filter(item => item.toLowerCase() !== trimmedQuery.toLowerCase());
      
      // Add the new query to the beginning
      const newHistory = [trimmedQuery, ...filteredHistory];
      
      // Keep only the most recent MAX_HISTORY_ITEMS
      const limitedHistory = newHistory.slice(0, MAX_HISTORY_ITEMS);
      
      // Save to localStorage
      saveSearchHistory(limitedHistory);
      
      return limitedHistory;
    });
  }, [saveSearchHistory]);

  // Clear search history
  const clearSearchHistory = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  }, []);

  // Remove a specific search from history
  const removeFromSearchHistory = useCallback((searchQuery: string) => {
    setRecentSearches(prevHistory => {
      const newHistory = prevHistory.filter(item => item !== searchQuery);
      saveSearchHistory(newHistory);
      return newHistory;
    });
  }, [saveSearchHistory]);

  return {
    recentSearches,
    addToSearchHistory,
    clearSearchHistory,
    removeFromSearchHistory,
  };
}; 