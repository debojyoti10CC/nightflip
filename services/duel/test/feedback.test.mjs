import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { validateFeedback } from '../feedback.mjs';

test('accepts and normalizes a bounded feedback record', () => {
  assert.deepEqual(validateFeedback({ rating: 4, category: 'Duel strategy', message: '  More options  ', mode: 'duel' }),
    { rating: 4, category: 'Duel strategy', message: 'More options', mode: 'duel' });
});

test('rejects invalid rating, category, mode and oversized text', () => {
  const base = { rating: 4, category: 'Game clarity', message: 'Useful', mode: 'solo' };
  for (const bad of [{ rating: 6 }, { rating: '5' }, { category: 'Custom' }, { mode: 'live' }, { message: 'x'.repeat(1001) }]) {
    assert.throws(() => validateFeedback({ ...base, ...bad }), /Invalid feedback/);
  }
});
