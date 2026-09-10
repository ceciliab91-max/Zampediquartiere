-- ====================================================================
-- ZAMPE DI QUARTIERE - DATABASE SCHEMA (SUPABASE PostgreSQL)
-- Architettura MVP iperlocale per dog-sitting e custodia reciproca
-- ====================================================================

-- 0. Estensioni ed Enum
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom Enum Types
CREATE TYPE pet_size_enum AS ENUM ('small', 'medium', 'large', 'giant');
CREATE TYPE service_type_enum AS ENUM ('dog_walking', 'daycare', 'overnight_boarding', 'home_visit');
CREATE TYPE booking_status_enum AS ENUM ('IN_ATTESA', 'MEET_AND_GREET', 'CONFERMATO', 'COMPLETATO', 'RIFIUTATO');
CREATE TYPE compensation_type_enum AS ENUM ('exchange', 'direct_pay', 'both');
CREATE TYPE housing_type_enum AS ENUM ('house_with_garden', 'apartment_with_balcony', 'apartment_no_outdoor', 'house_with_yard');

-- ====================================================================
-- 1. TABELLA: PROFILES
-- Memorizza i dati dei vicini di casa, ubicazione (CAP, Quartiere), 
-- tipo di alloggio e profilo sitter/proprietario.
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    
    -- Dati Anagrafici & Localizzazione
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    neighborhood TEXT NOT NULL,          -- Rione/Quartiere (es. "Isola", "Porta Romana")
    zip_code VARCHAR(5) NOT NULL,        -- CAP deterministico (es. "20124")
    city TEXT NOT NULL DEFAULT 'Milano',
    bio TEXT,
    
    -- Caratteristiche Abitazione (Filtri ricerca)
    housing_type housing_type_enum NOT NULL DEFAULT 'apartment_with_balcony',
    has_garden BOOLEAN NOT NULL DEFAULT FALSE,
    has_balcony BOOLEAN NOT NULL DEFAULT FALSE,
    has_other_pets BOOLEAN NOT NULL DEFAULT FALSE,
    other_pets_description TEXT,
    
    -- Configurazione Sitter & Economia Ibrida
    is_sitter BOOLEAN NOT NULL DEFAULT FALSE,
    compensation_type compensation_type_enum NOT NULL DEFAULT 'exchange',
    hourly_rate NUMERIC(6, 2) CHECK (hourly_rate >= 0),
    daily_rate NUMERIC(6, 2) CHECK (daily_rate >= 0),
    time_credits INT NOT NULL DEFAULT 5 CHECK (time_credits >= 0), -- Banca del tempo/Crediti
    
    -- Statistiche & Reputazione
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00 CHECK (rating >= 1.00 AND rating <= 5.00),
    reviews_count INT NOT NULL DEFAULT 0 CHECK (reviews_count >= 0),
    max_dog_size pet_size_enum NOT NULL DEFAULT 'medium'
);

-- Indici per ricerche deterministiche per CAP, Quartiere e Sitter attivi
CREATE INDEX IF NOT EXISTS idx_profiles_zip_code ON public.profiles(zip_code);
CREATE INDEX IF NOT EXISTS idx_profiles_neighborhood ON public.profiles(neighborhood);
CREATE INDEX IF NOT EXISTS idx_profiles_is_sitter ON public.profiles(is_sitter) WHERE is_sitter IS TRUE;
CREATE INDEX IF NOT EXISTS idx_profiles_compensation_type ON public.profiles(compensation_type);

-- ====================================================================
-- 2. TABELLA: DOGS
-- Scheda dei cani registrati dai vicini con compatibilità JSONB.
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.dogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    
    name TEXT NOT NULL,
    breed TEXT NOT NULL,
    size pet_size_enum NOT NULL DEFAULT 'medium',
    age_years INT NOT NULL CHECK (age_years >= 0 AND age_years <= 30),
    photo_url TEXT,
    
    -- JSONB per compatibilità dinamiche ed esigenze particolari
    -- Esempio: {"compat_with_cats": true, "compat_with_dogs": true, "compat_with_children": true, "special_needs": "Necessita farmaco cardio alle 18:00"}
    compatibility JSONB NOT NULL DEFAULT '{
        "compat_with_cats": true,
        "compat_with_dogs": true,
        "compat_with_children": true,
        "special_needs": null
    }'::jsonb,
    
    vet_contact_name TEXT,
    vet_contact_phone TEXT
);

CREATE INDEX IF NOT EXISTS idx_dogs_owner_id ON public.dogs(owner_id);
CREATE INDEX IF NOT EXISTS idx_dogs_size ON public.dogs(size);

-- ====================================================================
-- 3. TABELLA: AVAILABILITY_SLOTS
-- Disponibilità orarie pubblicate dai sitter di quartiere.
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.availability_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sitter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    
    service_type service_type_enum NOT NULL DEFAULT 'dog_walking',
    day_of_week INT CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Domenica, 1=Lunedì, ...
    specific_date DATE,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    
    CONSTRAINT chk_slot_date_or_day CHECK (
        (day_of_week IS NOT NULL AND specific_date IS NULL) OR
        (day_of_week IS NULL AND specific_date IS NOT NULL)
    )
);

CREATE INDEX IF NOT EXISTS idx_availability_slots_sitter ON public.availability_slots(sitter_id);
CREATE INDEX IF NOT EXISTS idx_availability_slots_service ON public.availability_slots(service_type);

-- ====================================================================
-- 4. TABELLA: BOOKING_REQUESTS
-- Macchina a stati del flusso fiduciario per la gestione delle richieste.
-- Stato: IN_ATTESA -> MEET_AND_GREET -> CONFERMATO -> COMPLETATO (o RIFIUTATO)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.booking_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sitter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    dog_id UUID NOT NULL REFERENCES public.dogs(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    
    service_type service_type_enum NOT NULL DEFAULT 'dog_walking',
    compensation_type compensation_type_enum NOT NULL DEFAULT 'exchange',
    
    agreed_price NUMERIC(6, 2) CHECK (agreed_price >= 0),
    agreed_credits INT CHECK (agreed_credits >= 0),
    
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    
    status booking_status_enum NOT NULL DEFAULT 'IN_ATTESA',
    
    -- Dettagli per fase fiduciaria obbligatoria: Meet & Greet
    meet_and_greet_date TIMESTAMPTZ,
    meet_and_greet_location TEXT,
    
    notes TEXT,
    
    CONSTRAINT chk_booking_dates CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_booking_requests_sitter ON public.booking_requests(sitter_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_owner ON public.booking_requests(owner_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_status ON public.booking_requests(status);

-- ====================================================================
-- 5. TRIGGER PER AGGIORNAMENTO AUTOMATICO DI UPDATED_AT
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_dogs_updated_at
    BEFORE UPDATE ON public.dogs
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_booking_requests_updated_at
    BEFORE UPDATE ON public.booking_requests
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ====================================================================
-- 6. ROW LEVEL SECURITY (RLS) & POLICIES
-- ====================================================================

-- Abilitazione RLS su tutte le tabelle
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

-- 6.1 PROFILES POLICIES
-- Lettura pubblica di tutti i profili sitter/vicini per ricerca di quartiere
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT 
    USING (true);

-- Modifica e inserimento permessi solo per il proprietario dell'account
CREATE POLICY "Users can insert their own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- 6.2 DOGS POLICIES
-- I vicini registrati possono vedere i cani dei profili
CREATE POLICY "Dogs are viewable by authenticated users" 
    ON public.dogs FOR SELECT 
    USING (true);

-- Gestione completa dei propri cani
CREATE POLICY "Owners can manage their own dogs" 
    ON public.dogs FOR ALL 
    USING (auth.uid() = owner_id);

-- 6.3 AVAILABILITY_SLOTS POLICIES
-- Le disponibilità sono visibili pubblicamente per esplorazione
CREATE POLICY "Availability slots are viewable by everyone" 
    ON public.availability_slots FOR SELECT 
    USING (true);

-- Solo il sitter può gestire i propri slot
CREATE POLICY "Sitters can manage their own slots" 
    ON public.availability_slots FOR ALL 
    USING (auth.uid() = sitter_id);

-- 6.4 BOOKING_REQUESTS POLICIES
-- Visibile sia dal proprietario del cane che dal sitter coinvolto
CREATE POLICY "Bookings viewable by owner or sitter" 
    ON public.booking_requests FOR SELECT 
    USING (auth.uid() = owner_id OR auth.uid() = sitter_id);

CREATE POLICY "Owners can create booking requests" 
    ON public.booking_requests FOR INSERT 
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owner or sitter can update booking request status" 
    ON public.booking_requests FOR UPDATE 
    USING (auth.uid() = owner_id OR auth.uid() = sitter_id);
