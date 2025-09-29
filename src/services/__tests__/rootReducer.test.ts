import { expect, describe, test } from '@jest/globals';
import rootReducer from '../rootReducer';

describe('rootReducer', () => {
  test('Проверяем правильную настройку или работу rootReducer', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('orders');
  });
});
