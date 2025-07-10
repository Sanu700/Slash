import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use service role for backend
const supabase = createClient(supabaseUrl, supabaseKey);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { contacts } = JSON.parse(event.body || '{}');
    if (!contacts || !Array.isArray(contacts)) {
      return { statusCode: 400, body: 'Invalid contacts' };
    }

    // Flatten all emails and phones from contacts
    const emails = contacts.flatMap((c: any) => c.email || []);
    const phones = contacts.flatMap((c: any) => c.tel || []);

    // Query Supabase for users with matching email or phone
    let matchedUsers: any[] = [];

    if (emails.length > 0) {
      const { data: emailMatches, error: emailError } = await supabase
        .from('users')
        .select('id, user_metadata, email, avatar_url')
        .in('email', emails);

      if (emailError) throw emailError;
      matchedUsers = matchedUsers.concat(emailMatches || []);
    }

    if (phones.length > 0) {
      const { data: phoneMatches, error: phoneError } = await supabase
        .from('users')
        .select('id, user_metadata, email, avatar_url, phone')
        .in('phone', phones);

      if (phoneError) throw phoneError;
      matchedUsers = matchedUsers.concat(phoneMatches || []);
    }

    // Remove duplicates by user id
    const uniqueUsers = Array.from(new Map(matchedUsers.map(u => [u.id, u])).values());

    // Format for frontend
    const formatted = uniqueUsers.map(u => ({
      id: u.id,
      name: u.user_metadata?.full_name || u.email,
      avatar: u.avatar_url || 'https://randomuser.me/api/portraits/lego/1.jpg',
      mutual: 0 // You can add logic for mutual friends if needed
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(formatted)
    };
  } catch (err) {
    return { statusCode: 500, body: 'Server error' };
  }
};
