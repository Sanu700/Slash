import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Setup Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Not the anon key if you're writing from backend
);

// Your link map
const linkMap = {
  "paragliding-kamshet": "https://example.com/paragliding-kamshet",
  "pottery-bandra": "https://example.com/pottery-bandra",
  "chef-dinner": "https://example.com/private-chef-dinner"
};

router.get('/:serviceId', async (req, res) => {
  const { serviceId } = req.params;
  const redirectUrl = linkMap[serviceId];
  const userId = req.headers['x-user-id'] || 'anonymous';
  const timestamp = new Date().toISOString();

  // Log to Supabase
  await supabase.from('click_logs').insert([
    { user_id: userId, service_id: serviceId, timestamp }
  ]);

  if (redirectUrl) {
    return res.redirect(302, redirectUrl);
  } else {
    return res.status(404).send('Service not found');
  }
});

export default router;
