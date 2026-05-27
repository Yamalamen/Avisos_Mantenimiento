// pinwyno — interacciones mínimas con flow

// Sticky nav background on scroll
const nav = document.querySelector('[data-nav]');
const onScroll = () => {
  if (window.scrollY > 24) nav.classList.add('is-stuck');
  else nav.classList.remove('is-stuck');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('[data-reveal]').forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i * 30, 240)}ms`;
  io.observe(el);
});

// Mobile burger
const burger = document.querySelector('[data-burger]');
burger?.addEventListener('click', () => {
  burger.classList.toggle('is-open');
  nav.classList.toggle('is-open');
});

// Cerrar menú al clicar enlace
document.querySelectorAll('.nav__links a').forEach((a) => {
  a.addEventListener('click', () => {
    burger?.classList.remove('is-open');
    nav.classList.remove('is-open');
  });
});

// Pequeño parallax en el hero image
const heroImg = document.querySelector('.hero__image img');
if (heroImg && matchMedia('(min-width: 720px)').matches) {
  window.addEventListener('scroll', () => {
    const y = Math.min(window.scrollY * 0.08, 40);
    heroImg.style.transform = `translateY(${y}px) scale(1.02)`;
  }, { passive: true });
}
