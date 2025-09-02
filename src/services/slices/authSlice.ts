import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  logoutApi,
  TLoginData,
  TRegisterData
} from '../../utils/burger-api';
import { TUser } from '@utils-types';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';

type TAuthState = {
  form: TLoginData;
  error: string | null;
  sending: boolean;
  user: TUser | null;
  isInit: boolean;
};

const initialState: TAuthState = {
  form: {
    email: '',
    password: ''
  },
  error: null,
  sending: false,
  user: { name: '', email: '' },
  isInit: false
};

export type TFieldType<T> = {
  field: keyof T;
  value: string;
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setFormValue: (state, action: PayloadAction<TFieldType<TLoginData>>) => {
      state.form[action.payload.field] = action.payload.value;
    },
    setIsInit: (state, action: PayloadAction<boolean>) => {
      state.isInit = action.payload;
    },
    userLogout: (state) => {
      state.user = null;
    }
  },
  selectors: {
    sendingSelector: (state) => state.sending,
    sendErrorSelector: (state) => state.error,
    authSelector: (state) => state.form
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.error = null;
        state.sending = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload as string;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.sending = false;
        state.user = action.payload;
        state.isInit = true;
      })
      .addCase(register.pending, (state) => {
        state.error = null;
        state.sending = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.sending = false;
        state.user = action.payload;
        state.isInit = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload as string;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isInit = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = { name: '', email: '' };
        state.error = null;
        state.sending = false;
        state.isInit = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.sending = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload as string;
      });
  }
});

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: Omit<TRegisterData, 'name'>) => {
    const data = await loginUserApi({ email, password });

    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('refreshToken');
    if (!token) {
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
      return;
    }

    try {
      await logoutApi();
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
    } catch (err) {
      return rejectWithValue('Ошибка выхода');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }: TRegisterData, { rejectWithValue }) => {
    try {
      const data = await registerUserApi({ name, email, password });
      if (!data?.success) {
        return rejectWithValue(data);
      }
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data.user;
    } catch (err) {
      return rejectWithValue('Ошибка регистрации');
    }
  }
);

export const getUser = createAsyncThunk('auth/getUser', async () => {
  const res = await getUserApi();
  return res.user;
});

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async ({ name, email, password }: TRegisterData, { rejectWithValue }) => {
    try {
      const token = getCookie('accessToken');
      const res = await fetch(
        'https://norma.nomoreparties.space/api/auth/user',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`
          },
          body: JSON.stringify({ name, email, password })
        }
      );

      const data = await res.json();
      if (!data?.success) {
        return rejectWithValue(data);
      }

      return data.user;
    } catch (err) {
      return rejectWithValue('Ошибка обновления профиля');
    }
  }
);

export const { setFormValue, setIsInit, userLogout } = authSlice.actions;

export const { sendingSelector, sendErrorSelector, authSelector } =
  authSlice.selectors;

export default authSlice.reducer;
