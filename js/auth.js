const AUTH_KEY = 'inmarc_auth_session';
const API_BASE = '/api';

const AuthService = {
    login: async (username, password) => {
        const response = await fetch(`${API_BASE}/auth.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const result = await response.json();
        
        if (result.success) {
            sessionStorage.setItem(AUTH_KEY, JSON.stringify(result.user));
            return true;
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
