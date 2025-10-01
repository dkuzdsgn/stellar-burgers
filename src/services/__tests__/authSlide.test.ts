import { describe, test, expect } from '@jest/globals';
import reducer, {
  setFormValue,
  userLogout,
  authChecked,
  login,
  register,
  getUser,
  logout,
  updateUser,
  initialState
} from '../slices/authSlice';
import { TUser } from '../../utils/types';
const user: TUser = { email: 'test@mail.com', name: 'Test' };

describe('auth reducer', () => {
  test('Тест setFormValue', () => {
    const action = {
      type: setFormValue.type,
      payload: { field: 'email', value: 'new@mail.com' }
    };
    const state = reducer(initialState, action);

    expect(state.form.email).toBe('new@mail.com');
  });

  test('Тест userLogout', () => {
    const action = { type: userLogout.type };
    const state = reducer({ ...initialState, user }, action);

    expect(state.user).toBeNull();
  });

  test('Тест authChecked', () => {
    const action = { type: authChecked.type };
    const state = reducer(initialState, action);

    expect(state.isAuthChecked).toBe(true);
  });

  test('Тест login (pending)', () => {
    const action = { type: login.pending.type };
    const state = reducer(initialState, action);

    expect(state.sending).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Тест login (rejected)', () => {
    const action = { type: login.rejected.type, payload: 'Ошибка авторизации' };
    const state = reducer(initialState, action);

    expect(state.error).toBe('Ошибка авторизации');
    expect(state.sending).toBe(false);
  });

  test('Тест login (fulfilled)', () => {
    const action = { type: login.fulfilled.type, payload: user };
    const state = reducer(initialState, action);

    expect(state.user).toEqual(user);
    expect(state.isAuthChecked).toBe(true);
    expect(state.sending).toBe(false);
  });

  test('Тест register (pending)', () => {
    const action = { type: register.pending.type };
    const state = reducer(initialState, action);

    expect(state.sending).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Тест register (fulfilled)', () => {
    const action = { type: register.fulfilled.type, payload: user };
    const state = reducer(initialState, action);

    expect(state.user).toEqual(user);
    expect(state.isAuthChecked).toBe(true);
  });

  test('Тест register (rejected)', () => {
    const action = {
      type: register.rejected.type,
      payload: 'Ошибка регистрации'
    };
    const state = reducer(initialState, action);

    expect(state.error).toBe('Ошибка регистрации');
    expect(state.sending).toBe(false);
  });

  test('Тест getUser (fulfilled)', () => {
    const action = { type: getUser.fulfilled.type, payload: user };
    const state = reducer(initialState, action);

    expect(state.user).toEqual(user);
    expect(state.isAuthChecked).toBe(true);
  });

  test('Тест logout (fulfilled)', () => {
    const action = { type: logout.fulfilled.type };
    const state = reducer({ ...initialState, user }, action);

    expect(state.user).toBeNull();
    expect(state.isAuthChecked).toBe(true);
  });

  test('Тест updateUser (pending)', () => {
    const action = { type: updateUser.pending.type };
    const state = reducer(initialState, action);

    expect(state.sending).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Тест updateUser (fulfilled)', () => {
    const updatedUser: TUser = { email: 'update@mail.com', name: 'Updated' };
    const action = { type: updateUser.fulfilled.type, payload: updatedUser };
    const state = reducer(initialState, action);

    expect(state.user).toEqual(updatedUser);
    expect(state.sending).toBe(false);
  });

  test('Тест updateUser (rejected)', () => {
    const action = {
      type: updateUser.rejected.type,
      payload: 'Ошибка обновления'
    };
    const state = reducer(initialState, action);

    expect(state.error).toBe('Ошибка обновления');
    expect(state.sending).toBe(false);
  });
});
