const API = 'https://jwt-dan-cors.vercel.app/';
let token = '';

async function signup() {
  const u = username.value, p = password.value;
  await fetch(`${API}/auth/signup`, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({username:u,password:p})
  });
  alert('Signed up! Please log in.');
}

async function login() {
  const res = await fetch(`${API}/auth/login`, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({username:username.value,password:password.value})
  });
  const data = await res.json(); token = data.token;
  document.getElementById('post-form').style.display = 'block';
  loadPosts();
}

async function loadPosts() {
  const res = await fetch(`${API}/posts`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const posts = await res.json();
  postsList.innerHTML = posts.map(p =>
    `<li><strong>${p.title}</strong><br>${p.content}<br><em>by ${p.author.username}</em></li>`
  ).join('');
}

async function createPost() {
  await fetch(`${API}/posts`, {
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},
    body: JSON.stringify({ title: title.value, content: content.value })
  });
  title.value = content.value = '';
  loadPosts();
}
