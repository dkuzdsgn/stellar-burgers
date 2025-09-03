export const PWD_REGEX = /^[a-zA-Z0-9!@#$%^&*()_+{}[\]:;<>,.?~\\/-]{6,}$/;
export const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export const formValidators = {
  email: {
    validator: (value: string) => EMAIL_REGEX.test(value),
    message: 'Укажите корректный email.'
  },
  password: {
    validator: (value: string) => PWD_REGEX.test(value),
    message: 'Укажите пароль посложнее.'
  }
};
