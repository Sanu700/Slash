import type { Handler } from '@netlify/functions';

const AI_BASE_URL = 'https://slash-rag-agent.onrender.com';

export const handler: Handler = async (event) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
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

  try {
    console.log('=== SUGGESTION FUNCTION CALLED ===');
    console.log('Event method:', event.httpMethod);
    console.log('Event queryStringParameters:', event.queryStringParameters);
    console.log('Event body:', event.body);

    // Extract query parameters
    const { query = '', k = '5', session_id } = event.queryStringParameters || {};
    
    console.log('Extracted parameters:');
    console.log('- query:', query);
    console.log('- k:', k);
    console.log('- session_id:', session_id);

    // Build the URL for the external API
    let url = `${AI_BASE_URL}/suggestion?query=${encodeURIComponent(query)}&k=${k}`;
    if (session_id) {
      url += `&session_id=${encodeURIComponent(session_id)}`;
    }

    console.log('Making request to:', url);

    // Forward the request to the external AI API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('External API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('External API error:', errorText);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: 'External API error', details: errorText }),
      };
    }

    const data = await response.json();
    console.log('External API response data:', data);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Suggestion function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }),
    };
  }
}; 