// EDUSAWA.
console.log("Edusawa - Full Version");

let currentUser = null;
let currentRole = null;
let currentQuiz = null;

let users = JSON.parse(localStorage.getItem('edusawa_users')) || [
  { username: "student1", password: "123456", role: "student" },
  { username: "teacher1", password: "123456", role: "teacher" },
  { username: "admin1", password: "123456", role: "admin" }
];

function saveUsers() {
  localStorage.setItem('edusawa_users', JSON.stringify(users));
}

function render(view) {
  const root = document.getElementById('root');
  let html = '';

  if (view === 'landing') {
    html = `
      <div class="min-h-screen bg-navy flex flex-col">
        <nav class="bg-black p-6 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <span class="text-4xl">📚</span>
            <h1 class="text-4xl font-bold">EduSawa</h1>
          </div>
          <button onclick="navigate('login')" class="px-8 py-3 bg-white text-navy font-semibold rounded-2xl">Login</button>
        </nav>
        <div class="flex-1 max-w-5xl mx-auto px-6 py-24 text-center">
          <h2 class="text-6xl font-bold mb-6">Learn STEMS the <span class="accent">smart</span> way - <br/>anytime, anywhere.</h2>
          <p class="text-2xl text-gray-300 mb-12">AI • 3D Labs • Materials • Quizzes • Progressive Web APP</p>
          <button onclick="navigate('login')" class="px-12 py-5 bg-white text-navy text-2xl font-bold rounded-3xl">Start Learning</button>
        </div>
        <div class="max-w-4xl mx-auto px-6 py-16 bg-black rounded-3xl mx-6">
          <h3 class="text-4xl font-bold mb-8 text-center">About Us</h3>
          <p class="text-lg text-gray-200">EduSawa,derived from the words Education and Usawa, means equitable education.EduSawa helps CBE learners access curated STEMS notes,quizzes, 3D videos and practice labs not forgetting offline-friendly design and AI/teacher-supported pathways.</p>
        </div>
        <footer class="bg-black py-8 text-center text-sm text-gray-400 mt-auto">
          Edusawa was developed in 2026 • All Rights Reserved • Designed for Kenyan CBC Education
        </footer>
      </div>`;
  } 
  else if (view === 'login') {
    html = `
      <div class="min-h-screen bg-navy flex items-center justify-center p-6">
        <div class="bg-black p-10 rounded-3xl w-full max-w-md">
          <h2 class="text-4xl font-bold mb-8 text-center">Welcome to Edusawa</h2>
          <div class="flex border-b mb-6">
            <button onclick="showLoginTab()" id="login-tab" class="flex-1 py-3 font-semibold border-b-2 border-navy">Login</button>
            <button onclick="showRegisterTab()" id="register-tab" class="flex-1 py-3 font-semibold">Register</button>
          </div>
          <div id="login-form">
            <input id="username" placeholder="Username" class="w-full p-4 bg-gray-900 rounded-2xl mb-4 text-white">
            <input id="password" type="password" placeholder="Password" class="w-full p-4 bg-gray-900 rounded-2xl mb-8 text-white">
            <button onclick="handleLogin()" class="w-full py-4 bg-white text-navy font-bold text-xl rounded-2xl">Login</button>
            <div class="text-center mt-4">
              <button onclick="showForgotPassword()" class="text-sm text-emerald-400 hover:text-emerald-300 underline">Forgot Password?</button>
            </div>
          </div>
          <div id="register-form" class="hidden">
            <input id="reg-username" placeholder="New Username" class="w-full p-4 bg-gray-900 rounded-2xl mb-4 text-white">
            <input id="reg-password" type="password" placeholder="Password" class="w-full p-4 bg-gray-900 rounded-2xl mb-4 text-white">
            <select id="reg-role" class="w-full p-4 bg-gray-900 rounded-2xl mb-8 text-white">
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
            <button onclick="handleRegister()" class="w-full py-4 bg-white text-navy font-bold text-xl rounded-2xl">Create Account</button>
          </div>
          <p class="text-center text-xs mt-6 text-gray-400"></p>
        </div>
      </div>`;
  } 
  else if (view === 'dashboard') {
    html = `
      <nav class="bg-black p-5 flex justify-between sticky top-0 z-50">
        <div class="flex items-center gap-3">
          <span class="text-3xl">📚</span>
          <h1 class="text-3xl font-bold">Edusawa</h1>
        </div>
        <div class="flex items-center gap-6">
          <span>${currentUser} <span class="text-emerald-400">(${currentRole || 'User'})</span></span>
          <button onclick="logout()" class="px-6 py-2 bg-red-600 rounded-2xl text-sm">Logout</button>
        </div>
      </nav>
      <div class="max-w-7xl mx-auto p-8">
        ${currentRole === 'student' ? studentDashboard() : teacherAdminDashboard()}
      </div>`;
  }

  root.innerHTML = html;

  if (view === 'dashboard') {
    if (currentRole === 'student') {
      setTimeout(() => {
        loadMaterials();
        loadQuizzes();
        loadProgress();
        loadLab();
      }, 300);
    } else {
      setTimeout(() => {
        loadTeacherMaterials();
      }, 100);
    }
  }
}

// Tab functions
function showLoginTab() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  if (loginForm && registerForm) {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  }
}
function showRegisterTab() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  if (loginForm && registerForm) {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
  }
}

// Forgot Password Modal
function showForgotPassword() {
  const modalHtml = `
    <div id="forgot-modal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div class="bg-gray-900 rounded-3xl p-8 max-w-md w-full">
        <h3 class="text-2xl font-bold mb-6 text-center">Reset Password</h3>
        <input id="reset-username" placeholder="Enter your username" class="w-full p-4 bg-black rounded-2xl mb-4 text-white">
        <input id="reset-new-password" type="password" placeholder="New password" class="w-full p-4 bg-black rounded-2xl mb-4 text-white">
        <input id="reset-confirm-password" type="password" placeholder="Confirm new password" class="w-full p-4 bg-black rounded-2xl mb-6 text-white">
        <div class="flex gap-3">
          <button onclick="resetPassword()" class="flex-1 py-3 bg-navy rounded-2xl font-semibold">Reset Password</button>
          <button onclick="closeForgotModal()" class="flex-1 py-3 bg-gray-700 rounded-2xl font-semibold">Cancel</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeForgotModal() {
  const modal = document.getElementById('forgot-modal');
  if (modal) modal.remove();
}

function resetPassword() {
  const username = document.getElementById('reset-username').value.trim();
  const newPass = document.getElementById('reset-new-password').value;
  const confirmPass = document.getElementById('reset-confirm-password').value;

  if (!username || !newPass || !confirmPass) {
    alert("Please fill all fields.");
    return;
  }
  if (newPass !== confirmPass) {
    alert("Passwords do not match.");
    return;
  }
  if (newPass.length < 4) {
    alert("Password must be at least 4 characters.");
    return;
  }

  const userIndex = users.findIndex(u => u.username === username);
  if (userIndex === -1) {
    alert("Username not found. Please check or register a new account.");
    return;
  }

  users[userIndex].password = newPass;
  saveUsers();
  alert(" Password reset successful! Please login with your new password.");
  closeForgotModal();
}

// Registration
function handleRegister() {
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value;
  const role = document.getElementById('reg-role').value;

  if (!username || !password) return alert("Please fill all fields");
  if (users.find(u => u.username === username)) return alert("Username already exists");

  users.push({ username, password, role });
  saveUsers();
  alert(" Account created! You can now login.");
  showLoginTab();
}

// Login 
function handleLogin() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return alert("Invalid username or password");

  currentUser = username;
  currentRole = user.role;
  render('dashboard');
}

function logout() {
  currentUser = null;
  currentRole = null;
  render('landing');
}

function navigate(page) { render(page); }

// AI Tutor (Fixed Mock version that works without API key)
async function sendAI() {
  const input = document.getElementById('prompt');
  const chat = document.getElementById('chat');
  const prompt = input.value.trim();
  if (!prompt) return;

  chat.innerHTML += `<div class="text-right mb-4"><span class="bg-navy px-5 py-3 rounded-3xl inline-block">You: ${prompt}</span></div>`;
  chat.scrollTop = chat.scrollHeight;
  input.value = "";

  // Mock intelligent responses (works offline)
  const lowerPrompt = prompt.toLowerCase();
  let reply = "";
  
  if (lowerPrompt.includes("photosynthesis")) {
    reply = "Photosynthesis is the process plants use to convert sunlight, water, and carbon dioxide into food (glucose) and oxygen. It happens in the leaves' chloroplasts.";
  } else if (lowerPrompt.includes("math") || lowerPrompt.includes("algebra")) {
    reply = "In mathematics, algebra uses letters to represent numbers. For example, solving 2x + 3 = 9 means x = 3. Would you like a practice problem?";
  } else if (lowerPrompt.includes("history") || lowerPrompt.includes("kenya")) {
    reply = "Kenya gained independence in 1963. The first president was Jomo Kenyatta. We study our history to understand our heritage and build a better future.";
  } else if (lowerPrompt.includes("science")) {
    reply = "Science is the study of the natural world through observation and experiment. What specific topic are you learning in CBC Science?";
  } else {
    reply = `That's a good question about "${prompt}". In the Kenyan CBC curriculum, we encourage critical thinking. Let me help: Can you tell me more about what you already know regarding this topic?`;
  }
  
  setTimeout(() => {
    chat.innerHTML += `<div class="mb-4"><span class="bg-gray-800 px-5 py-3 rounded-3xl leading-relaxed block whitespace-pre-wrap">${reply}</span></div>`;
    chat.scrollTop = chat.scrollHeight;
  }, 300);
}

// Teacher/Admin Dashboard with Management
function teacherAdminDashboard() {
  return `
    <div class="bg-black rounded-3xl p-8 max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-5xl font-bold mb-4">Welcome, ${currentUser}</h2>
        <p class="text-xl text-gray-400 mb-6">${currentRole.toUpperCase()} Panel - Content Manager</p>
        <div onclick="showUploadForm()" class="bg-navy hover:bg-blue-900 p-8 rounded-3xl cursor-pointer transition inline-block">
          <span class="text-4xl block mb-3">📤</span>
          <h3 class="text-2xl font-bold">Upload New Material</h3>
          <p class="text-gray-300 mt-2">CBC Notes, Videos, Images, PDFs, CATs, Revision Papers</p>
          <p class="text-sm text-emerald-400 mt-2">Supports: Images, Videos, PDFs, Documents</p>
        </div>
      </div>
      <div class="mt-12">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-3xl font-bold">📚 Manage All Materials</h3>
          <button onclick="loadTeacherMaterials()" class="px-4 py-2 bg-gray-700 rounded-xl hover:bg-gray-600 transition"> Refresh List</button>
        </div>
        <div id="teacher-materials-list" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="text-gray-400 text-center py-12 col-span-2">Loading materials...</div>
        </div>
      </div>
      <p class="text-sm text-gray-400 text-center mt-12">Only teachers and admins can upload and delete content to ensure quality and safety for learners.</p>
    </div>`;
}

function getFileTypeDisplay(material) {
  if (material.file_mime) {
    if (material.file_mime.startsWith('image/')) return { icon: '🖼️', label: 'Image' };
    if (material.file_mime.startsWith('video/')) return { icon: '🎬', label: 'Video' };
    if (material.file_mime === 'application/pdf') return { icon: '📕', label: 'PDF' };
    if (material.file_mime.includes('word')) return { icon: '📘', label: 'Word Document' };
    if (material.file_mime.includes('powerpoint')) return { icon: '📊', label: 'PowerPoint' };
    return { icon: '', label: 'Document' };
  }
  return { icon: '📝', label: 'Text Notes' };
}

async function loadTeacherMaterials() {
  const container = document.getElementById('teacher-materials-list');
  if (!container) return;
  container.innerHTML = `<div class="text-gray-400 text-center py-12 col-span-2">Loading materials...</div>`;
  
  try {
    const res = await fetch('/api/materials');
    if (!res.ok) throw new Error('Failed to fetch');
    const materials = await res.json();
    
    if (materials.length === 0) {
      container.innerHTML = `<div class="text-gray-400 text-center py-12 col-span-2">No materials uploaded yet. Click "Upload New Material" to add content.</div>`;
      return;
    }
    
    let html = '';
    materials.forEach(m => {
      const fileType = getFileTypeDisplay(m);
      const fileUrl = m.file_url;
      html += `
        <div class="bg-gray-900 rounded-2xl overflow-hidden hover:shadow-xl transition" data-material-id="${m.id}">
          <div class="p-6">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h4 class="font-bold text-xl mb-2">${escapeHtml(m.title)}</h4>
                <p class="text-sm text-emerald-400 mb-3">📚 ${m.subject || 'General'}</p>
                <div class="flex items-center gap-2 text-xs text-gray-400 mb-3">
                  <span>${fileType.icon} ${fileType.label}</span>
                  <span>•</span>
                  <span>📅 ${new Date(m.created_at).toLocaleDateString()}</span>
                </div>
                ${m.content ? `<p class="text-gray-300 text-sm line-clamp-2 mb-3">${escapeHtml(m.content.substring(0, 100))}${m.content.length > 100 ? '...' : ''}</p>` : ''}
              </div>
              <button onclick="deleteMaterial(${m.id})" class="ml-4 p-2 bg-red-600/20 hover:bg-red-600 rounded-xl transition group">
                <span class="text-red-400 group-hover:text-white text-xl">🗑️</span>
              </button>
            </div>
            <div class="mt-4 flex gap-2">
              ${fileUrl ? `<a href="${fileUrl}" target="_blank" class="px-4 py-2 bg-navy rounded-xl text-sm hover:bg-blue-700"> Preview</a>` : ''}
              ${fileUrl ? `<a href="${fileUrl}" download class="px-4 py-2 bg-gray-700 rounded-xl text-sm hover:bg-gray-600">⬇️ Download</a>` : ''}
              ${m.content ? `<button onclick="viewTextMaterial('${escapeHtml(m.title)}', \`${escapeHtml(m.content || 'No content')}\`)" class="px-4 py-2 bg-navy rounded-xl text-sm hover:bg-blue-700">📖 Read Text</button>` : ''}
            </div>
          </div>
        </div>`;
    });
    container.innerHTML = html;
  } catch (e) {
    console.error("Failed to load materials:", e);
    container.innerHTML = `<div class="text-red-400 text-center py-12 col-span-2">Failed to load materials. Please refresh.</div>`;
  }
}

async function deleteMaterial(materialId) {
  const confirmed = confirm("⚠️ Are you sure you want to delete this material? This action cannot be undone. The file will be permanently removed.");
  if (!confirmed) return;
  
  try {
    const res = await fetch(`/api/materials/${materialId}`, { method: 'DELETE' });
    if (res.ok) {
      alert(" Material deleted successfully!");
      loadTeacherMaterials();
      if (currentRole === 'student') loadMaterials();
    } else {
      const error = await res.json();
      alert("Failed to delete: " + (error.error || "Unknown error"));
    }
  } catch (e) {
    console.error("Delete error:", e);
    alert("Failed to delete material. Check your connection.");
  }
}

// Upload Form
let selectedFile = null;

function showUploadForm() {
  const html = `
    <div class="min-h-screen bg-navy flex items-center justify-center p-6">
      <div class="bg-black p-10 rounded-3xl w-full max-w-2xl">
        <h2 class="text-3xl font-bold mb-8 text-center">Upload Learning Material</h2>
        <div class="mb-6">
          <label class="block text-gray-300 mb-2 font-semibold">Title *</label>
          <input id="mat-title" placeholder="e.g., Grade 7 Science - Photosynthesis Video" class="w-full p-4 bg-gray-900 rounded-2xl text-white">
        </div>
        <div class="mb-6">
          <label class="block text-gray-300 mb-2 font-semibold">Subject</label>
          <select id="mat-subject" class="w-full p-4 bg-gray-900 rounded-2xl text-white">
            <option value="Science">Science</option>
            <option value="Technology">Technology</option>
            <option value="Engineering">Engineering</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Social Skills">Social Skills</option>
          </select>
        </div>
        <div class="mb-6">
          <label class="block text-gray-300 mb-2 font-semibold">Description / Notes (Optional)</label>
          <textarea id="mat-description" rows="4" placeholder="Add description or study notes here..." class="w-full p-4 bg-gray-900 rounded-2xl text-white"></textarea>
        </div>
        <div class="mb-6">
          <label class="block text-gray-300 mb-2 font-semibold">Upload File (Image, Video, PDF, Document)</label>
          <div class="border-2 border-dashed border-gray-600 rounded-2xl p-6 text-center hover:border-navy transition cursor-pointer" onclick="document.getElementById('file-input').click()">
            <input type="file" id="file-input" accept="image/*,video/*,application/pdf,.doc,.docx,.ppt,.pptx" class="hidden" onchange="previewFile()">
            <span class="text-4xl block mb-2"></span>
            <p class="text-gray-400">Click to select or drag and drop</p>
            <p class="text-xs text-gray-500 mt-2">Supports: Images (JPG, PNG, GIF), Videos (MP4, WebM), PDF, Word, PowerPoint</p>
          </div>
          <div id="file-preview" class="mt-3 hidden">
            <div class="bg-gray-900 p-3 rounded-2xl flex items-center gap-3">
              <span id="file-icon" class="text-2xl">📄</span>
              <span id="file-name" class="text-sm text-gray-300 flex-1"></span>
              <span id="file-size" class="text-xs text-gray-500"></span>
              <button onclick="clearFile()" class="text-red-400 hover:text-red-300">✖</button>
            </div>
          </div>
        </div>
        <div class="flex gap-4">
          <button onclick="uploadFileMaterial()" class="flex-1 py-4 bg-navy text-white font-bold rounded-2xl hover:bg-blue-700 transition">Upload Material</button>
          <button onclick="render('dashboard')" class="flex-1 py-4 bg-gray-700 text-white font-bold rounded-2xl hover:bg-gray-600 transition">Cancel</button>
        </div>
      </div>
    </div>`;
  document.getElementById('root').innerHTML = html;
  selectedFile = null;
}

function previewFile() {
  const file = document.getElementById('file-input').files[0];
  if (!file) return;
  selectedFile = file;
  const preview = document.getElementById('file-preview');
  const fileName = document.getElementById('file-name');
  const fileSize = document.getElementById('file-size');
  const fileIcon = document.getElementById('file-icon');
  
  if (file.type.startsWith('image/')) fileIcon.textContent = '🖼️';
  else if (file.type.startsWith('video/')) fileIcon.textContent = '🎬';
  else if (file.type === 'application/pdf') fileIcon.textContent = '📕';
  else if (file.type.includes('word')) fileIcon.textContent = '📘';
  else if (file.type.includes('powerpoint')) fileIcon.textContent = '📊';
  else fileIcon.textContent = '📄';
  
  fileName.textContent = file.name;
  fileSize.textContent = (file.size / 1024 / 1024).toFixed(2) + ' MB';
  preview.classList.remove('hidden');
}

function clearFile() {
  selectedFile = null;
  document.getElementById('file-input').value = '';
  document.getElementById('file-preview').classList.add('hidden');
}

async function uploadFileMaterial() {
  const title = document.getElementById('mat-title').value.trim();
  const subject = document.getElementById('mat-subject').value;
  const description = document.getElementById('mat-description').value.trim();
  
  if (!title) return alert("Please enter a title");
  if (!selectedFile) return alert("Please select a file to upload");
  if (selectedFile.size > 100 * 1024 * 1024) return alert("File too large. Max 100MB.");
  
  const formData = new FormData();
  formData.append('file', selectedFile);
  formData.append('title', title);
  formData.append('subject', subject);
  formData.append('description', description);
  
  try {
    const res = await fetch('/api/materials/upload-file', { method: 'POST', body: formData });
    if (res.ok) {
      alert(" Material uploaded successfully!");
      render('dashboard');
    } else {
      const error = await res.json();
      alert("Upload failed: " + (error.error || "Please try again"));
    }
  } catch (e) {
    alert("Upload failed. Check your connection.");
  }
}

// Student Dashboard
function studentDashboard() {
  return `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div class="lg:col-span-7 bg-black rounded-3xl p-8">
        <h3 class="text-3xl font-bold mb-6">🤖 AI Tutor</h3>
        <div id="chat" class="h-96 bg-gray-900 rounded-2xl p-6 overflow-y-auto mb-6"></div>
        <div class="flex gap-3">
          <input id="prompt" placeholder="Ask any CBC question..." class="flex-1 p-4 bg-gray-900 rounded-2xl text-white">
          <button onclick="sendAI()" class="px-10 bg-navy rounded-2xl font-semibold">Send</button>
        </div>
      </div>
      <div class="lg:col-span-5 bg-black rounded-3xl p-8">
        <h3 class="text-3xl font-bold mb-6">🔬 3D Virtual Labs</h3>
        <select id="labSelect" onchange="loadLab()" class="w-full p-4 bg-gray-900 rounded-2xl mb-6">
          <option value="pendulum">Physics - Pendulum</option>
          <option value="molecule">Chemistry - Water Molecule</option>
          <option value="solar">Physics - Solar System</option>
          <option value="cell">Biology - Plant Cell</option>
          <option value="dna">Biology - DNA Helix</option>
        </select>
        <canvas id="threeCanvas" class="w-full h-80 bg-black rounded-2xl"></canvas>
      </div>
      <div class="lg:col-span-12 bg-black rounded-3xl p-8">
        <h3 class="text-3xl font-bold mb-6">📚 Learning Materials</h3>
        <div id="materials-list" class="grid grid-cols-1 md:grid-cols-2 gap-6"></div>
      </div>
      <div class="lg:col-span-12 bg-black rounded-3xl p-8">
        <h3 class="text-3xl font-bold mb-6">📝 CBC Quizzes</h3>
        <div id="quizzes-list" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
      </div>
      <div class="lg:col-span-12 bg-black rounded-3xl p-8">
        <h3 class="text-3xl font-bold mb-6">📊 My Progress</h3>
        <div id="progress-list" class="space-y-3"></div>
      </div>
    </div>`;
}

// 3D Labs
let scene, camera, renderer, object;
function loadLab() {
  const canvas = document.getElementById('threeCanvas');
  if (!canvas) return;
  const type = document.getElementById('labSelect').value;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  const light = new THREE.PointLight(0xffffff, 1.2);
  light.position.set(10, 10, 10);
  scene.add(light);
  if (type === 'pendulum') object = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 4, 16), new THREE.MeshPhongMaterial({color: 0x00ffff}));
  else if (type === 'solar') object = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshPhongMaterial({color: 0xffee00}));
  else if (type === 'molecule') object = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), new THREE.MeshPhongMaterial({color: 0x00aaff}));
  else if (type === 'cell') object = new THREE.Mesh(new THREE.SphereGeometry(1.8, 32, 32), new THREE.MeshPhongMaterial({color: 0xff8800}));
  else if (type === 'dna') object = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 5, 8), new THREE.MeshPhongMaterial({color: 0x00ff88}));
  scene.add(object);
  camera.position.z = 8;
  function animate() { requestAnimationFrame(animate); object.rotation.y += 0.01; renderer.render(scene, camera); }
  animate();
}

// Student materials (read-only)
async function loadMaterials() {
  const container = document.getElementById('materials-list');
  if (!container) return;
  container.innerHTML = `<p class="text-gray-400">Loading materials...</p>`;
  try {
    const res = await fetch('/api/materials');
    if (res.ok) {
      const materials = await res.json();
      renderMaterials(materials);
      localStorage.setItem('offline_materials', JSON.stringify(materials));
      return;
    }
  } catch (e) { console.log("Online fetch failed"); }
  const offlineData = localStorage.getItem('offline_materials');
  if (offlineData) renderMaterials(JSON.parse(offlineData));
  else container.innerHTML = `<p class="text-gray-400">No materials available offline. Connect to internet.</p>`;
}

function renderMaterials(materials) {
  const container = document.getElementById('materials-list');
  if (!materials || materials.length === 0) {
    container.innerHTML = `<p class="text-gray-400">No materials available yet.</p>`;
    return;
  }
  let html = '';
  materials.forEach(m => {
    const hasFile = m.file_path && m.file_path !== 'null';
    let mediaHtml = '';
    if (hasFile && m.file_url) {
      if (m.file_mime.startsWith('image/')) mediaHtml = `<img src="${m.file_url}" class="rounded-xl max-h-48 w-full object-cover mt-3 cursor-pointer" onclick="window.open('${m.file_url}','_blank')">`;
      else if (m.file_mime.startsWith('video/')) mediaHtml = `<video controls class="rounded-xl w-full max-h-64 mt-3"><source src="${m.file_url}" type="${m.file_mime}"></video>`;
      else if (m.file_mime === 'application/pdf') mediaHtml = `<embed src="${m.file_url}" class="rounded-xl w-full h-40 mt-3"><div class="text-center mt-1"><a href="${m.file_url}" target="_blank" class="text-navy text-sm">Open PDF</a></div>`;
      else mediaHtml = `<div class="mt-3 bg-gray-800 p-2 rounded-xl text-center"><a href="${m.file_url}" target="_blank" class="text-navy">Preview File</a></div>`;
    }
    html += `
      <div class="bg-gray-900 rounded-2xl overflow-hidden p-6">
        <h4 class="font-bold text-xl mb-2">${escapeHtml(m.title)}</h4>
        <p class="text-sm text-emerald-400 mb-3">${m.subject || 'General'}</p>
        ${mediaHtml}
        ${m.content ? `<div class="mt-3 text-gray-300 text-sm border-t border-gray-700 pt-3">${escapeHtml(m.content.substring(0, 150))}${m.content.length > 150 ? '...' : ''}</div>` : ''}
        <div class="mt-4">
          ${hasFile ? `<a href="${m.file_url}" download class="px-4 py-2 bg-navy rounded-xl text-sm inline-block">⬇️ Download</a>` : ''}
          ${m.content ? `<button onclick="viewTextMaterial('${escapeHtml(m.title)}', \`${escapeHtml(m.content)}\`)" class="ml-2 px-4 py-2 bg-gray-700 rounded-xl text-sm">Read More</button>` : ''}
        </div>
      </div>`;
  });
  container.innerHTML = html;
}

function viewTextMaterial(title, content) {
  const html = `
    <div class="min-h-screen bg-navy flex items-center justify-center p-6">
      <div class="bg-black p-10 rounded-3xl max-w-3xl w-full">
        <h2 class="text-3xl font-bold mb-6">${title}</h2>
        <div class="prose text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">${content || 'No content'}</div>
        <button onclick="render('dashboard')" class="mt-10 px-8 py-4 bg-white text-navy font-bold rounded-2xl">Back</button>
      </div>
    </div>`;
  document.getElementById('root').innerHTML = html;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// Quizzes
async function loadQuizzes() {
  const container = document.getElementById('quizzes-list');
  if (!container) return;
  try {
    const res = await fetch('/api/quizzes');
    const quizzes = await res.json();
    if (quizzes.length === 0) { container.innerHTML = `<p class="text-gray-400">No quizzes yet.</p>`; return; }
    let html = '';
    quizzes.forEach(q => {
      html += `<div class="bg-gray-900 p-6 rounded-2xl">
        <h4 class="font-bold text-xl mb-2">${q.title}</h4>
        <p class="text-sm text-gray-400 mb-4">${q.subject || 'General'}</p>
        <button onclick="startQuiz(${q.id}, '${q.title}', \`${JSON.stringify(q.questions).replace(/`/g, '\\`')}\`)" class="px-6 py-2 bg-navy rounded-xl">Take Quiz</button>
      </div>`;
    });
    container.innerHTML = html;
  } catch(e) { container.innerHTML = `<p class="text-gray-400">Failed to load quizzes.</p>`; }
}

function startQuiz(id, title, questionsStr) {
  const questions = JSON.parse(questionsStr);
  currentQuiz = { id, title, questions, currentIndex: 0, score: 0 };
  showQuizQuestion();
}

function showQuizQuestion() {
  const q = currentQuiz.questions[currentQuiz.currentIndex];
  const html = `
    <div class="min-h-screen bg-navy flex items-center justify-center p-6">
      <div class="bg-black p-10 rounded-3xl max-w-2xl w-full">
        <h2 class="text-3xl font-bold mb-4">${currentQuiz.title}</h2>
        <p class="text-gray-400 mb-6">Q${currentQuiz.currentIndex+1}/${currentQuiz.questions.length}</p>
        <p class="text-xl mb-8">${q.q}</p>
        <div class="space-y-4">
          ${q.o.map((opt, idx) => `<button onclick="answerQuiz(${idx})" class="w-full text-left p-4 bg-gray-900 rounded-2xl hover:bg-navy">${opt}</button>`).join('')}
        </div>
      </div>
    </div>`;
  document.getElementById('root').innerHTML = html;
}

function answerQuiz(answerIdx) {
  const isCorrect = (answerIdx === currentQuiz.questions[currentQuiz.currentIndex].a);
  if (isCorrect) currentQuiz.score++;
  currentQuiz.currentIndex++;
  if (currentQuiz.currentIndex >= currentQuiz.questions.length) {
    const percentage = Math.round((currentQuiz.score / currentQuiz.questions.length) * 100);
    submitQuizScore(currentQuiz.id, percentage);
    showQuizResult(percentage);
  } else {
    showQuizQuestion();
  }
}

function showQuizResult(percentage) {
  const html = `
    <div class="min-h-screen bg-navy flex items-center justify-center p-6">
      <div class="bg-black p-10 rounded-3xl max-w-md w-full text-center">
        <h2 class="text-4xl font-bold mb-4">Quiz Complete!</h2>
        <p class="text-6xl font-bold mb-6 ${percentage>=70?'text-emerald-400':'text-amber-400'}">${percentage}%</p>
        <p class="text-gray-300 mb-8">Score: ${currentQuiz.score}/${currentQuiz.questions.length}</p>
        <button onclick="render('dashboard')" class="px-8 py-4 bg-white text-navy font-bold rounded-2xl">Back</button>
      </div>
    </div>`;
  document.getElementById('root').innerHTML = html;
}

async function submitQuizScore(quizId, score) {
  try { await fetch('/api/progress', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quiz_id: quizId, score }) }); } catch(e) {}
}

async function loadProgress() {
  const container = document.getElementById('progress-list');
  if (!container) return;
  try {
    const res = await fetch('/api/progress');
    const progress = await res.json();
    if (progress.length === 0) { container.innerHTML = `<p class="text-gray-400">No quiz attempts yet.</p>`; return; }
    let html = '';
    progress.forEach(p => {
      html += `<div class="bg-gray-900 p-5 rounded-2xl flex justify-between items-center">
        <div><p class="font-medium">${p.title}</p><p class="text-sm text-gray-400">${new Date(p.completed_at).toLocaleDateString()}</p></div>
        <div><span class="text-2xl font-bold ${p.score>=70?'text-emerald-400':'text-amber-400'}">${p.score}%</span></div>
      </div>`;
    });
    container.innerHTML = html;
  } catch(e) { container.innerHTML = `<p class="text-gray-400">Progress tracking coming soon.</p>`; }
}

// PWA Install
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; showInstallButton(); });
function showInstallButton() {
  const btn = document.createElement('button');
  btn.id = 'install-btn';
  btn.innerHTML = '📱 Install Edusawa App';
  btn.className = 'fixed bottom-6 right-6 bg-white text-navy px-6 py-3 rounded-2xl font-semibold shadow-lg z-50 hover:bg-gray-100';
  btn.onclick = async () => { if (deferredPrompt) { deferredPrompt.prompt(); const { outcome } = await deferredPrompt.userChoice; if (outcome === 'accepted') console.log('Installed'); deferredPrompt = null; btn.remove(); } };
  document.body.appendChild(btn);
}

// Start the app
render('landing');