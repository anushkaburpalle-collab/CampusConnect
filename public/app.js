// ===========================================================
// CampusConnect — Interaction layer + API Integration
// ===========================================================

// API Base URL (relative for same-origin requests)
const API_BASE_URL = '/api';

// Demo user ID (will be set after seeding)
let currentUserId = localStorage.getItem('currentUserId') || null;

// Fetch wrapper with error handling
async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error.message);
    throw error;
  }
}

document.addEventListener('DOMContentLoaded', async () => {

  /* ---------- Initialize: Seed demo data and set user ID ---------- */
  try {
    const seedResponse = await fetchAPI('/seed', { method: 'POST' });
    if (seedResponse.success && seedResponse.data) {
      currentUserId = seedResponse.data.demoUserId;
      localStorage.setItem('currentUserId', currentUserId);
      console.log('✅ Demo data seeded, User ID:', currentUserId);
    }
  } catch (error) {
    console.warn('⚠️ Seed error (may already exist):', error.message);
  }

  /* ---------- Nav scroll state ---------- */
  const nav = document.querySelector('.nav');
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.style.boxShadow = y > 20 ? '0 8px 24px rgba(74,50,103,0.08)' : 'none';
    lastY = y;
  }, { passive: true });

  /* ---------- Scroll-reveal for sections ---------- */
  const revealTargets = document.querySelectorAll(
    '.problem-card, .root-cause, .verify-step, .module-copy, .module-visual, .team-card, .scope-item'
  );

  revealTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1)';
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const siblingDelay = Array.from(el.parentElement.children).indexOf(el) * 90;
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, siblingDelay);
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- Animated counters (MVP scope stats) ---------- */
  const counters = document.querySelectorAll('.scope-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1200;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const value = Math.round(eased * target);
        el.textContent = value + (target === 100 ? '%' : '');
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  /* ---------- Hero thread cards: subtle 3D tilt on pointer move ---------- */
  const tiltCards = document.querySelectorAll('[data-tilt]');
  const stage = document.getElementById('thread-stage');

  if (stage && window.matchMedia('(hover: hover)').matches) {
    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;

      tiltCards.forEach((card, i) => {
        const depth = (i % 2 === 0) ? 10 : 14;
        const rx = (cy * -depth).toFixed(2);
        const ry = (cx * depth).toFixed(2);
        card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
      });
    });

    stage.addEventListener('mouseleave', () => {
      tiltCards.forEach(card => {
        card.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg)';
      });
    });
  }

  /* ---------- Gentle parallax on hero background blobs ---------- */
  const heroBg = document.getElementById('hero-bg');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (heroBg && y < window.innerHeight) {
      heroBg.style.transform = `translateY(${y * 0.15}px)`;
    }
  }, { passive: true });

  /* ---------- Smooth-scroll for in-page nav links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- Waitlist CTA: Submit email to backend ---------- */
  const ctaButtons = document.querySelectorAll('.btn-primary, .nav-cta');
  ctaButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      // Show email input modal
      const email = prompt('Enter your email to join the waitlist:');
      
      if (!email || !email.trim()) {
        return; // User cancelled
      }

      try {
        const result = await fetchAPI('/waitlist', {
          method: 'POST',
          body: JSON.stringify({ email: email.trim() })
        });

        if (result.success) {
          const original = btn.textContent;
          btn.textContent = "You're on the list ✓";
          btn.style.pointerEvents = 'none';
          setTimeout(() => {
            btn.textContent = original;
            btn.style.pointerEvents = 'auto';
          }, 2200);
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    });
  });

  /* ---------- "See how matching works" scrolls to solution ---------- */
  const ghostBtn = document.querySelector('.btn-ghost');
  if (ghostBtn) {
    ghostBtn.addEventListener('click', () => {
      document.getElementById('solution').scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ---------- Load marketplace items from API ---------- */
  const cartWindow = document.querySelector('.cart-window');
  if (cartWindow) {
    (async () => {
      try {
        const response = await fetchAPI('/listing');
        if (response && Array.isArray(response)) {
          // Clear existing demo items
          cartWindow.innerHTML = '<div class="cart-window-head"><span></span><span></span><span></span></div>';
          
          // Add items from API
          response.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.setAttribute('data-price', `₹${item.price}`);
            
            const thumbClass = ['thumb-a', 'thumb-b', 'thumb-c'][index % 3] || 'thumb-a';
            
            itemEl.innerHTML = `
              <div class="cart-item-thumb ${thumbClass}"></div>
              <div class="cart-item-info">
                <p class="ci-title">${item.title}</p>
                <p class="ci-sub">${item.condition} · ${item.department || 'Any'} Sem ${item.semester || '?'}</p>
              </div>
              <span class="ci-price">₹${item.price}</span>
            `;
            
            cartWindow.appendChild(itemEl);

            // Re-attach price pulse animation
            const price = itemEl.querySelector('.ci-price');
            itemEl.addEventListener('mouseenter', () => {
              if (price) {
                price.style.transition = 'transform .25s ease';
                price.style.transform = 'scale(1.15)';
              }
            });
            itemEl.addEventListener('mouseleave', () => {
              if (price) price.style.transform = 'scale(1)';
            });
          });
        }
      } catch (error) {
        console.error('Failed to load marketplace items:', error.message);
        // Keep default demo items if API fails
      }
    })();
  }

  /* ---------- Load study buddy matches from API ---------- */
  const matchStack = document.querySelector('.match-card-stack');
  if (matchStack && currentUserId) {
    (async () => {
      try {
        const response = await fetchAPI(`/study-buddies/matches/${currentUserId}`);
        if (response.success && Array.isArray(response.data)) {
          // Clear existing demo cards
          matchStack.innerHTML = '';
          
          // Add match cards from API (top 2 only for visual stack)
          response.data.slice(0, 2).forEach((match, index) => {
            const card = document.createElement('div');
            card.className = `match-card mc-${index + 1}`;
            
            const initials = match.student.name.split(' ').map(n => n[0]).join('');
            const score = Math.round(match.matchScore);
            
            card.innerHTML = `
              <div class="mc-avatar">${initials}</div>
              <p class="mc-name">${match.student.name}</p>
              <p class="mc-subject">${match.subjects ? match.subjects.join(', ') : 'N/A'}</p>
              <div class="mc-bar"><span style="width:${score}%"></span></div>
              <p class="mc-score">${score}% match</p>
            `;
            
            matchStack.appendChild(card);
          });

          // Re-attach stack click handler
          matchStack.addEventListener('click', () => {
            const cards = matchStack.querySelectorAll('.match-card');
            if (cards.length > 0) {
              matchStack.appendChild(cards[0]); // move front card to back
              cards.forEach((c, i) => {
                c.style.zIndex = cards.length - i;
              });
            }
          });
        }
      } catch (error) {
        console.error('Failed to load study buddy matches:', error.message);
        // Keep default demo cards if API fails
      }
    })();
  }

  /* ---------- Cart item hover price pulse (backup for dynamically added items) ---------- */
  document.querySelectorAll('.cart-item').forEach(item => {
    const price = item.querySelector('.ci-price');
    item.addEventListener('mouseenter', () => {
      if (price) {
        price.style.transition = 'transform .25s ease';
        price.style.transform = 'scale(1.15)';
      }
    });
    item.addEventListener('mouseleave', () => {
      if (price) price.style.transform = 'scale(1)';
    });
  });

  /* ---------- Match card stack: click to cycle front card ---------- */
  const stack = document.querySelector('.match-card-stack');
  if (stack) {
    stack.addEventListener('click', () => {
      const cards = stack.querySelectorAll('.match-card');
      if (cards.length > 0) {
        stack.appendChild(cards[0]); // move front card to back
        cards.forEach((c, i) => {
          c.style.zIndex = cards.length - i;
        });
      }
    });
  }

});

