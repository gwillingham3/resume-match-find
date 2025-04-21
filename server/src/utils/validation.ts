// Email validation using regex
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation
export const isStrongPassword = (password: string): boolean => {
  // At least 6 characters
  if (password.length < 6) return false;
  
  // At least one letter
  if (!/[a-zA-Z]/.test(password)) return false;
  
  return true;
};

// Password strength requirements message
export const getPasswordRequirements = (): string => {
  return 'Password must be at least 6 characters long and contain at least one letter.';
}; 