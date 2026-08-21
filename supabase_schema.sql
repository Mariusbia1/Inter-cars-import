-- ==============================================================================
-- INTER CARS IMPORT - Schéma SQL Supabase pour Déploiement Immédiat
-- ==============================================================================

-- 1. Table des Demandes de Contact & Devis d'Import (Leads)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    vehicle_type TEXT NOT NULL,
    brand_sought TEXT,
    model_sought TEXT,
    budget_range TEXT,
    preferred_timeline TEXT,
    fuel_type TEXT,
    transmission TEXT,
    message TEXT,
    status TEXT DEFAULT 'Nouveau' CHECK (status IN ('Nouveau', 'En cours', 'Devis envoyé', 'Clôturé')),
    admin_notes TEXT,
    source TEXT DEFAULT 'Web Form'
);

-- 2. Table des Véhicules Livrés (Catalogue & Showroom)
CREATE TABLE IF NOT EXISTS public.delivered_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Supercar', 'Sportive', 'SUV Prestige', 'Berline GT')),
    year INTEGER NOT NULL,
    mileage INTEGER NOT NULL,
    power_hp INTEGER NOT NULL,
    engine TEXT NOT NULL,
    transmission TEXT DEFAULT 'Automatique',
    origin_country TEXT NOT NULL,
    delivery_city TEXT NOT NULL,
    savings_amount INTEGER NOT NULL,
    purchase_price INTEGER,
    delivery_date DATE,
    image_url TEXT NOT NULL,
    gallery TEXT[] DEFAULT ARRAY[]::TEXT[],
    client_name TEXT,
    client_city TEXT,
    client_review TEXT,
    rating INTEGER DEFAULT 5,
    is_featured BOOLEAN DEFAULT false
);

-- 3. Table des Visiteurs & Statistiques Analytiques
CREATE TABLE IF NOT EXISTS public.visitors_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visited_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    page_path TEXT NOT NULL,
    country TEXT DEFAULT 'France',
    city TEXT,
    device TEXT DEFAULT 'Desktop',
    browser TEXT,
    referrer TEXT,
    session_duration_seconds INTEGER DEFAULT 45
);

-- 4. Table des Témoignages Clients
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    client_name TEXT NOT NULL,
    client_city TEXT NOT NULL,
    vehicle_model TEXT NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    delivery_year INTEGER DEFAULT 2025,
    is_verified BOOLEAN DEFAULT true,
    avatar_url TEXT
);

-- Activer le Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivered_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique pour véhicules et témoignages
CREATE POLICY "Lecture publique des véhicules livrés" 
ON public.delivered_vehicles FOR SELECT USING (true);

CREATE POLICY "Lecture publique des témoignages" 
ON public.testimonials FOR SELECT USING (true);

-- Politique d'insertion publique pour formulaires de contact et analytics
CREATE POLICY "Insertion publique des demandes de devis" 
ON public.leads FOR INSERT WITH CHECK (true);

CREATE POLICY "Insertion publique des analytics" 
ON public.visitors_analytics FOR INSERT WITH CHECK (true);

-- Politiques d'administration (authentifié)
CREATE POLICY "Gestion totale pour les administrateurs" 
ON public.leads FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Gestion totale des véhicules pour les administrateurs" 
ON public.delivered_vehicles FOR ALL USING (auth.role() = 'authenticated');
