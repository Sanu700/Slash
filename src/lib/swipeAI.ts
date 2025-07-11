export async function getSwipeAISuggestions(userId: string, swipedIds: string[]) {
  const response = await fetch('http://localhost:8000/swipe', {
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