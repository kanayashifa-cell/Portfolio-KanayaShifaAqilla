document.addEventListener('DOMContentLoaded', () => {
  initGSAPScrollTrigger();
  initParallaxTiltCard();
  initMagneticButtons();
  initTabFilters();
  initLightboxModal();
  initMobileMenu();
  initNavScrollHighlight();
});

function initGSAPScrollTrigger() {
  if (typeof gsap === 'undefined') return;

  const heroElements = document.querySelectorAll('.gsap-hero-element');
  if (heroElements.length > 0) {
    gsap.from(heroElements, {
      opacity: 0,
      y: 25,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    });
  }

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const revealElements = document.querySelectorAll('.gsap-reveal');
    revealElements.forEach(el => {
      gsap.from(el, {
        opacity: 0,
        y: 25,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      });
    });
  }
}

function initParallaxTiltCard() {
  const cards = document.querySelectorAll('.parallax-tilt-card');
  
  cards.forEach(card => {
    const img = card.querySelector('.hero-portrait-img, .project-header-art, .cert-preview-img');
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const rotateX = (-y / rect.height) * 10;
      const rotateY = (x / rect.width) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      if (img) img.style.transform = `scale(1.05) translate(${x * 0.03}px, ${y * 0.03}px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      if (img) img.style.transform = 'scale(1) translate(0px, 0px)';
    });
  });
}

function initMagneticButtons() {
  const magneticBtns = document.querySelectorAll('.magnetic-btn');

  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}

function initTabFilters() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const certCards = document.querySelectorAll('.cert-visual-card');

  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      certCards.forEach(card => {
        const category = card.dataset.category || 'all';
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          if (typeof gsap !== 'undefined') {
            gsap.to(card, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' });
          } else {
            card.style.opacity = '1';
          }
        } else {
          if (typeof gsap !== 'undefined') {
            gsap.to(card, { 
              opacity: 0, 
              scale: 0.95, 
              duration: 0.2, 
              onComplete: () => card.style.display = 'none' 
            });
          } else {
            card.style.opacity = '0';
            setTimeout(() => card.style.display = 'none', 200);
          }
        }
      });
    });
  });
}

function initLightboxModal() {
  const modal = document.getElementById('certLightbox');
  const closeBtn = document.getElementById('closeLightboxBtn');
  const imgTarget = document.getElementById('lightboxImg');
  const titleTarget = document.getElementById('lightboxTitle');
  const subtitleTarget = document.getElementById('lightboxSubtitle');
  const metaTarget = document.getElementById('lightboxMeta');

  if (!modal) return;

  function openModal(imgSrc, title, subtitle, meta) {
    if (imgTarget) imgTarget.src = imgSrc;
    if (titleTarget) titleTarget.textContent = title || 'Sertifikat';
    if (subtitleTarget) subtitleTarget.textContent = subtitle || '';
    if (metaTarget) metaTarget.textContent = meta || '';

    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', 'true');
    }
  }

  function closeModal() {
    if (typeof modal.close === 'function') {
      modal.close();
    } else {
      modal.removeAttribute('open');
    }
    if (imgTarget) imgTarget.src = '';
  }

  document.querySelectorAll('[data-cert-img]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(
        trigger.dataset.certImg,
        trigger.dataset.certTitle,
        trigger.dataset.certSubtitle,
        trigger.dataset.certMeta
      );
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX && e.clientX <= rect.left + rect.width
    );
    if (!isInDialog) closeModal();
  });
}

function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const links = document.getElementById('navLinks');

  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

function initNavScrollHighlight() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
