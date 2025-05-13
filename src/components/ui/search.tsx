import { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { getSavedExperiences } from '@/lib/data';

interface SearchProps {
  onResultClick?: (id: string) => void;
  onSubmit?: (query: string) => void;
  className?: string;
  placeholder?: string;
  maxResults?: number;
}

export const Search = ({
  onResultClick,
  onSubmit,
  className,
  placeholder = 'Search experiences...',
  maxResults = 5
}: SearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const experiences = getSavedExperiences();
    const lowercaseQuery = searchQuery.toLowerCase();
    const results = experiences
      .filter(exp => 
        exp.title.toLowerCase().includes(lowercaseQuery) || 
        exp.description.toLowerCase().includes(lowercaseQuery) ||
        exp.location.toLowerCase().includes(lowercaseQuery)
      )
      .slice(0, maxResults);
    
    setSearchResults(results);
  }, [searchQuery, maxResults]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSubmit) {
      onSubmit(searchQuery);
      setIsOpen(false);
    }
  };

  return (
    <div className={cn('relative', className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10"
        />
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </form>
      
      {isOpen && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50">
          {searchResults.map((result) => (
            <button
              key={result.id}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => {
                if (onResultClick) {
                  onResultClick(result.id);
                }
                setIsOpen(false);
              }}
            >
              <div className="font-medium">{result.title}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{result.location}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}; 