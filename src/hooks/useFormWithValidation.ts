import React, { ChangeEvent } from 'react';
import { useDispatch, useSelector } from '../services/store';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { RootState } from '../services/store';

export type TFieldType<T> = {
  field: keyof T;
  value: string;
};

type TErrorState<T> = { [key in keyof T]: string };
type TFormValidators<T> = {
  [key in keyof T]: { validator: (value: string) => boolean; message: string };
};

export function useFormWithValidation<T>(
  selector: (state: RootState) => T,
  setFormValue: ActionCreatorWithPayload<TFieldType<T>>,
  validators: TFormValidators<T>
) {
  const values = useSelector(selector);
  const [errors, setErrors] = React.useState<TErrorState<T>>(
    initError<T>(values)
  );
  const [isValid, setIsValid] = React.useState(false);
  const dispatch = useDispatch();

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const input = evt.target;
    const value = input.value;
    const name = input.name as keyof T;
    const isValid = validators[name]?.validator(value) ?? true;
    dispatch(setFormValue({ field: name, value }));
    setErrors({
      ...errors,
      [name]: !isValid ? validators[name]!.message : undefined
    });
    setIsValid(isValid);
  };

  return { values, handleChange, errors, isValid };
}

// Функция initError создаёт объект с такими же ключами , как у того,
//  с которым работает хук, но с пустыми строками в значениях
function initError<T>(a: T): TErrorState<T> {
  return Object.keys(a as object).reduce((acc, k) => {
    acc[k as keyof T] = '';
    return acc;
  }, {} as TErrorState<T>);
}
