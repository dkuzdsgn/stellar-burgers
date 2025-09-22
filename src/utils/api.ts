import { TUser } from '@utils-types';
import { loginUserApi, TLoginData } from './burger-api';
import { setCookie } from './cookie';

export const apiLogin = async (
  email: string,
  password: string
): Promise<TUser> => {
  const res = await loginUserApi({ email, password });

  localStorage.setItem('refreshToken', res.refreshToken);
  setCookie('accessToken', res.accessToken);

  return res.user;
};
