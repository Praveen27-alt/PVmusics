/* ═══════════════════════════════════════════════════════════
   PVmusic — Login Page Logic (login.js)
   ═══════════════════════════════════════════════════════════ */

// ── DOM Refs ──
const $ = (sel) => document.querySelector(sel);

const dom = {
  tabLogin: $('#tab-login'),
  tabSignup: $('#tab-signup'),
  tabIndicator: $('#tab-indicator'),
  formLogin: $('#form-login'),
  formSignup: $('#form-signup'),
  // Login fields
  loginUsername: $('#login-username'),
  loginPassword: $('#login-password'),
  loginError: $('#login-error'),
  loginLoader: $('#login-loader'),
  btnLogin: $('#btn-login'),
  toggleLoginPw: $('#toggle-login-pw'),
  rememberMe: $('#remember-me'),
  forgotLink: $('#forgot-link'),
  // Signup fields
  signupName: $('#signup-name'),
  signupEmail: $('#signup-email'),
  signupPassword: $('#signup-password'),
  signupConfirm: $('#signup-confirm'),
  signupError: $('#signup-error'),
  signupLoader: $('#signup-loader'),
  btnSignup: $('#btn-signup'),
  toggleSignupPw: $('#toggle-signup-pw'),
  passwordStrength: $('#password-strength'),
  strengthFill: $('#strength-fill'),
  strengthText: $('#strength-text'),
  // Social
  btnGoogle: $('#btn-google'),
  btnGithub: $('#btn-github'),
  // Background
  bgParticles: $('#bg-particles'),
  loginWrapper: $('.login-wrapper'),
  loginCard: $('#login-card')
};

// ═══════════════════════════════════════════
// AUTO REDIRECT IF ALREADY LOGGED IN
// ═══════════════════════════════════════════
(function checkAuth() {
  const session = JSON.parse(localStorage.getItem('pvmusic_session') || 'null');
  if (session && session.loggedIn) {
    window.location.href = 'index.html';
  }
})();

// ═══════════════════════════════════════════
// PARTICLES
// ═══════════════════════════════════════════
function createParticles() {
  for (let i = 0; i < 30; i++) {
    const span = document.createElement('span');
    span.style.left = Math.random() * 100 + '%';
    span.style.top = Math.random() * 100 + '%';
    span.style.animationDelay = (Math.random() * 8) + 's';
    span.style.animationDuration = (5 + Math.random() * 6) + 's';
    span.style.width = (2 + Math.random() * 3) + 'px';
    span.style.height = span.style.width;
    dom.bgParticles.appendChild(span);
  }
}

// ═══════════════════════════════════════════
// TAB SWITCHING
// ═══════════════════════════════════════════
function switchTab(tab) {
  if (tab === 'login') {
    dom.tabLogin.classList.add('active');
    dom.tabSignup.classList.remove('active');
    dom.tabIndicator.classList.remove('right');
    dom.formLogin.classList.remove('hidden');
    dom.formSignup.classList.add('hidden');
    clearErrors();
  } else {
    dom.tabSignup.classList.add('active');
    dom.tabLogin.classList.remove('active');
    dom.tabIndicator.classList.add('right');
    dom.formSignup.classList.remove('hidden');
    dom.formLogin.classList.add('hidden');
    clearErrors();
  }
}

dom.tabLogin.addEventListener('click', () => switchTab('login'));
dom.tabSignup.addEventListener('click', () => switchTab('signup'));

// ═══════════════════════════════════════════
// TOGGLE PASSWORD VISIBILITY
// ═══════════════════════════════════════════
function setupToggle(btn, input) {
  btn.addEventListener('click', () => {
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.textContent = isPassword ? '🙈' : '👁';
  });
}

setupToggle(dom.toggleLoginPw, dom.loginPassword);
setupToggle(dom.toggleSignupPw, dom.signupPassword);

// ═══════════════════════════════════════════
// PASSWORD STRENGTH METER
// ═══════════════════════════════════════════
dom.signupPassword.addEventListener('input', () => {
  const pw = dom.signupPassword.value;

  if (pw.length === 0) {
    dom.passwordStrength.classList.add('hidden');
    return;
  }

  dom.passwordStrength.classList.remove('hidden');

  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  dom.strengthFill.className = 'strength-fill';
  dom.strengthText.className = 'strength-text';

  if (score <= 2) {
    dom.strengthFill.classList.add('weak');
    dom.strengthText.classList.add('weak');
    dom.strengthText.textContent = 'Weak';
  } else if (score <= 3) {
    dom.strengthFill.classList.add('medium');
    dom.strengthText.classList.add('medium');
    dom.strengthText.textContent = 'Medium';
  } else {
    dom.strengthFill.classList.add('strong');
    dom.strengthText.classList.add('strong');
    dom.strengthText.textContent = 'Strong';
  }
});

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════
function showError(el, message) {
  el.textContent = message;
  el.classList.remove('hidden');
}

function clearErrors() {
  dom.loginError.classList.add('hidden');
  dom.signupError.classList.add('hidden');
}

function showLoader(btn, loader) {
  btn.querySelector('.btn-text').classList.add('hidden');
  loader.classList.remove('hidden');
  btn.disabled = true;
}

function hideLoader(btn, loader) {
  btn.querySelector('.btn-text').classList.remove('hidden');
  loader.classList.add('hidden');
  btn.disabled = false;
}

function getUsers() {
  return JSON.parse(localStorage.getItem('pvmusic_users') || '[]');
}

function saveUsers(users) {
  localStorage.setItem('pvmusic_users', JSON.stringify(users));
}

function createSession(user) {
  const session = {
    loggedIn: true,
    username: user.username || user.name,
    email: user.email,
    name: user.name,
    loginTime: new Date().toISOString()
  };
  localStorage.setItem('pvmusic_session', JSON.stringify(session));
}

function redirectToApp() {
  dom.loginCard.classList.add('success');
  setTimeout(() => {
    dom.loginWrapper.classList.add('fade-out');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 500);
  }, 400);
}

// ═══════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════
dom.formLogin.addEventListener('submit', (e) => {
  e.preventDefault();
  clearErrors();

  const username = dom.loginUsername.value.trim();
  const password = dom.loginPassword.value;

  if (!username || !password) {
    showError(dom.loginError, 'Please fill in all fields');
    return;
  }

  showLoader(dom.btnLogin, dom.loginLoader);

  // Simulate a small delay for UX
  setTimeout(() => {
    const users = getUsers();
    const user = users.find(u =>
      (u.email.toLowerCase() === username.toLowerCase() ||
       u.name.toLowerCase() === username.toLowerCase()) &&
      u.password === password
    );

    if (user) {
      createSession(user);
      redirectToApp();
    } else {
      // If no users exist yet, prompt to sign up
      if (users.length === 0) {
        showError(dom.loginError, 'No account found. Please sign up first!');
      } else {
        showError(dom.loginError, 'Invalid username or password');
      }
      hideLoader(dom.btnLogin, dom.loginLoader);
    }
  }, 800);
});

// ═══════════════════════════════════════════
// SIGNUP
// ═══════════════════════════════════════════
dom.formSignup.addEventListener('submit', (e) => {
  e.preventDefault();
  clearErrors();

  const name = dom.signupName.value.trim();
  const email = dom.signupEmail.value.trim();
  const password = dom.signupPassword.value;
  const confirm = dom.signupConfirm.value;

  if (!name || !email || !password || !confirm) {
    showError(dom.signupError, 'Please fill in all fields');
    return;
  }

  if (!email.includes('@') || !email.includes('.')) {
    showError(dom.signupError, 'Please enter a valid email address');
    return;
  }

  if (password.length < 6) {
    showError(dom.signupError, 'Password must be at least 6 characters');
    return;
  }

  if (password !== confirm) {
    showError(dom.signupError, 'Passwords do not match');
    return;
  }

  showLoader(dom.btnSignup, dom.signupLoader);

  setTimeout(() => {
    const users = getUsers();

    // Check if email already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      showError(dom.signupError, 'An account with this email already exists');
      hideLoader(dom.btnSignup, dom.signupLoader);
      return;
    }

    // Create user
    const newUser = {
      id: 'user_' + Date.now(),
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    saveUsers(users);

    // Auto-login
    createSession(newUser);
    redirectToApp();
  }, 800);
});

// ═══════════════════════════════════════════
// SOCIAL LOGIN (Demo - auto creates account)
// ═══════════════════════════════════════════
dom.btnGoogle.addEventListener('click', () => {
  createSession({ name: 'PV User', email: 'user@gmail.com' });
  redirectToApp();
});

dom.btnGithub.addEventListener('click', () => {
  createSession({ name: 'PV User', email: 'user@github.com' });
  redirectToApp();
});

// ═══════════════════════════════════════════
// FORGOT PASSWORD
// ═══════════════════════════════════════════
dom.forgotLink.addEventListener('click', (e) => {
  e.preventDefault();
  const email = prompt('Enter your email to reset password:');
  if (email) {
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      const newPw = prompt(`Account found for "${user.name}".\nEnter a new password:`);
      if (newPw && newPw.length >= 6) {
        user.password = newPw;
        saveUsers(users);
        alert('Password updated! You can now log in.');
      } else if (newPw) {
        alert('Password must be at least 6 characters.');
      }
    } else {
      alert('No account found with that email.');
    }
  }
});

// ═══════════════════════════════════════════
// KEYBOARD
// ═══════════════════════════════════════════
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' && !e.shiftKey) {
    // Allow natural tab navigation
  }
});

// ═══════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════
createParticles();
console.log('🔐 PVmusic Login page loaded');
