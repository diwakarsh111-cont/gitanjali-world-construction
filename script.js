/* ==========================================================================
   M/S GITANJALI WORLD CONSTRUCTION — SCRIPT
   Vanilla JS only. No dependencies.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------------------------------
     1. STICKY NAVBAR — shadow / background on scroll
  --------------------------------------------------------- */
  const navbar = document.getElementById("navbar");

  const handleNavbarScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };
  handleNavbarScroll();
  window.addEventListener("scroll", handleNavbarScroll, { passive: true });


  /* ---------------------------------------------------------
     2. MOBILE MENU TOGGLE
  --------------------------------------------------------- */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  const closeMobileMenu = () => {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  const toggleMobileMenu = () => {
    const isOpen = mobileMenu.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  hamburger.addEventListener("click", toggleMobileMenu);

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });


  /* ---------------------------------------------------------
     3. SMOOTH SCROLL for all in-page nav links
     (CSS scroll-behavior handles most browsers; this adds
     a controlled fallback + accounts for sticky navbar offset)
  --------------------------------------------------------- */
  const allNavLinks = document.querySelectorAll('a[href^="#"]');

  allNavLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId.length <= 1) return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPosition =
        targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight + 1;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  });


  /* ---------------------------------------------------------
     4. ACTIVE NAV LINK ON SCROLL (scrollspy)
  --------------------------------------------------------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinkEls = document.querySelectorAll(".nav-link[data-nav]");

  const setActiveLink = () => {
    let currentId = "home";
    const scrollPos = window.scrollY + navbar.offsetHeight + 60;

    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinkEls.forEach((link) => {
      const isMatch = link.getAttribute("href") === `#${currentId}`;
      link.classList.toggle("active", isMatch);
    });
  };
  setActiveLink();
  window.addEventListener("scroll", setActiveLink, { passive: true });


  /* ---------------------------------------------------------
     5. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // slight stagger for elements revealed together
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => entry.target.classList.add("in-view"), delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  revealEls.forEach((el, index) => {
    // small stagger within the same section for a polished cascade
    el.dataset.delay = (index % 4) * 90;
    revealObserver.observe(el);
  });


  /* ---------------------------------------------------------
     6. ANIMATED STAT COUNTERS
  --------------------------------------------------------- */
  const statEls = document.querySelectorAll(".stat-num[data-count]");

  const animateCount = (el) => {
    const target = parseInt(el.getAttribute("data-count"), 10) || 0;
    const suffix = el.getAttribute("data-count-suffix") || (target === 98 ? "%" : "+");
    const duration = 1600;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value + (progress >= 1 ? suffix : "");
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target + suffix;
      }
    };
    requestAnimationFrame(tick);
  };

  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  statEls.forEach((el) => statObserver.observe(el));


  /* ---------------------------------------------------------
     7. BACK TO TOP BUTTON
  --------------------------------------------------------- */
  const backToTop = document.getElementById("backToTop");

  const handleBackToTop = () => {
    backToTop.classList.toggle("show", window.scrollY > 600);
  };
  handleBackToTop();
  window.addEventListener("scroll", handleBackToTop, { passive: true });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });


  /* ---------------------------------------------------------
     8. SCROLL PROGRESS BAR
  --------------------------------------------------------- */
  const scrollProgress = document.getElementById("scrollProgress");

  const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + "%";
  };
  updateScrollProgress();
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);


  /* ---------------------------------------------------------
     9. CONTACT FORM — client-side validation + fake submit
  --------------------------------------------------------- */
  const contactForm = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");
  const submitBtn = document.getElementById("submitBtn");

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isValidPhone = (value) => /^[0-9+\-\s()]{7,15}$/.test(value);

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameField = document.getElementById("name");
    const phoneField = document.getElementById("phone");
    const emailField = document.getElementById("email");
    const messageField = document.getElementById("message");

    const fields = [nameField, phoneField, emailField, messageField];
    fields.forEach((f) => f.closest(".form-field").classList.remove("error"));

    let isValid = true;
    let errorMessage = "";

    if (nameField.value.trim().length < 2) {
      isValid = false;
      nameField.closest(".form-field").classList.add("error");
      errorMessage = "Please enter your full name.";
    }
    if (!isValidPhone(phoneField.value.trim())) {
      isValid = false;
      phoneField.closest(".form-field").classList.add("error");
      errorMessage = errorMessage || "Please enter a valid phone number.";
    }
    if (!isValidEmail(emailField.value.trim())) {
      isValid = false;
      emailField.closest(".form-field").classList.add("error");
      errorMessage = errorMessage || "Please enter a valid email address.";
    }
    if (messageField.value.trim().length < 10) {
      isValid = false;
      messageField.closest(".form-field").classList.add("error");
      errorMessage = errorMessage || "Please tell us a little more about your project (10+ characters).";
    }

    if (!isValid) {
      formNote.textContent = errorMessage;
      formNote.classList.add("error");
      return;
    }

    // Simulate a network request — no backend yet.
    formNote.classList.remove("error");
    submitBtn.disabled = true;
    submitBtn.querySelector(".btn-text").textContent = "Sending...";

    setTimeout(() => {
      submitBtn.querySelector(".btn-text").textContent = "Send Message";
      submitBtn.disabled = false;
      formNote.textContent = `Thank you, ${nameField.value.trim().split(" ")[0]}! Your message has been received — our team will contact you shortly.`;
      contactForm.reset();
    }, 900);
  });


  /* ---------------------------------------------------------
     10. FOOTER — current year
  --------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});