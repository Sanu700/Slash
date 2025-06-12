import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Search, Edit, Trash2, Plus, Filter } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { categories, Category } from "@/lib/data/categories";

export default function Categories() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filteredCategories = categories.filter(category => {
    const matchesSearch = searchQuery === "" || 
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === "All" || category.name === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsEditing(true);
  };

  const handleDelete = (categoryId: string) => {
    // Implement delete functionality
    console.log("Delete category:", categoryId);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Category Management</h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Minimal working dropdown for debugging */}
        <div className="mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Test Dropdown</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Option 1</DropdownMenuItem>
              <DropdownMenuItem>Option 2</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search categories..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                {selectedFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedFilter("All")}>All Categories</DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuItem key={category.id} onClick={() => setSelectedFilter(category.name)}>
                  {category.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Categories List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Manage experience categories</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Experiences</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow 
                      key={category.id}
                      className={selectedCategory?.id === category.id ? "bg-accent" : ""}
                      onClick={() => setSelectedCategory(category)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <category.icon className="h-4 w-4" />
                          <span>{category.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">12</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(category)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDelete(category.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Category Details/Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isEditing ? "Edit Category" : "Category Details"}
              </CardTitle>
              <CardDescription>
                {isEditing ? "Update category information" : "View category details"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedCategory ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Name</label>
                    <Input
                      value={selectedCategory.name}
                      disabled={!isEditing}
                      onChange={(e) => setSelectedCategory({ ...selectedCategory, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Description</label>
                    <Input
                      value={selectedCategory.description}
                      disabled={!isEditing}
                      onChange={(e) => setSelectedCategory({ ...selectedCategory, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Image URL</label>
                    <Input
                      value={selectedCategory.imageUrl}
                      disabled={!isEditing}
                      onChange={(e) => setSelectedCategory({ ...selectedCategory, imageUrl: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button 
                          className="flex-1"
                          onClick={() => {
                            // Implement save functionality
                            setIsEditing(false);
                          }}
                        >
                          Save Changes
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => {
                            setIsEditing(false);
                            setSelectedCategory(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button 
                        className="flex-1"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Category
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Select a category to view details
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
} 