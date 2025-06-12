
import { useState } from 'react';
import { useInView } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const Newsletter = () => {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // Here you would typically send this to your backend
      console.log('Subscribed email:', email);
    }
  };

  return (
    <section 
      ref={ref} 
      className="py-20 md:py-28 bg-primary text-white"
    >
      <div className="container max-w-6xl mx-auto px-6 md:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <h2 
            className={cn(
              "text-3xl md:text-4xl font-medium mb-4 transition-all duration-700",
              isInView ? "opacity-100" : "opacity-0 translate-y-8"
            )}
          >
            Get Inspired
          </h2>
          <p 
            className={cn(
              "text-lg text-white/80 mb-8 transition-all duration-700 delay-100",
              isInView ? "opacity-100" : "opacity-0 translate-y-8"
            )}
          >
            Join our newsletter for exclusive offers and the latest experience gift ideas
          </p>
          
          <form 
            onSubmit={handleSubmit}
            className={cn(
              "flex flex-col sm:flex-row gap-3 max-w-md mx-auto transition-all duration-700 delay-200",
              isInView ? "opacity-100" : "opacity-0 translate-y-8"
            )}
          >
            {!isSubmitted ? (
              <>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white/30"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button 
                  type="submit" 
                  className="bg-white text-primary hover:bg-white/90 sm:w-auto"
                >
                  Subscribe
                </Button>
              </>
            ) : (
              <div 
                className="w-full flex items-center justify-center p-3 bg-white/10 rounded-md text-white"
              >
                <Check className="h-5 w-5 mr-2 text-green-400" />
                <span>Thank you for subscribing!</span>
              </div>
            )}
          </form>
          
          <p 
            className={cn(
              "text-sm text-white/60 mt-4 transition-all duration-700 delay-300",
              isInView ? "opacity-100" : "opacity-0 translate-y-8"
            )}
          >
            We respect your privacy and will never share your information.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
