const API = 'https://jwt-dan-cors.vercel.app/';

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("message");

  try {
    const res = await fetch(`${API}/auth/signup`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    msg.textContent = "✅ Signup berhasil! Silakan login.";
    msg.className = "alert alert-success";
    msg.classList.remove("d-none");
  } catch (err) {
    msg.textContent = err.message;
    msg.className = "alert alert-danger";
    msg.classList.remove("d-none");
  }
});
