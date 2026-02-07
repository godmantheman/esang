-- Database Schema for AI Ideal Type World Cup

-- 1. World Cups Table
CREATE TABLE public.world_cups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    rounds INTEGER NOT NULL,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Characters Table
CREATE TABLE public.characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    world_cup_id UUID REFERENCES public.world_cups(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    wins INTEGER DEFAULT 0,
    total_matches INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies (Simple for now)
ALTER TABLE public.world_cups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.world_cups FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.characters FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.world_cups FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON public.characters FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.characters FOR UPDATE USING (true);
