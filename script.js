const sections = Array.from(document.querySelectorAll('main .lesson'));
const navLinks = Array.from(document.querySelectorAll('#lesson-nav a'));
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const themeToggle = document.getElementById('theme-toggle');

let current = 0;

function showSection(index) {
  current = index;
  sections.forEach((section, i) => {
    section.hidden = i !== index;
  });
  navLinks.forEach((link, i) => {
    if (i === index) {
      link.setAttribute('aria-current', 'true');
    } else {
      link.removeAttribute('aria-current');
    }
  });
  prevButton.disabled = index === 0;
  nextButton.disabled = index === sections.length - 1;
  document.title = sections[index].querySelector('h2').textContent + ' – Lesson 5';
}

function indexFromHash() {
  const id = window.location.hash.slice(1);
  const index = sections.findIndex((section) => section.id === id);
  return index === -1 ? 0 : index;
}

navLinks.forEach((link, i) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    history.pushState(null, '', '#' + sections[i].id);
    showSection(i);
    window.scrollTo(0, 0);
  });
});

function step(change) {
  const index = current + change;
  history.pushState(null, '', '#' + sections[index].id);
  showSection(index);
  window.scrollTo(0, 0);
}

prevButton.addEventListener('click', () => step(-1));
nextButton.addEventListener('click', () => step(1));
window.addEventListener('popstate', () => showSection(indexFromHash()));

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? 'Light theme' : 'Dark theme';
}

let savedTheme = null;
try {
  savedTheme = localStorage.getItem('theme');
} catch (error) {
  // Storage can be blocked; fall back to the default light theme.
}
setTheme(savedTheme === 'dark' ? 'dark' : 'light');

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(next);
  try {
    localStorage.setItem('theme', next);
  } catch (error) {
    // Ignore: the choice just won't be remembered.
  }
});

showSection(indexFromHash());
