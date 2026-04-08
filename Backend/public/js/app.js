//  EDUSAWA FINAL  VERSION -TAYARI KUDEPLOY.
console.log(" Edusawa - Fixed Login & Role Display");

let currentUser = null;
let currentRole = null;
let currentQuiz = null;

// Demo users with correct roles
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
            <span class="text-4xl"></span>
            <h1 class="text-4xl font-bold">EduSawa</h1>
          </div>
          <button onclick="navigate('login')" class="px-8 py-3 bg-white text-navy font-semibold rounded-2xl">Login</button>
        </nav>

        <div class="flex-1 max-w-5xl mx-auto px-6 py-24 text-center">
          <h2 class="text-6xl font-bold mb-6">Bridging Resource Gaps in Kenya</h2>
          <p class="text-2xl text-gray-300 mb-12">AI • 3D Labs • Materials • Quizzes • Progress</p>
          <button onclick="navigate('login')" class="px-12 py-5 bg-white text-navy text-2xl font-bold rounded-3xl">Start Learning</button>
        </div>

        <div class="max-w-4xl mx-auto px-6 py-16 bg-black rounded-3xl mx-6">
          <h3 class="text-4xl font-bold mb-8 text-center">About Us</h3>
          <p class="text-lg text-gray-200">This system was designed to promote inclusive CBC/CBE education with AI tutor, 3D labs, offline access to materials and quizzes for all Kenyan learners.</p>
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
          <p class="text-center text-xs mt-6 text-gray-400">Demo password:</p>
        </div>
      </div>`;
  } 
  else if (view === 'dashboard') {
    html = `
      <nav class="bg-black p-5 flex justify-between sticky top-0 z-50">
        <div class="flex items-center gap-3">
          <span class="text-3xl">📘</span>
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

  if (view === 'dashboard' && currentRole === 'student') {
    setTimeout(() => {
      loadMaterials();
      loadQuizzes();
      loadProgress();
      loadLab();
    }, 300);
  }
}

// Tab functions
function showLoginTab() {
  document.getElementById('login-form').classList.remove('hidden');
  document.getElementById('register-form').classList.add('hidden');
}
function showRegisterTab() {
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('register-form').classList.remove('hidden');
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
  alert("✅ Account created! You can now login.");
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

// AI gemini -2.5 flash
async function sendAI() {
  const input = document.getElementById('prompt');
  const chat = document.getElementById('chat');
  const prompt = input.value.trim();
  if (!prompt) return;

  chat.innerHTML += `<div class="text-right mb-4"><span class="bg-navy px-5 py-3 rounded-3xl inline-block">You: ${prompt}</span></div>`;
  chat.scrollTop = chat.scrollHeight;
  input.value = "";

  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    const formatted = data.reply.replace(/\n/g, '<br>');
    chat.innerHTML += `<div class="mb-4"><span class="bg-gray-800 px-5 py-3 rounded-3xl leading-relaxed block whitespace-pre-wrap">${formatted}</span></div>`;
    chat.scrollTop = chat.scrollHeight;
  } catch (e) {
    chat.innerHTML += `<div class="mb-4 text-red-400">AI temporarily unavailable.</div>`;
  }
}

// Teacher/Admin Dashboard
function teacherAdminDashboard() {
  return `
    <div class="bg-black rounded-3xl p-12 max-w-3xl mx-auto text-center">
      <h2 class="text-5xl font-bold mb-4">Welcome, ${currentUser}</h2>
      <p class="text-xl text-gray-400 mb-12">${currentRole.toUpperCase()} Panel</p>
      
      <div onclick="showUploadForm()" class="bg-navy hover:bg-blue-900 p-12 rounded-3xl cursor-pointer transition">
        <span class="text-6xl block mb-6">📤</span>
        <h3 class="text-2xl font-bold">Upload New Material</h3>
        <p class="text-gray-300 mt-3">CBC Notes, CATs, Revision Papers</p>
      </div>
      
      <p class="text-sm text-gray-400 mt-12">Only teachers and admins can upload content to ensure quality and safety for learners.</p>
    </div>`;
}

// Fixed Upload Form (Real Form)
function showUploadForm() {
  const html = `
    <div class="min-h-screen bg-navy flex items-center justify-center p-6">
      <div class="bg-black p-10 rounded-3xl w-full max-w-2xl">
        <h2 class="text-3xl font-bold mb-8 text-center">Upload New Learning Material</h2>
        
        <input id="mat-title" placeholder="Title (e.g. Grade 7 Science CAT 1)" 
               class="w-full p-4 bg-gray-900 rounded-2xl mb-4 text-white">
        
        <select id="mat-subject" class="w-full p-4 bg-gray-900 rounded-2xl mb-4 text-white">
          <option value="Mathematics">Mathematics</option>
          <option value="Science">Science</option>
          <option value="Social Studies">Social Studies</option>
          <option value="English">English</option>
          <option value="Kiswahili">Kiswahili</option>
        </select>
        
        <textarea id="mat-content" rows="10" placeholder="Paste notes, questions or content here..." 
                  class="w-full p-4 bg-gray-900 rounded-2xl mb-6 text-white"></textarea>
        
        <div class="flex gap-4">
          <button onclick="uploadMaterial()" 
                  class="flex-1 py-4 bg-navy text-white font-bold rounded-2xl">Upload Material</button>
          <button onclick="render('dashboard')" 
                  class="flex-1 py-4 bg-gray-700 text-white font-bold rounded-2xl">Cancel</button>
        </div>
      </div>
    </div>`;
  
  document.getElementById('root').innerHTML = html;
}

// Real Upload Function (already existed, now properly connected)
async function uploadMaterial() {
  const title = document.getElementById('mat-title').value.trim();
  const subject = document.getElementById('mat-subject').value;
  const content = document.getElementById('mat-content').value.trim();

  if (!title || !content) {
    alert("Title and content are required");
    return;
  }

  try {
    const res = await fetch('/api/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, subject })
    });

    if (res.ok) {
      alert("✅ Material uploaded successfully!");
      render('dashboard');   // Return to dashboard after upload
    } else {
      alert("Upload failed. Please try again.");
    }
  } catch (e) {
    alert("Upload failed. Check your connection.");
  }
}

// Placeholder for student functions 
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
        <h3 class="text-3xl font-bold mb-6">📚 Revision Materials</h3>
        <div id="materials-list" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
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

  if (type === 'pendulum') {
    object = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 4, 16), new THREE.MeshPhongMaterial({color: 0x00ffff}));
  } else if (type === 'lever') {
    object = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 0.2), new THREE.MeshPhongMaterial({color: 0x8888ff}));
  } else if (type === 'solar') {
    object = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshPhongMaterial({color: 0xffee00}));
  } else if (type === 'molecule') {
    object = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 32), new THREE.MeshPhongMaterial({color: 0x00aaff}));
  } else if (type === 'cell') {
    object = new THREE.Mesh(new THREE.SphereGeometry(1.8, 32, 32), new THREE.MeshPhongMaterial({color: 0xff8800}));
  } else if (type === 'dna') {
    object = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 5, 8), new THREE.MeshPhongMaterial({color: 0x00ff88}));
  }

  scene.add(object);
  camera.position.z = 8;

  function animate() {
    requestAnimationFrame(animate);
    object.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();
}

// PWA INSTALL BUTTON 
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallButton();
});

function showInstallButton() {
  const installBtn = document.createElement('button');
  installBtn.id = 'install-btn';
  installBtn.innerHTML = '📱 Install Edusawa App';
  installBtn.className = 'fixed bottom-6 right-6 bg-white text-navy px-6 py-3 rounded-2xl font-semibold shadow-lg z-50 hover:bg-gray-100 transition';
  
  installBtn.onclick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log(' User installed the app');
      }
      deferredPrompt = null;
      installBtn.remove();
    }
  };

  document.body.appendChild(installBtn);
}

// OFFLINE MATERIAL CACHING 
async function uploadMaterial() {
  const title = document.getElementById('mat-title').value.trim();
  const subject = document.getElementById('mat-subject').value;
  const content = document.getElementById('mat-content').value.trim();

  if (!title || !content) return alert("Title and content are required");

  const materialData = {
    id: Date.now(),
    title,
    subject,
    content,
    uploadedAt: new Date().toISOString()
  };

  try {
    // Save to server
    const res = await fetch('/api/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, subject })
    });

    if (res.ok) {
      // Also save locally for offline use
      let offlineMaterials = JSON.parse(localStorage.getItem('offline_materials')) || [];
      offlineMaterials.unshift(materialData);
      localStorage.setItem('offline_materials', JSON.stringify(offlineMaterials));

      alert("Material uploaded successfully!\nIt is also saved for offline viewing.");
      document.getElementById('mat-title').value = '';
      document.getElementById('mat-content').value = '';
      
      if (currentRole === 'student') loadMaterials();
    }
  } catch (e) {
    // Save locally even if server fails (offline first)
    let offlineMaterials = JSON.parse(localStorage.getItem('offline_materials')) || [];
    offlineMaterials.unshift(materialData);
    localStorage.setItem('offline_materials', JSON.stringify(offlineMaterials));
    
    alert("⚠️ Saved locally for offline use. Will sync when online.");
  }
}

// Enhanced loadMaterials with offline fallback
async function loadMaterials() {
  const container = document.getElementById('materials-list');
  container.innerHTML = `<p class="text-gray-400">Loading materials...</p>`;

  try {
    const res = await fetch('/api/materials');
    if (res.ok) {
      const materials = await res.json();
      renderMaterials(materials);
      return;
    }
  } catch (e) {
    console.log("Online fetch failed, using offline cache");
  }

  // Offline fallback
  const offlineMaterials = JSON.parse(localStorage.getItem('offline_materials')) || [];
  renderMaterials(offlineMaterials);
}

// Real Material View
async function loadMaterials() {
  const container = document.getElementById('materials-list');
  try {
    const res = await fetch('/api/materials');
    const materials = await res.json();

    let html = '';
    materials.forEach(m => {
      html += `
        <div class="bg-gray-900 p-6 rounded-2xl cursor-pointer" onclick="viewFullMaterial('${m.title}', \`${m.content ? m.content.replace(/`/g, '\\`') : ''}\`)">
          <h4 class="font-bold">${m.title}</h4>
          <p class="text-sm text-gray-400">${m.subject || 'General'}</p>
        </div>`;
    });
    container.innerHTML = html || '<p class="text-gray-400">No materials yet.</p>';
  } catch (e) {
    container.innerHTML = '<p class="text-red-400">Failed to load materials.</p>';
  }
}

function viewFullMaterial(title, content) {
  const html = `
    <div class="min-h-screen bg-navy flex items-center justify-center p-6">
      <div class="bg-black p-10 rounded-3xl max-w-3xl w-full">
        <h2 class="text-3xl font-bold mb-6">${title}</h2>
        <div class="prose text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">${content || 'No content available'}</div>
        <button onclick="render('dashboard')" class="mt-10 px-8 py-4 bg-white text-navy font-bold rounded-2xl">Back to Dashboard</button>
      </div>
    </div>`;
  document.getElementById('root').innerHTML = html;
}

// Progress Tracking
async function loadProgress() {
  const container = document.getElementById('progress-list');
  try {
    const res = await fetch('/api/progress');
    const progress = await res.json();

    if (progress.length === 0) {
      container.innerHTML = `<p class="text-gray-400">No quiz attempts yet. Take your first quiz!</p>`;
      return;
    }

    let html = '';
    progress.forEach(p => {
      html += `
        <div class="bg-gray-900 p-5 rounded-2xl flex justify-between items-center">
          <div>
            <p class="font-medium">${p.title}</p>
            <p class="text-sm text-gray-400">${new Date(p.completed_at).toLocaleDateString()}</p>
          </div>
          <div class="text-right">
            <span class="text-2xl font-bold ${p.score >= 70 ? 'text-emerald-400' : 'text-amber-400'}">${p.score}%</span>
          </div>
        </div>`;
    });
    container.innerHTML = html;
  } catch (e) {
    container.innerHTML = `<p class="text-gray-400">Progress tracking coming soon.</p>`;
  }
}

// Start the app
render('landing');