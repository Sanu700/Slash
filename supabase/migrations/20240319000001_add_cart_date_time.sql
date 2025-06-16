-- Add date and time fields to cart_items table
ALTER TABLE cart_items
ADD COLUMN selected_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN selected_time TIME;

-- Update RLS policies to include new fields
DROP POLICY IF EXISTS "Users can view their own cart items" ON cart_items;
CREATE POLICY "Users can view their own cart items"
    ON cart_items FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can add items to their cart" ON cart_items;
CREATE POLICY "Users can add items to their cart"
    ON cart_items FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their cart items" ON cart_items;
CREATE POLICY "Users can update their cart items"
    ON cart_items FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id); 