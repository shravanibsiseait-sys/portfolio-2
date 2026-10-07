/**
 * Portfolio Interactive Logic
 * Handles theme switching, vertical sidebar navigation, active scrollspy, and interactive terminal chat.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Theme Toggle (Auto-detect via CSS Media Query + Manual Override)
  // --------------------------------------------------------------------------
  const themeToggleBtns = document.querySelectorAll('#theme-toggle, #mobile-theme-toggle');
  const htmlRoot = document.documentElement;
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  // Apply saved theme if exists
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    htmlRoot.setAttribute('data-theme', savedTheme);
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeTheme = htmlRoot.getAttribute('data-theme') || 
        (systemPrefersDark.matches ? 'dark' : 'light');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  });

  // Listen to OS-level theme changes in real-time if no manual override
  systemPrefersDark.addEventListener('change', () => {
    if (!localStorage.getItem('theme')) {
      htmlRoot.removeAttribute('data-theme');
    }
  });

  // --------------------------------------------------------------------------
  // 2. Vertical Navigation Mobile Drawer & Backdrop Handling
  // --------------------------------------------------------------------------
  const verticalNav = document.getElementById('vertical-nav');
  const navToggleBtn = document.getElementById('nav-toggle-btn');
  const navBackdrop = document.getElementById('nav-backdrop');
  const navLinks = document.querySelectorAll('.sidebar-nav-link');

  function openDrawer() {
    verticalNav.classList.add('is-open');
    navBackdrop.classList.add('is-visible');
    navToggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    verticalNav.classList.remove('is-open');
    navBackdrop.classList.remove('is-visible');
    navToggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (navToggleBtn) {
    navToggleBtn.addEventListener('click', () => {
      const isOpen = verticalNav.classList.contains('is-open');
      isOpen ? closeDrawer() : openDrawer();
    });
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeDrawer);
  }

  // Close drawer when any nav link is clicked (on mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        closeDrawer();
      }
    });
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && verticalNav.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  // --------------------------------------------------------------------------
  // 3. ScrollSpy: Highlight Active Nav Link on Scroll
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  
  function updateActiveLink() {
    const scrollY = window.scrollY + 180;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  // --------------------------------------------------------------------------
  // 3.5. Skills Category Filter Tabs & XP Bar Animation
  // --------------------------------------------------------------------------
  const skillFilterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillBarItems = document.querySelectorAll('.skill-bar-item');
  const competencyCards = document.querySelectorAll('.competency-card');

  skillFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button state
      skillFilterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Filter XP Bars
      skillBarItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (filter === 'all' || itemCat === filter) {
          item.classList.remove('is-hidden');
        } else {
          item.classList.add('is-hidden');
        }
      });

      // Filter Competency Cards
      competencyCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filter === 'all' || cardCat === filter) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 4. Interactive Terminal & Chat Assistant
  // --------------------------------------------------------------------------
  const terminalForm = document.getElementById('terminal-form');
  const terminalInput = document.getElementById('terminal-input');
  const chatMessages = document.getElementById('chat-messages');
  const quickButtons = document.querySelectorAll('.quick-btn');

  const responses = {
    skills: "⚡ Shravani's core stack includes HTML5/CSS3/JavaScript (ES6+), React.js, Node.js, Python, PostgreSQL, MySQL, Docker, and RESTful API Architecture.",
    experience: "⏳ Shravani is pursuing Bachelor of Engineering in Information Science & Engineering with 3+ years building web systems, data algorithms, and full-stack software applications.",
    hire: "💼 Shravani is currently available for full-time Software Engineer, Frontend/Backend Developer, and Internship opportunities (Remote or Onsite).",
    resume: "📄 You can download Shravani's PDF resume directly from the hero section or contact card: 'Shravani resume.pdf'.",
    contact: "📧 You can reach Shravani via email at shravani@example.com or submit the Contact Form below!",
    default: "🤖 Command acknowledged. Shravani specializes in Information Science & Engineering, full-stack web applications, and system design. Type 'skills', 'experience', or 'hire' for more info!"
  };

  function appendMessage(author, text, isBot = true) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${isBot ? 'bot-msg' : 'user-msg'}`;
    
    const authorSpan = document.createElement('span');
    authorSpan.className = 'msg-author pixel-font';
    authorSpan.textContent = `[${author}]`;
    
    const p = document.createElement('p');
    p.textContent = text;
    
    msgDiv.appendChild(authorSpan);
    msgDiv.appendChild(p);
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleQuery(queryText) {
    appendMessage('YOU', queryText, false);
    
    const cleanQuery = queryText.toLowerCase().trim();
    let reply = responses.default;
    
    if (cleanQuery.includes('skill') || cleanQuery.includes('tech') || cleanQuery.includes('stack')) {
      reply = responses.skills;
    } else if (cleanQuery.includes('experience') || cleanQuery.includes('education') || cleanQuery.includes('background') || cleanQuery.includes('ise') || cleanQuery.includes('course')) {
      reply = responses.experience;
    } else if (cleanQuery.includes('hire') || cleanQuery.includes('job') || cleanQuery.includes('available') || cleanQuery.includes('role')) {
      reply = responses.hire;
    } else if (cleanQuery.includes('resume') || cleanQuery.includes('cv')) {
      reply = responses.resume;
    } else if (cleanQuery.includes('contact') || cleanQuery.includes('email') || cleanQuery.includes('reach')) {
      reply = responses.contact;
    }

    setTimeout(() => {
      appendMessage('SYSTEM', reply, true);
    }, 300);
  }

  if (terminalForm && terminalInput) {
    terminalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = terminalInput.value.trim();
      if (!val) return;
      handleQuery(val);
      terminalInput.value = '';
    });
  }

  quickButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const queryType = btn.getAttribute('data-query');
      handleQuery(btn.textContent.replace(/^[^\w]+/, ''));
    });
  });

  // --------------------------------------------------------------------------
  // 5. Dynamic Year in Footer & Contact Form Handler (Steps 11 & 12)
  // --------------------------------------------------------------------------
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const contactForm = document.getElementById('contact-form');
  const contactConfirmation = document.getElementById('contact-confirmation');
  const confirmationText = document.getElementById('confirmation-text');
  const contactResetBtn = document.getElementById('contact-reset-btn');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (contactForm && contactConfirmation) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Basic HTML5 validation check
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const subject = formData.get('subject');
      const message = formData.get('message');

      // Update button state to indicate processing
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'Transmitting Message... ⏳';
      }

      /*
       * =========================================================================
       * RESEND API / EMAIL SERVICE INTEGRATION POINT (Step 11):
       *
       * In production or serverless environments (e.g. Next.js API route, Vercel
       * Function, Cloudflare Worker, or Netlify Function), integrate Resend API:
       *
       * Example:
       * try {
       *   const response = await fetch('/api/send-email', {
       *     method: 'POST',
       *     headers: { 'Content-Type': 'application/json' },
       *     body: JSON.stringify({ name, email, subject, message })
       *   });
       *   if (!response.ok) throw new Error('Network response was not ok');
       * } catch (error) {
       *   console.error('Email sending error:', error);
       * }
       * =========================================================================
       */

      // Simulate network request latency for UI demonstration
      setTimeout(() => {
        // Reset submit button state
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.querySelector('.btn-text').textContent = 'Transmit Message 🚀';
        }

        // Display personalized confirmation message
        if (confirmationText) {
          confirmationText.textContent = `Thank you, ${name}! Your transmission has been logged. Shravani will respond to ${email} as soon as possible.`;
        }

        // Swap form view with confirmation card
        contactForm.style.display = 'none';
        contactConfirmation.classList.remove('is-hidden');
        contactForm.reset();
      }, 700);
    });

    // Reset button to allow sending subsequent messages
    if (contactResetBtn) {
      contactResetBtn.addEventListener('click', () => {
        contactConfirmation.classList.add('is-hidden');
        contactForm.style.display = 'flex';
      });
    }
  }

  // --------------------------------------------------------------------------
  // 6. Smooth Scroll for Back-to-Top and Anchor Links
  // --------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
