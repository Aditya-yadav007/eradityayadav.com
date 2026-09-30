/* ==========================================================================
   INTERACTIVE CYBER TERMINAL (<AdityaOS />)
   Executable CLI with Aditya Yadav's verified resume, telemetry & history
   ========================================================================== */

import { soundEngine } from './audio.js';

export class TerminalEmulator {
  constructor() {
    this.screen = document.getElementById('terminal-screen');
    this.input = document.getElementById('terminal-input');
    this.submitBtn = document.getElementById('terminal-submit-btn');
    this.chips = document.querySelectorAll('.t-chip');

    this.history = [];
    this.historyIdx = -1;

    this.commands = {
      help: () => `
<span class="term-cyan">AVAILABLE ADITYA COMMANDS:</span>
  <span class="term-amber">whoami</span>       - Professional summary & background
  <span class="term-amber">skills</span>       - AI/ML, Data Analytics & Software tech matrix
  <span class="term-amber">education</span>    - B.Tech (CGPA: 7.48), Diploma & Schooling details
  <span class="term-amber">internships</span>  - AICTE VOIS (Netflix), NetCamp (Android), IBM SkillBuild
  <span class="term-amber">projects</span>     - DocChat (RAG), BachatAI, Airbnb EDA, Twitter Sentiment
  <span class="term-amber">resume</span>       - Download Aditya's official verified PDF resume
  <span class="term-amber">socials</span>      - LinkedIn, GitHub, Instagram & contact links
  <span class="term-amber">certs</span>        - CISCO, Infosys, NPTEL, TCS iON, ISRO/IIRS credentials
  <span class="term-amber">contact</span>      - Phone (+91 7267001135), Email & Direct links
  <span class="term-amber">clear</span>        - Clean terminal output buffer
`,
      resume: () => `
<span class="term-cyan">OFFICIAL RESUME PACKET:</span>
  • Candidate: <span class="term-green">Aditya Yadav (AI/ML Engineer & Data Analyst)</span>
  • Format:    <span class="term-amber">PDF Document (Verified)</span>
  • Direct Link: <a href="${import.meta.env.BASE_URL}assets/ADITYA_RESUME.pdf" download="Aditya_Yadav_Resume.pdf" class="term-green" target="_blank" style="text-decoration: underline;">Download Aditya_Yadav_Resume.pdf ↗</a>
`,
      socials: () => `
<span class="term-cyan">VERIFIED DIGITAL PRESENCE:</span>
  • LinkedIn:  <a href="https://linkedin.com/in/aditya-yadav-aky/" target="_blank" class="term-cyan">linkedin.com/in/aditya-yadav-aky/ ↗</a>
  • GitHub:    <a href="https://github.com/Aditya-yadav007" target="_blank" class="term-cyan">github.com/Aditya-yadav007 ↗</a>
  • Instagram: <a href="https://www.instagram.com/aky007aditya/?hl=en" target="_blank" class="term-cyan">instagram.com/aky007aditya/ ↗</a>
`,
      contact: () => `
<span class="term-cyan">DIRECT TRANSMISSION CHANNELS:</span>
  • Email:     <span class="term-green">itsadityayadav35@gmail.com</span>
  • Phone:     <span class="term-green">+91 7267001135</span>
  • Location:  Prayagraj, Uttar Pradesh, India
  • LinkedIn:  <a href="https://linkedin.com/in/aditya-yadav-aky/" target="_blank" class="term-cyan">linkedin.com/in/aditya-yadav-aky/ ↗</a>
  • GitHub:    <a href="https://github.com/Aditya-yadav007" target="_blank" class="term-cyan">github.com/Aditya-yadav007 ↗</a>
  • Instagram: <a href="https://www.instagram.com/aky007aditya/?hl=en" target="_blank" class="term-cyan">instagram.com/aky007aditya/ ↗</a>
`,
      whoami: () => `
<span class="term-green">ADITYA YADAV — AI/ML Engineer | Data Analyst | Python Developer</span>
• Education: Final-year B.Tech in CSE (AI & ML) at United College of Engineering & Research (CGPA: 7.48).
• Focus: Machine learning systems, RAG pipelines (FAISS + LangChain), exploratory data analysis, and scalable Python backends.
• Contact: itsadityayadav35@gmail.com | +91 7267001135 | Prayagraj, UP, India.
• Seeking: Entry-level AI/ML Engineer or Data Analyst role in a dynamic, high-impact team.
`,
      skills: () => `
<span class="term-cyan">TECHNICAL SKILLS MATRIX:</span>
  • AI & GenAI:      RAG, FAISS, Sentence Transformers, LangChain, Prompt Engineering
  • Machine Learning: Scikit-learn, Model Evaluation, PyTorch, Supervised/Unsupervised ML
  • Data Analytics:  Python, Pandas, NumPy, Matplotlib, Seaborn, EDA, Data Cleaning
  • Languages:       Python, SQL, C/C++, Core Java, HTML5, CSS3, JavaScript, Django
  • Databases/Cloud: MySQL, Firebase, Google Colab
  • Coursework:      Data Structures & Algorithms, OOP, DBMS Concepts
  • Tools:           Git/GitHub, VS Code, Android Studio, Flask, Streamlit
`,
      education: () => `
<span class="term-cyan">ACADEMIC BACKGROUND:</span>
  1. <span class="term-green">B.Tech in Computer Science & Engineering (AI & ML)</span> [2023 – 2026]
     • United College of Engineering & Research, Prayagraj
     • Current CGPA: <span class="term-amber">7.48 / 10.0</span>
  2. <span class="term-green">Diploma in Information Technology</span> [2020 – 2023]
     • Handia Polytechnic / UCER, Prayagraj
     • Score: <span class="term-amber">76% Distinction</span>
  3. <span class="term-green">Mary Lucas School & College, Prayagraj</span> [2018 – 2020]
     • 12th Standard (ISC) & 10th Standard (ICSE)
`,
      internships: () => `
<span class="term-cyan">INDUSTRY INTERNSHIPS & EXPERIENCE:</span>
  • <span class="term-green">Netflix Content Trends Analysis | AICTE VOIS</span> [Aug 2025 – Oct 2025]
    Analyzed 7,700+ Netflix titles across 60+ genres using Python & Matplotlib. Produced 5 visual analyses (content-type split, yearly trends, top genres, countries, ratings).
  • <span class="term-green">Android Development with Core Java | NetCamp</span> [Sep 2024 – Oct 2024]
    Developed 5+ Android applications using Core Java, optimizing code/APIs for a 30% performance boost. Integrated Firebase for persistent, real-time data sync.
  • <span class="term-green">AI & Cloud Intern | IBM SkillBuild</span> [Jun 2024 – Jul 2024]
    Built intelligent catalog search chatbot trained on 1,000+ FAQs. Reduced escalations by 50%, boosted user engagement by 35%.
`,
      projects: () => `
<span class="term-cyan">FEATURED PRODUCTION PROJECTS:</span>
  1. <span class="term-green">DocChat — AI Intelligent Document Q&A Chatbot (2026)</span>
     • RAG pipeline built on FAISS, Sentence Transformers & LangChain.
     • Indexed 933-page corpus (1,823 FAISS chunks). 13.6ms avg retrieval latency (p95: 18.3ms).
     • 10/10 passage recall within top-3. Cut lookup time from 3-5 mins to <30s (~6-10x faster).
  2. <span class="term-green">BachatAI — AI-Driven Personal Finance System (2025)</span>
     • ML recommendation model trained on 100k+ Kaggle transactions across 100+ users (87-90% accuracy).
     • 6-category tracking dashboard with NLP conversational financial assistant.
  3. <span class="term-green">Airbnb Open Data Analysis (2025)</span>
     • 100,000+ Airbnb listings pipeline with EDA, pricing correlation (r = 0.14), and regression models.
  4. <span class="term-green">Twitter Sentiment Analysis (2025)</span>
     • Streamlit app using Python & scikit-learn for real-time sentiment classification.
`,
      certs: () => `
<span class="term-cyan">VERIFIED CERTIFICATIONS:</span>
  • Intro to Modern AI — CISCO Networking Academy
  • Introduction to Data Science — Infosys Springboard
  • Introduction to Machine Learning — NPTEL
  • AI and Cybersecurity Awareness — TCS iON
  • Remote Sensing & Digital Image Analysis — IIRS / ISRO
  • Google Analytics — Skillshop
  • Project Management Foundations & Data Analytics — LinkedIn Learning
`,
      contact: () => `
<span class="term-cyan">DIRECT TRANSMISSION CHANNELS:</span>
  • Email:    <span class="term-green">itsadityayadav35@gmail.com</span>
  • Phone:    <span class="term-green">+91 7267001135</span>
  • LinkedIn: <span class="term-cyan">linkedin.com/in/aditya-yadav-aky/</span>
  • GitHub:   <span class="term-cyan">github.com/Aditya-yadav007</span>
  • Location: Prayagraj, Uttar Pradesh, India
`,
      clear: () => null
    };

    this.init();
  }

  init() {
    if (!this.input || !this.screen) return;

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.executeCommand(this.input.value.trim());
      } else if (e.key === 'ArrowUp') {
        if (this.history.length > 0 && this.historyIdx > 0) {
          this.historyIdx--;
          this.input.value = this.history[this.historyIdx];
        }
      } else if (e.key === 'ArrowDown') {
        if (this.historyIdx < this.history.length - 1) {
          this.historyIdx++;
          this.input.value = this.history[this.historyIdx];
        } else {
          this.historyIdx = this.history.length;
          this.input.value = '';
        }
      }
    });

    this.submitBtn?.addEventListener('click', () => {
      this.executeCommand(this.input.value.trim());
    });

    this.chips.forEach(chip => {
      chip.addEventListener('click', () => {
        soundEngine.playClick();
        const cmd = chip.getAttribute('data-cmd');
        if (cmd) {
          this.input.value = cmd;
          this.executeCommand(cmd);
        }
      });
    });
  }

  executeCommand(rawCmd) {
    if (!rawCmd) return;
    soundEngine.playClick();

    this.history.push(rawCmd);
    this.historyIdx = this.history.length;

    const userLine = document.createElement('div');
    userLine.className = 'term-line';
    userLine.innerHTML = `<span class="term-prompt">aditya@aiml-dev:~$</span> <span class="term-cyan">${this.escapeHTML(rawCmd)}</span>`;
    this.screen.appendChild(userLine);

    this.input.value = '';

    const cmdLower = rawCmd.toLowerCase();
    if (cmdLower === 'clear') {
      this.screen.innerHTML = `
        <div class="term-line output-system">
          [SYSTEM] Terminal buffer cleared. Type <span class="term-amber">'help'</span> for options.
        </div>`;
      return;
    }

    const handler = this.commands[cmdLower];
    const responseLine = document.createElement('div');
    responseLine.className = 'term-line';

    if (handler) {
      responseLine.innerHTML = handler();
    } else {
      responseLine.innerHTML = `
        <span class="term-amber">Command not found: "${this.escapeHTML(rawCmd)}".</span><br />
        Type <span class="term-cyan">'help'</span> to see available system commands.`;
    }

    this.screen.appendChild(responseLine);
    this.screen.scrollTop = this.screen.scrollHeight;
  }

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
}
