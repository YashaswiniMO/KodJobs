// User authentication functionality

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

// Redirect if not logged in
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
    }
}

// Register functionality
function registerUser(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorElement = document.getElementById('error-message');
    
    // Reset error message
    errorElement.style.display = 'none';
    
    // Validation
    if (!fullName || !email || !password) {
        errorElement.textContent = 'All fields are required';
        errorElement.style.display = 'block';
        return;
    }
    
    if (password !== confirmPassword) {
        errorElement.textContent = 'Passwords do not match';
        errorElement.style.display = 'block';
        return;
    }
    
    if (password.length < 6) {
        errorElement.textContent = 'Password must be at least 6 characters';
        errorElement.style.display = 'block';
        return;
    }
    
    // Get existing users or create empty array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.some(user => user.email === email)) {
        errorElement.textContent = 'User with this email already exists';
        errorElement.style.display = 'block';
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        fullName,
        email,
        password, // In a real app, you would hash this
        createdAt: new Date().toISOString(),
        profile: {
            title: '',
            bio: '',
            skills: [],
            experience: [],
            education: []
        }
    };
    
    // Add to users array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Set as current user
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
}

// Login functionality
function loginUser(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('error-message');
    
    // Reset error message
    errorElement.style.display = 'none';
    
    // Validation
    if (!email || !password) {
        errorElement.textContent = 'All fields are required';
        errorElement.style.display = 'block';
        return;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find matching user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        errorElement.textContent = 'Invalid email or password';
        errorElement.style.display = 'block';
        return;
    }
    
    // Set as current user
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
}

// Logout functionality
function logoutUser() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Initialize sidebar functionality
function initSidebar() {
    const toggleSidebar = document.getElementById('toggle-sidebar');
    const closeSidebar = document.getElementById('close-sidebar');
    const sidebar = document.querySelector('.sidebar');
    
    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', () => {
            sidebar.classList.add('active');
        });
    }
    
    if (closeSidebar) {
        closeSidebar.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }
}

// Set user name in dashboard
function setUserName() {
    const userNameElements = document.querySelectorAll('#user-name, #welcome-user-name');
    if (userNameElements.length === 0) return;
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        userNameElements.forEach(element => {
            element.textContent = currentUser.fullName;
        });
    }
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', registerUser);
    }
    
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', loginUser);
    }
    
    // Logout button
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }
    
    // Check if page requires authentication
    const requiresAuth = document.body.dataset.requiresAuth === 'true';
    if (requiresAuth) {
        requireAuth();
        initSidebar();
        setUserName();
    }
});