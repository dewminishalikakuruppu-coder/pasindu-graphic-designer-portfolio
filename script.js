const header = document.querySelector('.site-header');
const navLinks = [...document.querySelectorAll('.nav-link')];
const menuToggle = document.querySelector('.menu-toggle');
const navPanel = document.querySelector('.nav-panel');
const scrollProgress = document.querySelector('.scroll-progress');
const backToTop = document.querySelector('.back-to-top');
const revealItems = document.querySelectorAll('.reveal');
const stats = document.querySelectorAll('[data-count]');
const skillFills = document.querySelectorAll('.skill-fill');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.portfolio-card');
const modal = document.getElementById('projectModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const modalDescription = document.getElementById('modalDescription');
const modalTools = document.getElementById('modalTools');
const toast = document.getElementById('toast');
const contactForm = document.getElementById('contactForm');
const sliderItems = [...document.querySelectorAll('.testimonial')];
const sliderDots = [...document.querySelectorAll('.dot')];
let currentSlide = 0;
let sliderInterval;

function updateScrollProgress() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
  header.classList.toggle('scrolled', window.scrollY > 18);
  backToTop.classList.toggle('visible', window.scrollY > 500);
}

window.addEventListener('scroll', updateScrollProgress);
updateScrollProgress();

menuToggle.addEventListener('click', () => {
  const isOpen = navPanel.classList.contains('open');
  navPanel.classList.toggle('open', !isOpen);
  menuToggle.classList.toggle('open', !isOpen);
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navPanel.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    });
  },
  { threshold: 0.25 }
);

const sections = document.querySelectorAll('main section[id]');
sections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);
revealItems.forEach((item) => revealObserver.observe(item));

const statObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number(element.dataset.count);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        element.textContent = `${current}+`;
      }, 32);
      observer.unobserve(element);
    });
  },
  { threshold: 0.4 }
);
stats.forEach((stat) => statObserver.observe(stat));

const skillObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const fill = entry.target;
      fill.style.width = fill.dataset.percent;
      observer.unobserve(fill);
    });
  },
  { threshold: 0.45 }
);
skillFills.forEach((fill) => skillObserver.observe(fill));

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));

    projectCards.forEach((card) => {
      const categories = card.dataset.category.split(' ');
      const matches = filter === 'all' || categories.includes(filter);
      card.classList.toggle('is-hidden', !matches);
    });
  });
});

function openModal(card) {
  const image = card.querySelector('img');
  const title = card.dataset.title;
  const category = card.querySelector('.meta').textContent.trim();
  const description = card.dataset.description;
  const tools = card.dataset.tools;

  modalImage.src = image.src;
  modalTitle.textContent = title;
  modalCategory.textContent = category;
  modalDescription.textContent = description;
  modalTools.textContent = tools;

  modal.showModal();
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.close();
  document.body.style.overflow = '';
}

document.querySelectorAll('.view-project').forEach((button, index) => {
  button.addEventListener('click', () => {
    const card = projectCards[index];
    if (card) openModal(card);
  });
});

document.querySelector('.modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.open) closeModal();
});

function showSlide(index) {
  currentSlide = (index + sliderItems.length) % sliderItems.length;
  sliderItems.forEach((item, i) => item.classList.toggle('active', i === currentSlide));
  sliderDots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
}

function startSlider() {
  window.clearInterval(sliderInterval);
  sliderInterval = setInterval(() => {
    showSlide(currentSlide + 1);
  }, 5000);
}

document.querySelector('.prev').addEventListener('click', () => {
  showSlide(currentSlide - 1);
  startSlider();
});
document.querySelector('.next').addEventListener('click', () => {
  showSlide(currentSlide + 1);
  startSlider();
});
sliderDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    showSlide(index);
    startSlider();
  });
});
showSlide(0);
startSlider();

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('visible'), 2800);
}

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  const fields = [
    { input: nameInput, message: 'Please enter your name.' },
    { input: emailInput, message: 'Please enter a valid email.' },
    { input: subjectInput, message: 'Please enter a subject.' },
    { input: messageInput, message: 'Please enter a message.' }
  ];

  let isValid = true;

  fields.forEach(({ input, message }) => {
    const error = input.parentElement.querySelector('.error-message');
    const value = input.value.trim();
    let validationMessage = '';

    if (!value) {
      validationMessage = message;
      isValid = false;
    } else if (input === emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      validationMessage = 'Please enter a valid email.';
      isValid = false;
    }

    error.textContent = validationMessage;
    input.style.borderColor = validationMessage ? '#ff9ea4' : 'rgba(255,255,255,0.12)';
  });

  if (!isValid) {
    showToast('Please complete the required fields.');
    return;
  }

  contactForm.reset();
  document.querySelector('.form-status').textContent = 'Thank you! Your message has been sent successfully.';
  showToast('Your message was submitted successfully.');
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelector('.page-loader').classList.add('hidden');
  }, 600);
});
