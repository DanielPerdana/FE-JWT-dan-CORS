// login.js
const API = 'https://jwt-dan-cors.vercel.app/api';

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 DOMContentLoaded fired');

  const form = document.getElementById('loginForm');
  const msg  = document.getElementById('message');

  if (!form) {
    console.error('❌ loginForm NOT found in DOM');
    return;
  }

  form.addEventListener('submit', async (e) => {
    console.log('🖱️ loginForm submit caught');
    e.preventDefault();

    // clear old message
    msg.classList.add('d-none');
    msg.textContent = '';

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    console.log('▶️ Attempting login with', { username, password });

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      console.log('🔁 Received HTTP', res.status);

      const data = await res.json();
      console.log('📨 Response JSON', data);

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // success
      console.log('✅ Login successful, saving token and redirecting');
      localStorage.setItem('token', data.token);

      // redirect
      window.location.href = 'dashboard.html';
    } catch (err) {
      console.error('⚠️ Login error:', err);
      msg.textContent = err.message;
      msg.className   = 'alert alert-danger';
      msg.classList.remove('d-none');
    }
  });
});
