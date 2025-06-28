import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from './input';
import { Experience } from '@/lib/data/types';
import { getSavedExperiences } from '@/lib/data';

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onResultSelect?: (experience: Experience) => void;
  className?: string;
  showSuggestions?: boolean;
  maxResults?: number;
  recentSearches?: string[];
  onRecentSearchClick?: (search: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search experiences...",
  onSearch,
  onResultSelect,
  className,
  showSuggestions = true,
  maxResults = 8,
  recentSearches = [],
  onRecentSearchClick
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Experience[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setSelectedIndex(-1);
      setIsOpen(false);
      return;
    }

    const experiences = getSavedExperiences();
    const lowercaseQuery = query.toLowerCase();
    
    // Enhanced search with better matching logic
    const searchResults = experiences
      .filter(exp => {
        const searchableText = [
          exp.title,
          exp.description,
          exp.location,
          exp.category,
          exp.nicheCategory || '',
          exp.duration,
          exp.participants
        ].join(' ').toLowerCase();
        
        // Check for exact matches first
        const exactMatch = exp.title.toLowerCase().includes(lowercaseQuery) ||
                          exp.location.toLowerCase().includes(lowercaseQuery) ||
                          exp.category.toLowerCase().includes(lowercaseQuery);
        
        // Check for partial matches in any field
        const partialMatch = searchableText.includes(lowercaseQuery);
        
        // Check for word boundary matches (better for multi-word queries)
        const words = lowercaseQuery.split(' ').filter(word => word.length > 0);
        const wordMatch = words.some(word => 
          exp.title.toLowerCase().includes(word) ||
          exp.location.toLowerCase().includes(word) ||
          exp.category.toLowerCase().includes(word)
        );
        
        return exactMatch || partialMatch || wordMatch;
      })
      .sort((a, b) => {
        // Sort by relevance: exact title matches first, then location, then category
        const aTitleMatch = a.title.toLowerCase().includes(lowercaseQuery);
        const bTitleMatch = b.title.toLowerCase().includes(lowercaseQuery);
        
        if (aTitleMatch && !bTitleMatch) return -1;
        if (!aTitleMatch && bTitleMatch) return 1;
        
        const aLocationMatch = a.location.toLowerCase().includes(lowercaseQuery);
        const bLocationMatch = b.location.toLowerCase().includes(lowercaseQuery);
        
        if (aLocationMatch && !bLocationMatch) return -1;
        if (!aLocationMatch && bLocationMatch) return 1;
        
        // If relevance is the same, sort by trending/featured status
        if (a.trending && !b.trending) return -1;
        if (!a.trending && b.trending) return 1;
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        
        return 0;
      })
      .slice(0, maxResults);
    
    setResults(searchResults);
    setSelectedIndex(-1);
    setIsOpen(showSuggestions && searchResults.length > 0);
  }, [query, showSuggestions, maxResults]);

  // Handle focus state for recent searches
  useEffect(() => {
    if (isFocused && !query && recentSearches.length > 0) {
      setIsOpen(true);
    } else if (!isFocused) {
      setIsOpen(false);
    }
  }, [isFocused, query, recentSearches.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || !results.length) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultSelect(results[selectedIndex]);
        } else if (query.trim()) {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleSearch = () => {
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleResultSelect = (experience: Experience) => {
    if (onResultSelect) {
      onResultSelect(experience);
    }
    setQuery('');
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const clearQuery = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
            if (query.length >= 2) {
              setIsOpen(true);
            }
          }}
          onBlur={() => {
            // Delay hiding to allow for clicks on suggestions
            setTimeout(() => setIsFocused(false), 150);
          }}
          className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all pr-10"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        {query && (
          <button
            type="button"
            onClick={clearQuery}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {results.map((experience, index) => (
            <button
              key={experience.id}
              onClick={() => handleResultSelect(experience)}
              className={cn(
                "w-full text-left p-3 hover:bg-gray-50 flex items-center justify-between group",
                selectedIndex === index && "bg-gray-100"
              )}
              onMouseEnter={() => setSelectedIndex(index)}
              onMouseLeave={() => setSelectedIndex(-1)}
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
                  {experience.imageUrl && (
                    <img 
                      src={experience.imageUrl} 
                      alt={experience.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate group-hover:text-primary transition-colors">
                    {experience.title}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {experience.location}
                  </div>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900 flex-shrink-0">
                ₹{experience.price.toLocaleString()}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          <div className="text-center text-gray-500">
            <p>No experiences match "{query}"</p>
            <p className="text-xs mt-1">Try different keywords</p>
          </div>
        </div>
      )}

      {/* Recent Searches - Only show when query is empty */}
      {isFocused && !query && recentSearches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          <div className="p-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-700">Recent Searches</p>
          </div>
          {recentSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => {
                if (onRecentSearchClick) {
                  onRecentSearchClick(search);
                } else {
                  setQuery(search);
                }
              }}
              className="w-full text-left p-3 hover:bg-gray-50 flex items-center text-gray-700"
            >
              <div className="w-4 h-4 mr-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <span className="text-sm">{search}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}; 