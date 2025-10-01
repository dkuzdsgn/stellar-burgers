import { describe, test, expect } from '@jest/globals';
import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  initialState
} from '../slices/constructorSlice';
import { TConstructorIngredient } from '../../utils/types';

const ingredient: TConstructorIngredient = {
  _id: '1',
  id: '1',
  name: 'Котлета',
  type: 'main',
  proteins: 5,
  fat: 1,
  carbohydrates: 5,
  calories: 250,
  price: 100,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
};

const ingredient2: TConstructorIngredient = {
  _id: '2',
  id: '2',
  name: 'Coyc',
  type: 'main',
  proteins: 5,
  fat: 1,
  carbohydrates: 5,
  calories: 250,
  price: 100,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
};

describe('burgerConstructor reducer', () => {
  test('Добавление ингредиента', () => {
    const action = { type: addIngredient.type, payload: ingredient };
    const state = reducer(initialState, action);

    expect(state.ingredients).toEqual([ingredient]);
  });

  test('Удаление ингредиента', () => {
    const prevState = { ...initialState, ingredients: [ingredient] };
    const action = { type: removeIngredient.type, payload: ingredient.id };
    const state = reducer(prevState, action);

    expect(state.ingredients).toEqual([]);
  });

  test('Изменение порядка ингредиентов', () => {
    const prevState = {
      ...initialState,
      ingredients: [ingredient, ingredient2]
    };

    const action = {
      type: moveIngredient.type,
      payload: { fromIndex: 0, toIndex: 1 }
    };
    const state = reducer(prevState, action);

    expect(state.ingredients).toEqual([ingredient2, ingredient]);
  });
});
