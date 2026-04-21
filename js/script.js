document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const navToggle = document.querySelector(".nav-toggle");

  // ─── Build mobile nav drawer from both left + right nav-links ───
  if (navToggle) {

    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "mobile-nav-overlay";
    body.appendChild(overlay);

    // Create drawer
    const drawer = document.createElement("nav");
    drawer.className = "mobile-nav-drawer";
    drawer.setAttribute("aria-label", "Mobile navigation");

    // Collect all nav links from both nav panels (left and right)
    const allNavLinks = document.querySelectorAll(".nav-links");
    const addedHrefs = new Set();

    allNavLinks.forEach((panel) => {
      panel.querySelectorAll("a").forEach((link) => {
        const href = link.getAttribute("href");
        // Skip duplicates and the dealership button-style link (we'll add it specially)
        if (!addedHrefs.has(href) && !link.style.backgroundColor) {
          const clone = link.cloneNode(true);
          // Strip any inline background styles so it looks clean
          clone.removeAttribute("style");
          if (link.classList.contains("nav-active")) {
            clone.classList.add("nav-active");
          }
          drawer.appendChild(clone);
          addedHrefs.add(href);
        }
      });
    });

    // Add the dealership CTA as a styled button at the bottom
    const dealershipLink = document.querySelector('.nav-links a[href="dealership.html"]');
    if (dealershipLink && !addedHrefs.has("dealership.html")) {
      const cta = document.createElement("a");
      cta.href = "dealership.html";
      cta.textContent = "Get Dealership";
      cta.className = "mobile-nav-cta";
      drawer.appendChild(cta);
    } else {
      // Upgrade existing dealership link to CTA style
      drawer.querySelectorAll('a[href="dealership.html"]').forEach(a => {
        a.classList.add("mobile-nav-cta");
      });
    }

    // Insert drawer right after navbar
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      navbar.after(drawer);
    } else {
      body.insertBefore(drawer, body.firstChild);
    }

    // Helper: set drawer/overlay top to actual navbar bottom
    const setDrawerTop = () => {
      const navbar = document.querySelector(".navbar");
      if (!navbar) return;
      const navBottom = navbar.getBoundingClientRect().bottom;
      drawer.style.top = navBottom + "px";
      overlay.style.top = navBottom + "px";
    };

    // Toggle function
    const openMenu = () => {
      setDrawerTop();
      drawer.classList.add("is-open");
      overlay.classList.add("is-open");
      navToggle.setAttribute("aria-expanded", "true");
      body.style.overflow = "hidden";
    };

    const closeMenu = () => {
      drawer.classList.remove("is-open");
      overlay.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      body.style.overflow = "";
    };

    navToggle.addEventListener("click", () => {
      const isOpen = drawer.classList.contains("is-open");
      isOpen ? closeMenu() : openMenu();
    });

    // Close on overlay click
    overlay.addEventListener("click", closeMenu);

    // Close on link click
    drawer.addEventListener("click", (e) => {
      if (e.target.tagName === "A") closeMenu();
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    // Close drawer if window resizes past mobile breakpoint
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  // ─── Lightbox ───────────────────────────────────────────────────
  const lightbox = document.querySelector(".lightbox");
  const lightboxImage = lightbox ? lightbox.querySelector("img") : null;
  const lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;

  if (lightbox && lightboxImage) {
    document.body.addEventListener("click", (event) => {
      const trigger = event.target.closest(".gallery-item, .gallery-tile");
      if (!trigger) return;
      const imgEl = trigger.querySelector("img");
      if (!imgEl) return;
      const fullSrc = imgEl.getAttribute("data-full") || imgEl.src;
      lightboxImage.src = fullSrc;
      lightbox.classList.add("is-visible");
    });

    const closeLightbox = () => {
      lightbox.classList.remove("is-visible");
      lightboxImage.src = "";
    };

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox || event.target === lightboxClose) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("is-visible")) {
        closeLightbox();
      }
    });
  }

  // ─── Hide mobile CTA while typing ───────────────────────────────
  if (body.classList.contains("has-mobile-cta")) {
    const isFormControl = (el) => {
      if (!el) return false;
      return el.matches("input, textarea, select") || el.isContentEditable === true;
    };

    document.addEventListener("focusin", (event) => {
      if (isFormControl(event.target)) body.classList.add("mobile-cta-hidden");
    });

    document.addEventListener("focusout", () => {
      body.classList.remove("mobile-cta-hidden");
    });
  }

  // ─── Scroll-triggered fade-up (IntersectionObserver) ────────────
  const fadeEls = document.querySelectorAll(".fade-up");
  if (fadeEls.length > 0) {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    fadeEls.forEach((el) => fadeObserver.observe(el));
  }

  // ─── Counter animation for stats ────────────────────────────────
  const counters = document.querySelectorAll("[data-counter]");
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseFloat(el.dataset.counter);
          const suffix = el.dataset.suffix || "";
          const duration = 1800;
          const steps = 60;
          let current = 0;
          const increment = target / steps;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = Math.round(current) + suffix;
          }, duration / steps);
          counterObserver.unobserve(el);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => counterObserver.observe(el));
  }
});
