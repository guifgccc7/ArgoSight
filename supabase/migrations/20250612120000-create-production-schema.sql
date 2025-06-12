
-- Create enhanced profiles table with organization support
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Create organizations table
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  type TEXT DEFAULT 'commercial',
  country TEXT,
  contact_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add organization reference to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

-- Create vessels table
CREATE TABLE IF NOT EXISTS public.vessels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mmsi TEXT UNIQUE NOT NULL,
  imo TEXT UNIQUE,
  name TEXT NOT NULL,
  call_sign TEXT,
  vessel_type TEXT,
  flag_country TEXT,
  length REAL,
  width REAL,
  gross_tonnage REAL,
  organization_id UUID REFERENCES public.organizations(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create vessel tracking data table
CREATE TABLE IF NOT EXISTS public.vessel_positions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vessel_id UUID REFERENCES public.vessels(id) ON DELETE CASCADE,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  speed REAL,
  heading REAL,
  course REAL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  source TEXT DEFAULT 'ais',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  type TEXT NOT NULL,
  vessel_id UUID REFERENCES public.vessels(id),
  organization_id UUID REFERENCES public.organizations(id),
  location JSONB,
  metadata JSONB,
  status TEXT CHECK (status IN ('active', 'acknowledged', 'resolved', 'dismissed')) DEFAULT 'active',
  assigned_to UUID REFERENCES public.profiles(id),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create analytics data table
CREATE TABLE IF NOT EXISTS public.analytics_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value REAL NOT NULL,
  dimensions JSONB,
  organization_id UUID REFERENCES public.organizations(id),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create data sources configuration table
CREATE TABLE IF NOT EXISTS public.data_sources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  configuration JSONB,
  organization_id UUID REFERENCES public.organizations(id),
  is_active BOOLEAN DEFAULT true,
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vessels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vessel_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;

-- Create security definer functions for role checking
CREATE OR REPLACE FUNCTION public.get_user_organization_id(user_id UUID DEFAULT auth.uid())
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT organization_id FROM public.profiles WHERE id = user_id;
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role = 'admin' FROM public.profiles WHERE id = user_id;
$$;

-- Create RLS policies for organizations
CREATE POLICY "Users can view their organization" ON public.organizations
  FOR SELECT USING (id = public.get_user_organization_id() OR public.is_admin());

CREATE POLICY "Admins can manage organizations" ON public.organizations
  FOR ALL USING (public.is_admin());

-- Create RLS policies for vessels
CREATE POLICY "Users can view vessels in their organization" ON public.vessels
  FOR SELECT USING (organization_id = public.get_user_organization_id() OR public.is_admin());

CREATE POLICY "Users can manage vessels in their organization" ON public.vessels
  FOR ALL USING (organization_id = public.get_user_organization_id() OR public.is_admin());

-- Create RLS policies for vessel positions
CREATE POLICY "Users can view positions for vessels in their organization" ON public.vessel_positions
  FOR SELECT USING (
    vessel_id IN (
      SELECT id FROM public.vessels 
      WHERE organization_id = public.get_user_organization_id()
    ) OR public.is_admin()
  );

CREATE POLICY "Users can insert positions for vessels in their organization" ON public.vessel_positions
  FOR INSERT WITH CHECK (
    vessel_id IN (
      SELECT id FROM public.vessels 
      WHERE organization_id = public.get_user_organization_id()
    ) OR public.is_admin()
  );

-- Create RLS policies for alerts
CREATE POLICY "Users can view alerts for their organization" ON public.alerts
  FOR SELECT USING (organization_id = public.get_user_organization_id() OR public.is_admin());

CREATE POLICY "Users can manage alerts for their organization" ON public.alerts
  FOR ALL USING (organization_id = public.get_user_organization_id() OR public.is_admin());

-- Create RLS policies for analytics data
CREATE POLICY "Users can view analytics for their organization" ON public.analytics_data
  FOR SELECT USING (organization_id = public.get_user_organization_id() OR public.is_admin());

CREATE POLICY "Users can insert analytics for their organization" ON public.analytics_data
  FOR INSERT WITH CHECK (organization_id = public.get_user_organization_id() OR public.is_admin());

-- Create RLS policies for data sources
CREATE POLICY "Users can view data sources for their organization" ON public.data_sources
  FOR SELECT USING (organization_id = public.get_user_organization_id() OR public.is_admin());

CREATE POLICY "Users can manage data sources for their organization" ON public.data_sources
  FOR ALL USING (organization_id = public.get_user_organization_id() OR public.is_admin());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vessel_positions_vessel_id ON public.vessel_positions(vessel_id);
CREATE INDEX IF NOT EXISTS idx_vessel_positions_timestamp ON public.vessel_positions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_vessel_positions_location ON public.vessel_positions USING GIST(ll_to_earth(latitude, longitude));

CREATE INDEX IF NOT EXISTS idx_alerts_organization_id ON public.alerts(organization_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON public.alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON public.alerts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_data_organization_id ON public.analytics_data(organization_id);
CREATE INDEX IF NOT EXISTS idx_analytics_data_timestamp ON public.analytics_data(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_data_metric_name ON public.analytics_data(metric_name);

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.vessel_positions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.analytics_data;

-- Set replica identity for realtime updates
ALTER TABLE public.vessel_positions REPLICA IDENTITY FULL;
ALTER TABLE public.alerts REPLICA IDENTITY FULL;
ALTER TABLE public.analytics_data REPLICA IDENTITY FULL;

-- Update the handle_new_user function to assign organization
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, organization_id, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'full_name',
    (NEW.raw_user_meta_data->>'organization_id')::UUID,
    COALESCE(NEW.raw_user_meta_data->>'role', 'analyst')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default organization for demo
INSERT INTO public.organizations (name, code, type, country, contact_email) 
VALUES ('ArgoSight Demo', 'DEMO', 'government', 'US', 'admin@argosight.com')
ON CONFLICT (code) DO NOTHING;
