
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useInView } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

// FAQ data by category
const faqData = [
  {
    category: 'General',
    questions: [
      {
        id: 'q1',
        question: 'What is Slash Experiences?',
        answer: 'Slash Experiences is a curated marketplace for extraordinary experiences. We connect people with unique, high-quality experiences across various categories including adventure, dining, wellness, luxury, and learning. Our platform makes it easy to discover, book, and gift memorable experiences.'
      },
      {
        id: 'q2',
        question: 'How does Slash Experiences work?',
        answer: 'We partner with premium experience providers to offer a curated selection of activities. You can browse experiences by category, location, or occasion, then book for yourself or purchase as a gift. Recipients can easily redeem their gift and schedule at their convenience.'
      },
      {
        id: 'q3',
        question: 'Where are experiences available?',
        answer: 'We currently offer experiences in major cities across the United States and are continuously expanding. Each experience listing includes location details. You can use our search filters to find experiences in specific areas.'
      }
    ]
  },
  {
    category: 'Bookings & Reservations',
    questions: [
      {
        id: 'q4',
        question: 'How do I book an experience?',
        answer: 'Simply browse our experiences, select the one you want, choose your preferred date and time (if applicable), and complete the checkout process. You will receive a confirmation email with all the details about your booking.'
      },
      {
        id: 'q5',
        question: 'Can I reschedule my experience?',
        answer: 'Yes, most experiences can be rescheduled. The specific reschedule policy varies by experience and is clearly displayed on each experience page. Generally, you can reschedule up to 72 hours before the scheduled time without any fee.'
      },
      {
        id: 'q6',
        question: 'What happens if the weather is bad?',
        answer: 'For outdoor experiences affected by weather conditions, providers typically offer rescheduling options or alternative activities. The specific weather policy is listed on each experience page, and the provider will contact you directly if there are concerns about scheduled activities.'
      }
    ]
  },
  {
    category: 'Gift Experiences',
    questions: [
      {
        id: 'q7',
        question: 'How do I purchase an experience as a gift?',
        answer: 'When viewing an experience, simply select "Buy as Gift" during checkout. You can personalize the gift with a message and choose digital delivery (email) or a physical gift package. The recipient will receive instructions on how to redeem their experience.'
      },
      {
        id: 'q8',
        question: 'How long are gift vouchers valid?',
        answer: 'Most gift vouchers are valid for 12 months from the date of purchase. The expiration date is clearly displayed on the voucher. Some seasonal experiences may have different validity periods, which will be clearly indicated.'
      },
      {
        id: 'q9',
        question: 'Can the gift recipient exchange for a different experience?',
        answer: 'Yes! Recipients can exchange their gift for any experience of equal or lesser value. If they choose an experience of greater value, they can pay the difference. Exchanges can be made through our website or by contacting customer support.'
      }
    ]
  },
  {
    category: 'Payment & Pricing',
    questions: [
      {
        id: 'q10',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and Apple Pay. All transactions are processed securely using industry-standard encryption.'
      },
      {
        id: 'q11',
        question: 'Are there any hidden fees?',
        answer: 'No, the price you see is the price you pay. All applicable taxes and fees are included in the displayed price. There are no hidden charges or booking fees added at checkout.'
      },
      {
        id: 'q12',
        question: 'Do you offer refunds?',
        answer: 'Our refund policy varies by experience. Generally, full refunds are available if canceled within 14 days of purchase and at least 72 hours before the scheduled experience. Specific refund policies are displayed on each experience page before purchase.'
      }
    ]
  },
  {
    category: 'Account & Support',
    questions: [
      {
        id: 'q13',
        question: 'How do I create an account?',
        answer: 'Click on the "Sign Up" button in the top right corner of our website. You can create an account using your email address or sign in with your Google or Facebook account. Having an account allows you to track your bookings, save favorite experiences, and manage your profile.'
      },
      {
        id: 'q14',
        question: 'How do I contact customer support?',
        answer: 'Our customer support team is available via email at support@slashexperiences.com, by phone at +1 (555) 123-4567, or through the live chat feature on our website. Support hours are Monday-Friday 9am-8pm, Saturday 10am-6pm, and Sunday 12pm-5pm EST.'
      },
      {
        id: 'q15',
        question: 'Can I leave a review for an experience?',
        answer: 'Yes! After you have completed an experience, you will receive an email invitation to share your feedback. You can rate the experience and write a review that will help other customers make informed decisions. We value honest reviews from our community.'
      }
    ]
  }
];

const FAQ = () => {
  const [heroRef, heroInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [activeCategory, setActiveCategory] = useState('General');
  const [searchQuery, setSearchQuery] = useState('');
  const [openQuestions, setOpenQuestions] = useState<{[key: string]: boolean}>({});
  
  // Toggle question open/closed state
  const toggleQuestion = (id: string) => {
    setOpenQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Filter questions based on search query
  const filteredFAQs = searchQuery 
    ? faqData.map(category => ({
        ...category,
        questions: category.questions.filter(q => 
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : faqData;

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
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Categories Sidebar */}
              {!searchQuery && (
                <div className="lg:w-1/4">
                  <h2 className="text-xl font-medium mb-6">Categories</h2>
                  <div className="space-y-2">
                    {faqData.map(category => (
                      <button
                        key={category.category}
                        onClick={() => setActiveCategory(category.category)}
                        className={cn(
                          "block w-full text-left px-4 py-2 rounded-lg transition-colors",
                          activeCategory === category.category
                            ? "bg-primary text-white"
                            : "hover:bg-secondary/50"
                        )}
                      >
                        {category.category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* FAQ Questions */}
              <div className={searchQuery ? "w-full" : "lg:w-3/4"}>
                {searchQuery ? (
                  // Showing search results
                  <>
                    <h2 className="text-xl font-medium mb-6">
                      {filteredFAQs.length > 0 
                        ? `Search Results (${filteredFAQs.reduce((total, cat) => total + cat.questions.length, 0)})`
                        : "No matching questions found"
                      }
                    </h2>
                    <div className="space-y-8">
                      {filteredFAQs.map(category => (
                        <div key={category.category}>
                          <h3 className="text-lg font-medium mb-4 border-b pb-2">{category.category}</h3>
                          <div className="space-y-4">
                            {category.questions.map(item => (
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
                ) : (
                  // Showing selected category
                  <>
                    <h2 className="text-2xl font-medium mb-6">{activeCategory}</h2>
                    <div className="space-y-4">
                      {faqData.find(cat => cat.category === activeCategory)?.questions.map(item => (
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
                )}
              </div>
            </div>
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
