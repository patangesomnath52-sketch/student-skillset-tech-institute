/**
 * ============================================================
 * STUDENT SKILLSET TECH INSTITUTE – MAIN JAVASCRIPT
 * All pages share this file for consistent behavior.
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', function () {

    // ============================================================
    // 1. THEME TOGGLE (Dark / Light)
    // ============================================================
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.querySelector('#themeIcon');

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    function getStoredTheme() {
        return localStorage.getItem('theme') || 'dark';
    }

    // Apply stored theme on load
    const initialTheme = getStoredTheme();
    setTheme(initialTheme);

    // Toggle on click
    if (themeToggle) {
        themeToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            setTheme(next);
        });
    }

    // ============================================================
    // 2. NAVBAR SCROLL EFFECT
    // ============================================================
    const navbar = document.querySelector('nav');
    if (navbar) {
        window.addEventListener('scroll', function () {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // ============================================================
    // 3. HAMBURGER MENU TOGGLE
    // ============================================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function (e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('active');
            });
        });
    }

    // ============================================================
    // 4. ADMISSION PANEL
    // ============================================================
    const panel = document.getElementById('admissionPanel');
    const overlay = document.getElementById('overlay');
    const closePanelBtn = document.getElementById('closePanel');
    const openTriggers = document.querySelectorAll('#admissionsLink, .open-admission');

    function openPanel(e) {
        if (e) e.preventDefault();
        if (panel) panel.classList.add('open');
        if (overlay) overlay.classList.add('show');
    }

    function closePanelFn() {
        if (panel) panel.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
    }

    openTriggers.forEach(function (el) {
        el.addEventListener('click', openPanel);
    });

    if (closePanelBtn) closePanelBtn.addEventListener('click', closePanelFn);
    if (overlay) overlay.addEventListener('click', closePanelFn);

    // ============================================================
    // 5. FILE INPUT HELPERS (for admission form)
    // ============================================================
    function setupFileInput(fileId, labelId, isPhoto) {
        const input = document.getElementById(fileId);
        const label = document.getElementById(labelId);
        if (!input || !label) return;

        input.addEventListener('change', function () {
            if (this.files && this.files.length > 0) {
                label.textContent = this.files[0].name;

                if (isPhoto) {
                    const preview = document.getElementById('photoPreview');
                    if (preview) {
                        const reader = new FileReader();
                        reader.onload = function (e) {
                            preview.src = e.target.result;
                            preview.style.display = 'block';
                        };
                        reader.readAsDataURL(this.files[0]);
                    }
                }
            } else {
                const defaultLabels = {
                    photoFile: 'Click to add photo',
                    aadhaarFile: 'Upload Aadhaar',
                    marksheetFile: 'Upload Marksheet'
                };
                label.textContent = defaultLabels[fileId] || 'Upload file';
                if (isPhoto) {
                    const preview = document.getElementById('photoPreview');
                    if (preview) preview.style.display = 'none';
                }
            }
        });

        // Reset on click so user can re-select the same file
        input.addEventListener('click', function () {
            this.value = '';
        });
    }

    setupFileInput('photoFile', 'photoLabel', true);
    setupFileInput('aadhaarFile', 'aadhaarLabel', false);
    setupFileInput('marksheetFile', 'marksheetLabel', false);

    // ============================================================
    // 6. COUNTER ANIMATION (on scroll)
    // ============================================================
    const counters = document.querySelectorAll('.counter-num');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.target, 10);
                    let count = 0;
                    const step = Math.max(1, Math.floor(target / 100));
                    const interval = setInterval(function () {
                        count += step;
                        if (count >= target) {
                            counter.innerText = target;
                            clearInterval(interval);
                        } else {
                            counter.innerText = count;
                        }
                    }, 16);
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function (c) {
            counterObserver.observe(c);
        });
    }

    // ============================================================
    // 7. TYPEWRITER EFFECT (on hero)
    // ============================================================
    const typewriterEl = document.getElementById('typewriter');
    if (typewriterEl) {
        const words = ['Learn. Build. Grow.', 'Practical Computer Education', 'Career Success Starts Here'];
        let wordIndex = 0,
            charIndex = 0,
            isDeleting = false;

        function type() {
            const current = words[wordIndex];
            if (isDeleting) {
                typewriterEl.textContent = current.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriterEl.textContent = current.substring(0, charIndex + 1);
                charIndex++;
            }

            if (!isDeleting && charIndex === current.length) {
                setTimeout(function () { isDeleting = true; }, 1500);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }
            setTimeout(type, isDeleting ? 50 : 100);
        }
        type();
    }

    // ============================================================
    // 8. ADMISSION FORM SUBMISSION (with file uploads)
    // ============================================================
    const form = document.getElementById('admissionForm');
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const photo = document.getElementById('photoFile').files[0];
            const aadhaar = document.getElementById('aadhaarFile').files[0];
            const marksheet = document.getElementById('marksheetFile').files[0];

            if (!photo || !aadhaar || !marksheet) {
                alert('Please upload all three documents (Photo, Aadhaar, Marksheet).');
                return;
            }

            const submitText = document.getElementById('submitText');
            const submitLoader = document.getElementById('submitLoader');
            const submitBtn = document.getElementById('submitBtn');

            submitText.classList.add('hidden');
            submitLoader.classList.remove('hidden');
            submitBtn.disabled = true;

            try {
                const formData = new FormData(form);
                const res = await fetch('/api/admissions', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                if (res.ok) {
                    alert('✅ ' + (data.message || 'Application submitted!'));
                    form.reset();
                    document.getElementById('photoLabel').textContent = 'Click to add photo';
                    document.getElementById('aadhaarLabel').textContent = 'Upload Aadhaar';
                    document.getElementById('marksheetLabel').textContent = 'Upload Marksheet';
                    document.getElementById('photoPreview').style.display = 'none';
                } else {
                    alert('❌ ' + (data.error || 'Submission failed.'));
                }
            } catch (err) {
                alert('❌ Network error. Please check your connection.');
            } finally {
                submitText.classList.remove('hidden');
                submitLoader.classList.add('hidden');
                submitBtn.disabled = false;
            }
        });
    }

    // ============================================================
    // 9. ADDITIONAL UTILITIES (optional)
    // ============================================================

    // Example: smooth scroll for anchor links (if any)
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

}); // end DOMContentLoaded