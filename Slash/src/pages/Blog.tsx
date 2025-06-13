import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Search, Tag } from "lucide-react";

const Blog = () => {
  // Mock blog data
  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Adventure Experiences in India",
      excerpt: "Discover the most thrilling adventure experiences across India...",
      category: "Adventure",
      date: "2024-03-15",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=2688&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Luxury Dining Experiences You Must Try",
      excerpt: "Explore the finest dining experiences that combine luxury with culinary excellence...",
      category: "Dining",
      date: "2024-03-14",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2574&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Wellness Retreats for Mind and Body",
      excerpt: "Find your inner peace with these transformative wellness experiences...",
      category: "Wellness",
      date: "2024-03-13",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=2678&auto=format&fit=crop"
    }
  ];

  const categories = [
    "All",
    "Adventure",
    "Dining",
    "Wellness",
    "Luxury",
    "Learning"
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        
        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search articles..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="cursor-pointer hover:bg-accent"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative h-48 md:h-full">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant="secondary">{post.category}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      {post.date}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-2xl mb-2">{post.title}</CardTitle>
                  <CardDescription className="mb-4">
                    {post.excerpt}
                  </CardDescription>
                  <Button variant="link" className="p-0">
                    Read More →
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Subscribe to Our Newsletter</CardTitle>
            <CardDescription>
              Get the latest updates on new experiences and exclusive offers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input placeholder="Enter your email" type="email" />
              <Button>Subscribe</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Blog; 