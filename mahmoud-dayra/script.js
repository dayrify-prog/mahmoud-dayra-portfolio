'use strict';
// All public copy lives in index.html, in paired data-ar / data-en attributes.
const root = document.documentElement;
const languageButton = document.getElementById('language');
const themeButton = document.getElementById('theme');
const motionButton = document.getElementById('motion');
const menuButton = document.getElementById('menu');
const navigation = document.getElementById('navigation');
let language = 'ar';
const readPreference = key => { try { return localStorage.getItem(key); } catch { return null; } };
const savePreference = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const darkScheme = matchMedia('(prefers-color-scheme: dark)');
const motionIsOff = () => root.dataset.motion === 'off' || reducedMotion.matches;
function updateControlLabels() {
  const dark = root.dataset.theme === 'dark';
  const themeText = language === 'ar' ? (dark ? 'الوضع الفاتح' : 'الوضع الداكن') : (dark ? 'Light mode' : 'Dark mode');
  themeButton.setAttribute('aria-label', themeText);
  themeButton.title = themeText;
  const paused = motionIsOff();
  const motionText = reducedMotion.matches
    ? (language === 'ar' ? 'الحركة متوقفة حسب إعدادات جهازك' : 'Motion reduced by your device settings')
    : (language === 'ar' ? (paused ? 'تشغيل الحركة' : 'إيقاف الحركة') : (paused ? 'Enable motion' : 'Pause motion'));
  motionButton.setAttribute('aria-label', motionText);
  motionButton.title = motionText;
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.disabled = reducedMotion.matches;
}
function setLanguage(value, persist = true) {
  language = value === 'en' ? 'en' : 'ar';
  root.lang = language;
  root.dir = language === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-ar][data-en]').forEach(el => { el.textContent = el.getAttribute('data-' + language); });
  document.querySelectorAll('[data-alt-ar]').forEach(el => { el.alt = el.getAttribute('data-alt-' + language); });
  document.querySelectorAll('[data-label-ar]').forEach(el => { el.setAttribute('aria-label', el.getAttribute('data-label-' + language)); });
  languageButton.textContent = language === 'ar' ? 'English' : 'العربية';
  languageButton.lang = language === 'ar' ? 'en' : 'ar';
  languageButton.setAttribute('aria-label', language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
  document.title = language === 'ar' ? 'محمود دايرة | Media Buyer' : 'Mahmoud Dayra | Media Buyer';
  const description = language === 'ar'
    ? 'محمود دايرة، Media Buyer بخلفية في المحتوى. رحلة من كتابة السكريبت إلى إدارة الحملات، مع أعمال ونتائج من داخل الـDashboard.'
    : 'Mahmoud Dayra, a Media Buyer with a creative background. Explore a journey from scriptwriting to paid campaigns, with work and dashboard results.';
  document.querySelector('meta[name="description"]').content = description;
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector('meta[property="og:description"]').content = description;
  document.querySelector('meta[property="og:locale"]').content = language === 'ar' ? 'ar_EG' : 'en_US';
  updateControlLabels();
  if (persist) savePreference('portfolio-language', language);
}
languageButton.addEventListener('click', () => setLanguage(language === 'ar' ? 'en' : 'ar'));
themeButton.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  savePreference('portfolio-theme', root.dataset.theme);
  updateControlLabels();
});
motionButton.addEventListener('click', () => {
  root.dataset.motion = root.dataset.motion === 'off' ? 'on' : 'off';
  savePreference('portfolio-motion', root.dataset.motion);
  updateControlLabels();
});
darkScheme.addEventListener('change', e => {
  if (!['light', 'dark'].includes(readPreference('portfolio-theme'))) {
    root.dataset.theme = e.matches ? 'dark' : 'light';
    updateControlLabels();
  }
});
reducedMotion.addEventListener('change', updateControlLabels);
function closeMenu() {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}
menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) { closeMenu(); menuButton.focus(); }
});
// Native video controls remain available without JavaScript. Only one video plays at a time.
const videos = [...document.querySelectorAll('video')];
videos.forEach(video => {
  video.addEventListener('play', () => { videos.forEach(other => { if (other !== video) other.pause(); }); });
});
document.addEventListener('visibilitychange', () => { if (document.hidden) videos.forEach(video => video.pause()); });
// Real image links are the no-JavaScript fallback. The dialog provides keyboard-safe zoom.
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const imageTitle = document.getElementById('image-title');
const lightboxScroll = document.querySelector('.lightbox-scroll');
const closeLightbox = document.getElementById('close-lightbox');
let lastTrigger = null;
document.querySelectorAll('[data-gallery]').forEach(link => link.addEventListener('click', event => {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !lightbox.showModal) return;
  event.preventDefault();
  lastTrigger = link;
  const thumbnail = link.querySelector('img');
  lightboxImage.src = link.href;
  lightboxImage.alt = thumbnail.alt;
  imageTitle.textContent = thumbnail.alt;
  lightboxScroll.classList.remove('zoomed');
  lightboxImage.tabIndex = 0;
  lightboxImage.setAttribute('role', 'button');
  lightboxImage.setAttribute('aria-pressed', 'false');
  lightboxImage.setAttribute('aria-label', (language === 'ar' ? 'تكبير: ' : 'Zoom: ') + thumbnail.alt);
  document.body.classList.add('modal-open');
  lightbox.showModal();
  closeLightbox.focus();
}));
function toggleZoom() {
  const zoomed = lightboxScroll.classList.toggle('zoomed');
  lightboxImage.setAttribute('aria-pressed', String(zoomed));
}
lightboxImage.addEventListener('click', toggleZoom);
lightboxImage.addEventListener('keydown', event => { if (['Enter', ' '].includes(event.key)) { event.preventDefault(); toggleZoom(); } });
closeLightbox.addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => {
  const bounds = lightbox.getBoundingClientRect();
  if (event.target === lightbox && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) lightbox.close();
});
lightbox.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  lightboxImage.removeAttribute('src');
  if (lastTrigger) lastTrigger.focus({ preventScroll: true });
});
// Scroll-driven chapter progress. Content is never hidden by an animation.
const chapters = [...document.querySelectorAll('.chapter')];
const chapterCount = document.getElementById('chapter-count');
let scheduled = false;
function updateProgress() {
  const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  root.style.setProperty('--scroll', Math.min(1, Math.max(0, scrollY / max)));
  let active = chapters[0];
  for (const chapter of chapters) if (chapter.getBoundingClientRect().top <= innerHeight * .5) active = chapter;
  chapterCount.textContent = String(active.dataset.chapter).padStart(2, '0');
  navigation.querySelectorAll('a').forEach(link => {
    if (link.hash === '#' + active.id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scheduled = false;
}
addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateProgress); } }, { passive: true });
addEventListener('resize', updateProgress, { passive: true });
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); } });
  }, { threshold: .08 });
  chapters.forEach(chapter => observer.observe(chapter));
}
setLanguage(readPreference('portfolio-language') || 'ar', false);
updateProgress();
