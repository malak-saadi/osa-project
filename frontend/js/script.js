// script.js

// ============ STORAGE UTILITIES ============
const StorageManager = {
    USERS_KEY: 'vital_users',
    CURRENT_USER_KEY: 'vital_current_user',

    getAllUsers() {
        try {
            const data = localStorage.getItem(this.USERS_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("[v0] Error reading users:", error);
            return [];
        }
    },

    addUser(userData) {
        try {
            const users = this.getAllUsers();
            users.push({
                ...userData,
                id: Date.now(),
                createdAt: new Date().toISOString()
            });
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
            return true;
        } catch (error) {
            console.error("[v0] Error adding user:", error);
            return false;
        }
    },

    getUserByUsername(username) {
        const users = this.getAllUsers();
        return users.find(u => u.username === username);
    },

    setCurrentUser(user) {
        try {
            localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
        } catch (error) {
            console.error("[v0] Error setting current user:", error);
        }
    },

    getCurrentUser() {
        try {
            const data = localStorage.getItem(this.CURRENT_USER_KEY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error("[v0] Error getting current user:", error);
            return null;
        }
    },

    clearCurrentUser() {
        try {
            localStorage.removeItem(this.CURRENT_USER_KEY);
        } catch (error) {
            console.error("[v0] Error clearing current user:", error);
        }
    }
};

// ============ VALIDATION UTILITIES ============
const Validator = {
    email(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    phone(phone) {
        const regex = /^[\d\s\-\+$$$$]{10,}$/;
        return regex.test(phone);
    },

    password(password) {
        return password && password.length >= 6;
    },

    username(username) {
        return username && username.length >= 3 && /^[a-zA-Z0-9._-]+$/.test(username);
    }
};

// ============ UI ALERTS ============
const AlertManager = {
    show(message, type = 'error', formId = null) {
        let alertContainer = document.querySelector('.alert');

        if (!alertContainer) {
            alertContainer = document.createElement('div');
            alertContainer.className = `alert alert-${type}`;

            if (formId) {
                const form = document.getElementById(formId);
                form.insertBefore(alertContainer, form.firstChild);
            } else {
                document.body.insertBefore(alertContainer, document.body.firstChild);
            }
        }

        alertContainer.textContent = message;
        alertContainer.className = `alert alert-${type} active`;

        console.log("[v0] Alert shown:", message);

        setTimeout(() => {
            alertContainer.classList.remove('active');
        }, 5000);
    },

    error(message, formId = null) {
        this.show(message, 'error', formId);
    },

    success(message, formId = null) {
        this.show(message, 'success', formId);
    }
};

// ============ LOGIN FORM ============
function initLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        // Validation
        if (!username || !password) {
            AlertManager.error('Please fill in all fields', 'loginForm');
            return;
        }

        // Check user
        const user = StorageManager.getUserByUsername(username);

        if (!user) {
            AlertManager.error('Invalid username or password', 'loginForm');
            console.log("[v0] User not found:", username);
            return;
        }

        // Verify password
        if (user.password !== password) {
            AlertManager.error('Invalid username or password', 'loginForm');
            console.log("[v0] Password mismatch for user:", username);
            return;
        }

        // Login success
        StorageManager.setCurrentUser({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        });

        AlertManager.success('Login successful! Redirecting...', 'loginForm');

        console.log("[v0] User logged in:", username);

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    });
}

// ============ REGISTER FORM ============
function initRegisterForm() {
    const form = document.getElementById('registerForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const role = document.getElementById('role').value;
        const email = document.getElementById('email').value.trim();
        const telephone = document.getElementById('telephone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validation
        if (!username || !role || !email || !telephone || !password || !confirmPassword) {
            AlertManager.error('Please fill in all fields', 'registerForm');
            return;
        }

        if (!Validator.username(username)) {
            AlertManager.error('Username must be 3+ characters (letters, numbers, dots, hyphens)', 'registerForm');
            return;
        }

        if (!Validator.email(email)) {
            AlertManager.error('Please enter a valid email address', 'registerForm');
            return;
        }

        if (!Validator.phone(telephone)) {
            AlertManager.error('Please enter a valid phone number', 'registerForm');
            return;
        }

        if (!Validator.password(password)) {
            AlertManager.error('Password must be at least 6 characters', 'registerForm');
            return;
        }

        if (password !== confirmPassword) {
            AlertManager.error('Passwords do not match', 'registerForm');
            return;
        }

        // Check if user exists
        if (StorageManager.getUserByUsername(username)) {
            AlertManager.error('Username already taken', 'registerForm');
            return;
        }

        // Create account
        const success = StorageManager.addUser({
            username,
            role,
            email,
            telephone,
            password
        });

        if (!success) {
            AlertManager.error('Error creating account. Please try again.', 'registerForm');
            return;
        }

        AlertManager.success('Account created! Redirecting to login...', 'registerForm');

        console.log("[v0] New user registered:", username);

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    });
}

// ============ DEMO DATA ============
function initializeDemoData() {
    const users = StorageManager.getAllUsers();

    if (users.length === 0) {
        StorageManager.addUser({
            username: 'jsmith',
            role: 'clinician',
            email: 'professional@medical.com',
            telephone: '+1 (555) 000-0000',
            password: 'password123'
        });

        console.log("[v0] Demo user created: jsmith / password123");
    }
}

// ============ PAGE PROTECTION ============
function protectPage() {
    const currentUser = StorageManager.getCurrentUser();
    if (!currentUser && window.location.pathname.includes('dashboard')) {
        window.location.href = 'login.html';
    }
}

// ============ LOGOUT ============
function logout() {
    StorageManager.clearCurrentUser();
    window.location.href = 'login.html';
}

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', function() {
    initializeDemoData();
    initLoginForm();
    initRegisterForm();
    protectPage();

    console.log("[v0] Application initialized");
});