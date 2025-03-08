
import { useState } from 'react';
import { useExperiencesManager } from '@/lib/data';
import { Experience } from '@/lib/data/experiences';
import { categories, nicheCategories } from '@/lib/data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Download, Upload, RotateCcw, PlusIcon, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useInView } from '@/lib/animations';
import { formatRupees } from '@/lib/formatters';

const ExperienceManager = () => {
  const {
    experiences,
    addExperience,
    updateExperience,
    deleteExperience,
    resetExperiences,
    importExperiences,
    exportExperiences
  } = useExperiencesManager();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Experience>>({});
  const [importText, setImportText] = useState('');
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  // Filter experiences based on search term
  const filteredExperiences = experiences.filter(exp => 
    exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectExperience = (experience: Experience) => {
    setSelectedExperience(experience);
    setFormData(experience);
    setIsEditMode(false);
  };

  const handleCreateNew = () => {
    setSelectedExperience(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      price: 0,
      location: '',
      duration: '',
      participants: '',
      date: '',
      category: '',
      nicheCategory: '',
      trending: false,
      featured: false,
      romantic: false,
      adventurous: false,
      group: false
    });
    setIsEditMode(true);
  };

  const handleEditExisting = () => {
    if (selectedExperience) {
      setFormData(selectedExperience);
      setIsEditMode(true);
    }
  };

  const handleDeleteExperience = () => {
    if (selectedExperience) {
      if (window.confirm(`Are you sure you want to delete "${selectedExperience.title}"?`)) {
        deleteExperience(selectedExperience.id);
        setSelectedExperience(null);
        toast.success('Experience deleted successfully');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Experience) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    });
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Experience) => {
    setFormData({
      ...formData,
      [field]: parseInt(e.target.value, 10) || 0
    });
  };

  const handleSelectChange = (value: string, field: keyof Experience) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleCheckboxChange = (checked: boolean, field: keyof Experience) => {
    setFormData({
      ...formData,
      [field]: checked
    });
  };

  const handleSaveExperience = () => {
    if (!formData.title || !formData.description || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (selectedExperience) {
      // Update existing experience
      updateExperience(selectedExperience.id, formData);
      setSelectedExperience({...selectedExperience, ...formData} as Experience);
      toast.success('Experience updated successfully');
    } else {
      // Create new experience
      const newExperience = addExperience(formData as Omit<Experience, 'id'>);
      setSelectedExperience(newExperience as Experience);
      toast.success('Experience created successfully');
    }
    setIsEditMode(false);
  };

  const handleCancel = () => {
    if (selectedExperience) {
      setFormData(selectedExperience);
    } else {
      setFormData({});
    }
    setIsEditMode(false);
  };

  const handleImport = () => {
    if (!importText.trim()) {
      toast.error('Please paste JSON data to import');
      return;
    }

    const result = importExperiences(importText);
    if (result.success) {
      toast.success(result.message);
      setImportText('');
    } else {
      toast.error(result.message);
    }
  };

  const handleExport = () => {
    const jsonData = exportExperiences();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'slash-experiences.json';
    a.click();
    
    URL.revokeObjectURL(url);
    toast.success('Experiences exported successfully');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all experiences to default? This cannot be undone.')) {
      resetExperiences();
      setSelectedExperience(null);
      toast.success('Experiences have been reset to default');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-20 md:pt-24">
        {/* Hero Section */}
        <div className="relative h-[20vh] md:h-[30vh] w-full">
          <img 
            src="https://images.unsplash.com/photo-1579389083078-4e7018379f7e?q=80&w=3270&auto=format&fit=crop"
            alt="Experience Manager"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute top-6 left-6">
            <Link to="/" className="bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-colors">
              <ArrowLeft className="h-5 w-5 text-white" />
            </Link>
          </div>
          
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-6">
            <h1 className="text-3xl md:text-4xl font-medium mb-2">Experience Manager</h1>
            <p className="max-w-2xl text-white/80">
              Create, edit, and manage your experiences without touching code
            </p>
          </div>
        </div>
        
        <div 
          ref={ref}
          className="container max-w-6xl mx-auto px-6 md:px-10 py-12"
        >
          <Tabs defaultValue="experiences" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="experiences">Manage Experiences</TabsTrigger>
              <TabsTrigger value="import-export">Import & Export</TabsTrigger>
            </TabsList>
            
            <TabsContent value="experiences" className="space-y-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left column: Experience List */}
                <div className="w-full lg:w-1/3">
                  <div className="bg-secondary/20 rounded-xl p-6 sticky top-24">
                    <div className="mb-6">
                      <Input
                        type="search"
                        placeholder="Search experiences..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="mb-4"
                      />
                      
                      <Button onClick={handleCreateNew} className="w-full">
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Create New Experience
                      </Button>
                    </div>
                    
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                      {filteredExperiences.length > 0 ? (
                        filteredExperiences.map(exp => (
                          <div 
                            key={exp.id}
                            onClick={() => handleSelectExperience(exp)}
                            className={cn(
                              "p-3 rounded-lg cursor-pointer transition-colors",
                              selectedExperience?.id === exp.id 
                                ? "bg-primary text-primary-foreground" 
                                : "hover:bg-secondary"
                            )}
                          >
                            <h3 className="font-medium truncate">{exp.title}</h3>
                            <div className="flex items-center justify-between text-sm mt-1">
                              <span className="capitalize">{exp.category}</span>
                              <span>{formatRupees(exp.price)}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-muted-foreground py-4">
                          No experiences found. Try adjusting your search or create a new one.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Right column: Experience Details/Editor */}
                <div className="w-full lg:w-2/3">
                  {isEditMode ? (
                    // Edit Form
                    <Card>
                      <CardHeader>
                        <CardTitle>{selectedExperience ? 'Edit Experience' : 'Create New Experience'}</CardTitle>
                        <CardDescription>
                          {selectedExperience ? 'Update the details of this experience' : 'Fill in the details to create a new experience'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="title">Title *</Label>
                            <Input 
                              id="title"
                              value={formData.title || ''}
                              onChange={(e) => handleInputChange(e, 'title')}
                              placeholder="Experience title"
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="description">Description *</Label>
                            <Textarea 
                              id="description"
                              value={formData.description || ''}
                              onChange={(e) => handleInputChange(e, 'description')}
                              placeholder="Experience description"
                              rows={3}
                              required
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="price">Price (in paise) *</Label>
                              <Input 
                                id="price"
                                type="number"
                                value={formData.price || 0}
                                onChange={(e) => handleNumberInputChange(e, 'price')}
                                placeholder="Price in paise (₹100 = 10000)"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="imageUrl">Image URL *</Label>
                              <Input 
                                id="imageUrl"
                                value={formData.imageUrl || ''}
                                onChange={(e) => handleInputChange(e, 'imageUrl')}
                                placeholder="https://example.com/image.jpg"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="location">Location *</Label>
                              <Input 
                                id="location"
                                value={formData.location || ''}
                                onChange={(e) => handleInputChange(e, 'location')}
                                placeholder="Location"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="duration">Duration *</Label>
                              <Input 
                                id="duration"
                                value={formData.duration || ''}
                                onChange={(e) => handleInputChange(e, 'duration')}
                                placeholder="e.g., 2 hours"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="participants">Participants *</Label>
                              <Input 
                                id="participants"
                                value={formData.participants || ''}
                                onChange={(e) => handleInputChange(e, 'participants')}
                                placeholder="e.g., 2 people"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="date">Date/Availability *</Label>
                              <Input 
                                id="date"
                                value={formData.date || ''}
                                onChange={(e) => handleInputChange(e, 'date')}
                                placeholder="e.g., Weekends, Year-round"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="category">Category *</Label>
                              <Select 
                                value={formData.category || ''} 
                                onValueChange={(value) => handleSelectChange(value, 'category')}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map(cat => (
                                    <SelectItem key={cat.id} value={cat.name.toLowerCase()}>
                                      {cat.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="nicheCategory">Niche Category</Label>
                              <Select 
                                value={formData.nicheCategory || ''} 
                                onValueChange={(value) => handleSelectChange(value, 'nicheCategory')}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a niche category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {nicheCategories.map(niche => (
                                    <SelectItem key={niche.id} value={niche.name}>
                                      {niche.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="trending" 
                                checked={formData.trending || false}
                                onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, 'trending')}
                              />
                              <Label htmlFor="trending">Trending</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="featured" 
                                checked={formData.featured || false}
                                onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, 'featured')}
                              />
                              <Label htmlFor="featured">Featured</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="romantic" 
                                checked={formData.romantic || false}
                                onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, 'romantic')}
                              />
                              <Label htmlFor="romantic">Romantic</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="adventurous" 
                                checked={formData.adventurous || false}
                                onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, 'adventurous')}
                              />
                              <Label htmlFor="adventurous">Adventurous</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="group" 
                                checked={formData.group || false}
                                onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, 'group')}
                              />
                              <Label htmlFor="group">Group Activity</Label>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                        <Button onClick={handleSaveExperience}>
                          {selectedExperience ? 'Save Changes' : 'Create Experience'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ) : (
                    // Experience Details View
                    selectedExperience ? (
                      <Card>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{selectedExperience.title}</CardTitle>
                              <CardDescription className="capitalize mt-1">{selectedExperience.category}</CardDescription>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={handleEditExisting}>
                                <Pencil className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button variant="destructive" size="sm" onClick={handleDeleteExperience}>
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Image */}
                          <div className="rounded-lg overflow-hidden h-48 bg-secondary">
                            {selectedExperience.imageUrl ? (
                              <img 
                                src={selectedExperience.imageUrl} 
                                alt={selectedExperience.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                No image available
                              </div>
                            )}
                          </div>
                          
                          {/* Details */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Price</h3>
                              <p>{formatRupees(selectedExperience.price)}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                              <p>{selectedExperience.location}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
                              <p>{selectedExperience.duration}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Participants</h3>
                              <p>{selectedExperience.participants}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Availability</h3>
                              <p>{selectedExperience.date}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground">Niche</h3>
                              <p>{selectedExperience.nicheCategory || 'None'}</p>
                            </div>
                          </div>
                          
                          {/* Description */}
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                            <p>{selectedExperience.description}</p>
                          </div>
                          
                          {/* Tags */}
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedExperience.trending && (
                                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Trending</span>
                              )}
                              {selectedExperience.featured && (
                                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Featured</span>
                              )}
                              {selectedExperience.romantic && (
                                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Romantic</span>
                              )}
                              {selectedExperience.adventurous && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Adventurous</span>
                              )}
                              {selectedExperience.group && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Group Activity</span>
                              )}
                            </div>
                          </div>
                          
                          {/* ID for reference */}
                          <div className="text-xs text-muted-foreground border-t pt-4 mt-4">
                            <span>Experience ID: {selectedExperience.id}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-96 text-center">
                        <div className="text-muted-foreground mb-4">
                          Select an experience from the list or create a new one
                        </div>
                        <Button onClick={handleCreateNew}>
                          <PlusIcon className="mr-2 h-4 w-4" />
                          Create New Experience
                        </Button>
                      </div>
                    )
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="import-export" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Import */}
                <Card>
                  <CardHeader>
                    <CardTitle>Import Experiences</CardTitle>
                    <CardDescription>
                      Paste JSON data to import experiences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      placeholder="Paste JSON data here..."
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                      rows={10}
                      className="font-mono text-sm"
                    />
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleImport} className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Import
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Export */}
                <Card>
                  <CardHeader>
                    <CardTitle>Export & Reset</CardTitle>
                    <CardDescription>
                      Export your experiences or reset to defaults
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-secondary/20 rounded-lg text-center">
                      <p className="mb-4">Export your experiences as JSON data</p>
                      <Button onClick={handleExport} variant="secondary" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Export Experiences
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-destructive/10 rounded-lg text-center">
                      <p className="mb-4 text-destructive">Reset all experiences to default values</p>
                      <Button onClick={handleReset} variant="destructive" className="w-full">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset to Defaults
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-secondary/20 p-6 rounded-xl">
                <h3 className="text-lg font-medium mb-4">JSON Format</h3>
                <p className="mb-4">The import format should be an array of experience objects with the following structure:</p>
                <pre className="bg-black text-white p-4 rounded-lg overflow-x-auto text-xs whitespace-pre">
{`[
  {
    "id": "exp1",
    "title": "Hot Air Balloon Ride",
    "description": "Soar above breathtaking landscapes",
    "imageUrl": "https://example.com/image.jpg",
    "price": 24999,
    "location": "Napa Valley, CA",
    "duration": "3 hours",
    "participants": "2 people",
    "date": "Available year-round",
    "category": "adventure",
    "trending": true,
    "featured": true,
    "nicheCategory": "Luxury Escapes",
    "romantic": true,
    "adventurous": true,
    "group": false
  }
]`}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ExperienceManager;
