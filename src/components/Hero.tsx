<div className={cn(
  "transition-all duration-1000 transform",
  isInView ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
)}>
  <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4 sm:mb-6">
    <img 
      src="/lovable-uploads/5c4b2b72-9668-4671-9be9-84c7371c459a.png" 
      alt="Slash logo" 
      className="h-4 w-4" 
    />
    <span className="text-sm font-medium">Curated Experience Gifts</span>
  </div>

  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight text-shadow">
    Gifting Something, <br />
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
      That Matters
    </span>
  </h1>

  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white mb-6 sm:mb-8 max-w-2xl text-shadow">
    92% of all people prefer an Experience over a Material gift and 63% forget what they received a year back.
  </p>

  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8">
    <SuggestedExperiences />
    
    <NavLink to="/gifting-guide" onClick={scrollToTop} className="w-full sm:w-auto">
      <Button 
        size="lg" 
        variant="outline" 
        className="w-full sm:w-auto border-white text-base transition-all bg-gray-50 text-gray-950"
      >
        Gift Inspiration
      </Button>
    </NavLink>
  </div>

  <div className={cn(
    "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl transition-all duration-1000 delay-300",
    isInView ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
  )}>
    {[
      { value: "500+", label: "Experiences" },
      { value: "50k+", label: "Happy Recipients" },
      { value: "4.9", label: "Average Rating" },
      { value: "100%", label: "Satisfaction" }
    ].map((stat, index) => (
      <div key={index} className="backdrop-blur-sm bg-white/20 rounded-lg p-4 md:p-6">
        <p className="text-2xl md:text-3xl font-medium">
          <AnimatedCounter value={stat.value} />
        </p>
        <p className="text-sm text-white/90">{stat.label}</p>
      </div>
    ))}
  </div>
</div>
