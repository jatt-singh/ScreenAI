const API = 'http://localhost:5000/api';

// State
let chatHistory = [];
let resumeLoaded = false;

// Elements
const uploadArea = document.getElementById('uploadArea');
const resumeInput = document.getElementById('resumeInput');
const candidateCard = document.getElementById('candidateCard');
const resumeTextBox = document.getElementById('resumeTextBox');
const resumeTextContent = document.getElementById('resumeTextContent');
const clearResumeBtn = document.getElementById('clearResume');
const chatWindow = document.getElementById('chatWindow');
const chatEmpty = document.getElementById('chatEmpty');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const suggestedQuestions = document.getElementById('suggestedQuestions');
const analyzeBtn = document.getElementById('analyzeBtn');
const jdInput = document.getElementById('jdInput');
const matchResults = document.getElementById('matchResults');
const statusText = document.getElementById('statusText');
const headerDot = document.querySelector('.dot');
const toggleResume = document.getElementById('toggleResume');

// Upload Area Click
uploadArea.addEventListener('click', () => resumeInput.click());

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.style.borderColor = 'var(--primary)';
  uploadArea.style.background = 'var(--primary-light)';
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.style.borderColor = '';
  uploadArea.style.background = '';
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file && file.type === 'application/pdf') handleResumeUpload(file);
});

resumeInput.addEventListener('change', (e) => {
  if (e.target.files[0]) handleResumeUpload(e.target.files[0]);
});

// Upload Resume
async function handleResumeUpload(file) {
  uploadArea.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i><p>Parsing resume...</p>`;

  const formData = new FormData();
  formData.append('resume', file);

  try {
    const res = await fetch(`${API}/upload-resume`, { method: 'POST', body: formData });
    const data = await res.json();

    if (!data.success) throw new Error(data.error);

    // Extract name from first line of resume
    const lines = data.resumeText.split('\n').filter(l => l.trim());
    const name = lines[0] || 'Candidate';
    const title = lines[1] || 'Professional';

    // Update candidate card
    document.getElementById('candidateName').textContent = name;
    document.getElementById('candidateTitle').textContent = title;
    document.getElementById('candidateAvatar').textContent = name.charAt(0).toUpperCase();
    candidateCard.classList.remove('hidden');

    // Show resume text
    resumeTextContent.textContent = data.resumeText;
    resumeTextBox.classList.remove('hidden');
    clearResumeBtn.classList.remove('hidden');
    uploadArea.classList.add('hidden');

    // Enable chat
    chatInput.disabled = false;
    sendBtn.disabled = false;
    analyzeBtn.disabled = false;
    chatEmpty.classList.add('hidden');
    suggestedQuestions.classList.remove('hidden');

    // Update header status
    statusText.textContent = `${name} loaded`;
    headerDot.classList.remove('inactive');
    headerDot.classList.add('active');

    resumeLoaded = true;

    // Welcome message
    appendMessage('assistant', `👋 Hi! I'm ready to answer questions as **${name}**. Go ahead and ask me anything about my background, skills, or experience.`);

  } catch (err) {
    uploadArea.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i><p>Error: ${err.message}</p><span>Try again</span>`;
  }
}

// Toggle resume text
toggleResume.addEventListener('click', () => {
  const content = document.getElementById('resumeTextContent');
  content.style.display = content.style.display === 'none' ? 'block' : 'none';
  toggleResume.querySelector('i').style.transform =
    content.style.display === 'none' ? 'rotate(0deg)' : 'rotate(180deg)';
});

// Clear Resume
clearResumeBtn.addEventListener('click', () => {
  location.reload();
});

// Chat
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) sendMessage();
});

sendBtn.addEventListener('click', sendMessage);

async function sendMessage() {
  const message = chatInput.value.trim();
  if (!message || !resumeLoaded) return;

  chatInput.value = '';
  sendBtn.disabled = true;
  chatInput.disabled = true;

  appendMessage('user', message);

  // Typing indicator
  const typingId = appendTyping();

  try {
    const res = await fetch(`${API}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, chatHistory }),
    });

    const data = await res.json();
    removeTyping(typingId);

    if (!data.success) throw new Error(data.error);

    appendMessage('assistant', data.reply);
    chatHistory.push({ role: 'user', content: message });
    chatHistory.push({ role: 'assistant', content: data.reply });

  } catch (err) {
    removeTyping(typingId);
    appendMessage('assistant', `⚠️ Error: ${err.message}`);
  }

  sendBtn.disabled = false;
  chatInput.disabled = false;
  chatInput.focus();
}

function appendMessage(role, text) {
  const div = document.createElement('div');
  div.className = `message ${role}`;
  div.innerHTML = `
    <span class="message-label">${role === 'user' ? '👤 HR' : '🤖 Candidate'}</span>
    <div class="message-bubble">${formatText(text)}</div>
  `;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function appendTyping() {
  const id = 'typing-' + Date.now();
  const div = document.createElement('div');
  div.className = 'message assistant typing';
  div.id = id;
  div.innerHTML = `
    <span class="message-label">🤖 Candidate</span>
    <div class="message-bubble">
      <div class="typing-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return id;
}

function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

// Suggested Questions
function askSuggested(question) {
  chatInput.value = question;
  sendMessage();
}

// JD Match Analysis
analyzeBtn.addEventListener('click', async () => {
  const jd = jdInput.value.trim();
  if (!jd) return alert('Please paste a job description first');

  analyzeBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';
  analyzeBtn.disabled = true;

  try {
    const res = await fetch(`${API}/analyze-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobDescription: jd }),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.error);

    displayMatchResults(data.analysis);

  } catch (err) {
    alert('Error: ' + err.message);
  }

  analyzeBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass-chart"></i> Analyze Match';
  analyzeBtn.disabled = false;
});

function displayMatchResults(analysis) {
  matchResults.classList.remove('hidden');

  // Score circle animation
  const score = analysis.matchPercentage;
  document.getElementById('scoreNumber').textContent = score;
  const circumference = 314;
  const offset = circumference - (score / 100) * circumference;
  document.getElementById('circleProgress').style.strokeDashoffset = offset;

  // Color score
  const circle = document.getElementById('circleProgress');
  if (score >= 70) circle.style.stroke = 'var(--success)';
  else if (score >= 40) circle.style.stroke = 'var(--warning)';
  else circle.style.stroke = 'var(--danger)';

  // Matched skills
  const matchedDiv = document.getElementById('matchedSkills');
  matchedDiv.innerHTML = analysis.matchedSkills
    .map(s => `<span class="tag matched">${s}</span>`).join('');

  // Missing skills
  const missingDiv = document.getElementById('missingSkills');
  missingDiv.innerHTML = analysis.missingSkills
    .map(s => `<span class="tag missing">${s}</span>`).join('');

  // Strengths
  document.getElementById('strengthsList').innerHTML = analysis.strengths
    .map(s => `<li>${s}</li>`).join('');

  // Gaps
  document.getElementById('gapsList').innerHTML = analysis.gaps
    .map(g => `<li>${g}</li>`).join('');

  // Summary
  document.getElementById('summaryText').textContent = analysis.summary;

  // Scroll to results
  matchResults.scrollIntoView({ behavior: 'smooth' });
}