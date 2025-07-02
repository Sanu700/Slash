import { Handler } from '@netlify/functions';

const AI_BASE_URL = 'https://slash-rag-agent.onrender.com';

export const handler: Handler = async (event) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { session_id, ans } = body;

    if (!session_id || !ans) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'session_id and ans are required' }),
      };
    }

    console.log('=== FOLLOWUP FUNCTION CALLED ===');
    console.log('Session ID:', session_id);
    console.log('Followup input:', ans);

    // Forward the request to the external AI API /followup endpoint
    const response = await fetch(`${AI_BASE_URL}/followup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_id, ans }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API Error:', errorText);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: `AI API error: ${response.status} ${response.statusText}`,
          details: errorText 
        }),
      };
    }

    const data = await response.json();
    console.log('Followup API response:', data);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };

  } catch (error) {
    console.error('Followup function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
}; 