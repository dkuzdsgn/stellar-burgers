import { describe, test, expect } from '@jest/globals';
import reducer, {
  fetchIngredients,
  initialState
} from '../slices/ingredientsSlice';
import { TIngredient } from '../../utils/types';

const ingredient: TIngredient = {
  _id: '123',
  name: 'Булочка',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 200,
  price: 50,
  image: '',
  image_mobile: '',
  image_large: ''
};

describe('ingredients reducer', () => {
  test('Тест запрос ингредиентов "Request"', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Тест успешная загрузка ингредиентов "Success"', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: [ingredient]
    };
    const state = reducer(initialState, action);

    expect(state.data).toEqual([ingredient]);
    expect(state.loading).toBe(false);
  });

  test('Тест ошибка загрузки ингредиентов "Failed"', () => {
    const action = { type: fetchIngredients.rejected.type, payload: 'Ошибка' };
    const state = reducer(initialState, action);

    expect(state.error).toBe('Ошибка');
    expect(state.loading).toBe(false);
  });
});
