return (
  <div className="min-h-screen flex flex-col">
    <Navbar />

    <main className="flex-1 bg-background pt-24">
      <div 
        ref={ref}
        className="container max-w-6xl mx-auto px-6 md:px-10 py-12"
      >
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className={cn(
              "mb-8 mt-8 transition-all duration-500",
              isInView ? "opacity-100" : "opacity-0 translate-y-8"
            )}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search experiences by title, description or location..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
              </div>
            </div>

            {/* Filters and Sorting */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div className={cn(
                "transition-all duration-700",
                isInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}>
                <h2 className="text-2xl font-medium">
                  {filteredExperiences.length} Experiences
                </h2>
              </div>

              <div className={cn(
                "flex items-center space-x-4 transition-all duration-700 delay-100",
                isInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}>
                <div className="flex items-center bg-secondary/50 rounded-lg p-1">
                  <button 
                    onClick={() => handleSortChange('default')}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-md transition-colors",
                      sortOrder === 'default' ? "bg-white text-black" : "text-muted-foreground"
                    )}
                  >
                    Featured
                  </button>
                  <button 
                    onClick={() => handleSortChange('price-low')}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-md transition-colors",
                      sortOrder === 'price-low' ? "bg-white text-black" : "text-muted-foreground"
                    )}
                  >
                    Price: Low to High
                  </button>
                  <button 
                    onClick={() => handleSortChange('price-high')}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-md transition-colors",
                      sortOrder === 'price-high' ? "bg-white text-black" : "text-muted-foreground"
                    )}
                  >
                    Price: High to Low
                  </button>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsFilterOpen(true)}
                  className={cn(
                    activeFilters && "border-primary text-primary"
                  )}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="ml-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Experiences Grid */}
            {currentExperiences.length > 0 ? (
              <div className={cn(
                "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 stagger-children",
                isInView ? "opacity-100" : "opacity-0"
              )}>
                {currentExperiences.map((experience) => (
                  <ExperienceCard key={experience.id} experience={experience} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl mb-2">No matching experiences found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search criteria</p>
                <Button onClick={() => {
                  setSearchTerm('');
                  setActiveFilters(null);
                }}>
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {filteredExperiences.length > experiencesPerPage && renderPagination()}
          </>
        )}
      </div>
    </main>
  </div>
);
