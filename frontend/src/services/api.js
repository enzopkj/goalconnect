const API_URL = 'http://localhost:3000/api';

export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: 'Network error' };
    }
};

export const register = async (email, password, dob) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, dob }),
        });
        return await response.json();
    } catch (error) {
        console.error('Registration API Error:', error);
        return { success: false, message: 'Network error' };
    }
};

export const forgotPassword = async (email, dob) => {
    try {
        const response = await fetch(`${API_URL}/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, dob }),
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: 'Network error' };
    }
};

export const changePassword = async (email, token, newPassword) => {
    try {
        const response = await fetch(`${API_URL}/change-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, token, newPassword }),
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: 'Network error' };
    }
};
