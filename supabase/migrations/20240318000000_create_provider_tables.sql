-- Create enum for provider status
CREATE TYPE provider_status AS ENUM ('pending', 'active', 'inactive', 'suspended');

-- Create enum for experience status
CREATE TYPE experience_status AS ENUM ('pending', 'active', 'inactive');

-- Create providers table
CREATE TABLE providers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    contact_no VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    status provider_status DEFAULT 'pending',
    join_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    experiences INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create experiences table
CREATE TABLE experiences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    price DECIMAL(10,2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    participants VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    category VARCHAR(100) NOT NULL,
    status experience_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_providers_status ON providers(status);
CREATE INDEX idx_providers_company_name ON providers(company_name);
CREATE INDEX idx_providers_email ON providers(email);
CREATE INDEX idx_experiences_provider_id ON experiences(provider_id);
CREATE INDEX idx_experiences_status ON experiences(status);
CREATE INDEX idx_experiences_category ON experiences(category);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_providers_updated_at
    BEFORE UPDATE ON providers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experiences_updated_at
    BEFORE UPDATE ON experiences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS (Row Level Security) policies
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Providers policies
CREATE POLICY "Public providers are viewable by everyone"
    ON providers FOR SELECT
    USING (status = 'active');

CREATE POLICY "Providers can be created by authenticated users"
    ON providers FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Providers can be updated by admin users"
    ON providers FOR UPDATE
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Experiences policies
CREATE POLICY "Public experiences are viewable by everyone"
    ON experiences FOR SELECT
    USING (status = 'active');

CREATE POLICY "Experiences can be created by provider or admin"
    ON experiences FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM providers
            WHERE id = provider_id
            AND (
                auth.uid() = id
                OR auth.jwt() ->> 'role' = 'admin'
            )
        )
    );

CREATE POLICY "Experiences can be updated by provider or admin"
    ON experiences FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM providers
            WHERE id = provider_id
            AND (
                auth.uid() = id
                OR auth.jwt() ->> 'role' = 'admin'
            )
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM providers
            WHERE id = provider_id
            AND (
                auth.uid() = id
                OR auth.jwt() ->> 'role' = 'admin'
            )
        )
    );

-- Create function to update provider experience count
CREATE OR REPLACE FUNCTION update_provider_experience_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE providers
        SET experiences = experiences + 1
        WHERE id = NEW.provider_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE providers
        SET experiences = experiences - 1
        WHERE id = OLD.provider_id;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update provider experience count
CREATE TRIGGER update_provider_experiences
    AFTER INSERT OR DELETE ON experiences
    FOR EACH ROW
    EXECUTE FUNCTION update_provider_experience_count(); 