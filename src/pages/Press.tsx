
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useInView } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

// Press release data
const pressReleases = [
  {
    id: 'pr1',
    title: 'Slash Experiences Raises $10M Series A to Expand Experience Marketplace',
    date: 'May 15, 2025',
    summary: 'Funding will support expansion into new markets and enhancement of the digital gifting platform.',
    link: '#'
  },
  {
    id: 'pr2',
    title: 'Slash Experiences Launches New Mobile App for Seamless Booking',
    date: 'March 3, 2025',
    summary: 'New app allows users to discover, book, and gift experiences directly from their mobile devices.',
    link: '#'
  },
  {
    id: 'pr3',
    title: 'Slash Experiences Partners with Premium Hotels for Exclusive Packages',
    date: 'January 20, 2025',
    summary: 'Strategic partnership brings luxury hotel packages to the Slash Experiences marketplace.',
    link: '#'
  }
];

// Media mentions
const mediaReleases = [
  {
    id: 'media1',
    title: '"The Future of Gifting" - How Slash Experiences is Changing Consumer Habits',
    publication: 'Forbes',
    date: 'April 10, 2025',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Forbes_logo.svg/2560px-Forbes_logo.svg.png',
    link: '#'
  },
  {
    id: 'media2',
    title: 'Top 10 Experience Gift Ideas for 2025',
    publication: 'The New York Times',
    date: 'February 8, 2025',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/77/The_New_York_Times_logo.png',
    link: '#'
  },
  {
    id: 'media3',
    title: 'Meet the Startup Making Memory-Making a Business',
    publication: 'TechCrunch',
    date: 'December 12, 2024',
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/b9/TechCrunch_logo.svg',
    link: '#'
  }
];

const Press = () => {
  const [heroRef, heroInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [pressRef, pressInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [mediaRef, mediaInView] = useInView<HTMLDivElement>({ threshold: 0.1 });

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
                <Button size="lg" variant="secondary" className="font-medium">
                  Press Kit
                  <Download className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:text-white hover:bg-white/10">
                  Media Inquiries
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
                    className="inline-flex items-center text-primary hover:text-primary/70 font-medium"
                  >
                    Read Full Release
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <Button variant="outline">View All Press Releases</Button>
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
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Logos
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
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Images
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
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
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
                  <Button className="bg-white text-primary hover:bg-white/90" size="lg">Contact Press Team</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Press;
