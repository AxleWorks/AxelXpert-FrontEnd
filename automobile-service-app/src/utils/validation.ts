export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
    return password.length >= 6;
};

export const validateSignupForm = (email: string, password: string): boolean => {
    return validateEmail(email) && validatePassword(password);
};

export const validateLoginForm = (email: string, password: string): boolean => {
    return validateEmail(email) && password.length > 0;
};