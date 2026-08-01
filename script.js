// --- Web Audio SFX & Multi-Vibe Music Synthesizer Engine ---
let audioCtx = null;
let isAudioPlaying = false;
let audioTimer = null;
let currentVibe = "piano";

function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

// Play UI Sound FX (pops, chimes, clicks)
function playSoundFX(type = "click") {
  try {
    initAudioContext();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    if (type === "click") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === "chime") {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const oscC = audioCtx.createOscillator();
        const gainC = audioCtx.createGain();
        oscC.type = "triangle";
        oscC.frequency.setValueAtTime(freq, now + i * 0.08);
        gainC.gain.setValueAtTime(0.08, now + i * 0.08);
        gainC.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.6);
        oscC.connect(gainC);
        gainC.connect(audioCtx.destination);
        oscC.start(now + i * 0.08);
        oscC.stop(now + i * 0.08 + 0.6);
      });
    }
  } catch (err) {
    // Ignore audio autoplay restrictions
  }
}

// Musical Chord Progressions for Vibe Picker
const vibeChords = {
  piano: [
    [261.63, 329.63, 392.00, 523.25], // C Major
    [220.00, 261.63, 329.63, 440.00], // A Minor
    [174.61, 220.00, 261.63, 349.23], // F Major
    [196.00, 246.94, 293.66, 392.00]  // G Major
  ],
  lofi: [
    [293.66, 349.23, 440.00, 523.25], // Dm7
    [196.00, 246.94, 293.66, 440.00], // G7
    [261.63, 329.63, 392.00, 493.88], // Cmaj7
    [220.00, 261.63, 329.63, 392.00]  // Am7
  ],
  upbeat: [
    [329.63, 392.00, 493.88, 659.25], // E Minor
    [261.63, 329.63, 392.00, 523.25], // C Major
    [196.00, 246.94, 293.66, 392.00], // G Major
    [220.00, 261.63, 329.63, 440.00]  // A Minor
  ]
};

let chordStep = 0;

function playAmbientChord() {
  if (!isAudioPlaying || !audioCtx) return;

  const currentChords = vibeChords[currentVibe] || vibeChords.piano;
  const notes = currentChords[chordStep];
  chordStep = (chordStep + 1) % currentChords.length;

  notes.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = currentVibe === "lofi" ? "triangle" : "sine";
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.035 - idx * 0.006, now + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now + idx * 0.12);
    osc.stop(now + 4.0);
  });
}

const audioToggleBtn = document.getElementById("audioToggleBtn");
const audioVibeSelect = document.getElementById("audioVibeSelect");

audioVibeSelect.addEventListener("change", (e) => {
  currentVibe = e.target.value;
  chordStep = 0;
  if (isAudioPlaying) {
    playAmbientChord();
  }
});

audioToggleBtn.addEventListener("click", () => {
  initAudioContext();
  isAudioPlaying = !isAudioPlaying;

  if (isAudioPlaying) {
    audioToggleBtn.classList.add("playing");
    playAmbientChord();
    audioTimer = setInterval(playAmbientChord, 3800);
    playSoundFX("chime");
  } else {
    audioToggleBtn.classList.remove("playing");
    clearInterval(audioTimer);
  }
});


// --- Dynamic Aesthetic Themes Switcher ---
document.querySelectorAll(".theme-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    playSoundFX("click");
    document.querySelectorAll(".theme-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const theme = btn.getAttribute("data-theme");
    document.documentElement.setAttribute("data-theme", theme);
  });
});


// --- Personalization Binder ---
const togglePersonalizeBtn = document.getElementById("togglePersonalizeBtn");
const personalizeBox = document.getElementById("personalizeBox");
const friendNameInput = document.getElementById("friendNameInput");
const badgeSelect = document.getElementById("badgeSelect");
const recipientNameDisplay = document.getElementById("recipientNameDisplay");
const friendBadge = document.getElementById("friendBadge");

togglePersonalizeBtn.addEventListener("click", () => {
  playSoundFX("click");
  personalizeBox.classList.toggle("hidden");
});

friendNameInput.addEventListener("input", (e) => {
  const val = e.target.value.trim();
  recipientNameDisplay.textContent = val ? val : "My Friend";
});

badgeSelect.addEventListener("change", (e) => {
  playSoundFX("click");
  friendBadge.innerHTML = `<i class="fa-solid fa-shield-heart"></i> ${e.target.value}`;
});


// --- Photo Filters Bar ---
let currentFilter = "normal";
const photoFrame = document.getElementById("photoFrame");

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    playSoundFX("click");
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.getAttribute("data-filter");
    
    photoFrame.className = `photo-frame filter-${currentFilter}`;
  });
});


// --- Heartfelt Message Typewriter Effect ---
const text = "Some people come into our lives and become family by choice. A true friend is someone who stands by you through every smile, every tear, every success, and every challenge. Thank you for filling my life with unforgettable memories, endless laughter, and unconditional support. No matter where life takes us, our friendship will always remain strong because true friendship is built on trust, care, and countless beautiful moments together. On this Friendship Day, I just want you to know how grateful I am to have you in my life. May our bond continue to grow stronger with every passing year. Wishing you a Friendship Day filled with happiness, love, and beautiful memories. Happy Friendship Day, my forever friend! 💙✨";

let i = 0;
let typingTimeout = null;
const msgElement = document.getElementById("msg");

function typeMessage() {
  if (i < text.length) {
    msgElement.textContent += text[i++];
    typingTimeout = setTimeout(typeMessage, 35);
  }
}

document.getElementById("replayMsgBtn").addEventListener("click", () => {
  playSoundFX("click");
  clearTimeout(typingTimeout);
  msgElement.textContent = "";
  i = 0;
  typeMessage();
});

typeMessage();


// --- Images & Memories System ---
const images = [
  "pic/WhatsApp Image 2026-08-01 at 8.56.40 PM (1).jpeg",
  "pic/WhatsApp Image 2026-08-01 at 8.56.40 PM.jpeg",
  "pic/WhatsApp Image 2026-08-01 at 8.56.41 PM (1).jpeg",
  "pic/WhatsApp Image 2026-08-01 at 8.56.41 PM (2).jpeg",
  "pic/WhatsApp Image 2026-08-01 at 8.56.41 PM (3).jpeg",
  "pic/WhatsApp Image 2026-08-01 at 8.56.41 PM (4).jpeg",
  "pic/WhatsApp Image 2026-08-01 at 8.56.41 PM (5).jpeg",
  "pic/WhatsApp Image 2026-08-01 at 8.56.41 PM (6).jpeg",
  "pic/WhatsApp Image 2026-08-01 at 8.56.41 PM.jpeg",
  "pic/IMG_1356.JPG",
  "pic/20250217_122403.jpg",
  "pic/IMG_3593.JPG",
  "pic/IMG_3596.JPG"
];

const memoryTags = [
  "#Unforgettable", "#BestTimes", "#PureJoy", "#SquadGoals", 
  "#ForeverFriends", "#Laughs", "#GoodVibes", "#Precious", 
  "#Memories", "#GoldenDays", "#PartnersInCrime", "#Celebration", "#EndlessLaughter"
];

let idx = 0;
let isPlaying = true;
let slideshowInterval = null;
let progressInterval = null;
let progressValue = 0;
const SLIDE_DURATION = 3500;

const slideImg = document.getElementById("slide");
const photoCaption = document.getElementById("photoCaption");
const photoTag = document.getElementById("photoTag");
const imgCounter = document.getElementById("imgCounter");
const playPauseBtn = document.getElementById("playPauseBtn");
const playPauseText = document.getElementById("playPauseText");
const slideshowProgress = document.getElementById("slideshowProgress");
const thumbnailStrip = document.getElementById("thumbnailStrip");

// Generate Thumbnails
images.forEach((src, index) => {
  const thumb = document.createElement("img");
  thumb.src = src;
  thumb.alt = `Thumb ${index + 1}`;
  thumb.className = `thumb-item ${index === 0 ? "active" : ""}`;
  thumb.addEventListener("click", () => {
    playSoundFX("click");
    goToImg(index);
  });
  thumbnailStrip.appendChild(thumb);
});

function updateImgDisplay(newIdx) {
  idx = (newIdx + images.length) % images.length;
  
  slideImg.classList.add("fade-out");
  
  setTimeout(() => {
    slideImg.src = images[idx];
    photoCaption.textContent = `Precious Moment ${idx + 1}`;
    photoTag.textContent = memoryTags[idx % memoryTags.length];
    imgCounter.innerHTML = `<i class="fa-regular fa-image"></i> Photo ${idx + 1} of ${images.length}`;
    
    document.querySelectorAll(".thumb-item").forEach((thumb, i) => {
      thumb.classList.toggle("active", i === idx);
      if (i === idx) {
        thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    slideImg.classList.remove("fade-out");
  }, 250);

  resetProgress();
}

function nextImg() {
  playSoundFX("click");
  updateImgDisplay(idx + 1);
}

function prevImg() {
  playSoundFX("click");
  updateImgDisplay(idx - 1);
}

function goToImg(targetIdx) {
  updateImgDisplay(targetIdx);
}

function resetProgress() {
  progressValue = 0;
  if (slideshowProgress) slideshowProgress.style.width = "0%";
}

function startSlideshowTimer() {
  clearInterval(slideshowInterval);
  clearInterval(progressInterval);

  if (!isPlaying) return;

  const intervalStep = 50;
  progressInterval = setInterval(() => {
    if (isPlaying) {
      progressValue += (intervalStep / SLIDE_DURATION) * 100;
      if (slideshowProgress) slideshowProgress.style.width = `${Math.min(progressValue, 100)}%`;
    }
  }, intervalStep);

  slideshowInterval = setInterval(() => {
    if (isPlaying) {
      nextImg();
    }
  }, SLIDE_DURATION);
}

playPauseBtn.addEventListener("click", () => {
  playSoundFX("click");
  isPlaying = !isPlaying;
  if (isPlaying) {
    playPauseBtn.querySelector("i").className = "fa-solid fa-pause";
    playPauseText.textContent = "Pause";
    startSlideshowTimer();
  } else {
    playPauseBtn.querySelector("i").className = "fa-solid fa-play";
    playPauseText.textContent = "Play";
    clearInterval(slideshowInterval);
    clearInterval(progressInterval);
  }
});

startSlideshowTimer();

// Keyboard Navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") prevImg();
  if (e.key === "ArrowRight") nextImg();
  if (e.key === " ") {
    e.preventDefault();
    playPauseBtn.click();
  }
});


// --- 3D Polaroid Tilt Physics ---
const polaroid3D = document.getElementById("polaroid3D");
if (polaroid3D) {
  document.addEventListener("mousemove", (e) => {
    const rect = polaroid3D.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    if (Math.abs(mouseX) < 400 && Math.abs(mouseY) < 400) {
      const rotateX = (mouseY / 25).toFixed(2);
      const rotateY = (-mouseX / 25).toFixed(2);
      polaroid3D.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    } else {
      polaroid3D.style.transform = `rotateX(0deg) rotateY(0deg)`;
    }
  });
}


// --- Modals (Gallery & Timeline) ---
const galleryModal = document.getElementById("galleryModal");
const openGalleryBtn = document.getElementById("openGalleryBtn");
const closeGalleryBtn = document.getElementById("closeGalleryBtn");
const galleryGrid = document.getElementById("galleryGrid");

images.forEach((src, index) => {
  const item = document.createElement("div");
  item.className = "grid-item";
  item.innerHTML = `<img src="${src}" alt="Memory ${index + 1}">`;
  item.addEventListener("click", () => {
    playSoundFX("click");
    goToImg(index);
    galleryModal.classList.remove("open");
  });
  galleryGrid.appendChild(item);
});

openGalleryBtn.addEventListener("click", () => {
  playSoundFX("click");
  galleryModal.classList.add("open");
});

closeGalleryBtn.addEventListener("click", () => {
  playSoundFX("click");
  galleryModal.classList.remove("open");
});


// Timeline Modal
const timelineModal = document.getElementById("timelineModal");
const openTimelineBtn = document.getElementById("openTimelineBtn");
const closeTimelineBtn = document.getElementById("closeTimelineBtn");
const timelineContainer = document.getElementById("timelineContainer");

images.forEach((src, index) => {
  const node = document.createElement("div");
  node.className = "timeline-node";
  node.innerHTML = `
    <img class="timeline-thumb" src="${src}" alt="Timeline ${index + 1}">
    <div class="timeline-info">
      <h4>Memory #${index + 1}</h4>
      <p>${memoryTags[index % memoryTags.length]} &bull; A moment frozen in time</p>
    </div>
  `;
  node.addEventListener("click", () => {
    playSoundFX("click");
    goToImg(index);
    timelineModal.classList.remove("open");
  });
  timelineContainer.appendChild(node);
});

openTimelineBtn.addEventListener("click", () => {
  playSoundFX("click");
  timelineModal.classList.add("open");
});

closeTimelineBtn.addEventListener("click", () => {
  playSoundFX("click");
  timelineModal.classList.remove("open");
});


// --- Floating Canvas Particles & Cursor Stardust Trail ---
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Particle {
  constructor(x, y, isBurst = false, isSparkle = false) {
    this.x = x || Math.random() * canvas.width;
    this.y = y || canvas.height + Math.random() * 50;
    this.size = isSparkle ? Math.random() * 4 + 2 : Math.random() * 14 + 8;
    this.speedY = isBurst ? (Math.random() - 0.5) * 8 : (isSparkle ? (Math.random() - 0.5) * 2 : - (Math.random() * 1.5 + 0.5));
    this.speedX = isBurst ? (Math.random() - 0.5) * 8 : (Math.random() - 0.5) * 1.5;
    this.opacity = Math.random() * 0.7 + 0.3;
    this.color = ["#60a5fa", "#93c5fd", "#c084fc", "#f472b6", "#fbbf24", "#34d399"][Math.floor(Math.random() * 6)];
    this.rotation = Math.random() * Math.PI * 2;
    this.isBurst = isBurst;
    this.isSparkle = isSparkle;
    this.life = isBurst || isSparkle ? (isSparkle ? 40 : 100) : Infinity;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += 0.02;

    if (this.isBurst || this.isSparkle) {
      this.life--;
      this.opacity = this.life / (this.isSparkle ? 40 : 100);
      if (this.isBurst) this.speedY += 0.08;
    } else {
      if (this.y < -30) {
        this.y = canvas.height + 20;
        this.x = Math.random() * canvas.width;
      }
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = Math.max(0, this.opacity);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;

    if (this.isSparkle) {
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Draw Heart Shape
      ctx.beginPath();
      const topCurveHeight = this.size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
      ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, this.size, 0, this.size);
      ctx.bezierCurveTo(0, this.size, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
      ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }
}

// Spawn particles
for (let i = 0; i < 35; i++) {
  particles.push(new Particle());
}

// Mouse Stardust Trail
window.addEventListener("mousemove", (e) => {
  if (Math.random() < 0.3) {
    particles.push(new Particle(e.clientX, e.clientY, false, true));
  }
});

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach((p, index) => {
    p.update();
    p.draw();

    if ((p.isBurst || p.isSparkle) && p.life <= 0) {
      particles.splice(index, 1);
    }
  });

  requestAnimationFrame(animateParticles);
}
animateParticles();

// Celebrate Button (Fireworks / Heart Burst)
document.getElementById("celebrateBtn").addEventListener("click", (e) => {
  playSoundFX("chime");
  const rect = e.target.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top;

  for (let i = 0; i < 70; i++) {
    particles.push(new Particle(centerX, centerY, true));
  }
});

