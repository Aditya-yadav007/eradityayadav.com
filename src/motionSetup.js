/* ==========================================================================
   MOTION ENGINE INTEGRATION (motion npm package)
   Scroll-linked physics, inView viewport triggers, spring micro-interactions
   ========================================================================== */

import { animate, scroll, inView, stagger } from 'motion';

export function setupMotionSystem() {
  // 1. Scroll-Linked Progress Indicator
  const progressBar = document.getElementById('scroll-progress-bar');
  if (progressBar) {
    scroll((progress) => {
      progressBar.style.width = `${progress * 100}%`;
    });
  }

  // 2. Dynamic Sticky Header Backdrop
  const header = document.getElementById('site-header');
  if (header) {
    scroll((progress) => {
      if (progress > 0.02) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // 3. Hero Elements Entrance
  const heroStatus = document.getElementById('hero-status');
  const heroTitle = document.querySelector('.hero-title');
  const heroDesc = document.querySelector('.hero-description');
  const heroCta = document.querySelector('.hero-cta-group');
  const heroCard = document.getElementById('hero-3d-card');

  if (heroStatus) {
    animate(heroStatus, { opacity: [0, 1], y: [-20, 0] }, { duration: 0.6, easing: [0.16, 1, 0.3, 1] });
  }
  if (heroTitle) {
    animate(heroTitle, { opacity: [0, 1], y: [30, 0] }, { duration: 0.8, delay: 0.15, easing: [0.16, 1, 0.3, 1] });
  }
  if (heroDesc) {
    animate(heroDesc, { opacity: [0, 1], y: [20, 0] }, { duration: 0.7, delay: 0.3, easing: [0.16, 1, 0.3, 1] });
  }
  if (heroCta) {
    animate(heroCta, { opacity: [0, 1], y: [20, 0] }, { duration: 0.7, delay: 0.45, easing: [0.16, 1, 0.3, 1] });
  }
  if (heroCard) {
    animate(heroCard, { opacity: [0, 1], scale: [0.92, 1] }, { duration: 1, delay: 0.25, easing: [0.16, 1, 0.3, 1] });
  }

  // 4. Staggered Stat Numbers Count-Up
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length > 0) {
    inView('.hero-stats-strip', () => {
      statNumbers.forEach((el) => {
        const target = parseInt(el.getAttribute('data-target'), 10) || 0;
        let current = 0;
        const duration = 1200;
        const stepTime = 30;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current);
          }
        }, stepTime);
      });
    });
  }

  // 5. Timeline Chapter Cards Staggered InView
  const chapterCards = document.querySelectorAll('.chapter-card');
  chapterCards.forEach((card) => {
    inView(card, () => {
      animate(
        card,
        { opacity: [0, 1], y: [45, 0] },
        { duration: 0.8, easing: [0.16, 1, 0.3, 1] }
      );
    }, { amount: 0.2 });
  });

  // 6. Project Cards 3D Tilt & InView Reveal
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card, idx) => {
    inView(card, () => {
      animate(
        card,
        { opacity: [0, 1], y: [50, 0] },
        { duration: 0.8, delay: idx * 0.15, easing: [0.16, 1, 0.3, 1] }
      );
    }, { amount: 0.15 });

    // Interactive 3D Cursor Tilt
    const inner = card.querySelector('.card-inner-3d');
    if (inner) {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      });

      card.addEventListener('pointerleave', () => {
        inner.style.transform = `rotateX(0deg) rotateY(0deg) translateZ(0px)`;
      });
    }
  });

  // 7. Skills Matrix Cards Stagger
  const matrixCards = document.querySelectorAll('.matrix-category');
  matrixCards.forEach((cat, idx) => {
    inView(cat, () => {
      animate(
        cat,
        { opacity: [0, 1], y: [35, 0] },
        { duration: 0.7, delay: idx * 0.12, easing: [0.16, 1, 0.3, 1] }
      );
    }, { amount: 0.2 });
  });
}
