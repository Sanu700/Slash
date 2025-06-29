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
    console.log('=== BACK FUNCTION CALLED ===');
    console.log('Event method:', event.httpMethod);
    console.log('Event queryStringParameters:', event.queryStringParameters);
    console.log('Event body:', event.body);

    // Extract session_id from query parameters for GET request
    const { session_id } = event.queryStringParameters || {};
    
    console.log('🔍 === INPUT DEBUG ===');
    console.log('Query parameters:', event.queryStringParameters);
    console.log('Extracted session_id:', session_id);
    console.log('Session ID type:', typeof session_id);
    console.log('Session ID length:', session_id ? session_id.length : 'undefined');
    console.log('=== END INPUT DEBUG ===');
    
    console.log('Extracted parameters:');
    console.log('- session_id:', session_id);
    console.log('- session_id type:', typeof session_id);
    console.log('- session_id length:', session_id ? session_id.length : 'undefined');

    // Validate session_id
    if (!session_id) {
      console.error('❌ 405 ERROR: Session ID is missing from query parameters');
      console.error('❌ Query parameters received:', event.queryStringParameters);
      console.error('❌ Event method:', event.httpMethod);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Session ID is required',
          details: 'session_id parameter is missing from the query parameters',
          receivedQueryParams: event.queryStringParameters,
          method: event.httpMethod
        }),
      };
    }

    if (typeof session_id !== 'string' || session_id.trim().length === 0) {
      console.error('❌ 405 ERROR: Session ID is invalid:', session_id);
      console.error('❌ Session ID type:', typeof session_id);
      console.error('❌ Session ID length:', session_id ? session_id.length : 'undefined');
      console.error('❌ Session ID trimmed length:', session_id ? session_id.trim().length : 'undefined');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid Session ID',
          details: 'session_id must be a non-empty string',
          receivedSessionId: session_id,
          sessionIdType: typeof session_id,
          sessionIdLength: session_id ? session_id.length : 'undefined'
        }),
      };
    }

    // Build the URL for the external API with session_id as query parameter
    const externalUrl = `${AI_BASE_URL}/back?session_id=${encodeURIComponent(session_id)}`;
    console.log('🚀 === EXTERNAL API REQUEST DEBUG ===');
    console.log('External API URL:', externalUrl);
    console.log('External API Method:', 'GET');
    console.log('Session ID being sent to external API:', session_id);
    console.log('=== END EXTERNAL API REQUEST DEBUG ===');

    console.log('Making GET request to:', externalUrl);

    // Forward the request to the external AI API
    const response = await fetch(externalUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 === EXTERNAL API RESPONSE DEBUG ===');
    console.log('External API response status:', response.status);
    console.log('External API response status text:', response.statusText);
    console.log('External API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ External API error:', errorText);
      console.error('❌ External API status:', response.status);
      console.error('❌ External API status text:', response.statusText);
      console.error('❌ External API headers:', response.headers);
      console.error('❌ Request URL that failed:', externalUrl);
      console.error('❌ Session ID that was sent:', session_id);
      
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: 'External API error', 
          status: response.status,
          statusText: response.statusText,
          details: errorText,
          requestUrl: externalUrl,
          sessionId: session_id
        }),
      };
    }

    const data = await response.json();
    console.log('✅ External API response data:', data);
    console.log('=== END EXTERNAL API RESPONSE DEBUG ===');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('❌ Back function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }),
    };
  }
}; 