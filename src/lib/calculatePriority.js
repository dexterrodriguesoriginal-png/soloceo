export function calculatePriority({ sentimentStatus = 'neutral', lastInteractionDate, messageCount = 0 }) {
  let score = 0;

  // 1. Sentiment Score
  switch (sentimentStatus?.toLowerCase()) {
    case 'frustrated':
    case 'negative':
      score += 3;
      break;
    case 'neutral':
      score += 1;
      break;
    case 'positive':
      score -= 1;
      break;
    default:
      score += 0;
  }

  // 2. Days without interaction
  if (lastInteractionDate) {
    const now = new Date();
    const last = new Date(lastInteractionDate);
    const diffTime = Math.abs(now - last);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Add 0.5 score for every day without interaction
    score += (diffDays * 0.5);
  } else {
    // If never interacted, treat as high urgency (e.g., 5 days equivalent)
    score += 2.5; 
  }

  // 3. Message Count (Engagement volume)
  // More messages = potentially higher complexity or interest
  score += (messageCount / 10);

  return parseFloat(score.toFixed(2));
}
