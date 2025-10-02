// Alice in Borderland Enhanced Portfolio Script
// Wrapped in an IIFE exactly as original but with cyberpunk enhancements
(function(){
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.documentElement;
  const toTopBtn = document.getElementById('to-top');
  const header = document.querySelector('header');
  const scrollProgress = document.getElementById('scroll-progress');

  /*************************
   * Alice in Borderland Matrix Rain Effect
   *************************/
  function createMatrixRain() {
    try {
      const matrixContainer = document.createElement('div');
      matrixContainer.className = 'matrix-rain';
      matrixContainer.setAttribute('aria-hidden', 'true');
      document.body.appendChild(matrixContainer);

      const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ♠♥♦♣';
      const columns = Math.max(10, Math.floor(window.innerWidth / 20));
      let dropCount = 0;
      const maxDrops = 50; // Limit for performance

      function createDrop() {
        if (dropCount >= maxDrops) return;
        
        const drop = document.createElement('div');
        drop.className = 'matrix-drop';
        drop.textContent = characters[Math.floor(Math.random() * characters.length)];
        drop.style.left = Math.random() * window.innerWidth + 'px';
        drop.style.animationDuration = (Math.random() * 3 + 2) + 's';
        drop.style.animationDelay = Math.random() * 2 + 's';
        
        // Random colors for different characters
        const colors = ['var(--neon-green)', 'var(--neon-blue)', 'var(--neon-red)', 'var(--neon-purple)'];
        drop.style.color = colors[Math.floor(Math.random() * colors.length)];
        
        matrixContainer.appendChild(drop);
        dropCount++;

        // Remove drop after animation
        setTimeout(() => {
          if (drop.parentNode) {
            drop.parentNode.removeChild(drop);
            dropCount--;
          }
        }, 5000);
      }

      // Create initial drops with throttling
      for (let i = 0; i < Math.min(columns / 2, 15); i++) {
        setTimeout(createDrop, Math.random() * 1000);
      }

      // Continue creating drops with performance consideration
      const dropInterval = setInterval(() => {
        if (document.hidden || dropCount >= maxDrops) return;
        createDrop();
      }, 300);
      
      // Cleanup on page visibility change
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          clearInterval(dropInterval);
        }
      });
      
    } catch (error) {
      console.warn('Matrix rain effect could not be initialized:', error);
    }
  }

  /*************************
   * Glitch Text Effect
   *************************/
  function addGlitchEffect() {
    const titles = document.querySelectorAll('h1, h2');
    titles.forEach(title => {
      if (!title.classList.contains('glitch')) {
        title.classList.add('glitch');
        
        // Random glitch trigger
        setInterval(() => {
          if (Math.random() < 0.1) { // 10% chance
            title.style.animation = 'none';
            setTimeout(() => {
              title.style.animation = 'glitch 1s infinite';
            }, 50);
          }
        }, 3000);
      }
    });
  }

  /*************************
   * Card Mouse Tracking Effect
   *************************/
  function initCardEffects() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        card.style.setProperty('--x', x + '%');
        card.style.setProperty('--y', y + '%');
      });
      
      // Add scan lines effect on hover
      card.addEventListener('mouseenter', () => {
        if (!card.classList.contains('scan-lines')) {
          card.classList.add('scan-lines');
        }
      });
      
      card.addEventListener('mouseleave', () => {
        card.classList.remove('scan-lines');
      });
    });
  }

  /*************************
   * Neon Pulse Animation for Interactive Elements
   *************************/
  function initNeonEffects() {
    const buttons = document.querySelectorAll('.btn, .ghost');
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.animation = 'neon-flicker 0.5s ease-in-out';
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.animation = '';
      });
    });

    // Add periodic glow to important elements
    const logo = document.querySelector('.logo-sq');
    if (logo) {
      setInterval(() => {
        logo.style.animation = 'none';
        setTimeout(() => {
          logo.style.animation = 'logo-pulse 2s ease-in-out infinite alternate';
        }, 50);
      }, 10000);
    }
  }

  /*************************
   * Cyberpunk Cursor Trail
   *************************/
  function initCursorTrail() {
    try {
      let trail = [];
      const trailLength = 6;
      let lastUpdate = 0;
      const throttleDelay = 16; // ~60fps

      function createTrailDot(x, y) {
        const now = Date.now();
        if (now - lastUpdate < throttleDelay) return;
        lastUpdate = now;

        // Clean up old trail dots efficiently
        const oldDots = document.querySelectorAll('.cursor-trail');
        if (oldDots.length > trailLength) {
          for (let i = 0; i < oldDots.length - trailLength; i++) {
            if (oldDots[i] && oldDots[i].parentNode) {
              oldDots[i].parentNode.removeChild(oldDots[i]);
            }
          }
        }

        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.setAttribute('aria-hidden', 'true');
        dot.style.cssText = `
          position: fixed;
          width: 4px;
          height: 4px;
          background: var(--neon-red);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          left: ${x}px;
          top: ${y}px;
          box-shadow: 0 0 10px var(--neon-red);
          animation: cursor-fade 0.8s ease-out forwards;
        `;

        document.body.appendChild(dot);
      }

      document.addEventListener('mousemove', (e) => {
        if (!document.hidden) {
          requestAnimationFrame(() => createTrailDot(e.clientX, e.clientY));
        }
      }, { passive: true });

      // Add cursor fade animation if not exists
      if (!document.querySelector('#cursor-trail-styles')) {
        const style = document.createElement('style');
        style.id = 'cursor-trail-styles';
        style.textContent = `
          @keyframes cursor-fade {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0); }
          }
        `;
        document.head.appendChild(style);
      }
      
    } catch (error) {
      console.warn('Cursor trail effect could not be initialized:', error);
    }
  }

  /*************************
   * Initialize All Alice in Borderland Effects
   *************************/
  function initAliceEffects() {
    try {
      // Enhanced mobile and performance detection
      const isMobile = window.innerWidth <= 768 || 
                      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isLowPerformance = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Only create heavy effects on capable devices
      if (!prefersReducedMotion && !isMobile && !isLowPerformance) {
        createMatrixRain();
        initCursorTrail();
      }
      
      // Always initialize lightweight effects
      addGlitchEffect();
      initCardEffects();
      initNeonEffects();
      
    } catch (error) {
      console.warn('Some effects could not be initialized:', error);
      // Fallback: ensure basic functionality works
      try {
        initCardEffects();
        initNeonEffects();
      } catch (fallbackError) {
        console.error('Critical initialization failure:', fallbackError);
      }
    }
  }

  // Theme: read preference from localStorage or system (enhanced for Alice theme)
  function readTheme(){
    const stored = localStorage.getItem('theme');
    if(stored) return stored;
    // Default to dark theme for Alice in Borderland aesthetic
    return 'dark';
  }
  
  function applyTheme(t){
    body.setAttribute('data-theme', t);
    const pressed = t === 'dark' ? false : true;
    if(themeToggle) themeToggle.setAttribute('aria-pressed', t === 'light');
    localStorage.setItem('theme', t);
    
    // Add cyberpunk theme class for enhanced effects
    if (t === 'dark') {
      body.classList.add('cyberpunk-theme');
    } else {
      body.classList.remove('cyberpunk-theme');
    }
  }
  
  applyTheme(readTheme());

  // Theme toggle functionality
  function toggleTheme() {
    const next = body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
  }

  // Desktop theme button
  themeToggle && themeToggle.addEventListener('click', toggleTheme);
  
  // Mobile theme button
  mobileThemeToggle && mobileThemeToggle.addEventListener('click', toggleTheme);

  // Mobile navigation toggle
  if (mobileToggle && mobileNav) {
    const mobileCloseBtn = document.getElementById('mobile-close');
    
    function closeMobileNav() {
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
    
    function openMobileNav() {
      mobileToggle.setAttribute('aria-expanded', 'true');
      mobileNav.setAttribute('aria-hidden', 'false');
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    // Hamburger menu toggle
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close button functionality
    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener('click', closeMobileNav);
    }

    // Close mobile nav when clicking navigation links
    const mobileNavLinks = mobileNav.querySelectorAll('.mobile-nav-link[href^="#"]');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    // Close mobile nav when clicking outside
    mobileNav.addEventListener('click', (e) => {
      if (e.target === mobileNav) {
        closeMobileNav();
      }
    });

    // Close mobile nav on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMobileNav();
      }
    });
  }

  // Project preview modal
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalImg = document.getElementById('modal-img');
  const modalDesc = document.getElementById('modal-desc');
  const modalLink = document.getElementById('modal-link');

  function openModal(data){
    modalTitle.textContent = data.title || 'Project';
    modalImg.src = data.img || '';
    modalImg.alt = data.title || 'Project image';
    modalDesc.textContent = data.desc || '';
    modalLink.href = data.link || '#';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    // trap focus simply by focusing close button
    modalClose.focus();
  }
  function closeModal(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
  }
  // attach preview buttons
  document.querySelectorAll('.card').forEach(card=>{
    const previewBtn = card.querySelector('.preview-btn');
    const projectData = JSON.parse(card.getAttribute('data-project') || '{}');
    // optionally add a link key for modal button
    projectData.link = projectData.link || (card.querySelector('a') ? card.querySelector('a').href : '#');
    previewBtn && previewBtn.addEventListener('click', ()=> openModal(projectData));
    // keyboard: enter on card opens modal (accessible)
    card.addEventListener('keydown',(e)=>{
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        openModal(projectData);
      }
    });
  });
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click',(e)=>{
    if(e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') closeModal();
  });

  // Contact form basic handler (no backend) — we show a friendly success toast (or fallback)
  const contactForm = document.getElementById('contact-form');
  if(contactForm){
    contactForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      
      try {
        const name = contactForm.name.value.trim() || 'Friend';
        const email = contactForm.email.value.trim();
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          alert('Please enter a valid email address.');
          return;
        }
        
        // Success message
        alert(`Thanks, ${name}! Your message was received. I'll get back to you at ${email}.`);
        contactForm.reset();
        
        // Optional: Add visual feedback
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          const originalText = submitBtn.innerHTML;
          submitBtn.innerHTML = '<span>✓</span> Message Sent!';
          submitBtn.style.background = 'var(--neon-green)';
          
          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
          }, 3000);
        }
        
      } catch (error) {
        console.error('Form submission error:', error);
        alert('Sorry, there was an error sending your message. Please try again or contact me directly.');
      }
    });
  }

  // Enhanced Back-to-top with Alice theme
  window.addEventListener('scroll', ()=>{
    const scrolled = window.scrollY > 400;
    
    if(scrolled) {
      toTopBtn.classList.add('show');
    } else {
      toTopBtn.classList.remove('show');
    }
    
    // Enhanced header shrink with neon effects
    if(header){
      if(window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    
    // Enhanced scroll progress with color transitions
    if(scrollProgress){
      const h = document.documentElement;
      const scrollPercent = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
      scrollProgress.style.width = (scrollPercent * 100) + '%';
      
      // Change color based on scroll position
      if (scrollPercent < 0.33) {
        scrollProgress.style.background = 'linear-gradient(90deg, var(--neon-red), var(--neon-pink))';
      } else if (scrollPercent < 0.66) {
        scrollProgress.style.background = 'linear-gradient(90deg, var(--neon-blue), var(--neon-purple))';
      } else {
        scrollProgress.style.background = 'linear-gradient(90deg, var(--neon-green), var(--neon-yellow))';
      }
    }
  });
  
  toTopBtn.addEventListener('click', ()=> {
    window.scrollTo({top:0,behavior:'smooth'});
    // Add flash effect when clicked
    toTopBtn.style.animation = 'neon-flicker 0.5s ease-in-out';
    setTimeout(() => {
      toTopBtn.style.animation = '';
    }, 500);
  });

  // smooth keyboard focus for heading anchor navigation
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href.length > 1){
        const el = document.querySelector(href);
        if(el){
          // small delay to allow :focus outline
          setTimeout(()=> el.focus({preventScroll:true}), 300);
        }
      }
    });
  });

  // small accessibility improvement: skip to content on load if hash present
  if(location.hash){
    const el = document.querySelector(location.hash);
    if(el) el.setAttribute('tabindex','-1'), el.focus();
  }

  /*************************
   * Enhanced Scroll Animations with Alice Theme
   *************************/
  const animated = Array.from(document.querySelectorAll('[data-animate]'));
  if('IntersectionObserver' in window && animated.length){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach((entry, index) => {
        if(entry.isIntersecting){
          // Add staggered delay for dramatic effect
          setTimeout(() => {
            entry.target.classList.add('in-view');
            
            // Add special effects for certain elements
            if (entry.target.classList.contains('card')) {
              entry.target.style.animation = 'scale-in 0.6s cubic-bezier(.34,1.56,.42,.92)';
            }
            
            // Add neon flicker effect to titles
            if (entry.target.tagName === 'H2') {
              setTimeout(() => {
                entry.target.classList.add('neon-text');
              }, 300);
            }
          }, index * 100); // Stagger by 100ms
          
          io.unobserve(entry.target);
        }
      });
    }, {threshold: 0.15, rootMargin: '50px'});
    
    animated.forEach((el,i)=>{
      // Enhanced stagger within grids
      if(el.closest('.projects-grid')){
        el.style.setProperty('--delay', (i * 0.08)+'s');
      }
      io.observe(el);
    });
  } else {
    // Fallback: show all with basic effects
    animated.forEach(el=> {
      el.classList.add('in-view');
      if (el.tagName === 'H2') {
        el.classList.add('neon-text');
      }
    });
  }

  /*************************
   * Enhanced Active Navigation with Cyberpunk Effects
   *************************/
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const mainElement = document.querySelector('main#main-content');
  const navLinks = Array.from(document.querySelectorAll('.nav-links a, .mobile-nav-link'));
  
  function setActive(id){
    navLinks.forEach(a=>{
      const href = a.getAttribute('href');
      a.classList.remove('active');
      if(href === '#'+id) {
        a.classList.add('active');
        // Add glow effect to active link
        a.style.animation = 'neon-flicker 0.3s ease-in-out';
        setTimeout(() => {
          a.style.animation = '';
        }, 300);
      }
    });
  }
  
  if('IntersectionObserver' in window){
    const secObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          setActive(entry.target.id);
        }
      });
    },{threshold:0.3});
    
    // Observe all sections
    sections.forEach(s=> secObserver.observe(s));
    
    // Also observe the main element for home navigation
    if(mainElement) {
      secObserver.observe(mainElement);
    }
  }

  /*************************
   * Enhanced Smooth Scroll with Alice Effects
   *************************/
  navLinks.forEach(link=>{
    link.addEventListener('click', (e)=>{
      const href = link.getAttribute('href');
      if(href && href.startsWith('#') && href.length > 1){
        let target = document.querySelector(href);
        
        // Special handling for home navigation
        if(href === '#main-content' && !target) {
          target = document.querySelector('#hero') || document.querySelector('main');
        }
        
        if(target){
          e.preventDefault();
          
          // Add click effect
          link.style.animation = 'neon-flicker 0.2s ease-in-out';
          setTimeout(() => {
            link.style.animation = '';
          }, 200);
          
          // Scroll to top for main-content, normal scroll for sections
          if(href === '#main-content') {
            window.scrollTo({top: 0, behavior: 'smooth'});
          } else {
            target.scrollIntoView({behavior:'smooth',block:'start'});
          }
          
          history.replaceState(null,'',href);
        }
      }
    });
  });

  /*************************
   * Initialize Everything
   *************************/
  // Initialize Alice in Borderland effects when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAliceEffects);
  } else {
    initAliceEffects();
  }

  // Re-initialize card effects after potential dynamic content changes
  const observer = new MutationObserver(() => {
    initCardEffects();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();
