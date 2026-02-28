-- Gardening Planner Database Schema for Supabase
-- Run these SQL commands in your Supabase SQL Editor

-- Garden Layouts Table
CREATE TABLE IF NOT EXISTS garden_layouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    layout_data JSONB NOT NULL,
    dimensions JSONB NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pest Issues Table
CREATE TABLE IF NOT EXISTS pest_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plant_id UUID REFERENCES plants(id) ON DELETE SET NULL,
    pest_type VARCHAR(255) NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high')),
    symptoms TEXT,
    treatment TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'treating', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seasonal Tasks Table
CREATE TABLE IF NOT EXISTS seasonal_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    season VARCHAR(20) CHECK (season IN ('spring', 'summer', 'fall', 'winter')),
    task_type VARCHAR(50) CHECK (task_type IN ('planting', 'maintenance', 'harvesting', 'preparation')),
    due_date DATE,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Harvest Plans Table
CREATE TABLE IF NOT EXISTS harvest_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plant_id UUID REFERENCES plants(id) ON DELETE SET NULL,
    expected_yield VARCHAR(255),
    expected_date DATE,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'ready', 'harvested')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Harvest Logs Table
CREATE TABLE IF NOT EXISTS harvest_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plant_id UUID REFERENCES plants(id) ON DELETE SET NULL,
    actual_yield VARCHAR(255) NOT NULL,
    quality_notes TEXT,
    harvest_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Posts Table
CREATE TABLE IF NOT EXISTS community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[],
    images TEXT[],
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Comments Table
CREATE TABLE IF NOT EXISTS community_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shared Gardens Table
CREATE TABLE IF NOT EXISTS shared_gardens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_layout_id UUID REFERENCES garden_layouts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    layout_data JSONB NOT NULL,
    dimensions JSONB NOT NULL,
    tags TEXT[],
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add planted_date column to plants table if it doesn't exist
ALTER TABLE plants ADD COLUMN IF NOT EXISTS planted_date DATE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_garden_layouts_user_id ON garden_layouts(user_id);
CREATE INDEX IF NOT EXISTS idx_pest_issues_user_id ON pest_issues(user_id);
CREATE INDEX IF NOT EXISTS idx_pest_issues_plant_id ON pest_issues(plant_id);
CREATE INDEX IF NOT EXISTS idx_seasonal_tasks_user_id ON seasonal_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_seasonal_tasks_season ON seasonal_tasks(season);
CREATE INDEX IF NOT EXISTS idx_harvest_plans_user_id ON harvest_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_harvest_plans_plant_id ON harvest_plans(plant_id);
CREATE INDEX IF NOT EXISTS idx_harvest_logs_user_id ON harvest_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_harvest_logs_plant_id ON harvest_logs(plant_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_tags ON community_posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_user_id ON community_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_shared_gardens_user_id ON shared_gardens(user_id);
CREATE INDEX IF NOT EXISTS idx_shared_gardens_tags ON shared_gardens USING GIN(tags);

-- Enable Row Level Security (RLS)
ALTER TABLE garden_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pest_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasonal_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE harvest_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE harvest_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_gardens ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Garden Layouts
CREATE POLICY "Users can view own garden layouts" ON garden_layouts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own garden layouts" ON garden_layouts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own garden layouts" ON garden_layouts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own garden layouts" ON garden_layouts
    FOR DELETE USING (auth.uid() = user_id);

-- Pest Issues
CREATE POLICY "Users can view own pest issues" ON pest_issues
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pest issues" ON pest_issues
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pest issues" ON pest_issues
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pest issues" ON pest_issues
    FOR DELETE USING (auth.uid() = user_id);

-- Seasonal Tasks
CREATE POLICY "Users can view own seasonal tasks" ON seasonal_tasks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own seasonal tasks" ON seasonal_tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own seasonal tasks" ON seasonal_tasks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own seasonal tasks" ON seasonal_tasks
    FOR DELETE USING (auth.uid() = user_id);

-- Harvest Plans
CREATE POLICY "Users can view own harvest plans" ON harvest_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own harvest plans" ON harvest_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own harvest plans" ON harvest_plans
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own harvest plans" ON harvest_plans
    FOR DELETE USING (auth.uid() = user_id);

-- Harvest Logs
CREATE POLICY "Users can view own harvest logs" ON harvest_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own harvest logs" ON harvest_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own harvest logs" ON harvest_logs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own harvest logs" ON harvest_logs
    FOR DELETE USING (auth.uid() = user_id);

-- Community Posts (public read, user write)
CREATE POLICY "Anyone can view community posts" ON community_posts
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own community posts" ON community_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own community posts" ON community_posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own community posts" ON community_posts
    FOR DELETE USING (auth.uid() = user_id);

-- Community Comments
CREATE POLICY "Anyone can view community comments" ON community_comments
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own community comments" ON community_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own community comments" ON community_comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own community comments" ON community_comments
    FOR DELETE USING (auth.uid() = user_id);

-- Shared Gardens (public read, user write)
CREATE POLICY "Anyone can view shared gardens" ON shared_gardens
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own shared gardens" ON shared_gardens
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shared gardens" ON shared_gardens
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own shared gardens" ON shared_gardens
    FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_garden_layouts_updated_at 
    BEFORE UPDATE ON garden_layouts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pest_issues_updated_at 
    BEFORE UPDATE ON pest_issues 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seasonal_tasks_updated_at 
    BEFORE UPDATE ON seasonal_tasks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_harvest_plans_updated_at 
    BEFORE UPDATE ON harvest_plans 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at 
    BEFORE UPDATE ON community_posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shared_gardens_updated_at 
    BEFORE UPDATE ON shared_gardens 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
