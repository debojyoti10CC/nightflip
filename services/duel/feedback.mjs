const allowedModes = new Set(['solo', 'duel']);
const allowedCategories = new Set(['Game clarity', 'Duel strategy', 'Multiplayer connection', 'Visual design',
  'Fairness explanation', 'Wallet onboarding', 'Performance']);

export function validateFeedback(body) {
  if (!body || !Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5 ||
      !allowedModes.has(body.mode) || !allowedCategories.has(body.category) ||
      typeof body.message !== 'string' || body.message.length > 1000) {
    throw Object.assign(new Error('Invalid feedback.'), { status: 400 });
  }
  return { rating: body.rating, category: body.category, message: body.message.trim(), mode: body.mode };
}
