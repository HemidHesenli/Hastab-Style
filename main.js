// Hastab Style: loqo girişi, scroll ilə görünmə, kolleksiya filtri.
const WHATSAPP = '994775035211';
const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = !!(window.gsap && window.ScrollTrigger);

root.classList.add('js');

/* ---------- 1. Loqo girişi: scroll etdikcə loqo çəkilir ---------- */
if (hasGsap && !reduceMotion) {
  root.classList.add('anim');
  gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: '#intro',
      start: 'top top',
      end: '+=170%',
      pin: true,
      scrub: 0.8,
    },
  });

  tl.to('.ink-ring', { strokeDashoffset: 0, opacity: 1, duration: 1.3 })
    .to('.ink-stem', { strokeDashoffset: 0, opacity: 1, duration: 0.6 }, '-=0.35')
    .to('.ink-arc', { strokeDashoffset: 0, opacity: 1, duration: 0.7 }, '-=0.15')
    .to('.ink-plus', { strokeDashoffset: 0, opacity: 1, duration: 0.45 }, '-=0.1')
    .from('.intro-word span', { yPercent: 120, opacity: 0, stagger: 0.04, duration: 0.5, ease: 'power3.out' }, '-=0.2')
    .to({}, { duration: 0.35 }) // loqo bir an tam görünür
    // Loqo kiçilir və pin bitəndə səhifə ilə birlikdə yuxarı gedir, altdan hero çıxır
    .to('.intro-stage', { scale: 0.86, yPercent: -12, duration: 0.6, ease: 'power1.inOut' });

  // Naviqasiya giriş bitəndə görünür
  gsap.set('.nav', { y: -20 });
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top 85%',
    onEnter: () => gsap.to('.nav', { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }),
    onLeaveBack: () => gsap.to('.nav', { autoAlpha: 0, y: -20, duration: 0.4, ease: 'power2.in' }),
  });

  // Hero kartlarında yüngül dərinlik (parallax)
  gsap.to('.hcard-main', { yPercent: -8, scrollTrigger: { trigger: '#hero', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.to('.hcard-feed', { yPercent: 10, scrollTrigger: { trigger: '#hero', start: 'top bottom', end: 'bottom top', scrub: true } });
}

/* ---------- 2. Elementlər ekrana girəndə görünür ---------- */
const revealEls = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-in'));
}

// Hero elementləri də ardıcıl görünsün
document.querySelectorAll('.hero-copy > *, .hero-visual > *').forEach((el, i) => {
  el.setAttribute('data-reveal', '');
  el.style.setProperty('--d', `${i * 0.08}s`);
  if (reduceMotion) el.classList.add('is-in');
  else new IntersectionObserver(([e], obs) => {
    if (e.isIntersecting) { el.classList.add('is-in'); obs.disconnect(); }
  }, { threshold: 0.1 }).observe(el);
});

/* ---------- 3. Kolleksiya: hər modelə "Sifariş ver" düyməsi ---------- */
const items = [...document.querySelectorAll('.item')];
items.forEach((item) => {
  const text = `Salam! "${item.dataset.name}" haqqında məlumat almaq istəyirəm.`;
  const a = document.createElement('a');
  a.className = 'item-order';
  a.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
  a.target = '_blank';
  a.rel = 'noopener';
  a.innerHTML = '<i class="ph ph-whatsapp-logo"></i> Sifariş ver';
  a.setAttribute('aria-label', `${item.dataset.name}: WhatsApp-da sifariş ver`);
  item.appendChild(a);
});

/* ---------- 4. Kolleksiya filtri ---------- */
const tabs = document.querySelectorAll('.tab');
const empty = document.getElementById('empty');
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const f = tab.dataset.filter;
    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-pressed', String(on));
    });

    let shown = 0;
    items.forEach((item) => {
      const match = f === 'all' || item.dataset.cat.split(' ').includes(f);
      if (match) shown++;
      if (match && item.classList.contains('is-hidden')) {
        item.classList.remove('is-hidden');
        item.classList.add('is-fading');
        requestAnimationFrame(() => requestAnimationFrame(() => item.classList.remove('is-fading')));
      } else if (!match) {
        item.classList.add('is-hidden');
      }
    });
    empty.hidden = shown > 0;
    if (hasGsap) ScrollTrigger.refresh();
  });
});
