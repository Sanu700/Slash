-- Add boolean columns for each category
ALTER TABLE experiences
ADD COLUMN adventurous BOOLEAN DEFAULT false,
ADD COLUMN dining BOOLEAN DEFAULT false,
ADD COLUMN wellness BOOLEAN DEFAULT false,
ADD COLUMN cultural BOOLEAN DEFAULT false,
ADD COLUMN entertainment BOOLEAN DEFAULT false,
ADD COLUMN sports BOOLEAN DEFAULT false,
ADD COLUMN educational BOOLEAN DEFAULT false,
ADD COLUMN romantic BOOLEAN DEFAULT false,
ADD COLUMN family BOOLEAN DEFAULT false,
ADD COLUMN luxury BOOLEAN DEFAULT false;

-- Create indexes for the new category columns
CREATE INDEX idx_experiences_adventurous ON experiences(adventurous);
CREATE INDEX idx_experiences_dining ON experiences(dining);
CREATE INDEX idx_experiences_wellness ON experiences(wellness);
CREATE INDEX idx_experiences_cultural ON experiences(cultural);
CREATE INDEX idx_experiences_entertainment ON experiences(entertainment);
CREATE INDEX idx_experiences_sports ON experiences(sports);
CREATE INDEX idx_experiences_educational ON experiences(educational);
CREATE INDEX idx_experiences_romantic ON experiences(romantic);
CREATE INDEX idx_experiences_family ON experiences(family);
CREATE INDEX idx_experiences_luxury ON experiences(luxury);

-- Migrate existing data
UPDATE experiences
SET 
    adventurous = (category = 'Adventure'),
    dining = (category = 'Dining'),
    wellness = (category = 'Wellness'),
    cultural = (category = 'Cultural'),
    entertainment = (category = 'Entertainment'),
    sports = (category = 'Sports'),
    educational = (category = 'Educational'),
    romantic = (category = 'Romantic'),
    family = (category = 'Family'),
    luxury = (category = 'Luxury');

-- Drop the old category column
ALTER TABLE experiences DROP COLUMN category; 