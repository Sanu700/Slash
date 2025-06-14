import React from 'react';
import { useInView } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Building2, Briefcase, Users2, Globe, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const jobOpenings = [/* ...unchanged job listings... */];

const Careers = () => {
  const [heroRef, heroInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [cultureRef, cultureInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [jobsRef, jobsInView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <>
      {/* Hero Section */}
      <div ref={heroRef} className="relative bg-gradient-to-r from-indigo-800 to-purple-700 text-white py-16 md:py-24">
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
            {/* Benefit Cards */}
            {[
              {
                icon: <Globe className="w-6 h-6" />,
                title: "Meaningful Impact",
                desc: "Work on a product that brings joy and creates lasting memories for thousands of people every day."
              },
              {
                icon: <Users2 className="w-6 h-6" />,
                title: "Amazing Team",
                desc: "Join a diverse team of passionate individuals who value collaboration, creativity, and excellence."
              },
              {
                icon: <Heart className="w-6 h-6" />,
                title: "Great Benefits",
                desc: "Enjoy competitive compensation, health benefits, flexible PTO, and regular team experiences."
              },
              {
                icon: <Building2 className="w-6 h-6" />,
                title: "Growth Opportunities",
                desc: "Develop your skills in a fast-growing company with clear paths for advancement and professional development."
              },
              {
                icon: <BadgeCheck className="w-6 h-6" />,
                title: "Experience Perks",
                desc: "Regular opportunities to try our curated experiences and contribute to our experience research."
              },
              {
                icon: <Briefcase className="w-6 h-6" />,
                title: "Work Flexibility",
                desc: "Flexible work arrangements including remote options and focus on work-life balance."
              }
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                  {icon}
                </div>
                <h3 className="text-xl font-medium mb-3">{title}</h3>
                <p className="text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Culture Section */}
      <section ref={cultureRef} className="py-16 md:py-24 bg-secondary/10">
        <div className="container max-w-6xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className={cn(
                "text-3xl font-medium mb-6 transition-all duration-700",
                cultureInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}>Our Culture</h2>
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
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                "https://images.unsplash.com/photo-1515187029135-18ee286d815b",
                "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
                "https://images.unsplash.com/photo-1531545514256-b1400bc00f31",
                "https://images.unsplash.com/photo-1543269865-cbf427effbad"
              ].map((src, index) => (
                <div key={index} className={cn(
                  "rounded-xl overflow-hidden transition-all duration-700",
                  cultureInView ? "opacity-100" : "opacity-0 translate-x-8"
                )} style={{ transitionDelay: `${200 + index * 100}ms` }}>
                  <img
                    src={`${src}?w=600&auto=format&fit=crop`}
                    alt="Team activity"
                    className="w-full h-full object-cover"
                    style={{ width: '248px', height: '165.33px' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Careers;
