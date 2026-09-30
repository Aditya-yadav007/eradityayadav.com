/* ==========================================================================
   ADITYA YADAV — 3D SPATIAL PORTFOLIO MAIN ENTRY
   Glues Three.js scene, Motion physics, Character controller, Terminal & Audio
   ========================================================================== */

import { soundEngine } from './audio.js';
import { Scene3D } from './scene3d.js';
import { CharacterSystem } from './character.js';
import { TerminalEmulator } from './terminal.js';
import { setupMotionSystem } from './motionSetup.js';
import confetti from 'canvas-confetti';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Three.js Spatial Scene
  const canvas = document.getElementById('webgl-canvas');
  let scene3d = null;
  if (canvas) {
    scene3d = new Scene3D(canvas);
  }

  // 2. Initialize Motion Engine
  setupMotionSystem();

  // 3. Initialize Character System
  const characterSystem = new CharacterSystem();

  // 4. Initialize Interactive Terminal
  const terminal = new TerminalEmulator();

  // 5. Global Sound & Audio Toggle
  const audioToggle = document.getElementById('audio-toggle');
  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      const isPlaying = soundEngine.toggle();
      audioToggle.classList.toggle('active', isPlaying);
    });
  }

  // Bind subtle hover sounds to interactive elements
  const hoverSoundTargets = document.querySelectorAll(
    'a, button, .project-card, .chapter-card, .hotspot, .pose-chip, .t-chip'
  );
  hoverSoundTargets.forEach(el => {
    el.addEventListener('mouseenter', () => soundEngine.playHover());
  });

  // 6. Theme Switcher Engine
  const themeButtons = document.querySelectorAll('[data-theme-btn]');
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      soundEngine.playClick();
      const theme = btn.getAttribute('data-theme-btn');
      if (!theme) return;

      document.documentElement.setAttribute('data-theme', theme);

      themeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (scene3d) {
        scene3d.setTheme(theme);
      }
    });
  });

  // 6b. Mobile Navigation Drawer Controller
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavBackdrop = document.getElementById('mobile-nav-backdrop');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-contact-btn, .mobile-nav-resume-btn');

  const openMobileNav = () => {
    if (!mobileNavDrawer) return;
    soundEngine.playClick();
    mobileNavDrawer.classList.add('open');
    mobileNavDrawer.setAttribute('aria-hidden', 'false');
    mobileMenuToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileNav = () => {
    if (!mobileNavDrawer) return;
    soundEngine.playClick();
    mobileNavDrawer.classList.remove('open');
    mobileNavDrawer.setAttribute('aria-hidden', 'true');
    mobileMenuToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  mobileMenuToggle?.addEventListener('click', () => {
    if (mobileNavDrawer?.classList.contains('open')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  mobileNavClose?.addEventListener('click', closeMobileNav);
  mobileNavBackdrop?.addEventListener('click', closeMobileNav);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNavDrawer?.classList.contains('open')) {
      closeMobileNav();
    }
  });

  // 6c. Navigation Active State Tracking with IntersectionObserver
  const navLinks = document.querySelectorAll('.nav-link[data-nav]');
  const mobileNavLinksAll = document.querySelectorAll('.mobile-nav-link[data-mobile-nav]');
  const sectionIds = ['hero', 'journey', 'projects', 'lab', 'terminal-section', 'contact'];
  const sectionElements = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  const updateActiveNav = (activeSectionId) => {
    // Map section IDs to nav data attributes
    const navMap = {
      'hero': null,
      'journey': 'journey',
      'projects': 'projects',
      'lab': 'lab',
      'terminal-section': 'terminal',
      'contact': 'contact'
    };

    const activeNav = navMap[activeSectionId];

    navLinks.forEach(link => {
      const nav = link.getAttribute('data-nav');
      if (nav === activeNav) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    const mobileNavMap = {
      'hero': 'hero',
      'journey': 'journey',
      'projects': 'projects',
      'lab': 'lab',
      'terminal-section': 'terminal',
      'contact': 'contact'
    };

    const activeMobileNav = mobileNavMap[activeSectionId];

    mobileNavLinksAll.forEach(link => {
      const nav = link.getAttribute('data-mobile-nav');
      if (nav === activeMobileNav) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        updateActiveNav(entry.target.id);
      }
    });
  }, {
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  });

  sectionElements.forEach(section => navObserver.observe(section));

  // 7. Workstation Hotspot Detail Explorer (Aditya's AI/ML Tech Matrix)
  const hotspots = document.querySelectorAll('.hotspot');
  const panelBadge = document.getElementById('panel-badge');
  const panelTitle = document.getElementById('panel-title');
  const panelBody = document.getElementById('panel-body');
  const panelItems = document.getElementById('panel-items');

  const hotspotData = {
    aiml: {
      badge: "GENAI, RAG & MACHINE LEARNING",
      title: "LangChain, FAISS, PyTorch & Scikit-learn",
      body: "Specialized in building end-to-end AI/ML pipelines: vector database indexing (FAISS), dense sentence embeddings, prompt engineering, RAG document search with sub-15ms retrieval, and classification/regression model evaluation.",
      specs: [
        { label: "Vector Search", val: "FAISS + Dense Embeddings" },
        { label: "Frameworks", val: "LangChain & PyTorch" },
        { label: "ML & Eval", val: "Scikit-learn Models" },
        { label: "LLM Methods", val: "Prompt Eng. & RAG" }
      ]
    },
    data: {
      badge: "PYTHON & DATA ANALYTICS PIPELINE",
      title: "Pandas, NumPy, Matplotlib & Exploratory Data Analysis",
      body: "Extensive experience processing large-scale datasets: analyzed 7,700+ Netflix catalog titles across 60+ genres (AICTE VOIS Internship), explored 100,000+ Airbnb market listings, and evaluated 100k+ Kaggle transactions.",
      specs: [
        { label: "Datasets", val: "7.7k+ Netflix / 100k+ Airbnb" },
        { label: "Libraries", val: "Pandas, NumPy, Matplotlib" },
        { label: "Analysis", val: "EDA, Trends & Correlation" },
        { label: "Databases", val: "SQL, MySQL & Firebase" }
      ]
    },
    webcloud: {
      badge: "CORE SOFTWARE & ENGINEERING RIGOR",
      title: "Python, Flask, Django, Core Java & Firebase",
      body: "Solid software engineering foundation in Data Structures & Algorithms, OOP, and DBMS. Built 5+ Android apps using Core Java and Firebase with 30% performance boost at NetCamp. Full-stack web interfaces in Flask, HTML5, CSS3, JavaScript.",
      specs: [
        { label: "Full-Stack", val: "Flask, Django, HTML, CSS, JS" },
        { label: "Mobile / Java", val: "Core Java & Android Studio" },
        { label: "Cloud / DB", val: "Firebase & MySQL" },
        { label: "Workflow", val: "Git, GitHub & VS Code" }
      ]
    },
    certifications: {
      badge: "VERIFIED CREDENTIALS & INDUSTRY TRAINING",
      title: "CISCO, Infosys, NPTEL, TCS iON & ISRO / IIRS",
      body: "Continuously expanding capabilities with rigorous verified certifications in modern AI, machine learning, data science, digital image analysis, and project management.",
      specs: [
        { label: "AI & Data", val: "CISCO Modern AI & Infosys DS" },
        { label: "ML Rigor", val: "NPTEL Machine Learning" },
        { label: "Security", val: "TCS iON AI & Cyber Awareness" },
        { label: "Remote Sensing", val: "IIRS / ISRO Image Analysis" }
      ]
    }
  };

  hotspots.forEach(spot => {
    spot.addEventListener('click', () => {
      soundEngine.playClick();
      hotspots.forEach(s => s.classList.remove('active'));
      spot.classList.add('active');

      const key = spot.getAttribute('data-hotspot');
      const data = hotspotData[key];
      if (!data) return;

      if (panelBadge) panelBadge.textContent = data.badge;
      if (panelTitle) panelTitle.textContent = data.title;
      if (panelBody) panelBody.textContent = data.body;
      if (panelItems) {
        panelItems.innerHTML = data.specs.map(s => `
          <div class="spec-card">
            <span class="s-label">${s.label}</span>
            <span class="s-val">${s.val}</span>
          </div>
        `).join('');
      }
    });
  });

  // 8. 3D Project Modals Engine (Aditya's Flagship Systems)
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const modalImg = document.getElementById('modal-img');
  const modalBadge = document.getElementById('modal-badge');
  const modalStats = document.getElementById('modal-stats');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalHighlights = document.getElementById('modal-highlights');
  const modalTech = document.getElementById('modal-tech');
  const btnModalDemo = document.getElementById('btn-modal-demo');
  const btnModalGithub = document.getElementById('btn-modal-github');  const base = import.meta.env.BASE_URL;
  const projectDetails = {
    docchat: {
      title: "DocChat — AI Intelligent Document Q&A Chatbot",
      badge: "RAG / FAISS / LANGCHAIN / 2026",
      stats: "13.6ms Latency • 10/10 Recall • 933 Pages",
      img: `${base}assets/projects/omni_ai.jpg`,
      desc: "An enterprise-grade Retrieval-Augmented Generation (RAG) system engineered for high-throughput semantic querying across massive enterprise document corpora with minimal hallucination.",
      highlights: [
        "Indexed and retrieved answers from a 933-page, 4-document corpus (1,823 FAISS vector chunks) with 13.6ms average retrieval latency (p95: 18.3ms) across 30 test queries.",
        "Validated retrieval relevance through rigorous manual testing of 10 known-answer queries, achieving 10/10 relevant-passage recall within top-3 results.",
        "Cut time to locate information in a 933-page corpus from an estimated 3–5 minutes down to under 30 seconds (~6–10x faster) via a full-stack Flask + LangChain application.",
        "Engineered incremental indexing and FAISS vector persistence for dynamic document onboarding."
      ],
      tech: ["Python", "LangChain", "FAISS", "Sentence Transformers", "Generative AI", "Flask", "Prompt Engineering"],
      demoUrl: "https://github.com/Aditya-yadav007",
      demoText: "GitHub Repository ↗",
      githubUrl: "https://github.com/Aditya-yadav007"
    },
    bachatai: {
      title: "BachatAI — AI-Driven Personal Finance Management System",
      badge: "MACHINE LEARNING / NLP / 2025",
      stats: "100k+ Transactions • 87–90% Accuracy • 6 Categories",
      img: `${base}assets/projects/aether_finance.jpg`,
      desc: "An intelligent personal finance and budgeting platform featuring automated expenditure classification, predictive budget modeling, and natural language conversational financial advisory.",
      highlights: [
        "Trained and evaluated an ML-based recommendation model on a Kaggle dataset of 100,000+ transactions across 100+ users over 12 months, achieving 87–90% accuracy.",
        "Built a real-time analytics dashboard tracking 6 financial categories: salary, investments, rent, loans, fees, and daily expenses.",
        "Integrated an NLP-based chatbot to handle natural-language financial queries directly within the dashboard interface.",
        "Automated personalized budget allocation models based on historical user expenditure behaviors."
      ],
      tech: ["Python", "Scikit-learn", "Pandas", "NumPy", "NLP Chatbot", "Streamlit", "Matplotlib"],
      demoUrl: "https://github.com/Aditya-yadav007/BachatAI",
      demoText: "GitHub Repository ↗",
      githubUrl: "https://github.com/Aditya-yadav007/BachatAI"
    },
    netflix: {
      title: "Netflix Content Trends & Interactive Analytics Dashboard",
      badge: "BIG DATA / EDA / AICTE VOIS MAJOR PROJECT",
      stats: "7,700+ Netflix Titles • 60+ Genres • Live Deployed",
      img: `${base}assets/projects/netflix_dashboard.png`,
      desc: "Interactive big data analytics dashboard and exploratory analysis of 7,700+ Netflix titles across 60+ genres developed as the Major Project for AICTE VOIS Internship. Explores genre distributions, release velocity, and regional market acquisition trends.",
      highlights: [
        "Explored 7,700+ Netflix catalog titles across 60+ genres, generating 5 visual business intelligence analyses with Python, Pandas, and Matplotlib.",
        "Engineered interactive web dashboard deployed live on GitHub Pages presenting distribution charts, content split, and rating frequencies.",
        "Uncovered key content strategy shifts from movie cataloging to episodic original series acquisition between 2018 and 2025.",
        "Cleaned inconsistent international release years, director metadata, and multi-country origin fields."
      ],
      tech: ["Python", "Pandas", "Matplotlib", "Seaborn", "EDA", "GitHub Pages", "Data Visualization"],
      demoUrl: "https://aditya-yadav007.github.io/VOIS_AICTE_Oct2025_MajorProject_Aditya-Yadav-/",
      demoText: "🚀 Launch Live App ↗",
      githubUrl: "https://github.com/Aditya-yadav007/VOIS_AICTE_Oct2025_MajorProject_Aditya-Yadav-"
    },
    airbnb: {
      title: "Airbnb Open Data Analysis & Market Intelligence",
      badge: "DATA SCIENCE / PREDICTIVE MODELING / LIVE REPORT",
      stats: "100k+ Listings • Price & Occupancy Forecast • r = 0.14",
      img: `${base}assets/projects/airbnb_analysis.png`,
      desc: "Deep exploratory data analysis and econometric modeling on 100,000+ Airbnb listings uncovering pricing dynamics, host behaviors, and occupancy trends with live GitHub Pages interactive report.",
      highlights: [
        "Analysed 100,000+ Airbnb listings using Python, Pandas, and Seaborn, building a complete pipeline covering cleaning, EDA, and statistical tests.",
        "Discovered a weak correlation (r = 0.14) between host listings count and availability, disproving the assumption that multi-unit hosts retain higher unbooked ratios.",
        "Constructed predictive pricing regression baselines and neighborhood occupancy distributions.",
        "Deployed live web report on GitHub Pages showcasing interactive statistical visualizations."
      ],
      tech: ["Python", "Pandas", "Seaborn", "Scikit-learn", "Regression Models", "GitHub Pages"],
      demoUrl: "https://aditya-yadav007.github.io/VOIS_AICTE_Oct2025_Aditya_Yadav/",
      demoText: "🚀 Launch Live App ↗",
      githubUrl: "https://github.com/Aditya-yadav007/VOIS_AICTE_Oct2025_Aditya_Yadav"
    },
    twitter: {
      title: "Twitter Real-Time Sentiment Analysis Web Application",
      badge: "NLP / STREAMLIT / LIVE CLOUD APP / 2025",
      stats: "Real-time NLP • Streamlit Cloud • Scikit-learn Classifier",
      img: `${base}assets/projects/twitter_sentiment.png`,
      desc: "An interactive NLP web application deployed on Streamlit Cloud that classifies tweets as positive, negative, or neutral with live visual distributions, confidence gauges, and batch CSV dataset processing capability.",
      highlights: [
        "Trained NLP classification models using scikit-learn and NLTK text tokenization, stemming, and TF-IDF vectorization.",
        "Deployed live to Streamlit Cloud with real-time inference latency under 50ms per tweet.",
        "Built dual input pipelines: live single-text inference and batch bulk CSV upload with automated graphical distribution generation.",
        "Interactive gauge metrics and probability breakdown per emotional polarity class."
      ],
      tech: ["Streamlit", "Python", "Scikit-learn", "NLP", "TF-IDF", "Streamlit Cloud", "Matplotlib"],
      demoUrl: "https://aditya-yadav007-twitter-sentiment-analysis-app-hmewpp.streamlit.app",
      demoText: "🚀 Launch Live App ↗",
      githubUrl: "https://github.com/Aditya-yadav007/twitter-sentiment-analysis"
    },
    tictactoe: {
      title: "Interactive Tic Tac Toe Game Engine",
      badge: "WEB DEVELOPMENT / JAVASCRIPT / LIVE GAME",
      stats: "Responsive Canvas • Matrix Win Logic • Live GitHub Pages",
      img: `${base}assets/projects/tictactoe_game.png`,
      desc: "A responsive interactive web game built with vanilla HTML5, CSS3, and modern JavaScript featuring move history, active turn tracking, intelligent win detection, and responsive canvas layout deployed on GitHub Pages.",
      highlights: [
        "Built using pure Vanilla JavaScript, HTML5, and CSS3 with 0 runtime dependencies for 60fps responsiveness.",
        "Engineered matrix win-state checking algorithm spanning all horizontal, vertical, and diagonal win configurations.",
        "Fully responsive mobile and tablet touch controls with smooth micro-animations.",
        "Deployed live on GitHub Pages with continuous deployment from repository commits."
      ],
      tech: ["JavaScript (ES6+)", "HTML5", "CSS3", "DOM Manipulation", "GitHub Pages", "Game Logic"],
      demoUrl: "https://aditya-yadav007.github.io/myGame/",
      demoText: "🚀 Launch Live Game ↗",
      githubUrl: "https://github.com/Aditya-yadav007/myGame"
    },
    puzzle: {
      title: "Interactive Picture Slider Puzzle Game",
      badge: "GAME ENGINE / JAVASCRIPT / LIVE DEPLOYED",
      stats: "Matrix Coordination • Shuffle Algorithm • Live GitHub Pages",
      img: `${base}assets/projects/puzzle_game.jpg`,
      desc: "An engaging picture tile-sliding puzzle game built with HTML, CSS, and JavaScript. Features interactive tile rearranging, move counting, shuffle algorithms, and image reconstruction logic hosted live on GitHub Pages.",
      highlights: [
        "Implemented 2D matrix tile coordination and valid sliding movement validation algorithms in JavaScript.",
        "Randomized solvable shuffle generation ensuring all puzzle states are mathematically solvable.",
        "Dynamic visual slice rendering splitting custom imagery into interactive sliding grid pieces.",
        "Live deployment running smoothly on GitHub Pages."
      ],
      tech: ["JavaScript", "HTML5", "CSS3", "Matrix Algorithms", "GitHub Pages", "UI Animations"],
      demoUrl: "https://aditya-yadav007.github.io/puzzle/",
      demoText: "🚀 Launch Live Game ↗",
      githubUrl: "https://github.com/Aditya-yadav007/puzzle"
    },
    wdpage: {
      title: "Responsive Web Dev Bookstore Portal",
      badge: "E-COMMERCE UI / RESPONSIVE CSS / LIVE SITE",
      stats: "CSS Grid & Flexbox • Product Filtering • Live GitHub Pages",
      img: `${base}assets/projects/wdpage_preview.jpeg`,
      desc: "A complete responsive web portal and catalog showcasing curated programming & web development textbooks, pricing cards, search filtering, and modern responsive layouts hosted live on GitHub Pages.",
      highlights: [
        "Designed a clean, modern e-commerce style catalog with CSS Grid, Flexbox, and fluid typography.",
        "Structured semantic HTML5 with accessible navigation, book categories, and detailed spec cards.",
        "Optimized asset delivery and responsive breakpoints for mobile, tablet, and widescreen viewports.",
        "Live production hosting on GitHub Pages."
      ],
      tech: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "GitHub Pages", "Web Accessibility"],
      demoUrl: "https://aditya-yadav007.github.io/wdpage/",
      demoText: "🚀 Launch Live App ↗",
      githubUrl: "https://github.com/Aditya-yadav007/wdpage"
    },
    myprofile: {
      title: "Interactive Developer Profile & Quiz Engine",
      badge: "WEB PORTAL / INTERACTIVE QUIZ / LIVE SITE",
      stats: "Live Quiz Engine • Dynamic Scoring • Live GitHub Pages",
      img: `${base}assets/aditya_photo.jpg`,
      desc: "Custom personal web portal featuring developer biography, career milestones, skill showcase, and an interactive JavaScript knowledge quiz engine with real-time score calculation hosted live on GitHub Pages.",
      highlights: [
        "Engineered an interactive multi-question quiz module with instant answer evaluation and scoring logic.",
        "Built responsive personal portfolio layout showcasing education, skills, and contact pathways.",
        "Crafted with lightweight vanilla web technologies for instant load times.",
        "Hosted live on GitHub Pages."
      ],
      tech: ["HTML5", "CSS3", "JavaScript", "Quiz Logic", "GitHub Pages", "DOM Events"],
      demoUrl: "https://aditya-yadav007.github.io/my_profile/",
      demoText: "🚀 Launch Live App ↗",
      githubUrl: "https://github.com/Aditya-yadav007/my_profile"
    }
  };

  const openProjectModal = (projId) => {
    const data = projectDetails[projId];
    if (!data || !modal) return;
    soundEngine.playChime();

    modalImg.src = data.img;
    modalBadge.textContent = data.badge;
    modalStats.textContent = data.stats;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalHighlights.innerHTML = data.highlights.map(h => `<li>${h}</li>`).join('');
    modalTech.innerHTML = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');

    if (btnModalDemo) {
      btnModalDemo.href = data.demoUrl || "https://github.com/Aditya-yadav007";
      const span = btnModalDemo.querySelector('span');
      if (span) span.textContent = data.demoText || "🚀 Launch Live App ↗";
    }
    if (btnModalGithub) {
      btnModalGithub.href = data.githubUrl || "https://github.com/Aditya-yadav007";
      const span = btnModalGithub.querySelector('span');
      if (span) span.textContent = "GitHub Repository ↗";
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    if (!modal) return;
    soundEngine.playClick();
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Inspect buttons & Card clicks
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const projId = btn.getAttribute('data-modal');
      openProjectModal(projId);
    });
  });

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      const projId = card.getAttribute('data-project-id');
      if (projId) openProjectModal(projId);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const projId = card.getAttribute('data-project-id');
        if (projId) openProjectModal(projId);
      }
    });
  });

  // Filter tabs logic
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      soundEngine.playClick();
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filterVal = tab.getAttribute('data-filter');
      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        if (filterVal === 'all' || cat.includes(filterVal)) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  modalClose?.addEventListener('click', closeProjectModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeProjectModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) {
      closeProjectModal();
    }
  });

  // Quick Terminal Launcher Button in Hero
  const quickTermBtn = document.getElementById('btn-open-terminal');
  if (quickTermBtn) {
    quickTermBtn.addEventListener('click', () => {
      soundEngine.playClick();
      const termSection = document.getElementById('terminal-section');
      termSection?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        document.getElementById('terminal-input')?.focus();
      }, 700);
    });
  }

  // 9. Copy Email Button with Confetti
  const copyBtn = document.getElementById('btn-copy-email');
  const copyStatus = document.getElementById('copy-status');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      soundEngine.playClick();
      const email = document.getElementById('display-email')?.textContent || "itsadityayadav35@gmail.com";
      navigator.clipboard.writeText(email).then(() => {
        if (copyStatus) copyStatus.textContent = "Copied! ✦";
        confetti({
          particleCount: 60,
          spread: 55,
          origin: { y: 0.8 },
          colors: ['#00e5ff', '#d946ef', '#10b981', '#ffffff']
        });
        setTimeout(() => {
          if (copyStatus) copyStatus.textContent = "Copy";
        }, 2200);
      });
    });
  }

  // 10. Contact Form Transmission Process
  const contactForm = document.getElementById('portfolio-contact-form');
  const successAlert = document.getElementById('form-success-alert');
  const submitBtn = document.getElementById('btn-submit-form');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      soundEngine.playClick();

      let hasError = false;
      const name = document.getElementById('contact-name');
      const email = document.getElementById('contact-email');
      const subject = document.getElementById('contact-subject');
      const message = document.getElementById('contact-message');

      const errName = document.getElementById('err-name');
      const errEmail = document.getElementById('err-email');
      const errMessage = document.getElementById('err-message');

      // Validation
      if (!name || !name.value.trim()) {
        if (errName) errName.style.display = 'block';
        hasError = true;
      } else {
        if (errName) errName.style.display = 'none';
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !email.value.trim() || !emailRegex.test(email.value.trim())) {
        if (errEmail) errEmail.style.display = 'block';
        hasError = true;
      } else {
        if (errEmail) errEmail.style.display = 'none';
      }

      if (!message || !message.value.trim()) {
        if (errMessage) errMessage.style.display = 'block';
        hasError = true;
      } else {
        if (errMessage) errMessage.style.display = 'none';
      }

      if (hasError) return;

      const nameVal = name.value.trim();
      const emailVal = email.value.trim();
      const subjectVal = subject ? subject.value : 'AI / ML Engineer Opportunity';
      const messageVal = message.value.trim();

      // UI Loading State
      const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
      const btnIcon = submitBtn ? submitBtn.querySelector('.btn-icon') : null;
      const originalText = btnText ? btnText.textContent : 'Transmit Transmission';
      const originalIconHtml = btnIcon ? btnIcon.innerHTML : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        if (btnText) btnText.textContent = 'Transmitting Packet...';
        if (btnIcon) btnIcon.innerHTML = '<span class="btn-spinner" aria-hidden="true"></span>';
      }

      try {
        const payload = {
          name: nameVal,
          email: emailVal,
          subject: subjectVal,
          message: messageVal,
          _subject: `[Portfolio Transmission] ${subjectVal} from ${nameVal}`,
          _replyto: emailVal,
          _template: "table",
          _captcha: "false"
        };

        const response = await fetch('https://formsubmit.co/ajax/itsadityayadav35@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json().catch(() => ({ success: "true" }));
        console.log('Transmission response received:', data);

        // Success Feedback & Confetti
        soundEngine.playChime();
        confetti({
          particleCount: 140,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#00e5ff', '#d946ef', '#10b981', '#f59e0b', '#ffffff']
        });

        if (successAlert) {
          successAlert.classList.remove('error-state');
          const title = document.getElementById('success-title');
          const desc = document.getElementById('success-desc');
          const fallback = document.getElementById('success-fallback-action');

          if (title) title.textContent = 'Transmission Successfully Dispatched!';
          if (desc) {
            desc.innerHTML = `Packet delivered to <strong>itsadityayadav35@gmail.com</strong>. Aditya has received your inquiry regarding <em>"${subjectVal}"</em> and will reply to <strong>${emailVal}</strong>.`;
          }
          if (fallback) {
            const mailtoUrl = `mailto:itsadityayadav35@gmail.com?subject=${encodeURIComponent('[Portfolio] ' + subjectVal + ' from ' + nameVal)}&body=${encodeURIComponent(messageVal)}`;
            fallback.innerHTML = `<a href="${mailtoUrl}" class="term-cyan" style="font-size: 0.8rem; text-decoration: underline;">Launch Native Email Client (mailto backup) ↗</a>`;
            fallback.style.display = 'block';
          }
          successAlert.classList.add('show');
          successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        contactForm.reset();

      } catch (err) {
        console.warn('Network transmission error, deploying client fallback:', err);
        soundEngine.playChime();

        if (successAlert) {
          successAlert.classList.add('show');
          const title = document.getElementById('success-title');
          const desc = document.getElementById('success-desc');
          const fallback = document.getElementById('success-fallback-action');

          if (title) title.textContent = 'Direct Email Packet Prepared';
          if (desc) {
            desc.innerHTML = `Your message to <strong>itsadityayadav35@gmail.com</strong> is ready to send. Click the button below to launch your default mail app.`;
          }
          if (fallback) {
            const mailtoUrl = `mailto:itsadityayadav35@gmail.com?subject=${encodeURIComponent('[Portfolio] ' + subjectVal + ' from ' + nameVal)}&body=${encodeURIComponent('Hi Aditya,\n\n' + messageVal + '\n\nBest regards,\n' + nameVal + ' (' + emailVal + ')')}`;
            fallback.innerHTML = `<a href="${mailtoUrl}" class="btn-primary" style="display:inline-block; padding: 0.5rem 1rem; font-size: 0.85rem; text-decoration: none; margin-top: 0.4rem;">Send via Email App ↗</a>`;
            fallback.style.display = 'block';
          }
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          if (btnText) btnText.textContent = originalText;
          if (btnIcon) btnIcon.innerHTML = originalIconHtml;
        }

        setTimeout(() => {
          successAlert?.classList.remove('show');
        }, 12000);
      }
    });
  }
});
