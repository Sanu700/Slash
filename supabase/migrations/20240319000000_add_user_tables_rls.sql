-- Enable RLS on user-related tables
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_items ENABLE ROW LEVEL SECURITY;

-- Wishlists policies
CREATE POLICY "Users can view their own wishlist items"
    ON wishlists FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can add items to their wishlist"
    ON wishlists FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove items from their wishlist"
    ON wishlists FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Cart items policies
CREATE POLICY "Users can view their own cart items"
    ON cart_items FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can add items to their cart"
    ON cart_items FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their cart items"
    ON cart_items FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove items from their cart"
    ON cart_items FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
    ON bookings FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
    ON bookings FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Booking items policies
CREATE POLICY "Users can view their own booking items"
    ON booking_items FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM bookings
            WHERE bookings.id = booking_items.booking_id
            AND bookings.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create their own booking items"
    ON booking_items FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM bookings
            WHERE bookings.id = booking_items.booking_id
            AND bookings.user_id = auth.uid()
        )
    ); 