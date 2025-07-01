const BASE_URL = "https://slash-rag-agent.onrender.com" 

// Add retry logic for failed requests
const fetchWithRetry = async (url: string, options: RequestInit, retries = 3) => {
  console.log('=== FETCH WITH RETRY CALLED ===');
  console.log('URL:', url);
  console.log('Method:', options.method);
  console.log('Retries:', retries);
  
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempt ${i + 1} of ${retries} for URL: ${url}`);
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        mode: 'cors',
      });
      
      console.log(`Attempt ${i + 1} completed with status: ${response.status}`);
      
      if (response.ok) {
        console.log(`Request successful on attempt ${i + 1}`);
        return response;
      }
      
      // If it's a 502 or timeout error, retry
      if (response.status === 502 || response.status === 504) {
        console.log(`Attempt ${i + 1} failed with status ${response.status}, retrying...`);
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
          continue;
        }
      }
      
      console.log(`Request failed on attempt ${i + 1} with status: ${response.status}`);
      return response;
    } catch (error) {
      console.log(`Attempt ${i + 1} failed with error:`, error);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
};

export const fetchInitQuestion = async () => {
  try {
    const res = await fetchWithRetry(`${BASE_URL}/init`, {
      method: 'GET',
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to fetch initial question: ${res.status} ${res.statusText}`);
    }
    const responseText = await res.text();
    try {
      const data = JSON.parse(responseText);
      console.log('Init response:', data);
    
      // Debug logging to see what fields the AI is returning
      console.log('=== INIT RESPONSE FIELDS DEBUG ===');
      console.log('Full response data:', data);
      console.log('Data type:', typeof data);
      console.log('All keys in response:', data && typeof data === 'object' ? Object.keys(data) : 'N/A');
      console.log('Question field:', data.question);
      console.log('Session ID field:', data.session_id);
      console.log('Has question field:', 'question' in data);
      console.log('Has session_id field:', 'session_id' in data);
      console.log('=== END INIT RESPONSE FIELDS DEBUG ===');
    
      // Return both question and session_id
      return { question: data.question, session_id: data.session_id };
    } catch (e) {
      console.error('Failed to parse JSON from response:', responseText);
      throw new Error('Invalid JSON response from server.');
    }
  } catch (error) {
    console.error('Error fetching initial question:', error);
    throw error;
  }
};

export const submitAnswer = async (session_id: string, ans: string) => {
  try {
    const requestBody = { 
      session_id,  // Session ID from /init
      ans, // User's answer
    };
    
    // Debug logging to show what's being sent
    console.log('=== SUBMIT ANSWER DEBUG ===');
    console.log('Request URL:', `${BASE_URL}/submit`);
    console.log('Request method:', 'POST');
    console.log('Session ID parameter:', session_id);
    console.log('Answer parameter:', ans);
    console.log('Request body object:', requestBody);
    console.log('JSON stringified body:', JSON.stringify(requestBody));
    console.log('=== END SUBMIT ANSWER DEBUG ===');
    
    const res = await fetchWithRetry(`${BASE_URL}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    const responseText = await res.text();
    if (!res.ok) {
      throw new Error(`Failed to submit answer: ${res.status} ${res.statusText} - ${responseText}`);
    }
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse JSON from response:", responseText);
      throw new Error('Invalid JSON response from API');
    }
    if (data.status === 'error') {
      throw new Error(data.message || 'API returned an error');
    }
    return data.key || data;
  } catch (error) {
    throw error;
  }
};

export const fetchNextQuestion = async (session_id?: string) => {
  try {
    let url = `${BASE_URL}/next`;
    if (session_id) {
      url += `?session_id=${encodeURIComponent(session_id)}`;
    }
    
    console.log('=== FETCH NEXT QUESTION DEBUG ===');
    console.log('Request URL:', url);
    console.log('Session ID parameter:', session_id);
    console.log('=== END FETCH NEXT QUESTION DEBUG ===');
    
    const res = await fetchWithRetry(url, {
      method: 'GET',
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Next Error Response:', errorText);
      throw new Error(`Failed to fetch next question: ${res.status} ${res.statusText}`);
    }
    const responseText = await res.text();
    try {
      const data = JSON.parse(responseText);
      console.log('Next response:', data);
      return data.question;
    } catch (e) {
        console.error('Failed to parse JSON from response:', responseText);
        throw new Error('Invalid JSON response from server.');
    }
  } catch (error) {
    console.error('Error fetching next question:', error);
    throw error;
  }
};

export const fetchSuggestions = async (query = "", k = 5, session_id?: string) => {
  console.log('=== FETCH SUGGESTIONS FUNCTION CALLED ===');
  console.log('Parameters received:');
  console.log('- query:', query);
  console.log('- k:', k);
  console.log('- session_id:', session_id);
  console.log('BASE_URL:', BASE_URL);
  console.log('=== END PARAMETERS ===');
  
  try {
    // Handle undefined parameters properly
    const safeQuery = query === undefined ? "" : query;
    const safeK = k === undefined ? 5 : k;
    
    console.log('Fetching suggestions with query:', safeQuery, 'k:', safeK, 'session_id:', session_id);
    let url = `${BASE_URL}/suggestion?query=${encodeURIComponent(safeQuery)}&k=${safeK}`;
    if (session_id) {
      url += `&session_id=${encodeURIComponent(session_id)}`;
    }
    console.log('Final URL being called:', url);
    console.log('About to make fetch request to:', url);
    console.log('Request method: GET');
    
    const res = await fetchWithRetry(url, {
      method: 'GET',
    });
    console.log('Fetch request completed, status:', res.status);
    console.log('Response headers:', res.headers);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Suggestions Error Response:', errorText);
      console.error('Error status:', res.status);
      console.error('Error status text:', res.statusText);
      throw new Error(`Failed to fetch suggestions: ${res.status} ${res.statusText}`);
    }
    
    // Log the raw response text first
    const responseText = await res.text();
    console.log('Raw response text:', responseText);
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError, 'Raw text:', responseText);
      throw new Error('Invalid JSON response from API');
    }
    
    console.log('Parsed suggestions response:', data);
    console.log('Response type:', typeof data);
    console.log('Is array:', Array.isArray(data));
    console.log('Response keys:', data && typeof data === 'object' ? Object.keys(data) : 'N/A');
    
    // Handle different response structures with proper bounds checking
    if (Array.isArray(data)) {
      console.log('Returning array response:', data);
      // Check if array is not empty before returning
      if (data.length > 0) {
        return data;
      } else {
        console.warn('Empty array received from API');
        return [];
      }
    } else if (data.suggestions && Array.isArray(data.suggestions)) {
      console.log('Returning suggestions array:', data.suggestions);
      // Check if suggestions array is not empty
      if (data.suggestions.length > 0) {
        return data.suggestions;
      } else {
        console.warn('Empty suggestions array received from API');
        return [];
      }
    } else if (data.results && Array.isArray(data.results)) {
      console.log('Returning results array:', data.results);
      // Check if results array is not empty
      if (data.results.length > 0) {
        return data.results;
      } else {
        console.warn('Empty results array received from API');
        return [];
      }
    } else if (typeof data === 'object' && data !== null) {
      // If the response is an object but doesn't have the expected structure,
      // try to extract suggestions from it
      console.log('Attempting to parse response object:', data);
      
      // Check if the response has a direct array of items with bounds checking
      const keys = Object.keys(data);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (Array.isArray(data[key])) {
          console.log(`Found array in key: ${key}`, data[key]);
          // Check if the array is not empty before returning
          if (data[key].length > 0) {
            return data[key];
          } else {
            console.warn(`Empty array found in key: ${key}`);
            // Continue searching for non-empty arrays
            continue;
          }
        }
      }
      
      // If no non-empty array found, return the data as is (might be a single suggestion)
      console.log('No non-empty array found, returning data as is:', data);
      return [data];
    } else {
      console.warn('Unexpected response structure:', data);
      throw new Error('Invalid response structure from API');
    }
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    throw error;
  }
};

export const fetchContext = async () => {
  try {
    const res = await fetchWithRetry(`${BASE_URL}/context`, {
      method: 'GET',
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Context Error Response:', errorText);
      throw new Error(`Failed to fetch context: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching context:', error);
    throw error;
  }
};

export const goBackOneStep = async (session_id?: string) => {
  try {
    console.log('🔥 === /BACK EXECUTION DEBUG ===');
    console.log('🔥 SESSION_ID BEING SENT TO /BACK:', session_id);
    console.log('🔥 SESSION_ID TYPE:', typeof session_id);
    console.log('🔥 SESSION_ID LENGTH:', session_id ? session_id.length : 'undefined');
    console.log('🔥 THIS IS THE EXACT SAME SESSION_ID FROM /INIT');
    console.log('🔥 === END /BACK DEBUG ===');
    
    let url = `${BASE_URL}/back`;
    if (session_id) {
      url += `?session_id=${encodeURIComponent(session_id)}`;
    }
    
    console.log('🚀 === FULL REQUEST DEBUG ===');
    console.log('Request URL:', url);
    console.log('Request Method:', 'GET');
    console.log('Request Headers:', {
      'Content-Type': 'application/json',
    });
    console.log('Session ID in URL:', session_id);
    console.log('=== END REQUEST DEBUG ===');
    
    const res = await fetchWithRetry(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📥 === RESPONSE DEBUG ===');
    console.log('Response Status:', res.status);
    console.log('Response Status Text:', res.statusText);
    console.log('Response Headers:', Object.fromEntries(res.headers.entries()));
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Back Error Response:', errorText);
      console.error('❌ Back Error Status:', res.status);
      console.error('❌ Back Error Status Text:', res.statusText);
      console.error('❌ Request that failed:');
      console.error('  - URL:', url);
      console.error('  - Method: GET');
      console.error('  - Session ID sent:', session_id);
      
      // Try to parse error response for more details
      try {
        const errorData = JSON.parse(errorText);
        console.error('❌ Parsed error response:', errorData);
        console.error('❌ Error details:', errorData.details);
        console.error('❌ Received body:', errorData.receivedBody);
        console.error('❌ Parsed body:', errorData.parsedBody);
      } catch (parseError) {
        console.error('❌ Could not parse error response as JSON');
      }
      
      throw new Error(`Failed to go back: ${res.status} ${res.statusText} - ${errorText}`);
    }
    
    const data = await res.json();
    console.log('✅ Response Data:', data);
    console.log('✅ /back call completed successfully with same session_id');
    console.log('=== END RESPONSE DEBUG ===');
    return data;
  } catch (error) {
    console.error('❌ Error going back:', error);
    throw error;
  }
};

export const resetSession = async () => {
  try {
    console.log('=== RESETTING AI SESSION ===');
    const res = await fetchWithRetry(`${BASE_URL}/reset`, {
      method: 'GET',
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Reset Error Response:', errorText);
      throw new Error(`Failed to reset session: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Reset response:', data);
    console.log('=== AI SESSION RESET COMPLETE ===');
    return data;
  } catch (error) {
    console.error('Error resetting session:', error);
    throw error;
  }
};

export const submitFollowup = async (session_id: string, input: string, id?: string) => {
  console.log('=== SUBMIT FOLLOWUP FUNCTION CALLED ===');
  console.log('session_id:', session_id);
  console.log('input:', input);
  console.log('id:', id);
  
  try {
    let followupInput = input;
    if (id) {
      followupInput = `${input}\`${id}`;
    }
    
    // Build URL with query parameters for GET request
    let url = `${BASE_URL}/followup?session_id=${encodeURIComponent(session_id)}&ans=${encodeURIComponent(followupInput)}`;
    
    console.log('=== SUBMIT FOLLOWUP DEBUG ===');
    console.log('Request URL:', url);
    console.log('Session ID parameter:', session_id);
    console.log('Input parameter:', input);
    console.log('Followup input:', followupInput);
    console.log('=== END SUBMIT FOLLOWUP DEBUG ===');
    
    console.log('About to call fetchWithRetry...');
    const res = await fetchWithRetry(url, {
      method: "GET",
    });
    console.log('fetchWithRetry completed, response status:', res.status);
    
    const responseText = await res.text();
    console.log('Response text:', responseText);
    
    if (!res.ok) {
      console.error('Response not ok:', res.status, res.statusText);
      throw new Error(`Failed to submit followup: ${res.status} ${res.statusText} - ${responseText}`);
    }
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed response data:', data);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      throw new Error('Invalid JSON response from /followup');
    }
    
    if (data.status === 'error') {
      console.error('API returned error status:', data);
      throw new Error(data.message || 'API returned an error');
    }
    
    console.log('submitFollowup completed successfully, returning:', data.key || data);
    return data.key || data;
  } catch (error) {
    console.error('Error in submitFollowup:', error);
    throw error;
  }
};  