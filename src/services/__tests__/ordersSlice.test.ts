import { describe, test, expect } from '@jest/globals';
import reducer, {
  setOrders,
  setFeed,
  fetchProfileOrders,
  fetchFeedOrders,
  OrdersState,
  initialState
} from '../slices/ordersSlice';
import { TOrder, TOrdersData } from '../../utils/types';

const order: TOrder = {
  _id: '1',
  status: 'done',
  name: 'Тестовый заказ',
  createdAt: '28-09-2025',
  updatedAt: '29-09-2025',
  number: 123,
  ingredients: ['1', '2']
};

describe('orders reducer', () => {
  test('Тест setOrders', () => {
    const action = { type: setOrders.type, payload: [order] };
    const state = reducer(initialState, action);

    expect(state.orders).toEqual([order]);
  });

  test('Тест setFeed', () => {
    const action = {
      type: setFeed.type,
      payload: { total: 10, totalToday: 2 }
    };
    const state = reducer({ ...initialState, orders: [order] }, action);

    expect(state.feed).toEqual({
      orders: [order],
      total: 10,
      totalToday: 2
    });
  });

  test('Тест fetchProfileOrders (pending)', () => {
    const action = { type: fetchProfileOrders.pending.type };
    const state = reducer(initialState, action);

    expect(state.loading).toBe(true);
  });

  test('Тест fetchProfileOrders (fulfilled)', () => {
    const action = {
      type: fetchProfileOrders.fulfilled.type,
      payload: [order]
    };
    const state = reducer(initialState, action);

    expect(state.orders).toEqual([order]);
    expect(state.loading).toBe(false);
  });

  test('Тест fetchProfileOrders (rejected)', () => {
    const action = {
      type: fetchProfileOrders.rejected.type,
      error: { message: 'Ошибка' }
    };
    const state = reducer(initialState, action);

    expect(state.error).toBe('Ошибка');
    expect(state.loading).toBe(false);
  });

  test('Тест fetchFeedOrders (pending)', () => {
    const action = { type: fetchFeedOrders.pending.type };
    const state = reducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Тест fetchFeedOrders (fulfilled)', () => {
    const payload: TOrdersData = {
      orders: [order],
      total: 50,
      totalToday: 5
    };
    const action = { type: fetchFeedOrders.fulfilled.type, payload };
    const state = reducer(initialState, action);

    expect(state.feed).toEqual(payload);
    expect(state.orders).toEqual([order]);
    expect(state.loading).toBe(false);
  });

  test('Тест fetchFeedOrders (rejected)', () => {
    const action = {
      type: fetchFeedOrders.rejected.type,
      error: { message: 'Ошибка' }
    };
    const state = reducer(initialState, action);

    expect(state.error).toBe('Ошибка');
    expect(state.loading).toBe(false);
  });
});
