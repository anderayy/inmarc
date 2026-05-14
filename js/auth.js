const AUTH_KEY = 'inmarc_auth_session';
const API_BASE = '/api';

const AuthService = {
    login: async (username, password) => {
        try {
            const response = await fetch(`${API_BASE}/auth.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ username, password })
            });
            const result = await response.json();
            
            if (response.ok && result.success) {
                sessionStorage.setItem(AUTH_KEY, JSON.stringify(result.user));
                return true;
            }
            // If API returns error but response is received, throw to trigger mock
            throw new Error(result.message || 'Auth failed');
        } catch (error) {
            console.warn('API error or not available:', error.message);
        }
        return false;
    },

    logout: () => {
        sessionStorage.removeItem(AUTH_KEY);
        window.location.href = '/admin/login.html';
    },

    getUser: () => {
        const user = sessionStorage.getItem(AUTH_KEY);
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!AuthService.getUser();
    },

    checkAuth: () => {
        if (!AuthService.isAuthenticated()) {
            window.location.href = '/admin/login.html';
        }
    }
};

export default AuthService;
