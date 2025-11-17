export const validateName = (name: string): boolean => {
  return /^[a-zA-Z]+$/.test(name);
};

export const validateEmail = (email: string): boolean => {
  return /^\S+@\S+\.\S+$/.test(email);
};

export const validatePhoneNumber = (num: string): boolean => {
  return num.length >= 9 && num.length <= 10
} 