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
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editModal, setEditModal] = useState<{ open: boolean, category: any } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean, category: any } | null>(null);
  const [categoryList, setCategoryList] = useState(categories);

  const filteredCategories = categoryList.filter(category => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      category.name.toLowerCase().includes(searchTerm) ||
      category.description.toLowerCase().includes(searchTerm)
    );
  });

  const handleEdit = (category: any) => {
    setEditModal({ open: true, category: { ...category } });
  };

  const handleDelete = (category: any) => {
    setDeleteModal({ open: true, category });
  };

  const saveEdit = () => {
    if (editModal) {
      setCategoryList(prev => 
        prev.map(cat => 
          cat.id === editModal.category.id ? editModal.category : cat
        )
      );
      setEditModal(null);
    }
  };

  const confirmDelete = () => {
    if (deleteModal) {
      setCategoryList(prev => 
        prev.filter(cat => cat.id !== deleteModal.category.id)
      );
      setDeleteModal(null);
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.description) {
      return;
    }
    setCategoryList(prev => [
      ...prev,
      {
        id: (prev.length + 1).toString(),
        name: newCategory.name,
        description: newCategory.description,
        imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=2688&auto=format&fit=crop',
        icon: Plus
      }
    ]);
    setShowAddModal(false);
    setNewCategory({ name: '', description: '' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Category Management</h1>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
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
                              onClick={() => handleDelete(category)}
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

        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add New Category</h2>
              <div className="mb-4 space-y-2">
                <Input placeholder="Name" value={newCategory.name} onChange={e => setNewCategory({ ...newCategory, name: e.target.value })} />
                <Input placeholder="Description" value={newCategory.description} onChange={e => setNewCategory({ ...newCategory, description: e.target.value })} />
              </div>
              <Button className="w-full" onClick={handleAddCategory} disabled={!newCategory.name || !newCategory.description}>Add</Button>
              <Button variant="outline" className="w-full mt-2" onClick={() => setShowAddModal(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {editModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit Category</h2>
              <div className="mb-4 space-y-2">
                <Input placeholder="Name" value={editModal.category.name} onChange={e => setEditModal(m => ({ ...m, category: { ...m.category, name: e.target.value } }))} />
                <Input placeholder="Description" value={editModal.category.description} onChange={e => setEditModal(m => ({ ...m, category: { ...m.category, description: e.target.value } }))} />
              </div>
              <Button className="w-full" onClick={saveEdit}>Save</Button>
              <Button variant="outline" className="w-full mt-2" onClick={() => setEditModal(null)}>Cancel</Button>
            </div>
          </div>
        )}

        {deleteModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Delete Category</h2>
              <div className="mb-4">Are you sure you want to delete {deleteModal.category.name}?</div>
              <Button className="w-full" variant="destructive" onClick={confirmDelete}>Delete</Button>
              <Button variant="outline" className="w-full mt-2" onClick={() => setDeleteModal(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 