const BASE_URL = import.meta.env.DEV 
  ? "/api/ai" 
  : "/.netlify/functions/ai-proxy";

export const fetchInitQuestion = async () => {
  try {
    const res = await fetch(`${BASE_URL}/init`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to fetch initial question: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Init response:', data);
    return data.question;
  } catch (error) {
    console.error('Error fetching initial question:', error);
    throw error;
  }
};

export const submitAnswer = async (answer: string) => {
  try {
    console.log('=== SUBMIT ANSWER API CALL ===');
    console.log('Answer being sent:', answer);
    console.log('Answer type:', typeof answer);
    console.log('Answer length:', answer.length);
    console.log('First 200 characters:', answer.substring(0, 200));
    console.log('Last 200 characters:', answer.substring(answer.length - 200));
    
    // ✅ Frontend Validation (Defensive Coding)
    // Check if answer contains backticks and validate format
    if (answer.includes('`')) {
      const parts = answer.split("`");
      console.log('Answer parts:', parts);
      console.log('Number of parts:', parts.length);
      
      // Temporarily disable validation to test backend compatibility
      /*
      // Validate that we have exactly 5 parts (name, location, relation, occasion, budget)
      if (parts.length !== 5) {
        console.error("Invalid answer format. Expected exactly 5 backtick-separated parts.");
        console.error("Expected format: name`location`relation`occasion`budget");
        console.error("Parts found:", parts);
        console.error("Number of parts:", parts.length);
        throw new Error("Invalid answer format. Please make sure all 5 fields are filled: name, location, relation, occasion, budget");
      }
      
      // Log each part for debugging
      parts.forEach((part, index) => {
        const fieldNames = ['name', 'location', 'relation', 'occasion', 'budget'];
        console.log(`Part ${index} (${fieldNames[index]}): "${part.trim()}" (length: ${part.trim().length})`);
      });
      
      // Check for empty parts
      const emptyParts = parts.filter(part => part.trim().length === 0);
      if (emptyParts.length > 0) {
        console.warn("Found empty parts:", emptyParts.length);
        console.warn("Empty part indices:", parts.map((part, index) => part.trim().length === 0 ? index : -1).filter(i => i !== -1));
      }
      */
    } else {
      console.log('Answer does not contain backticks, treating as single field');
    }
    
    const requestBody = { ans: answer };
    console.log('Full request body:', JSON.stringify(requestBody, null, 2));
    console.log('=== END SUBMIT ANSWER API CALL ===');
    
    const res = await fetch(`${BASE_URL}/submit`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      mode: 'cors',
      body: JSON.stringify(requestBody),
    });
    
    // Log the raw response first
    const responseText = await res.text();
    console.log('Raw response text:', responseText);
    console.log('Response status:', res.status);
    console.log('Response headers:', Object.fromEntries(res.headers.entries()));
    
    if (!res.ok) {
      console.error('Submit Error Response:', responseText);
      console.error('Response status:', res.status);
      console.error('Response status text:', res.statusText);
      throw new Error(`Failed to submit answer: ${res.status} ${res.statusText} - ${responseText}`);
    }
    
    // Try to parse the response
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      throw new Error('Invalid JSON response from API');
    }
    
    console.log('Submit response:', data);
    
    // Check if the response indicates an error
    if (data.status === 'error') {
      console.error('API returned error status:', data);
      throw new Error(data.message || 'API returned an error');
    }
    
    return data.key || data;
  } catch (error) {
    console.error('Error submitting answer:', error);
    throw error;
  }
};

export const fetchNextQuestion = async () => {
  try {
    const res = await fetch(`${BASE_URL}/next`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Next Error Response:', errorText);
      throw new Error(`Failed to fetch next question: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Next response:', data);
    return data.question;
  } catch (error) {
    console.error('Error fetching next question:', error);
    throw error;
  }
};

export const fetchSuggestions = async (query = "", k = 5) => {
  try {
    console.log('Fetching suggestions with query:', query, 'k:', k);
    const url = `${BASE_URL}/suggestion?query=${encodeURIComponent(query)}&k=${k}`;
    console.log('Fetching from URL:', url);
    
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Suggestions Error Response:', errorText);
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
      console.error('Failed to parse JSON:', parseError);
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
    const res = await fetch(`${BASE_URL}/context`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
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

export const goBackOneStep = async () => {
  try {
    const res = await fetch(`${BASE_URL}/back`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Back Error Response:', errorText);
      throw new Error(`Failed to go back: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error going back:', error);
    throw error;
  }
};

export const resetSession = async () => {
  try {
    console.log('=== RESETTING AI SESSION ===');
    const res = await fetch(`${BASE_URL}/reset`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
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