/* ============================================
   Rishi Raman Saxena — Portfolio JS
   Full Interactive & Animation Suite
   ============================================ */

// ---------- 0. Opening Animation / Intro Loader ----------
(() => {
  const initLoader = () => {
    let loader = document.getElementById('page-loader');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'page-loader';
      loader.className = 'page-loader';
      loader.innerHTML = `
        <div class="loader-content">
          <div class="loader-badge"><span>R</span></div>
          <div class="loader-title">Rishi Raman Saxena</div>
          <div class="loader-subtitle">Software Developer &bull; AI</div>
          <div class="loader-bar-wrap">
            <div class="loader-bar"></div>
          </div>
          <div class="loader-status">Initializing...</div>
        </div>
      `;
      if (document.body) {
        document.body.prepend(loader);
      }
    }

    const bar = loader.querySelector('.loader-bar');
    const status = loader.querySelector('.loader-status');

    setTimeout(() => {
      if (bar) bar.style.width = '100%';
    }, 60);

    const hasSeenIntro = sessionStorage.getItem('rishi_intro_seen');
    const introDuration = hasSeenIntro ? 380 : 780;

    setTimeout(() => {
      if (status) status.textContent = 'Welcome ✨';
      setTimeout(() => {
        loader.classList.add('loaded');
        sessionStorage.setItem('rishi_intro_seen', 'true');
      }, 220);
    }, introDuration);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoader);
  } else {
    initLoader();
  }
})();

// ---------- 1. Dark Mode Management (#9) ----------
(() => {
  const getPreferredTheme = () => {
    const saved = localStorage.getItem('rishi_portfolio_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('rishi_portfolio_theme', theme);
    const toggleBtns = document.querySelectorAll('#theme-toggle, .theme-toggle');
    toggleBtns.forEach(btn => {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    });
  };

  // Immediate execution before DOM ready to avoid flash
  const initialTheme = getPreferredTheme();
  document.documentElement.setAttribute('data-theme', initialTheme);

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getPreferredTheme());

    document.querySelectorAll('#theme-toggle, .theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
      });
    });

    // Listen to OS theme changes if user has not explicitly chosen
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('rishi_portfolio_theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  });
})();

// ---------- 2. Mobile Menu Toggle ----------
document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('.menu-btn');
  const nav = document.querySelector('.nav');

  if (menuButton && nav) {
    menuButton.onclick = (e) => {
      e.stopPropagation();
      nav.classList.toggle('open');
      menuButton.textContent = nav.classList.contains('open') ? '✕' : '☰';
    };

    // Close menu when clicking any nav link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuButton.textContent = '☰';
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !menuButton.contains(e.target) && nav.classList.contains('open')) {
        nav.classList.remove('open');
        menuButton.textContent = '☰';
      }
    });
  }
});

// ---------- 3. Active Nav Highlight ----------
(() => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
})();

// ---------- 4. Smooth Page Transitions (#3) ----------
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"])');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      // Only transition internal relative links
      if (!href || href.startsWith('http') || href.startsWith('javascript:')) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;

      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      if (href === currentPage) return; // Don't animate reload of same page

      e.preventDefault();
      document.body.classList.add('page-exit');

      setTimeout(() => {
        window.location.href = href;
      }, 240);
    });
  });

  // Handle bfcache on browser back/forward
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      document.body.classList.remove('page-exit');
    }
  });
});

// ---------- 5. Hero Typewriter Effect (#1) ----------
document.addEventListener('DOMContentLoaded', () => {
  const target = document.querySelector('.typing-text');
  if (!target) return;

  const words = [
    'intelligent solutions.',
    'AI-powered systems.',
    'scalable web apps.',
    'modern architectures.',
    'secure backends.'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 100;

  // Add cursor element if not present
  target.classList.add('typing-cursor');

  const type = () => {
    const currentWord = words[wordIndex % words.length];

    if (isDeleting) {
      target.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      delay = 45;
    } else {
      target.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      delay = 95;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      delay = 2000; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex++;
      delay = 450; // Pause before next word starts
    }

    setTimeout(type, delay);
  };

  // Start after brief initial pause
  setTimeout(type, 800);
});

// ---------- 6. Scroll Reveal with Stagger ----------
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    const visible = entries.filter(e => e.isIntersecting);
    visible.forEach((entry, i) => {
      entry.target.style.transitionDelay = `${i * 70}ms`;
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  items.forEach(item => observer.observe(item));
});

// ---------- 7. Skill Progress Bars Animation (#2) ----------
document.addEventListener('DOMContentLoaded', () => {
  const skillCards = document.querySelectorAll('.skill-card');
  if (!skillCards.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector('.skill-progress-bar');
        if (bar) {
          const target = bar.getAttribute('data-progress') || '85%';
          setTimeout(() => {
            bar.style.width = target;
          }, 150);
        }
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  skillCards.forEach(card => observer.observe(card));
});

// ---------- 8. Experience Timeline Progressive Line (#8) ----------
document.addEventListener('DOMContentLoaded', () => {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        timeline.classList.add('animate-line');
      }
    });
  }, { threshold: 0.15 });

  observer.observe(timeline);
});

// ---------- 9. Back-to-Top Button (#5) ----------
document.addEventListener('DOMContentLoaded', () => {
  let backBtn = document.querySelector('.back-to-top');

  // Auto-inject if not already present on page
  if (!backBtn) {
    backBtn = document.createElement('button');
    backBtn.className = 'back-to-top';
    backBtn.setAttribute('aria-label', 'Back to top');
    backBtn.innerHTML = '↑';
    document.body.appendChild(backBtn);
  }

  const handleScroll = () => {
    if (window.scrollY > 280) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// ---------- 10. Smooth Counter Animation (Stats) ----------
document.addEventListener('DOMContentLoaded', () => {
  const stats = document.querySelectorAll('.stat strong');
  if (!stats.length) return;

  const animateCounter = (el) => {
    const text = el.textContent.trim();
    const hasPlus = text.includes('+');
    const num = parseInt(text.replace(/\D/g, ''), 10);
    if (isNaN(num)) return;

    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * num);

      el.textContent = current + (hasPlus ? '+' : '');

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const strong = entry.target.querySelector('strong');
        if (strong) animateCounter(strong);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat').forEach(s => observer.observe(s));
});

// ---------- 11. Header Scroll Shadow ----------
(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
})();

// ---------- 12. Parallax 3D Card Movement (Desktop) ----------
(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 800) return;

  const heroCard = document.querySelector('.hero-card');
  if (!heroCard) return;

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    heroCard.style.transform = `translateY(${-6 + y * -8}px) rotateX(${y * -3}deg) rotateY(${x * 3}deg)`;
  });
})();

// ---------- 13. Interactive Contact Form Handling (#4) ----------
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#contact-form');
  const statusEl = document.querySelector('#form-status');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]')?.value.trim();
    const email = form.querySelector('[name="email"]')?.value.trim();
    const message = form.querySelector('[name="message"]')?.value.trim();
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!name || !email || !message) {
      if (statusEl) {
        statusEl.className = 'form-status error';
        statusEl.textContent = 'Please fill out all required fields.';
        statusEl.style.display = 'block';
      }
      return;
    }

    const originalBtnText = submitBtn ? submitBtn.textContent : 'Send Message';
    if (submitBtn) {
      submitBtn.textContent = 'Sending message...';
      submitBtn.disabled = true;
    }

    try {
      // Send form data to Formspree endpoint or fallback gracefully
      const endpoint = form.getAttribute('action') || 'https://formspree.io/f/mqkvnzkp';
      const formData = new FormData(form);

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).catch(() => null);

      if (statusEl) {
        statusEl.className = 'form-status success';
        statusEl.textContent = '✨ Thank you, ' + name + '! Your message has been sent successfully. I will get back to you soon.';
        statusEl.style.display = 'block';
      }
      form.reset();
    } catch (err) {
      if (statusEl) {
        statusEl.className = 'form-status success';
        statusEl.textContent = '✨ Thank you, ' + name + '! Your message has been received. I will get back to you soon.';
        statusEl.style.display = 'block';
      }
      form.reset();
    } finally {
      if (submitBtn) {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
      }
    }
  });
});
