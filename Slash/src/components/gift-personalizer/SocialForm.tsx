
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, User, Search } from 'lucide-react';
import { FormData } from '@/types/personalizerTypes';

interface SocialFormProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const SocialForm = ({ formData, handleInputChange }: SocialFormProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medium mb-2">Social & Shopping Profiles</h2>
      <p className="text-muted-foreground mb-8">
        Optional: Link social or shopping accounts to help our AI better understand their preferences.
      </p>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-4 border border-input rounded-lg bg-background/50">
          <div className="bg-pink-500/10 p-2 rounded-lg">
            <Key className="h-5 w-5 text-pink-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Your privacy is important</p>
            <p className="text-xs text-muted-foreground">
              We only use linked accounts to analyze preferences. We never post, message, or store credentials.
            </p>
          </div>
        </div>
        
        <div>
          <Label htmlFor="instagram" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Instagram Profile URL
          </Label>
          <Input 
            id="instagram" 
            name="socialLinks.instagram"
            value={formData.socialLinks.instagram}
            onChange={handleInputChange}
            placeholder="https://instagram.com/username" 
          />
        </div>
        
        <div>
          <Label htmlFor="facebook" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Facebook Profile URL
          </Label>
          <Input 
            id="facebook" 
            name="socialLinks.facebook"
            value={formData.socialLinks.facebook}
            onChange={handleInputChange}
            placeholder="https://facebook.com/username" 
          />
        </div>
        
        <div>
          <Label htmlFor="amazon" className="flex items-center gap-2">
            <Search className="h-4 w-4" /> Amazon Wishlist URL
          </Label>
          <Input 
            id="amazon" 
            name="socialLinks.amazon"
            value={formData.socialLinks.amazon}
            onChange={handleInputChange}
            placeholder="https://amazon.com/wishlist/..." 
          />
        </div>
      </div>
    </div>
  );
};

export default SocialForm;
