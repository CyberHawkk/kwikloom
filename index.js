require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Supabase using .env credentials
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Register new user
app.post('/register', async (req, res) => {
  const { name, email, referralCode } = req.body;

  // Create a unique referral code (e.g., random 6 characters)
  const userReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  const { data, error } = await supabase
    .from('users')
    .insert([{ name, email, paid: false, referral_code: userReferralCode, referred_by: referralCode }])
    .select();

  if (error) {
    console.error('Error registering user:', error.message);
    return res.status(400).json({ error: error.message });
  }

  res.json({ message: 'Registered successfully!', user: data[0] });
});

// Confirm payment
app.post('/confirm-payment', async (req, res) => {
  const { email, txid, amount } = req.body;

  const { data: user, error } = await supabase
    .from('users')
    .update({ paid: true })
    .eq('email', email)
    .select();

  if (error || !user.length) {
    console.error('Error confirming payment:', error?.message || 'User not found');
    return res.status(400).json({ error: 'User not found or error updating payment' });
  }

  const { error: txError } = await supabase
    .from('transactions')
    .insert([{ user_id: user[0].id, txid, amount }]);

  if (txError) {
    console.error('Error inserting transaction:', txError.message);
    return res.status(400).json({ error: txError.message });
  }

  res.json({ message: 'Payment confirmed!' });
});

// Dashboard: show referrals and earnings
app.get('/dashboard/:email', async (req, res) => {
  const { email } = req.params;

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    console.error('Dashboard error:', error?.message || 'User not found');
    return res.status(404).json({ error: 'User not found' });
  }

  const { data: referrals, error: refError } = await supabase
    .from('users')
    .select('*')
    .eq('referred_by', user.referral_code);

  if (refError) {
    console.error('Dashboard referral fetch error:', refError.message);
    return res.status(400).json({ error: refError.message });
  }

  res.json({
    user,
    referrals,
    earnings: referrals.length * 20, // ₵20 per referral
  });
});

// Start server
app.listen(5000, () => console.log('✅ Backend API running on http://localhost:5000'));
