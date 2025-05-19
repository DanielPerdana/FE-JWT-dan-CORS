// dashboard.js
const API = 'https://jwt-dan-cors.vercel.app/api';
const token = localStorage.getItem('token');
if (!token) window.location.replace('index.html');

const postsList = document.getElementById('posts');
const msg       = document.getElementById('message');
const form      = document.getElementById('postForm');
const titleIn   = document.getElementById('title');
const contentIn = document.getElementById('content');

// Tampilkan notifikasi
function showMessage(text, type = "success") {
  msg.textContent = text;
  msg.className   = `alert alert-${type}`;
  msg.classList.remove('d-none');
  setTimeout(() => msg.classList.add('d-none'), 3000);
}

// Handle form submit untuk create atau update
let editMode = false;
let editId = null;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = titleIn.value.trim();
  const content = contentIn.value.trim();
  try {
    let res;
    if (!editMode) {
      // CREATE
      res = await fetch(`${API}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      });
    } else {
      // UPDATE
      res = await fetch(`${API}/posts/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      });
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || (editMode ? 'Gagal mengupdate post' : 'Gagal membuat post'));

    showMessage(editMode ? '✏️ Post updated!' : '✅ Post created!');
    // reset form
    editMode = false;
    editId = null;
    form.querySelector('button').textContent = 'Create Post';
    titleIn.value = '';
    contentIn.value = '';
    loadPosts();
  } catch (err) {
    showMessage(err.message, 'danger');
  }
});

// Load & render posts
async function loadPosts() {
  try {
    const res = await fetch(`${API}/posts`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Gagal memuat posts');
    const posts = await res.json();
    postsList.innerHTML = posts.map(p => `
      <li
        class="list-group-item d-flex justify-content-between align-items-start"
        data-id="${p._id}"
        data-title="${encodeURIComponent(p.title)}"
        data-content="${encodeURIComponent(p.content)}"
      >
        <div>
          <strong>${p.title}</strong><br>
          ${p.content}<br>
          <em>by ${p.author.username}</em>
        </div>
        <div>
          <button class="btn btn-sm btn-outline-secondary me-1" onclick="startEdit(event)">
            Edit
          </button>
          <button class="btn btn-sm btn-outline-danger" onclick="deletePost('${p._id}')">
            Delete
          </button>
        </div>
      </li>
    `).join('');
  } catch (err) {
    showMessage(err.message, 'danger');
  }
}


// Mulai mode edit: isi form dan ubah tombol
function startEdit(event) {
  const li = event.target.closest('li');
  if (!li) return;

  // Ambil data dari atribut
  const id      = li.dataset.id;
  const title   = decodeURIComponent(li.dataset.title);
  const content = decodeURIComponent(li.dataset.content);

  // Atur mode edit
  editMode = true;
  editId   = id;
  titleIn.value   = title;
  contentIn.value = content;
  form.querySelector('button').textContent = 'Update Post';
  titleIn.focus();
}

// Delete post
async function deletePost(id) {
  if (!confirm('Hapus post ini?')) return;
  try {
    const res = await fetch(`${API}/posts/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menghapus post');
    showMessage('🗑️ Post deleted');
    loadPosts();
  } catch (err) {
    showMessage(err.message, 'danger');
  }
}

// Logout
async function logout() {
  try {
    const res = await fetch(`${API}/auth/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Logout failed');
    localStorage.removeItem('token');
    showMessage('🚪 Logout successful', 'success');
    setTimeout(() => window.location.replace('index.html'), 500);
  } catch (err) {
    showMessage(err.message, 'danger');
  }
}

// Inisialisasi
loadPosts();
