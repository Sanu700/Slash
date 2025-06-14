import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useInView } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

// Press release data
const pressReleases = [
  {
    id: 'pr1',
    title: 'The Gift of Experiences: Why Memories Are Better Than Things',
    date: 'December 19, 2023',
    summary: 'Experiential gifts strengthen relationships, deepen gratitude, and create lasting memories—more so than physical gifts.',
    link: 'https://money.usnews.com/money/personal-finance/family-finance/articles/the-gift-of-experiences-why-memories-are-better-than-things?utm_source=chatgpt.com'
  },
  {
    id: 'pr2',
    title: 'Experiential Gifts Foster Stronger Social Relationships than Material Ones',
    date: 'December 23, 2016',
    summary: 'An academic but highly compelling study showing that people derive more social connection and happiness from experiences than possessions.',
    link: 'https://en.wikipedia.org/wiki/Thomas_Gilovich?utm_source=chatgpt.com'
  },
  {
    id: 'pr3',
    title: 'What Happens in Your Brain When You Give a Gift?',
    date: 'December 9, 2022',
    summary: 'A science-backed overview of how gift-giving activates pleasure and trust networks—useful to lend credibility and depth.',
    link: 'https://www.apa.org/topics/mental-health/brain-gift-giving?utm_source=chatgpt.com'
  }
];

// Media mentions
const mediaReleases = [
  {
    id: 'media1',
    title: 'I don\'t buy my kids gifts to unwrap - I buy them experiences',
    publication: 'The Daily Telegraph',
    date: 'Nov 19, 2024',
    image: '/dailytelegraph.svg',
    link: 'https://www.dailytelegraph.com.au/lifestyle/parenting/i-dont-buy-my-kids-gifts-to-unwrap-i-buy-them-experiences/news-story/eb8b92cea7033771aac1f3708a0301b6?utm_source=chatgpt.com'
  },
  {
    id: 'media2',
    title: 'One thing you need to do with your cash',
    publication: 'news.com.au',
    date: 'Dec 13, 2024',
    image: 'https://www.news.com.au/content/dam/images/1/5/0/3/5/0/image.related.articleLeadwide.620x349.150350.png/1688889600018.jpg',
    link: 'https://www.news.com.au/finance/money/wealth/proof-money-really-can-buy-happiness/news-story/3d6847d3b047921553f270ee0811c1fd?utm_source=chatgpt.com'
  },
  {
    id: 'media3',
    title: 'My parents gave my son an experience rather than a toy for his birthday. It was a game changer',
    publication: 'Business Insider',
    date: 'Apr 29, 2025',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Business_Insider_logo.svg/1200px-Business_Insider_logo.svg.png',
    link: 'https://www.businessinsider.com/grandparents-birthday-gift-experiences-instead-of-toys-2025-4?utm_source=chatgpt.com'
  }
];

const Press = () => {
  const [heroRef, heroInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [pressRef, pressInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [mediaRef, mediaInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [showAllPressReleases, setShowAllPressReleases] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <div 
          ref={heroRef}
          className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 md:py-24"
        >
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <div className={`max-w-2xl transition-all duration-700 ${heroInView ? "opacity-100" : "opacity-0 translate-y-8"}`}>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Press & Media</h1>
              <p className="text-xl mb-8">
                Find the latest news, press releases, media resources, and company information about Slash Experiences.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" variant="secondary" className="font-medium" asChild>
                  <a href="/press-kit.zip" download>Press Kit <Download className="w-4 h-4 ml-2" /></a>
                </Button>
                <Button size="lg" variant="secondary" className="font-medium" asChild>
                  <a href="mailto:press@slashexperiences.com">Media Inquiries</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Press Releases Section */}
        <section 
          ref={pressRef}
          className="py-16 md:py-24"
        >
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <h2 className={cn(
              "text-3xl font-medium mb-12 transition-all duration-700",
              pressInView ? "opacity-100" : "opacity-0 translate-y-8"
            )}>
              Press Releases
            </h2>
            
            <div className="space-y-8">
              {pressReleases.map((release, index) => (
                <div 
                  key={release.id}
                  className={cn(
                    "border-b border-border pb-8 last:border-0 transition-all duration-700",
                    pressInView ? "opacity-100" : "opacity-0 translate-y-8",
                    { "delay-100": index === 0, "delay-200": index === 1, "delay-300": index === 2 }
                  )}
                >
                  <div className="text-sm text-muted-foreground mb-2">
                    {release.date}
                  </div>
                  <h3 className="text-xl font-medium mb-3">
                    {release.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {release.summary}
                  </p>
                  <a 
                    href={release.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:text-primary/70"
                  >
                    Read Full Release
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <Button 
                variant="outline" 
                onClick={() => setShowAllPressReleases(!showAllPressReleases)}
              >
                {showAllPressReleases ? 'Show Less' : 'View All Press Releases'}
              </Button>
            </div>
          </div>
        </section>
        
        {/* Media Coverage Section */}
        <section 
          ref={mediaRef}
          className="py-16 md:py-24 bg-secondary/10"
        >
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <h2 className={cn(
              "text-3xl font-medium mb-12 transition-all duration-700",
              mediaInView ? "opacity-100" : "opacity-0 translate-y-8"
            )}>
              Media Coverage
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {mediaReleases.map((media, index) => (
                <a 
                  key={media.id}
                  href={media.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group",
                    "transition-all duration-700",
                    mediaInView ? "opacity-100" : "opacity-0 translate-y-8",
                    { "delay-100": index === 0, "delay-200": index === 1, "delay-300": index === 2 }
                  )}
                >
                  <div className="h-32 p-6 flex items-center justify-center bg-gray-100">
                    <img 
                      src={media.image}
                      alt={media.publication} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="text-sm text-muted-foreground mb-2 flex justify-between">
                      <span>{media.publication}</span>
                      <span>{media.date}</span>
                    </div>
                    <h3 className="font-medium mb-4 group-hover:text-primary transition-colors">
                      {media.title}
                    </h3>
                    <div className="flex items-center text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                      Read Article
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
        
        {/* Brand Assets Section */}
        <section className="py-16 md:py-24">
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-medium mb-4">Brand Assets</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Official logos, images, and brand guidelines for media use
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Logo Pack */}
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="bg-gray-100 p-8 flex items-center justify-center h-48">
                  <div className="text-4xl font-bold">Slash</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium mb-2">Logo Pack</h3>
                  <p className="text-muted-foreground mb-4">
                    Official logo in various formats (PNG, SVG, EPS) with light and dark variations.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/logos.zip" download>
                      <Download className="w-4 h-4 mr-2" />
                      Download Logos
                    </a>
                  </Button>
                </div>
              </div>
              
              {/* Product Images */}
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="bg-gray-100 p-8 flex items-center justify-center h-48">
                  <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
                    <div className="aspect-video bg-gray-300 rounded"></div>
                    <div className="aspect-video bg-gray-400 rounded"></div>
                    <div className="aspect-video bg-gray-400 rounded"></div>
                    <div className="aspect-video bg-gray-300 rounded"></div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium mb-2">Product Images</h3>
                  <p className="text-muted-foreground mb-4">
                    High-resolution screenshots and product images for media use.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/images.zip" download>
                      <Download className="w-4 h-4 mr-2" />
                      Download Images
                    </a>
                  </Button>
                </div>
              </div>
              
              {/* Brand Guidelines */}
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="bg-gray-100 p-8 flex items-center justify-center h-48">
                  <div className="w-32 h-40 bg-white shadow-md rounded flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-sm font-medium">Brand</div>
                      <div className="text-xs text-muted-foreground">Guidelines</div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium mb-2">Brand Guidelines</h3>
                  <p className="text-muted-foreground mb-4">
                    Comprehensive guide for proper brand usage, colors, typography, and tone of voice.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/brand-guidelines.pdf" download>
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section className="py-16 md:py-24 bg-primary text-white">
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-medium mb-4">Media Inquiries</h2>
              <p className="text-xl mb-8">
                For press inquiries, interview requests, or additional information, please contact our PR team.
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-2">Press Contact</h3>
                  <p className="text-white/80">
                    For general press inquiries and interview requests:
                  </p>
                  <a href="mailto:press@slashexperiences.com" className="text-white hover:underline">
                    press@slashexperiences.com
                  </a>
                </div>
                
                <div>
                  <Button className="bg-white text-primary hover:bg-white/90" size="lg" asChild>
                    <a href="mailto:press@slashexperiences.com">Contact Press Team</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Press;
