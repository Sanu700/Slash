import { useState, useEffect, useCallback } from 'react';

const SEARCH_HISTORY_KEY = 'searchHistory';
const MAX_HISTORY_ITEMS = 10;

export const useSearchHistory = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const loadSearchHistory = useCallback(() => {
    try {
      const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (saved) {
        const history = JSON.parse(saved);
        return Array.isArray(history) ? history : [];
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
    return [];
  }, []);

  const saveSearchHistory = useCallback((history: string[]) => {
    try {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }, []);

  const reloadSearchHistory = useCallback(() => {
    const history = loadSearchHistory();
    setRecentSearches(history);
  }, [loadSearchHistory]);

  const addToSearchHistory = useCallback((term: string) => {
    if (!term.trim()) return;
    
    const trimmedTerm = term.trim();
    setRecentSearches(prev => {
      // Remove the term if it already exists
      const filtered = prev.filter(item => item !== trimmedTerm);
      // Add to the beginning and limit to max items
      const newHistory = [trimmedTerm, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      saveSearchHistory(newHistory);
      return newHistory;
    });
  }, [saveSearchHistory]);

  const removeFromSearchHistory = useCallback((term: string) => {
    setRecentSearches(prev => {
      const newHistory = prev.filter(item => item !== term);
      saveSearchHistory(newHistory);
      return newHistory;
    });
  }, [saveSearchHistory]);

  const clearSearchHistory = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  }, []);

  // Load search history on mount
  useEffect(() => {
    reloadSearchHistory();
  }, [reloadSearchHistory]);

  return {
    recentSearches,
    addToSearchHistory,
    reloadSearchHistory,
    clearSearchHistory,
    removeFromSearchHistory,
  };
}; 