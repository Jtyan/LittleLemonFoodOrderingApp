export const validateName = (name: string): boolean => {
  return /^[a-zA-Z]+$/.test(name);
};

export const validateEmail = (email: string): boolean => {
  return /^\S+@\S+\.\S+$/.test(email);
};
