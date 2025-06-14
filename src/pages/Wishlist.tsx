import React from 'react';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

const Wishlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      <div className="text-center py-12">
        <Heart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-6">Start adding experiences you love to your wishlist</p>
        <Button onClick={() => navigate('/experiences')}>
          Browse Experiences
        </Button>
      </div>
    </div>
  );
};

export default Wishlist; 