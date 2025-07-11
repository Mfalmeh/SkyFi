-- Add INSERT policy for payments table
CREATE POLICY "Users can insert own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
