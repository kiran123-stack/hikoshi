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

// ── AJAX Form Submission Handler (Sends enquiry to info@hikkoshiglobal.com) ──
(function() {
    var form = document.getElementById('enquiry-form');
    var successMsg = document.getElementById('form-success-message');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            var submitBtn = form.querySelector('button[type="submit"]');
            var originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Sending...</span>';
            }

            var formData = new FormData(form);

            fetch("https://formsubmit.co/ajax/info@hikkoshiglobal.com", {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(function(response) { return response.json(); })
            .then(function(data) {
                if (data.success || data.message || data.status === 'success') {
                    var formPanel = document.querySelector('.enquiry-form-panel');
                    if (formPanel) {
                        formPanel.innerHTML = [
                            '<div class="form-submitted-state">',
                            '  <div class="submitted-icon">&#10003;</div>',
                            '  <h3>Your enquiry has been submitted!</h3>',
                            '  <p>Thank you for reaching out. Our team will review your enquiry and get back to you shortly at the email address provided.</p>',
                            '  <p class="submitted-note">You can also reach us directly at info@hikkoshiglobal.com or on WhatsApp.</p>',
                            '</div>'
                        ].join('');
                    } else if (successMsg) {
                        form.reset();
                        successMsg.style.display = 'flex';
                    }
                } else {
                    // Fallback to native form submission
                    form.submit();
                }
            })
            .catch(function(error) {
                // If fetch fails (CORS or network), submit natively so enquiry is never lost
                form.submit();
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
