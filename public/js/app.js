const views = {
  login: document.getElementById('login-view'),
  register: document.getElementById('register-view'),
  dashboard: document.getElementById('dashboard-view')
};

const navButtons = {
  login: document.getElementById('nav-login'),
  register: document.getElementById('nav-register'),
  dashboard: document.getElementById('nav-dashboard')
};

document.querySelectorAll('[data-view]').forEach((button) => {
  button.addEventListener('click', () => showView(button.dataset.view));
});

document.getElementById('logout-btn').addEventListener('click', logout);
document.getElementById('login-form').addEventListener('submit', login);
document.getElementById('register-form').addEventListener('submit', register);

function showView(view) {
  Object.entries(views).forEach(([key, element]) => {
    element.classList.toggle('hidden', key !== view);
  });

  Object.entries(navButtons).forEach(([key, button]) => {
    button.classList.toggle('active', key === view);
  });

  clearMessages();
}

async function login(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const email = form.elements.email.value.trim();
  const password = form.elements.password.value;

  if (!email || !password) {
    showMessage('login-message', 'Please enter your email and password.', 'error');
    return;
  }

  setLoading('login-btn', true);

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();

    if (!response.ok) {
      showMessage('login-message', data.error || 'Login failed.', 'error');
      return;
    }

    sessionStorage.setItem('authUser', JSON.stringify(data.user));
    form.reset();
    renderDashboard(data.user);
  } catch {
    showMessage('login-message', 'Cannot reach the server. Start it with npm start.', 'error');
  } finally {
    setLoading('login-btn', false);
  }
}

async function register(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const password = form.elements.password.value;
  const confirmPassword = form.elements.confirmPassword.value;

  if (!name || !email || !password || !confirmPassword) {
    showMessage('register-message', 'Please complete every field.', 'error');
    return;
  }

  if (password.length < 8) {
    showMessage('register-message', 'Password must be at least 8 characters.', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showMessage('register-message', 'Passwords do not match.', 'error');
    return;
  }

  setLoading('register-btn', true);

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await response.json();

    if (!response.ok) {
      showMessage('register-message', data.error || 'Account creation failed.', 'error');
      return;
    }

    form.reset();
    showMessage('register-message', 'Account created. You can login now.', 'success');
    setTimeout(() => showView('login'), 900);
  } catch {
    showMessage('register-message', 'Cannot reach the server. Start it with npm start.', 'error');
  } finally {
    setLoading('register-btn', false);
  }
}

async function logout() {
  try {
    await fetch('/api/logout', { method: 'POST' });
  } finally {
    sessionStorage.removeItem('authUser');
    navButtons.dashboard.classList.add('hidden');
    showView('login');
  }
}

function renderDashboard(user) {
  document.getElementById('profile-name').textContent = user.name;
  document.getElementById('profile-email').textContent = user.email;
  document.getElementById('profile-id').textContent = user.id;
  document.getElementById('profile-created').textContent = user.created_at
    ? new Date(`${user.created_at}Z`).toLocaleDateString()
    : 'Today';
  document.getElementById('profile-avatar').textContent = getInitials(user.name);

  navButtons.dashboard.classList.remove('hidden');
  showView('dashboard');
}

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || 'U';
}

function showMessage(id, text, type) {
  const element = document.getElementById(id);
  element.textContent = text;
  element.className = `form-message ${type}`;
  element.hidden = false;
}

function clearMessages() {
  document.querySelectorAll('.form-message').forEach((element) => {
    element.hidden = true;
    element.textContent = '';
  });
}

function setLoading(buttonId, loading) {
  const button = document.getElementById(buttonId);
  button.disabled = loading;
  button.querySelector('.btn-label').hidden = loading;
  button.querySelector('.btn-loader').hidden = !loading;
}

(async function restoreSession() {
  if (!sessionStorage.getItem('authUser')) return;

  try {
    const response = await fetch('/api/me');
    if (!response.ok) throw new Error('Session expired');
    const data = await response.json();
    renderDashboard(data.user);
  } catch {
    sessionStorage.removeItem('authUser');
  }
})();
