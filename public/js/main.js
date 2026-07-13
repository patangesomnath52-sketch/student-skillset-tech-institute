/**
 * STUDENT SKILLSET TECH INSTITUTE – MAIN JAVASCRIPT
 * Safe for every page – never throws errors.
 */
(function () {
  // ========== THEME TOGGLE ==========
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (icon) icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  }

  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeIcon(next);
    });
  }

  // ========== HAMBURGER MENU ==========
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      this.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });

    // Close when a link inside the mobile menu is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });

    // Close when clicking outside the menu or hamburger
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
      }
    });
  }

  // ========== ADMISSION PANEL (if present) ==========
  const panel = document.getElementById('admissionPanel');
  const overlay = document.getElementById('overlay');
  const openTriggers = document.querySelectorAll('#admissionsLink, .open-admission');
  const closeBtn = document.getElementById('closePanel');

  function openPanel(e) {
    e.preventDefault();
    if (panel) panel.classList.add('open');
    if (overlay) overlay.classList.add('show');
  }

  function closePanel() {
    if (panel) panel.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
  }

  openTriggers.forEach(btn => btn.addEventListener('click', openPanel));
  if (closeBtn) closeBtn.addEventListener('click', closePanel);
  if (overlay) overlay.addEventListener('click', closePanel);

  // ========== ADMISSION FORM (if present) ==========
  const form = document.getElementById('admissionForm');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn = document.getElementById('submitBtn');
      const submitText = document.getElementById('submitText');
      const submitLoader = document.getElementById('submitLoader');

      if (submitBtn) submitBtn.disabled = true;
      if (submitText) submitText.classList.add('hidden');
      if (submitLoader) submitLoader.classList.remove('hidden');

      try {
        const res = await fetch('/api/admissions', {
          method: 'POST',
          body: new FormData(form)
        });
        const data = await res.json();
        if (res.ok) {
          alert('✅ ' + (data.message || 'Application submitted!'));
          form.reset();
          closePanel(); // close panel after success
        } else {
          throw new Error(data.error || 'Submission failed.');
        }
      } catch (err) {
        alert('❌ ' + err.message);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (submitText) submitText.classList.remove('hidden');
        if (submitLoader) submitLoader.classList.add('hidden');
      }
    });
  }
})();