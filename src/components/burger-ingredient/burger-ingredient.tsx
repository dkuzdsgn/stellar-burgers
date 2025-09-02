import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { addIngredient, setBun } from '../../services/slices/constructorSlice';
import { nanoid } from 'nanoid';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      const item = { ...ingredient, id: nanoid() };

      if (ingredient.type === 'bun') {
        dispatch(setBun(item));
      } else if (ingredient.type === 'sauce') {
        dispatch(addIngredient(item));
      } else if (ingredient.type === 'main') {
        dispatch(addIngredient(item));
      }
      console.log('handleAdd called:', ingredient);
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
