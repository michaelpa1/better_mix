-- ============================================
-- Migration: Admin Module
-- Description: Complete admin system with authentication and management features
-- Dependencies: None (base migration)
-- ============================================

-- 1. CREATE ENUM TYPES
CREATE TYPE public.user_role AS ENUM ('USER', 'ADMIN');

-- 2. CREATE TABLES (Parent → Child order)

-- Profiles table with role-based access
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role public.user_role DEFAULT 'USER' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Jobs table for tracking processing jobs
CREATE TABLE public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    size_bytes BIGINT NOT NULL,
    service TEXT NOT NULL,
    mode TEXT NOT NULL,
    estimated_credits INTEGER NOT NULL,
    result_url TEXT,
    analysis_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Pricing tiers for service configuration
CREATE TABLE public.pricing_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    per_min_credit_cost INTEGER NOT NULL,
    preview_free BOOLEAN DEFAULT true,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Feature flags for system configuration
CREATE TABLE public.feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    enabled BOOLEAN DEFAULT false,
    tier TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. CREATE INDEXES (for performance)
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_jobs_user_id ON public.jobs(user_id);
CREATE INDEX idx_jobs_service ON public.jobs(service);
CREATE INDEX idx_jobs_created_at ON public.jobs(created_at DESC);
CREATE INDEX idx_pricing_tiers_active ON public.pricing_tiers(active);
CREATE INDEX idx_feature_flags_enabled ON public.feature_flags(enabled);

-- 4. TRIGGER FUNCTION (reads raw_user_meta_data from auth.users)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'USER')::public.user_role
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. TRIGGER (fires after auth.users insert)
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 6. ENABLE RLS (security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- 7. CREATE RLS POLICIES (access control)

-- Profiles policies
CREATE POLICY "users_view_own_profile" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (id = auth.uid());

CREATE POLICY "users_update_own_profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (id = auth.uid()) 
WITH CHECK (id = auth.uid());

CREATE POLICY "admins_view_all_profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');

CREATE POLICY "admins_update_all_profiles" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN')
WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');

-- Jobs policies
CREATE POLICY "users_view_own_jobs" 
ON public.jobs 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "users_insert_own_jobs" 
ON public.jobs 
FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "admins_view_all_jobs" 
ON public.jobs 
FOR SELECT 
TO authenticated 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');

-- Pricing tiers policies (admin only)
CREATE POLICY "admins_manage_pricing_tiers" 
ON public.pricing_tiers 
FOR ALL 
TO authenticated 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN')
WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');

-- Feature flags policies (admin only)
CREATE POLICY "admins_manage_feature_flags" 
ON public.feature_flags 
FOR ALL 
TO authenticated 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN')
WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'ADMIN');

-- 8. INSERT MOCK DATA (Trigger auto-creates profiles)
DO $$
DECLARE
    admin_user_id UUID := gen_random_uuid();
    demo_user_id UUID := gen_random_uuid();
BEGIN
    -- Insert auth.users with profile data in raw_user_meta_data
    -- Trigger will automatically create profiles from this data
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password,
        email_confirmed_at, created_at, updated_at, raw_user_meta_data,
        raw_app_meta_data, is_sso_user, is_anonymous, confirmation_token,
        confirmation_sent_at, recovery_token, recovery_sent_at,
        email_change_token_new, email_change, email_change_sent_at,
        email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone,
        phone_change, phone_change_token, phone_change_sent_at
    ) VALUES (
        admin_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated',
        'authenticated', 'admin@demo.com', crypt('admin123', gen_salt('bf')),
        now(), now(), now(), 
        '{"role": "ADMIN"}'::jsonb,
        '{"provider": "email"}'::jsonb, false, false, '', null, '', null,
        '', '', null, '', 0, '', null, null, '', '', null
    ), (
        demo_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated',
        'authenticated', 'demo@test.com', crypt('demo123', gen_salt('bf')),
        now(), now(), now(),
        '{"role": "USER"}'::jsonb,
        '{"provider": "email"}'::jsonb, false, false, '', null, '', null,
        '', '', null, '', 0, '', null, null, '', '', null
    );

    -- Insert sample pricing tiers
    INSERT INTO public.pricing_tiers (name, per_min_credit_cost, preview_free, active) VALUES
        ('Basic', 1, true, true),
        ('Pro', 5, false, true),
        ('Enterprise', 10, false, true);

    -- Insert sample feature flags
    INSERT INTO public.feature_flags (key, enabled, tier) VALUES
        ('enhanced_processing', true, 'Pro'),
        ('batch_processing', false, 'Enterprise'),
        ('real_time_analysis', true, null);

    -- Insert sample jobs
    INSERT INTO public.jobs (user_id, filename, size_bytes, service, mode, estimated_credits, result_url) VALUES
        (demo_user_id, 'sample_track.wav', 5242880, 'mastering_preview', 'dev', 3, 'https://example.com/result1.wav'),
        (demo_user_id, 'demo_audio.mp3', 3145728, 'enhance_preview', 'dev', 2, 'https://example.com/result2.mp3');

    RAISE NOTICE 'Demo credentials: admin@demo.com/admin123, demo@test.com/demo123';
    RAISE NOTICE 'Profiles auto-created by trigger from raw_user_meta_data';
    RAISE NOTICE 'Sample data inserted: pricing tiers, feature flags, and jobs';
END $$;