-- Add date column to cart_items table
ALTER TABLE cart_items ADD COLUMN date TIMESTAMP WITH TIME ZONE;

-- Update existing cart items to have a default date
UPDATE cart_items SET date = NOW() WHERE date IS NULL;

-- Make date column required
ALTER TABLE cart_items ALTER COLUMN date SET NOT NULL; 