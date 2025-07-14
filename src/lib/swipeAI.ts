export async function getSwipeAISuggestions(userId: string, swipedIds: string[]) {
  const API_URL = import.meta.env.VITE_API_URL;
  const response = await fetch(`${API_URL}/swipe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      swiped_ids: swipedIds
    })
  });
  if (!response.ok) throw new Error('Swipe AI API error');
  return response.json();
} 