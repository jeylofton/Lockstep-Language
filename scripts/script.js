'use strict';

/* ==========================================================================
  Lockstep Language — plain JavaScript (no frameworks)
  Handles: page switching, nav state, the pronunciation/syllable demo,
  and register-form validation.
   ========================================================================== */

/* ---------------------------------------------------------------------- *
 * 1. Page switching
 * ---------------------------------------------------------------------- */

var PAGES = ['home', 'how', 'method', 'about', 'register', 'confirm'];

function getStoredPage() {
  try {
    var p = localStorage.getItem('lockstep.page');
    return PAGES.indexOf(p) !== -1 ? p : 'home';
  } catch (e) {
    return 'home';
  }
}

function storePage(page) {
  try { localStorage.setItem('lockstep.page', page); } catch (e) { /* ignore */ }
}

function goToPage(page) {
  if (PAGES.indexOf(page) === -1) page = 'home';

  document.querySelectorAll('.page').forEach(function (section) {
    section.classList.toggle('is-active', section.dataset.page === page);
  });

  var navKey = page === 'method' ? 'how' : page;
  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.classList.toggle('is-current', link.dataset.goto === navKey);
  });

  if (page === 'register') resetRegisterForm();

  storePage(page);
  closeMobileMenu();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------------------------------------------------------------------- *
 * 1b. Mobile hamburger menu (tablet and below)
 * ---------------------------------------------------------------------- */

var navToggle = null;
var navLinks = null;

function closeMobileMenu() {
  if (!navToggle || !navLinks) return;
  navLinks.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
}

function openMobileMenu() {
  if (!navToggle || !navLinks) return;
  navLinks.classList.add('is-open');
  navToggle.setAttribute('aria-expanded', 'true');
}

function initMobileMenu() {
  navToggle = document.getElementById('nav-toggle');
  navLinks = document.getElementById('primary-nav');
  if (!navToggle || !navLinks) return;

  navToggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.contains('is-open');
    if (isOpen) closeMobileMenu(); else openMobileMenu();
  });

  document.addEventListener('click', function (ev) {
    if (!navLinks.classList.contains('is-open')) return;
    if (navLinks.contains(ev.target) || navToggle.contains(ev.target)) return;
    closeMobileMenu();
  });

  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') closeMobileMenu();
  });

  window.addEventListener('resize', closeMobileMenu);
}

function initNavigation() {
  document.querySelectorAll('[data-goto]').forEach(function (el) {
    el.addEventListener('click', function (ev) {
      ev.preventDefault();
      goToPage(el.dataset.goto);
    });
  });
  document.querySelectorAll('.noop').forEach(function (el) {
    el.addEventListener('click', function (ev) { ev.preventDefault(); });
  });
  goToPage(getStoredPage());
}

/* ---------------------------------------------------------------------- *
 * 2. Pronunciation / syllable demo (Learning Method Details page)
 * ---------------------------------------------------------------------- */

var WORDS = [
  { key: 'necesito', word: 'necesito', gloss: 'I need', syl: ['ne', 'ce', 'si', 'to'], stress: 2 },
  { key: 'convertirse', word: 'convertirse', gloss: 'to become', syl: ['con', 'ver', 'tir', 'se'], stress: 2 }
];

var playTimer = null;
var currentAudio = null;

function buildPronunciationCard() {
  var card = document.getElementById('pron-card');
  if (!card) return;

  var sentences = card.querySelector('.sample-sentences');

  WORDS.forEach(function (w) {
    var row = document.createElement('div');
    row.className = 'word-row';

    var head = document.createElement('div');
    head.className = 'word-head';
    head.innerHTML =
      '<span class="w">' + w.word + '</span>' +
      '<span class="gloss">— ' + w.gloss + '</span>';
    row.appendChild(head);

    var syllablesWrap = document.createElement('div');
    syllablesWrap.className = 'syllables';

    var chipsWrap = document.createElement('div');
    chipsWrap.className = 'syllable-chips';

    w.syl.forEach(function (text, i) {
      var chip = document.createElement('span');
      chip.className = 'syllable' + (i === w.stress ? ' is-stressed' : '');
      chip.textContent = text;
      chip.dataset.word = w.key;
      chip.dataset.index = String(i);
      chipsWrap.appendChild(chip);
    });
    syllablesWrap.appendChild(chipsWrap);

    var playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.className = 'btn btn-primary play-btn';
    playBtn.setAttribute('aria-label', 'Play syllables for ' + w.word);
    playBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="7 4 20 12 7 20 7 4"></polygon></svg>';
    playBtn.addEventListener('click', function () { playWord(w.key); });
    syllablesWrap.appendChild(playBtn);

    row.appendChild(syllablesWrap);
    card.insertBefore(row, sentences);
  });
}

function highlightSyllable(key, index) {
  document.querySelectorAll('.syllable[data-word="' + key + '"]').forEach(function (el) {
    el.classList.toggle('is-active', Number(el.dataset.index) === index);
  });
}

function clearHighlight(key) {
  document.querySelectorAll('.syllable[data-word="' + key + '"]').forEach(function (el) {
    el.classList.remove('is-active');
  });
}

function playWordTimed(key, syllableCount) {
  var i = 0;
  highlightSyllable(key, i);
  playTimer = setInterval(function () {
    i++;
    if (i >= syllableCount) {
      clearInterval(playTimer);
      clearHighlight(key);
      return;
    }
    highlightSyllable(key, i);
  }, 480);
}

function playWord(key) {
  clearInterval(playTimer);
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  document.querySelectorAll('.syllable.is-active').forEach(function (el) {
    el.classList.remove('is-active');
  });

  var w = WORDS.find(function (x) { return x.key === key; });
  if (!w) return;

  var n = w.syl.length;
  var audio = new Audio('audio/' + key + '.mp3');
  currentAudio = audio;

  var stop = function () {
    clearInterval(playTimer);
    clearHighlight(key);
    if (currentAudio === audio) currentAudio = null;
  };

  var fallback = function () {
    if (currentAudio !== audio) return; // a newer play() has already taken over
    playWordTimed(key, n);
  };

  audio.addEventListener('error', fallback);
  audio.addEventListener('ended', stop);
  audio.addEventListener('playing', function () {
    clearInterval(playTimer);
    playTimer = setInterval(function () {
      var d = audio.duration;
      if (!d || isNaN(d)) return;
      var i = Math.min(n - 1, Math.floor((audio.currentTime / d) * n));
      highlightSyllable(key, i);
    }, 40);
  });

  audio.play().catch(fallback);
}

/* ---------------------------------------------------------------------- *
 * 3. Register form
 * ---------------------------------------------------------------------- */

var form = null;
var submitBtn = null;
var alertBox = null;
var alertText = null;
var touched = {};
var tried = false;

function fieldValue(name) {
  var el = form.elements[name];
  if (!el) return '';
  return el.type === 'checkbox' ? el.checked : el.value;
}

function validateForm() {
  var errors = {};
  var first = String(fieldValue('first')).trim();
  var last = String(fieldValue('last')).trim();
  var email = String(fieldValue('email')).trim();
  var pw = fieldValue('pw');
  var pw2 = fieldValue('pw2');
  var terms = fieldValue('terms');

  if (!first) errors.first = 'First name is required.';
  if (!last) errors.last = 'Last name is required.';
  if (!email) errors.email = 'Email address is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'Enter a valid email address (e.g. name@example.com).';
  if (!pw) errors.pw = 'Password is required.';
  else if (pw.length < 8) errors.pw = 'Password must be at least 8 characters.';
  if (!pw2) errors.pw2 = 'Please confirm your password.';
  else if (pw2 !== pw) errors.pw2 = 'Passwords do not match.';
  if (!terms) errors.terms = 'Please agree to the Terms of Service and Privacy Policy.';

  return errors;
}

function renderErrors(errors) {
  var names = ['first', 'last', 'email', 'pw', 'pw2', 'terms'];
  var count = 0;

  names.forEach(function (name) {
    var show = !!errors[name] && (tried || touched[name]);
    var errEl = form.querySelector('[data-error-for="' + name + '"]');
    var inputEl = form.elements[name];

    if (errEl) {
      errEl.hidden = !show;
      errEl.textContent = show ? errors[name] : '';
    }
    if (inputEl && inputEl.classList) {
      inputEl.classList.toggle('has-error', show);
    }
    if (show) count++;
  });

  var emailOk = (tried || touched.email) && !errors.email;
  var checkIcon = form.querySelector('.input-check');
  if (checkIcon) checkIcon.hidden = !emailOk;

  if (tried && count > 0) {
    alertBox.hidden = false;
    alertText.textContent = 'Please fix ' + count + ' error' + (count === 1 ? '' : 's') + ' below.';
  } else {
    alertBox.hidden = true;
  }

  return count;
}

function resetRegisterForm() {
  if (!form) return;
  form.reset();
  touched = {};
  tried = false;
  submitBtn.disabled = false;
  submitBtn.textContent = 'Create Account';
  var pwInput = document.getElementById('f-pw');
  var pw2Input = document.getElementById('f-pw2');
  var toggleBtn = document.getElementById('toggle-pw');
  if (pwInput) pwInput.type = 'password';
  if (pw2Input) pw2Input.type = 'password';
  if (toggleBtn) toggleBtn.textContent = 'Show';
  renderErrors(validateForm());
}

function initRegisterForm() {
  form = document.getElementById('register-form');
  if (!form) return;
  submitBtn = document.getElementById('submit-btn');
  alertBox = document.getElementById('form-alert');
  alertText = document.getElementById('form-alert-text');

  ['first', 'last', 'email', 'pw', 'pw2'].forEach(function (name) {
    var input = form.elements[name];
    input.addEventListener('input', function () { renderErrors(validateForm()); });
    input.addEventListener('blur', function () {
      touched[name] = true;
      renderErrors(validateForm());
    });
  });
  form.elements.terms.addEventListener('change', function () {
    touched.terms = true;
    renderErrors(validateForm());
  });

  var toggleBtn = document.getElementById('toggle-pw');
  toggleBtn.addEventListener('click', function () {
    var pwInput = document.getElementById('f-pw');
    var pw2Input = document.getElementById('f-pw2');
    var showing = pwInput.type === 'text';
    pwInput.type = showing ? 'password' : 'text';
    pw2Input.type = showing ? 'password' : 'text';
    toggleBtn.textContent = showing ? 'Show' : 'Hide';
  });

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (submitBtn.disabled) return;

    tried = true;
    var errors = validateForm();
    var count = renderErrors(errors);

    if (count > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account…';
    setTimeout(function () {
      goToPage('confirm');
    }, 1100);
  });

  resetRegisterForm();
}

/* ---------------------------------------------------------------------- *
 * Init
 * ---------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function () {
  buildPronunciationCard();
  initRegisterForm();
  initMobileMenu();
  initNavigation();
});
