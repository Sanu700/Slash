import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const CITIES = [
  'Bangalore', 'Delhi', 'Gurgaon', 'Mumbai', 'Pune', 'Ahmedabad', 'Gandhinagar',
  'Chennai', 'Hyderabad', 'Lucknow', 'Indore', 'Chandigarh', 'Kolkata',
  'Bhopal', 'Shimla', 'Dehradun', 'Thiruvananthpuram'
];

const SERVED_CITIES = ['Bangalore', 'Gurgaon', 'Delhi'];

const CitySelectorModal = ({ open, onClose }) => {
  const [selectedCity, setSelectedCity] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  const handleSelect = (city) => {
    setSelectedCity(city);
    if (!SERVED_CITIES.includes(city)) {
      setShowWarning(true);
      localStorage.setItem('selected_city', city);
    } else {
      setShowWarning(false);
      localStorage.setItem('selected_city', city);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Your City</DialogTitle>
          <DialogDescription>
            Please choose your city for experiences:
          </DialogDescription>
        </DialogHeader>
        <div style={{ maxHeight: 250, overflowY: 'auto', margin: '1rem 0' }}>
          {CITIES.map(city => (
            <Button
              key={city}
              variant={selectedCity === city ? 'default' : 'outline'}
              className="w-full mb-2"
              onClick={() => handleSelect(city)}
            >
              {city}
            </Button>
          ))}
        </div>
        {showWarning && (
          <div className="text-red-600 text-center mt-2">
            We don't currently serve these places
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CitySelectorModal; 