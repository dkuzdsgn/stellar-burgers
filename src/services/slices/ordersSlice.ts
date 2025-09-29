import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';
import { getOrdersApi, getFeedsApi } from '../../utils/burger-api';
import { AppDispatch } from '../store';
import { getCookie } from '../../utils/cookie';

export type OrdersState = {
  orders: TOrder[];
  feed: TOrdersData | null;
  loading: boolean;
  error: string | null;
};

export const initialState: OrdersState = {
  orders: [],
  feed: null,
  loading: false,
  error: null
};

export const fetchProfileOrders = createAsyncThunk<TOrder[]>(
  'orders/fetchProfileOrders',
  async () => {
    const res = await getOrdersApi();
    return res;
  }
);

export const fetchFeedOrders = createAsyncThunk<TOrdersData>(
  'orders/fetchFeedOrders',
  async () => {
    const res = await getFeedsApi();
    return res;
  }
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<TOrder[]>) => {
      state.orders = [...action.payload];
      if (state.feed) {
        state.feed.orders = [...action.payload];
      }
    },
    setFeed: (
      state,
      action: PayloadAction<{ total: number; totalToday: number }>
    ) => {
      state.feed = {
        orders: state.orders,
        total: action.payload.total,
        totalToday: action.payload.totalToday
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(fetchFeedOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.feed = {
          orders: action.payload.orders,
          total: action.payload.total,
          totalToday: action.payload.totalToday
        };
      })
      .addCase(fetchFeedOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      });
  }
});

export const { setOrders, setFeed } = ordersSlice.actions;

export default ordersSlice.reducer;

export const connectUserFeedWs = () => (dispatch: AppDispatch) => {
  const token = getCookie('accessToken');
  const url = `wss://norma.nomoreparties.space/orders?token=${token}`;
  const websocket = new WebSocket(url);

  websocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.success) {
      dispatch(setOrders(data.orders));
      dispatch(
        setFeed({
          total: data.total,
          totalToday: data.totalToday
        })
      );
    }
  };
};
