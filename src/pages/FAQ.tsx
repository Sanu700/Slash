
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useInView } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { getFAQs, FAQItem } from '@/lib/services/contentService';

const FAQ = () => {
  const [heroRef, heroInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [openQuestions, setOpenQuestions] = useState<{[key: string]: boolean}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [faqsByCategory, setFaqsByCategory] = useState<{[category: string]: FAQItem[]}>({});
  const [categories, setCategories] = useState<string[]>([]);
  
  // Fetch FAQs from Supabase
  useEffect(() => {
    const loadFAQs = async () => {
      setIsLoading(true);
      try {
        const faqData = await getFAQs();
        setFaqsByCategory(faqData);
        
        // Extract categories
        const categoryList = Object.keys(faqData);
        setCategories(categoryList);
        
        // Set initial active category
        if (categoryList.length > 0 && !activeCategory) {
          setActiveCategory(categoryList[0]);
        }
      } catch (error) {
        console.error("Error loading FAQs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFAQs();
  }, []);
  
  // Toggle question open/closed state
  const toggleQuestion = (id: string) => {
    setOpenQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Filter questions based on search query
  const filteredFAQs = searchQuery 
    ? Object.entries(faqsByCategory).reduce((result, [category, questions]) => {
        const filteredQuestions = questions.filter(q => 
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        if (filteredQuestions.length > 0) {
          result[category] = filteredQuestions;
        }
        
        return result;
      }, {} as {[category: string]: FAQItem[]})
    : faqsByCategory;
  
  // Count total filtered questions
  const totalFilteredQuestions = Object.values(filteredFAQs)
    .reduce((count, questions) => count + questions.length, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <div 
          ref={heroRef}
          className="relative bg-gradient-to-r from-purple-800 to-indigo-700 text-white py-16 md:py-24"
        >
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <div className={`text-center max-w-2xl mx-auto transition-all duration-700 ${heroInView ? "opacity-100" : "opacity-0 translate-y-8"}`}>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
              <p className="text-xl mb-8">
                Find answers to common questions about experiences, bookings, gifts, and more.
              </p>
              
              {/* Search Input */}
              <div className="relative max-w-xl mx-auto">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
                  <Search className="w-5 h-5" />
                </div>
                <Input 
                  type="search"
                  placeholder="Search for answers..."
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus-visible:ring-white/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQ Content */}
        <section className="py-16 md:py-24">
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-10">
                {/* Categories Sidebar */}
                {!searchQuery && categories.length > 0 && (
                  <div className="lg:w-1/4">
                    <h2 className="text-xl font-medium mb-6">Categories</h2>
                    <div className="space-y-2">
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => setActiveCategory(category)}
                          className={cn(
                            "block w-full text-left px-4 py-2 rounded-lg transition-colors",
                            activeCategory === category
                              ? "bg-primary text-white"
                              : "hover:bg-secondary/50"
                          )}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* FAQ Questions */}
                <div className={searchQuery || categories.length === 0 ? "w-full" : "lg:w-3/4"}>
                  {searchQuery ? (
                    // Showing search results
                    <>
                      <h2 className="text-xl font-medium mb-6">
                        {totalFilteredQuestions > 0 
                          ? `Search Results (${totalFilteredQuestions})`
                          : "No matching questions found"
                        }
                      </h2>
                      <div className="space-y-8">
                        {Object.entries(filteredFAQs).map(([category, questions]) => (
                          <div key={category}>
                            <h3 className="text-lg font-medium mb-4 border-b pb-2">{category}</h3>
                            <div className="space-y-4">
                              {questions.map(item => (
                                <div 
                                  key={item.id} 
                                  className="border border-border rounded-lg overflow-hidden"
                                >
                                  <button
                                    onClick={() => toggleQuestion(item.id)}
                                    className="flex items-center justify-between w-full p-4 text-left"
                                  >
                                    <h4 className="font-medium">{item.question}</h4>
                                    {openQuestions[item.id] ? (
                                      <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                                    ) : (
                                      <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                                    )}
                                  </button>
                                  
                                  {openQuestions[item.id] && (
                                    <div className="p-4 pt-0 border-t">
                                      <p className="text-muted-foreground">{item.answer}</p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : activeCategory && faqsByCategory[activeCategory] ? (
                    // Showing selected category
                    <>
                      <h2 className="text-2xl font-medium mb-6">{activeCategory}</h2>
                      <div className="space-y-4">
                        {faqsByCategory[activeCategory].map(item => (
                          <div 
                            key={item.id} 
                            className="border border-border rounded-lg overflow-hidden"
                          >
                            <button
                              onClick={() => toggleQuestion(item.id)}
                              className="flex items-center justify-between w-full p-4 text-left"
                            >
                              <h4 className="font-medium">{item.question}</h4>
                              {openQuestions[item.id] ? (
                                <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                              )}
                            </button>
                            
                            {openQuestions[item.id] && (
                              <div className="p-4 pt-0 border-t">
                                <p className="text-muted-foreground">{item.answer}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No FAQs available</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
        
        {/* Still Have Questions */}
        <section className="py-16 md:py-24 bg-secondary/10">
          <div className="container max-w-4xl mx-auto px-6 md:px-10 text-center">
            <h2 className="text-3xl font-medium mb-4">Still Have Questions?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Please reach out to our friendly support team.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/contact">Contact Support</Link>
              </Button>
              <Button size="lg" variant="outline">
                Live Chat
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
