-- ==============================================================================
-- INTER CARS IMPORT - Schéma SQL Supabase & Données Complètes
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

-- 3. Table des Visiteurs & Statistiques Analytiques Réelles
CREATE TABLE IF NOT EXISTS public.visitors_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visited_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    page_path TEXT NOT NULL,
    country TEXT DEFAULT 'France',
    city TEXT DEFAULT 'Visiteur Réel',
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

-- Politiques de sécurité (Lecture & Écriture intégrale)
DROP POLICY IF EXISTS "Acces total leads" ON public.leads;
DROP POLICY IF EXISTS "Acces total vehicules" ON public.delivered_vehicles;
DROP POLICY IF EXISTS "Acces total analytics" ON public.visitors_analytics;
DROP POLICY IF EXISTS "Acces total testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Acces total settings" ON public.site_settings;

CREATE POLICY "Acces total leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acces total vehicules" ON public.delivered_vehicles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acces total analytics" ON public.visitors_analytics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acces total testimonials" ON public.testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acces total settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- INSERTION DES 6 VÉHICULES DU CATALOGUE DE PRESTIGE
-- ==============================================================================
INSERT INTO public.delivered_vehicles (title, brand, model, category, year, mileage, power_hp, engine, transmission, origin_country, delivery_city, certification, warranty, image_url, client_name, client_city, client_review, rating, is_featured)
VALUES 
(
    'Porsche 911 (992) GT3 Touring',
    'Porsche',
    '911 GT3 Touring',
    'Supercar',
    2024,
    8200,
    510,
    '4.0L Flat-6 Atmosphérique',
    'Automatique (PDK)',
    'Réseau Officiel Certifié',
    'Cannes (06)',
    'Audit 150 Points Validé',
    'Contrôle Technique Vierge',
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
    'Alexandre D.',
    'Cannes',
    'Inter Cars Import a déniché un exemplaire parfait chez un concessionnaire officiel. Audit 150 points irréprochable et livraison à domicile en plateau fermé.',
    5,
    true
),
(
    'Audi RS6 Avant (C8) Dynamic Plus',
    'Audi',
    'RS6 Avant C8',
    'Berline GT',
    2023,
    24500,
    600,
    '4.0L V8 Bi-Turbo Mild-Hybrid',
    'Automatique (Tiptronic)',
    'Concessionnaire Officiel',
    'Paris (75)',
    'Audit 150 Points Validé',
    'Historique Complet & Limpide',
    'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
    'Stéphane M.',
    'Paris 8e',
    'Un break d''exception dans un état concours. L''équipe a géré l''immatriculation et les formalités en 48h.',
    5,
    true
),
(
    'Mercedes-AMG G 63 V8 Biturbo',
    'Mercedes-AMG',
    'Classe G 63 AMG',
    'SUV Prestige',
    2024,
    12000,
    585,
    '4.0L V8 Biturbo AMG',
    'Automatique (Speedshift)',
    'Réseau Partenaire Agréé',
    'Monaco (MC)',
    'Audit 150 Points Validé',
    'Contrôle Châssis & Électronique',
    'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=80',
    'Jean-Christophe L.',
    'Monaco',
    'Trouver un G63 dans cette teinte Magno avec intérieur beige était introuvable. Service 5 étoiles.',
    5,
    true
),
(
    'Ferrari 296 GTB Assetto Fiorano',
    'Ferrari',
    '296 GTB',
    'Supercar',
    2023,
    4100,
    830,
    '3.0L V6 Turbo + Hybride Plug-in',
    'Automatique (F1 Double Embrayage)',
    'Concession Officielle Ferrari',
    'Bordeaux (33)',
    'Audit 150 Points Validé',
    'Programme Entretien Actif',
    'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1200&q=80',
    'Édouard de B.',
    'Bordeaux',
    'Configuration Assetto Fiorano rare. Contrôle micrométrique de la carrosserie et dossier irréprochable.',
    5,
    true
),
(
    'BMW M4 Competition (G82) M xDrive',
    'BMW',
    'M4 Competition G82',
    'Sportive',
    2024,
    9500,
    510,
    '3.0L 6-en-ligne Bi-Turbo',
    'Automatique (M Steptronic)',
    'Réseau Officiel Certifié',
    'Lyon (69)',
    'Audit 150 Points Validé',
    'Première Main Certifiée',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
    'Maxime V.',
    'Lyon',
    'Pack carbone extérieur et sièges baquets M. Livrée lavée et protégée avec traitement céramique.',
    5,
    false
),
(
    'Aston Martin Vantage V8 Coupe',
    'Aston Martin',
    'Vantage V8',
    'Sportive',
    2022,
    18400,
    510,
    '4.0L V8 Bi-Turbo',
    'Automatique (Touchtronic)',
    'Concession Officielle',
    'Aix-en-Provence (13)',
    'Audit 150 Points Validé',
    'Contrôle Technique Vierge',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80',
    'Guillaume R.',
    'Aix-en-Provence',
    'Couleur sur mesure British Racing Green. Suivi limpide depuis le premier jour.',
    5,
    false
);

-- ==============================================================================
-- INSERTION DES TÉMOIGNAGES CLIENTS
-- ==============================================================================
INSERT INTO public.testimonials (client_name, client_city, vehicle_model, rating, comment, tag, date, is_verified, avatar_url)
VALUES
(
    'Alexandre Dutertre',
    'Cannes (06)',
    'Porsche 911 (992) GT3 Touring',
    5,
    'Une expérience digne des plus grandes maisons de conciergerie. L''équipe a trouvé en quelques jours exactement la configuration GT3 avec freins carbone et boîte mécanique que je recherchais depuis des mois. Rapport d''inspection de 40 pages avant validation.',
    'Recherche Sur Mesure',
    'Novembre 2025',
    true,
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80'
),
(
    'Stéphane Mercier',
    'Paris 8e (75)',
    'Audi RS6 Avant (C8) Dynamic Plus',
    5,
    'Achat en toute sérénité. L''accompagnement sur le choix du modèle et la rigueur du contrôle technique font toute la différence. Mention spéciale pour la gestion administrative et l''immatriculation sans le moindre stress.',
    'Achat Clé en Main',
    'Décembre 2025',
    true,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80'
),
(
    'Jean-Christophe Laurent',
    'Monaco (MC)',
    'Mercedes-AMG G 63 V8 Biturbo',
    5,
    'Inter Cars Import a sécurisé l''ensemble de la transaction auprès d''une concession officielle. Contrôle minutieux du carnet, vérification de peinture au micromètre et livraison à mon domicile en camion fermé. Remarquable.',
    'Livraison VIP',
    'Janvier 2026',
    true,
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80'
);

-- ==============================================================================
-- INITIALISATION DES PARAMÈTRES DU SITE
-- ==============================================================================
INSERT INTO public.site_settings (id, phone, email, notification_email, address)
VALUES ('main_settings', '+33 (0)4 93 00 00 00', 'contact@inter-cars-import.fr', 'direction@intercarsimport.fr', 'Showroom Privé & Bureau Sourcing, Axe Cannes — Monaco')
ON CONFLICT (id) DO UPDATE SET 
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    notification_email = EXCLUDED.notification_email,
    address = EXCLUDED.address,
    updated_at = timezone('utc'::text, now());
