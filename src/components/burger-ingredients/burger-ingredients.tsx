import { nanoid } from 'nanoid';

import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector, useDispatch } from '../../services/store';
import { TConstructorIngredient, TIngredient, TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { Preloader } from '@ui';
export const BurgerIngredients: FC = () => {
  const dispatch = useDispatch();

  const { data: ingredients, loading } = useSelector(
    (state) => state.ingredients
  );
  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
      console.log('Dispatching fetchIngredients...');
    }
  }, [dispatch, ingredients.length]);

  const buns = ingredients.filter((item: TIngredient) => item.type === 'bun');
  const sauces = ingredients.filter(
    (item: TIngredient) => item.type === 'sauce'
  );
  const mains = ingredients.filter((item: TIngredient) => item.type === 'main');

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });

  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });

  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  useEffect(() => {
    if (ingredients.length) {
      console.log(
        'Types in ingredients:',
        ingredients.map((i) => i.type)
      );
    }
  }, [ingredients]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return <Preloader />;
  if (!ingredients.length) return <p>Ингредиенты не найдены</p>;

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
