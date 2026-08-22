-- ==============================================================================
-- INTER CARS IMPORT - Schéma SQL Supabase Complet & Initialisation
-- ==============================================================================

-- 1. Table des Demandes de Contact & Devis (Leads)
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
    delivery_city TEXT,
    message TEXT,
    status TEXT DEFAULT 'Nouveau' CHECK (status IN ('Nouveau', 'En cours', 'Devis envoyé', 'Clôturé')),
    admin_notes TEXT,
    source TEXT DEFAULT 'Web Conciergerie'
);

-- 2. Table des Véhicules du Catalogue & Showroom
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
    certification TEXT DEFAULT 'Audit 150 Points Validé',
    warranty TEXT DEFAULT 'Historique & Carnet Certifiés',
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
    city TEXT DEFAULT 'Paris',
    device TEXT DEFAULT 'Desktop',
    browser TEXT DEFAULT 'Chrome',
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
    tag TEXT DEFAULT 'Achat Prestige',
    date TEXT DEFAULT 'Février 2026',
    is_verified BOOLEAN DEFAULT true,
    avatar_url TEXT
);

-- 5. Table des Paramètres Généraux du Site
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'main_settings',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    phone TEXT DEFAULT '+33 (0)4 93 00 00 00',
    email TEXT DEFAULT 'contact@inter-cars-import.fr',
    notification_email TEXT DEFAULT 'direction@intercarsimport.fr',
    address TEXT DEFAULT 'Showroom Privé & Bureau Sourcing, Axe Cannes — Monaco'
);

-- Activer Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivered_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité (Accès fluide pour lecture et gestion)
CREATE POLICY "Acces total leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acces total vehicules" ON public.delivered_vehicles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acces total analytics" ON public.visitors_analytics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acces total testimonials" ON public.testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acces total settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- Initialisation des réglages par défaut
INSERT INTO public.site_settings (id, phone, email, notification_email, address)
VALUES ('main_settings', '+33 (0)4 93 00 00 00', 'contact@inter-cars-import.fr', 'direction@intercarsimport.fr', 'Showroom Privé & Bureau Sourcing, Axe Cannes — Monaco')
ON CONFLICT (id) DO NOTHING;
