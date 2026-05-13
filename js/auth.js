const AUTH_KEY = 'inmarc_auth_session';
const API_BASE = '/api';

const AuthService = {
    login: async (username, password) => {
        try {
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
        } catch (error) {
            console.warn('API not available, attempting local mock login for development...');
            // Local Mock Login Bypass for static environments (Live Server)
            if (username === 'admin' && password === 'admin123') {
                const mockUser = { 
                    username: 'admin', 
                    name: 'Admin User',
                    email: 'admin@inmarc.id',
                    role: 'administrator' 
                };
                sessionStorage.setItem(AUTH_KEY, JSON.stringify(mockUser));
                return true;
            }
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
