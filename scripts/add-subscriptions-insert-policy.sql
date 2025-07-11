-- Add INSERT policy for subscriptions table
CREATE POLICY "Users can insert own subscriptions" ON public.subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
