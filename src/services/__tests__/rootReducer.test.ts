import { expect, describe, test } from '@jest/globals';
import rootReducer from '../rootReducer';
import { initialState as ingredientsInitialState } from '../slices/ingredientsSlice';
import { initialState as constructorInitialState } from '../slices/constructorSlice';
import { initialState as authInitialState } from '../slices/authSlice';
import { initialState as ordersInitialState } from '../slices/ordersSlice';

describe('rootReducer', () => {
  test('Проверяем правильную настройку или работу rootReducer', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual({
      ingredients: ingredientsInitialState,
      burgerConstructor: constructorInitialState,
      auth: authInitialState,
      orders: ordersInitialState
    });
  });
});
