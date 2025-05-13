
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { categories } from '@/lib/data';
import { useInView } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

const CategorySection = () => {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <section 
      id="categories"
      ref={ref} 
      className="py-20 md:py-28"
    >
      <div className="container max-w-6xl mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <h2 
            className={cn(
              "text-3xl md:text-4xl font-medium mb-4 transition-all duration-700",
              isInView ? "opacity-100" : "opacity-0 translate-y-8"
            )}
          >
            Browse by Category
          </h2>
          <p 
            className={cn(
              "text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-700 delay-100",
              isInView ? "opacity-100" : "opacity-0 translate-y-8"
            )}
          >
            Discover the perfect experience gift by exploring our curated categories
          </p>
        </div>

        <div 
          className={cn(
            "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 stagger-children",
            isInView ? "opacity-100" : "opacity-0"
          )}
        >
          {categories.map((category, index) => (
            <Link 
              key={category.id}
              to={`/category/${category.id}`}
              className="group relative overflow-hidden rounded-xl cursor-pointer hover-lift"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {/* Background Image */}
              <div className="aspect-[3/4] rounded-xl overflow-hidden">
                <img 
                  src={category.imageUrl}
                  alt={category.name}
                  className={cn(
                    "h-full w-full object-cover transition-transform duration-700",
                    hoveredCategory === category.id ? "scale-110" : "scale-100"
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </div>
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <div className={cn(
                  "rounded-full bg-white/10 backdrop-blur-sm w-12 h-12 flex items-center justify-center mb-4 transition-transform duration-300",
                  hoveredCategory === category.id ? "scale-110" : "scale-100"
                )}>
                  <category.icon className="h-6 w-6" />
                </div>
                
                <h3 className="text-xl font-medium mb-2">{category.name}</h3>
                
                <p className={cn(
                  "text-sm text-white/80 mb-3 transition-opacity duration-300",
                  hoveredCategory === category.id ? "opacity-100" : "opacity-70"
                )}>
                  {category.description}
                </p>
                
                <div className={cn(
                  "flex items-center text-sm font-medium transition-all duration-300",
                  hoveredCategory === category.id ? "translate-x-2" : "translate-x-0"
                )}>
                  <span>Explore</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
