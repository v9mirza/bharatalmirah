document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const lightbox = document.querySelector(".lightbox");
  const lightboxImage = lightbox ? lightbox.querySelector("img") : null;
  const lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      body.classList.toggle("nav-open");
    });

    navLinks.addEventListener("click", (event) => {
      const target = event.target;
      if (target.tagName === "A") {
        body.classList.remove("nav-open");
      }
    });
  }

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
});

