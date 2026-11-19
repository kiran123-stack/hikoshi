// ── Responsive Hamburger Menu Toggle ──
(function() {
  var btn = document.querySelector('.nav-hamburger');
  var drawer = document.getElementById('mobile-nav-drawer');

  if (btn && drawer) {
    function closeMenu() {
      btn.setAttribute('aria-expanded', 'false');
      btn.classList.remove('is-active');
      drawer.classList.remove('is-open');
    }

    function toggleMenu(e) {
      if (e) e.stopPropagation();
      var isOpen = drawer.classList.contains('is-open');
      btn.setAttribute('aria-expanded', String(!isOpen));
      btn.classList.toggle('is-active', !isOpen);
      drawer.classList.toggle('is-open', !isOpen);
    }

    btn.addEventListener('click', toggleMenu);

    // Auto-close on any link click inside drawer
    drawer.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', closeMenu);
    });

    // Auto-close when clicking outside
    document.addEventListener('click', function(e) {
      if (drawer.classList.contains('is-open') && !btn.contains(e.target) && !drawer.contains(e.target)) {
        closeMenu();
      }
    });

    // Auto-close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeMenu();
        btn.focus();
      }
    });

    // Auto-close when resizing back to desktop
    window.addEventListener('resize', function() {
      if (window.innerWidth > 920 && drawer.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }
})();

// ── Smooth Scrolling Navigation ──
(function() {
  var mainSections = document.querySelectorAll('[data-views*="home"]');
  var subPages = document.querySelectorAll('#canada, #new-zealand, #australia');

  function showMainPage() {
    mainSections.forEach(function(s) { s.style.display = ''; });
    subPages.forEach(function(s) { s.style.display = 'none'; });
  }

  function handleNav(targetId, smooth) {
    var behavior = smooth ? 'smooth' : 'auto';

    if (!targetId || targetId === 'home') {
      showMainPage();
      window.scrollTo({ top: 0, behavior: behavior });
      if (history.replaceState) history.replaceState(null, '', '#home');
      return;
    }

    if (targetId === 'canada' || targetId === 'new-zealand' || targetId === 'australia') {
      var subPage = document.getElementById(targetId);
      mainSections.forEach(function(s) { s.style.display = 'none'; });
      if (subPage) subPage.style.display = '';
      window.scrollTo({ top: 0, behavior: behavior });
      if (history.replaceState) history.replaceState(null, '', '#' + targetId);
      return;
    }

    var targetEl = document.getElementById(targetId);
    if (targetEl) {
      showMainPage();
      targetEl.scrollIntoView({ behavior: behavior });
      if (history.replaceState) history.replaceState(null, '', '#' + targetId);
    }
  }

  document.addEventListener('click', function(e) {
    var a = e.target.closest('a');
    if (!a) return;

    var href = a.getAttribute('href') || '';
    if (!href.startsWith('#')) return;

    var targetId = href.slice(1);
    if (!targetId) return;

    e.preventDefault();
    handleNav(targetId, true);
  });

  // Handle URL hash on page load
  var initialHash = (location.hash || '').replace(/^#/, '');
  if (initialHash) {
    handleNav(initialHash, false);
  } else {
    showMainPage();
  }
})();

// ── AJAX Form Submission Handler (Stays on page & sends data to email) ──
(function() {
    var form = document.getElementById('enquiry-form');
    var successMsg = document.getElementById('form-success-message');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevents page reload or redirect

            var submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;

            var formData = new FormData(form);

            fetch("https://formsubmit.co/ajax/kiranpar321@gmail.com", {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Replace entire form panel content with a full success state
                    var formPanel = document.querySelector('.enquiry-form-panel');
                    if (formPanel) {
                        formPanel.innerHTML = [
                            '<div class="form-submitted-state">',
                            '  <div class="submitted-icon">&#10003;</div>',
                            '  <h3>Your enquiry has been submitted!</h3>',
                            '  <p>Thank you for reaching out. Our team will review your query and get back to you as soon as possible  typically within 24–48 hours.</p>',
                            '  <p class="submitted-note">No uploads or payments are needed. We\'ll be in touch via the email address you provided.</p>',
                            '</div>'
                        ].join('');
                    } else {
                        // Fallback: just show success banner
                        form.reset();
                        if (successMsg) successMsg.style.display = 'block';
                    }
                } else {
                    if (submitBtn) submitBtn.disabled = false;
                    alert('Something went wrong. Please try again.');
                }
            })
            .catch(function(error) {
                if (submitBtn) submitBtn.disabled = false;
                alert('Network error. Please check your connection.');
            })
            .finally(() => {
                if (submitBtn) submitBtn.disabled = false;
            });
        });
    }
})();

// ── Update Footer Copyright Year ──
(function() {
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
