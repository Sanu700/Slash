import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useInView } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Building2, Briefcase, Users2, Globe, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

// Current job openings
const jobOpenings = [
  {
    id: 'job1',
    title: 'Experience Curator',
    department: 'Product',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description: 'Source and evaluate potential experience partners to add to our platform, ensuring all experiences meet our quality standards.'
  },
  {
    id: 'job2',
    title: 'Customer Experience Specialist',
    department: 'Customer Support',
    location: 'Remote',
    type: 'Full-time',
    description: 'Provide exceptional support to our customers before, during, and after their experiences, ensuring their needs are met.'
  },
  {
    id: 'job3',
    title: 'Marketing Specialist',
    department: 'Marketing',
    location: 'New York, NY',
    type: 'Full-time',
    description: 'Create and implement marketing strategies to promote our experiences and increase brand awareness.'
  },
  {
    id: 'job4',
    title: 'Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Build and maintain our web platform using modern technologies to create a seamless user experience.'
  },
  {
    id: 'job5',
    title: 'Partnership Manager',
    department: 'Business Development',
    location: 'Los Angeles, CA',
    type: 'Full-time',
    description: 'Establish and maintain relationships with experience providers and corporate partners.'
  }
];

const Careers = () => {
  const [heroRef, heroInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [cultureRef, cultureInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [jobsRef, jobsInView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <div 
          ref={heroRef}
          className="relative bg-gradient-to-r from-indigo-800 to-purple-700 text-white py-16 md:py-24"
        >
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <div className={`max-w-2xl transition-all duration-700 ${heroInView ? "opacity-100" : "opacity-0 translate-y-8"}`}>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Team</h1>
              <p className="text-xl mb-8">
                Help us revolutionize the way people discover and experience extraordinary moments.
                We're looking for passionate individuals to join our mission.
              </p>
              <Button size="lg" variant="secondary" className="font-medium" asChild>
                <a href="#openings">View Open Positions</a>
              </Button>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="hidden md:block absolute right-10 bottom-10 opacity-20">
            <div className="w-48 h-48 border-2 border-white/50 rounded-full"></div>
            <div className="w-32 h-32 border-2 border-white/50 rounded-full absolute -top-10 -left-10"></div>
          </div>
        </div>
        
        {/* Why Join Us Section */}
        <section className="py-16 md:py-24">
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-medium mb-4">Why Join Slash Experiences?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We're building a team of passionate individuals who are excited about creating meaningful experiences
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Benefit 1 */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">Meaningful Impact</h3>
                <p className="text-muted-foreground">
                  Work on a product that brings joy and creates lasting memories for thousands of people every day.
                </p>
              </div>
              
              {/* Benefit 2 */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                  <Users2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">Amazing Team</h3>
                <p className="text-muted-foreground">
                  Join a diverse team of passionate individuals who value collaboration, creativity, and excellence.
                </p>
              </div>
              
              {/* Benefit 3 */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">Great Benefits</h3>
                <p className="text-muted-foreground">
                  Enjoy competitive compensation, health benefits, flexible PTO, and regular team experiences.
                </p>
              </div>
              
              {/* Benefit 4 */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">Growth Opportunities</h3>
                <p className="text-muted-foreground">
                  Develop your skills in a fast-growing company with clear paths for advancement and professional development.
                </p>
              </div>
              
              {/* Benefit 5 */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                  <BadgeCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">Experience Perks</h3>
                <p className="text-muted-foreground">
                  Regular opportunities to try our curated experiences and contribute to our experience research.
                </p>
              </div>
              
              {/* Benefit 6 */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">Work Flexibility</h3>
                <p className="text-muted-foreground">
                  Flexible work arrangements including remote options and focus on work-life balance.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Culture Section */}
        <section 
          ref={cultureRef}
          className="py-16 md:py-24 bg-secondary/10"
        >
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className={cn(
                  "text-3xl font-medium mb-6 transition-all duration-700",
                  cultureInView ? "opacity-100" : "opacity-0 translate-y-8"
                )}>
                  Our Culture
                </h2>
                <p className={cn(
                  "text-lg text-muted-foreground mb-6 transition-all duration-700 delay-100",
                  cultureInView ? "opacity-100" : "opacity-0 translate-y-8"
                )}>
                  At Slash Experiences, we believe in creating an environment where passionate people can do their best work. Our culture is built around these core values:
                </p>
                
                <ul className="space-y-4">
                  <li className={cn(
                    "flex items-start transition-all duration-700 delay-200",
                    cultureInView ? "opacity-100" : "opacity-0 translate-y-8"
                  )}>
                    <BadgeCheck className="w-6 h-6 text-primary mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-medium">Customer Delight</h3>
                      <p className="text-muted-foreground">We're obsessed with creating exceptional experiences for our customers at every touchpoint.</p>
                    </div>
                  </li>
                  
                  <li className={cn(
                    "flex items-start transition-all duration-700 delay-300",
                    cultureInView ? "opacity-100" : "opacity-0 translate-y-8"
                  )}>
                    <BadgeCheck className="w-6 h-6 text-primary mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-medium">Authentic Connection</h3>
                      <p className="text-muted-foreground">We foster genuine relationships with customers, partners, and team members.</p>
                    </div>
                  </li>
                  
                  <li className={cn(
                    "flex items-start transition-all duration-700 delay-400",
                    cultureInView ? "opacity-100" : "opacity-0 translate-y-8"
                  )}>
                    <BadgeCheck className="w-6 h-6 text-primary mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-medium">Continual Innovation</h3>
                      <p className="text-muted-foreground">We're always looking for new ways to improve our offerings and operations.</p>
                    </div>
                  </li>
                  
                  <li className={cn(
                    "flex items-start transition-all duration-700 delay-500",
                    cultureInView ? "opacity-100" : "opacity-0 translate-y-8"
                  )}>
                    <BadgeCheck className="w-6 h-6 text-primary mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-medium">Embracing Diversity</h3>
                      <p className="text-muted-foreground">We celebrate diverse perspectives and backgrounds, knowing they make us stronger.</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className={cn(
                  "rounded-xl overflow-hidden transition-all duration-700 delay-200",
                  cultureInView ? "opacity-100" : "opacity-0 translate-x-8"
                )}>
                  <img 
                    src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop"
                    alt="Team collaboration" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={cn(
                  "rounded-xl overflow-hidden mt-8 transition-all duration-700 delay-300",
                  cultureInView ? "opacity-100" : "opacity-0 translate-x-8"
                )}>
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop"
                    alt="Team planning" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={cn(
                  "rounded-xl overflow-hidden transition-all duration-700 delay-400",
                  cultureInView ? "opacity-100" : "opacity-0 translate-x-8"
                )}>
                  <img 
                    src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=600&auto=format&fit=crop"
                    alt="Team celebration" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={cn(
                  "rounded-xl overflow-hidden mt-8 transition-all duration-700 delay-500",
                  cultureInView ? "opacity-100" : "opacity-0 translate-x-8"
                )}>
                  <img 
                    src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&auto=format&fit=crop"
                    alt="Team working" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Open Positions Section */}
        <section 
          id="openings"
          ref={jobsRef}
          className="py-16 md:py-24"
        >
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <div className="text-center mb-16">
              <h2 className={cn(
                "text-3xl font-medium mb-4 transition-all duration-700",
                jobsInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}>
                Open Positions
              </h2>
              <p className={cn(
                "text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-700 delay-100",
                jobsInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}>
                Join our team and help us create extraordinary experiences for our customers
              </p>
            </div>
            
            <div className="space-y-6">
              {jobOpenings.map((job, index) => (
                <div 
                  key={job.id}
                  className={cn(
                    "border border-border rounded-xl overflow-hidden transition-all duration-700",
                    jobsInView ? "opacity-100" : "opacity-0 translate-y-8",
                    { "delay-100": index === 0, "delay-200": index === 1, "delay-300": index === 2, 
                      "delay-400": index === 3, "delay-500": index === 4 }
                  )}
                >
                  <div className="bg-muted p-6 flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h3 className="text-xl font-medium mb-1">{job.title}</h3>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className="bg-secondary/50 text-foreground px-2 py-0.5 rounded-full">{job.department}</span>
                        <span className="bg-secondary/50 text-foreground px-2 py-0.5 rounded-full">{job.location}</span>
                        <span className="bg-secondary/50 text-foreground px-2 py-0.5 rounded-full">{job.type}</span>
                      </div>
                    </div>
                    <Button className="mt-4 md:mt-0" variant="secondary" asChild>
                      <a href={`mailto:careers@slashexperiences.com?subject=Application for ${encodeURIComponent(job.title)}`}>Apply Now</a>
                    </Button>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-muted-foreground">{job.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* No Positions Message */}
            <div className="mt-12 text-center">
              <p className="text-lg mb-6">Don't see a position that matches your skills?</p>
              <Button variant="outline" asChild>
                <a href="mailto:careers@slashexperiences.com?subject=General%20Resume%20Submission">Submit Your Resume</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Careers;
