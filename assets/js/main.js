/* ==========================================================================
   GOLLA SUKANYA DEVI - PORTFOLIO INTERACTION ENGINE
   Features: Typing Effect, 3D Tilt, Counter Animations, Filter Engine, Sound Synth
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Web Audio API Sound Synthesizer (Zero external audio file dependencies!)
  let soundEnabled = false;
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function playTechSound(type = 'hover') {
    if (!soundEnabled) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;
      if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.04);
        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (e) {
      // Browser audio policy catch
    }
  }

  // Sound Toggle Button
  const soundBtn = document.getElementById('sound-toggle');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      soundBtn.innerHTML = soundEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
      soundBtn.style.color = soundEnabled ? '#38bdf8' : '#64748b';
      playTechSound('click');
    });
  }

  // 2. Custom Cursor Follower & Magnetic Effect
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');

  if (cursor && follower) {
    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });

    function animateFollower() {
      posX += (mouseX - posX) * 0.15;
      posY += (mouseY - posY) * 0.15;
      follower.style.left = `${posX}px`;
      follower.style.top = `${posY}px`;
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover elements effect
    const hoverables = document.querySelectorAll('a, button, .glass-card, .filter-btn, .social-btn');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
        playTechSound('hover');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
      el.addEventListener('click', () => {
        playTechSound('click');
      });
    });
  }

  // 3. Typing Effect for Professional Headlines
  const typingElement = document.querySelector('.typing-text');
  if (typingElement) {
    const roles = [
      "HR Operations Executive",
      "Human Resources Professional",
      "Learning & Development"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
      } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 90;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typingSpeed = 1800; // Pause at full word
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400; // Pause before typing next
      }

      setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();
  }

  // 4. Scroll Progress Bar & Navbar Active States
  const progressBar = document.querySelector('.scroll-progress');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Scroll progress line
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (progressBar) progressBar.style.width = `${scrolled}%`;

    // Active Section Detection
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // 5. Statistics Counter Animation
  const statNumbers = document.querySelectorAll('.stat-number');
  let animatedStats = false;

  function runCounterAnimation() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const suffix = stat.getAttribute('data-suffix') || '';
      let count = 0;
      const increment = Math.ceil(target / 40);

      const updateCounter = () => {
        count += increment;
        if (count >= target) {
          stat.textContent = target + suffix;
        } else {
          stat.textContent = count + suffix;
          setTimeout(updateCounter, 30);
        }
      };
      updateCounter();
    });
  }

  // Observer for Stats Counter
  const statsSection = document.querySelector('.hero-stats-grid');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedStats) {
          animatedStats = true;
          runCounterAnimation();
        }
      });
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
  }

  // 6. Skills Category Filtering System
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            if (card.style.opacity === '0') card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // 7. Skill Bars Animation on Scroll
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillsSection = document.getElementById('skills');

  if (skillsSection) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillBars.forEach(bar => {
            const level = bar.getAttribute('data-level');
            bar.style.width = `${level}%`;
          });
        }
      });
    }, { threshold: 0.2 });
    skillObserver.observe(skillsSection);
  }

  // 8. 3D Card Tilt Effect (Physics Simulation)
  const tiltCards = document.querySelectorAll('.glass-card, .hero-portrait-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // 9. Modal Controller (Resume & Contact Modal)
  const resumeModalBtn = document.getElementById('btn-open-resume');
  const modalOverlay = document.getElementById('resume-modal');
  const modalCloseBtn = document.getElementById('modal-close');

  if (resumeModalBtn && modalOverlay) {
    resumeModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (modalCloseBtn && modalOverlay) {
    modalCloseBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = 'auto';
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }

  // 10. Contact Form Interactive Submit Simulation
  const contactForm = document.getElementById('portfolio-contact-form');
  const formSubmitMsg = document.getElementById('form-submit-message');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
        submitBtn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
        if (formSubmitMsg) {
          formSubmitMsg.style.display = 'block';
          formSubmitMsg.innerHTML = '<i class="fas fa-check-circle"></i> Thank you for reaching out, Sukanya will get back to you shortly!';
        }
        contactForm.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
        }, 4000);
      }, 1500);
    });
  }

  // 11. Mobile Navigation Drawer
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const navDrawer = document.querySelector('.nav-links');

  if (mobileNavToggle && navDrawer) {
    mobileNavToggle.addEventListener('click', () => {
      navDrawer.classList.toggle('active');
      const icon = mobileNavToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navDrawer.classList.remove('active');
        const icon = mobileNavToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });
  }

  // 12. Copy Email Quick Action
  const copyEmailBtns = document.querySelectorAll('.btn-copy-email');
  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText('sukanyadevi532@gmail.com');
      const origText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Email Copied!';
      setTimeout(() => {
        btn.innerHTML = origText;
      }, 2500);
    });
  });

});
