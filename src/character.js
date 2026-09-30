/* ==========================================================================
   CHARACTER CONTROLLER & INTERACTIVE WALKING ENGINE
   Manages sprite cycling, timeline locomotion, 3D card tilt, and speech HUD
   ========================================================================== */

import { soundEngine } from './audio.js';

export class CharacterSystem {
  constructor() {
    // Walking Cycle Sprites
    const base = import.meta.env.BASE_URL;
    this.walkSprites = [
      `${base}assets/character/02_walking_1.png`,
      `${base}assets/character/03_walking_2.png`,
      `${base}assets/character/04_walking_3.png`,
      `${base}assets/character/07_with_laptop.png`,
      `${base}assets/character/08_walking_right.png`
    ];

    // Companion Mood Cycle
    this.companionPoses = [
      { src: `${base}assets/character/09_hero_front.png`, speech: "Ready to build production-grade AI & ML systems." },
      { src: `${base}assets/character/15_welcome_gesture.png`, speech: "Welcome! Seeking AI/ML and Data Analyst opportunities." },
      { src: `${base}assets/character/12_thinking.png`, speech: "Evaluating dense vector retrieval & 13.6ms RAG benchmarks..." },
      { src: `${base}assets/character/13_pointing_right.png`, speech: "Check out DocChat and BachatAI right there!" },
      { src: `${base}assets/character/11_sitting_working.png`, speech: "Preprocessing 100k+ records and optimizing models in Python." }
    ];
    this.currentCompanionIdx = 0;

    // DOM Elements
    this.heroCard = document.getElementById('hero-3d-card');
    this.heroCardContainer = document.getElementById('hero-card-container');
    this.cardGlow = document.getElementById('card-glow');
    this.heroCharImg = document.getElementById('hero-character-image');
    this.poseChips = document.querySelectorAll('.pose-chip');

    // Walking Track Elements
    this.journeySection = document.getElementById('journey');
    this.walkerAvatar = document.getElementById('walker-avatar');
    this.walkerSprite = document.getElementById('walker-sprite');
    this.walkerSpeech = document.getElementById('walker-speech');
    this.walkerStatus = document.getElementById('walker-status-text');
    this.walkerChapter = document.getElementById('walker-chapter-text');
    this.trackFill = document.getElementById('track-line-progress');

    // Companion Elements
    this.companionDock = document.getElementById('companion-dock');
    this.companionTrigger = document.getElementById('companion-avatar-trigger');
    this.companionImg = document.getElementById('companion-avatar-img');
    this.companionBubble = document.getElementById('companion-bubble');
    this.bubbleClose = document.getElementById('bubble-close');

    // Walk State
    this.walkFrame = 0;
    this.lastScrollY = window.scrollY;

    this.init();
  }

  init() {
    this.bindHero3DTilt();
    this.bindPoseChips();
    this.bindWalkingTrack();
    this.bindCompanion();
  }

  // 1. HERO 3D CARD TILT & SPECULAR HIGHLIGHT
  bindHero3DTilt() {
    if (!this.heroCardContainer || !this.heroCard) return;

    const handleMove = (e) => {
      const rect = this.heroCardContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12; // tilt angle
      const rotateY = ((x - centerX) / centerX) * 14;

      this.heroCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      if (this.cardGlow) {
        const glowX = (x / rect.width) * 100;
        const glowY = (y / rect.height) * 100;
        this.cardGlow.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, var(--primary-glow) 0%, transparent 60%)`;
      }
    };

    const handleLeave = () => {
      this.heroCard.style.transform = `rotateX(0deg) rotateY(0deg)`;
      if (this.cardGlow) {
        this.cardGlow.style.background = `radial-gradient(circle at 50% 30%, var(--primary-glow) 0%, transparent 60%)`;
      }
    };

    this.heroCardContainer.addEventListener('pointermove', handleMove);
    this.heroCardContainer.addEventListener('pointerleave', handleLeave);
  }

  // 2. HERO POSE CHIPS
  bindPoseChips() {
    this.poseChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        soundEngine.playClick();
        this.poseChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const newSrc = chip.getAttribute('data-pose-src');
        if (this.heroCharImg && newSrc) {
          this.heroCharImg.style.opacity = '0';
          this.heroCharImg.style.transform = 'scale(0.95)';
          setTimeout(() => {
            this.heroCharImg.src = newSrc;
            this.heroCharImg.style.opacity = '1';
            this.heroCharImg.style.transform = 'scale(1)';
          }, 180);
        }
      });
    });
  }

  // 3. SCROLL-DRIVEN WALKING TRACK
  bindWalkingTrack() {
    if (!this.journeySection || !this.walkerAvatar) return;

    window.addEventListener('scroll', () => {
      const rect = this.journeySection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Check if journey section is in viewport
      if (rect.top <= windowHeight && rect.bottom >= 0) {
        const totalDist = rect.height - windowHeight * 0.4;
        const scrolled = Math.max(0, windowHeight * 0.8 - rect.top);
        const progress = Math.min(1, Math.max(0, scrolled / totalDist));

        // Advance walker horizontally (5% to 92%)
        const walkerPos = 5 + progress * 87;
        this.walkerAvatar.style.setProperty('--walker-pos', `${walkerPos}%`);
        this.trackFill?.style.setProperty('--track-fill', `${walkerPos}%`);

        // Sprite Cycling based on scroll distance
        const delta = Math.abs(window.scrollY - this.lastScrollY);
        if (delta > 12) {
          this.walkFrame = (this.walkFrame + 1) % this.walkSprites.length;
          if (this.walkerSprite) {
            this.walkerSprite.src = this.walkSprites[this.walkFrame];
          }
          this.lastScrollY = window.scrollY;
        }

        // Chapter Milestones & Speech
        if (progress < 0.25) {
          if (this.walkerChapter) this.walkerChapter.textContent = "01 / 04";
          if (this.walkerStatus) this.walkerStatus.textContent = "Schooling at Mary Lucas & Early Logic";
          if (this.walkerSpeech) this.walkerSpeech.textContent = '"Where curiosity for computer science first began!"';
        } else if (progress < 0.55) {
          if (this.walkerChapter) this.walkerChapter.textContent = "02 / 04";
          if (this.walkerStatus) this.walkerStatus.textContent = "Diploma in IT (76%) & Android Java";
          if (this.walkerSpeech) this.walkerSpeech.textContent = '"Building 5+ Android apps with Firebase at NetCamp!"';
        } else if (progress < 0.82) {
          if (this.walkerChapter) this.walkerChapter.textContent = "03 / 04";
          if (this.walkerStatus) this.walkerStatus.textContent = "B.Tech AI/ML & IBM/VOIS Internships";
          if (this.walkerSpeech) this.walkerSpeech.textContent = '"Analyzing 7,700+ Netflix titles & IBM chatbots!"';
        } else {
          if (this.walkerChapter) this.walkerChapter.textContent = "04 / 04";
          if (this.walkerStatus) this.walkerStatus.textContent = "Enterprise RAG & BachatAI ML";
          if (this.walkerSpeech) this.walkerSpeech.textContent = '"Architecting sub-15ms RAG pipelines & ML models!"';
        }
      }
    }, { passive: true });
  }

  // 4. COMPANION CHARACTER DOCK
  bindCompanion() {
    if (!this.companionTrigger) return;

    this.companionTrigger.addEventListener('click', () => {
      soundEngine.playClick();
      this.currentCompanionIdx = (this.currentCompanionIdx + 1) % this.companionPoses.length;
      const current = this.companionPoses[this.currentCompanionIdx];

      if (this.companionImg) {
        this.companionImg.style.transform = 'scale(0.85) rotate(5deg)';
        setTimeout(() => {
          this.companionImg.src = current.src;
          this.companionImg.style.transform = 'scale(1) rotate(0deg)';
        }, 120);
      }

      if (this.companionBubble) {
        const textSpan = this.companionBubble.querySelector('span');
        if (textSpan) textSpan.textContent = `"${current.speech}"`;
        this.companionBubble.classList.add('show');
      }
    });

    if (this.bubbleClose && this.companionBubble) {
      this.bubbleClose.addEventListener('click', (e) => {
        e.stopPropagation();
        this.companionBubble.classList.remove('show');
      });
    }

    // Contextual remarks when scrolling over different sections
    let speechTimer = null;
    const triggerSpeech = (msg, poseSrc) => {
      if (!this.companionBubble) return;
      const textSpan = this.companionBubble.querySelector('span');
      if (textSpan) textSpan.textContent = msg;
      if (poseSrc && this.companionImg) this.companionImg.src = poseSrc;
      this.companionBubble.classList.add('show');

      clearTimeout(speechTimer);
      speechTimer = setTimeout(() => {
        this.companionBubble.classList.remove('show');
      }, 5000);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const base = import.meta.env.BASE_URL;
          if (id === 'projects') {
            triggerSpeech('"Check out these real-time 3D architectures!"', `${base}assets/character/13_pointing_right.png`);
          } else if (id === 'lab') {
            triggerSpeech('"Welcome to my workstation. Click the glowing hotspots!"', `${base}assets/character/11_sitting_working.png`);
          } else if (id === 'contact') {
            triggerSpeech('"Let’s build something legendary together!"', `${base}assets/character/15_welcome_gesture.png`);
          }
        }
      });
    }, { threshold: 0.35 });

    ['hero', 'journey', 'projects', 'lab', 'terminal-section', 'contact'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }
}
