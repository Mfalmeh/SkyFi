-- Create users table extension for additional user data
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create packages table
CREATE TABLE IF NOT EXISTS public.packages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  price INTEGER NOT NULL,
  duration_days INTEGER NOT NULL,
  description TEXT,
  features JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  package_id INTEGER REFERENCES public.packages(id),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'active',
  payment_method VARCHAR(20),
  payment_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  subscription_id INTEGER REFERENCES public.subscriptions(id),
  amount INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'UGX',
  payment_method VARCHAR(20),
  payment_reference TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default packages
INSERT INTO public.packages (name, price, duration_days, description, features) VALUES
('Daily Package', 1500, 1, 'Unlimited WiFi access for 24 hours', '["Unlimited WiFi access", "Valid for 1 day", "24/7 customer support"]'),
('Weekly Package', 8500, 7, 'Unlimited WiFi access for 7 days', '["Unlimited WiFi access", "Valid for 7 days", "24/7 customer support"]'),
('Monthly Package', 35000, 30, 'Unlimited WiFi access for 30 days', '["Unlimited WiFi access", "Valid for 30 days", "24/7 customer support"]')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
