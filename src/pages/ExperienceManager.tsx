import React from 'react';
import { useState } from 'react';
import { useExperiencesManager } from '@/lib/data';
import { Experience } from '@/lib/data/types';
import { categories, nicheCategories } from '@/lib/data';
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
import { Link, useNavigate } from 'react-router-dom';
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

  const handleDeleteExperience = async () => {
    if (selectedExperience) {
      if (window.confirm(`Are you sure you want to delete "${selectedExperience.title}"?`)) {
        await deleteExperience(selectedExperience.id);
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

  const handleSaveExperience = async () => {
    if (!formData.title || !formData.description || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (selectedExperience) {
      // Update existing experience
      await updateExperience(selectedExperience.id, formData);
      // Refresh the selected experience with updated data
      const updatedExperience = { ...selectedExperience, ...formData } as Experience;
      setSelectedExperience(updatedExperience);
      toast.success('Experience updated successfully');
    } else {
      // Create new experience
      const newExperience = await addExperience(formData as Omit<Experience, 'id'>);
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

  const handleImport = async () => {
    if (!importText.trim()) {
      toast.error('Please paste JSON data to import');
      return;
    }

    try {
      const result = await importExperiences(importText);
      if (result.success) {
        toast.success(result.message);
        setImportText('');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to import experiences');
    }
  };

  const handleExport = async () => {
    try {
      const jsonData = await exportExperiences();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'slash-experiences.json';
      a.click();
      
      URL.revokeObjectURL(url);
      toast.success('Experiences exported successfully');
    } catch (error) {
      toast.error('Failed to export experiences');
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all experiences to default? This cannot be undone.')) {
      await resetExperiences();
      setSelectedExperience(null);
      toast.success('Experiences have been reset to default');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className={cn(
            "flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 transition-all duration-700",
            isInView ? "opacity-100" : "opacity-0 translate-y-8"
          )}>
            <div className="flex items-center gap-4">
              <Link to="/admin">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-medium">Experience Manager</h1>
                <p className="text-muted-foreground">Manage your experiences and categories</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Experience List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Experiences</CardTitle>
                  <CardDescription>Manage your experiences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      placeholder="Search experiences..."
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                    
                    <div className="space-y-2">
                      {filteredExperiences.map((exp) => (
                        <button
                          key={exp.id}
                          onClick={() => handleSelectExperience(exp)}
                          className={cn(
                            "w-full text-left p-3 rounded-lg transition-colors",
                            selectedExperience?.id === exp.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-secondary"
                          )}
                        >
                          <div className="font-medium">{exp.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {exp.category} • {formatRupees(exp.price)}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleCreateNew}>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add New Experience
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Right Column - Experience Details */}
            <div className="lg:col-span-2">
              {selectedExperience ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{selectedExperience.title}</CardTitle>
                        <CardDescription>{selectedExperience.category}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {!isEditMode && (
                          <>
                            <Button variant="outline" size="icon" onClick={handleEditExisting}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={handleDeleteExperience}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isEditMode ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                              id="title"
                              value={formData.title || ''}
                              onChange={(e) => handleInputChange(e, 'title')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="price">Price</Label>
                            <Input
                              id="price"
                              type="number"
                              value={formData.price || 0}
                              onChange={(e) => handleNumberInputChange(e, 'price')}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={formData.description || ''}
                            onChange={(e) => handleInputChange(e, 'description')}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              value={formData.location || ''}
                              onChange={(e) => handleInputChange(e, 'location')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="duration">Duration</Label>
                            <Input
                              id="duration"
                              value={formData.duration || ''}
                              onChange={(e) => handleInputChange(e, 'duration')}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="participants">Participants</Label>
                            <Input
                              id="participants"
                              value={formData.participants || ''}
                              onChange={(e) => handleInputChange(e, 'participants')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                              id="date"
                              value={formData.date || ''}
                              onChange={(e) => handleInputChange(e, 'date')}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                              value={formData.category || ''}
                              onValueChange={(value) => handleSelectChange(value, 'category')}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((cat) => (
                                  <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="nicheCategory">Niche Category</Label>
                            <Select
                              value={formData.nicheCategory || ''}
                              onValueChange={(value) => handleSelectChange(value, 'nicheCategory')}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a niche category" />
                              </SelectTrigger>
                              <SelectContent>
                                {nicheCategories.map((cat) => (
                                  <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Experience Types</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                              <Label htmlFor="group">Group</Label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={handleCancel}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveExperience}>
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium mb-2">Description</h3>
                          <p className="text-muted-foreground">{selectedExperience.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-medium mb-2">Location</h3>
                            <p className="text-muted-foreground">{selectedExperience.location}</p>
                          </div>
                          <div>
                            <h3 className="font-medium mb-2">Duration</h3>
                            <p className="text-muted-foreground">{selectedExperience.duration}</p>
                          </div>
                          <div>
                            <h3 className="font-medium mb-2">Participants</h3>
                            <p className="text-muted-foreground">{selectedExperience.participants}</p>
                          </div>
                          <div>
                            <h3 className="font-medium mb-2">Date</h3>
                            <p className="text-muted-foreground">{selectedExperience.date}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-2">Experience Types</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedExperience.trending && (
                              <span className="bg-primary/10 text-primary text-sm px-2 py-1 rounded-full">
                                Trending
                              </span>
                            )}
                            {selectedExperience.featured && (
                              <span className="bg-primary/10 text-primary text-sm px-2 py-1 rounded-full">
                                Featured
                              </span>
                            )}
                            {selectedExperience.romantic && (
                              <span className="bg-primary/10 text-primary text-sm px-2 py-1 rounded-full">
                                Romantic
                              </span>
                            )}
                            {selectedExperience.adventurous && (
                              <span className="bg-primary/10 text-primary text-sm px-2 py-1 rounded-full">
                                Adventurous
                              </span>
                            )}
                            {selectedExperience.group && (
                              <span className="bg-primary/10 text-primary text-sm px-2 py-1 rounded-full">
                                Group
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <h3 className="text-xl font-medium mb-2">No Experience Selected</h3>
                    <p className="text-muted-foreground mb-6">
                      Select an experience from the list or create a new one
                    </p>
                    <Button onClick={handleCreateNew}>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Create New Experience
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          {/* Import Dialog */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Import Experiences</CardTitle>
              <CardDescription>Import experiences from a JSON file</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Paste JSON data here..."
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  className="h-32"
                />
                <Button onClick={handleImport}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExperienceManager;
