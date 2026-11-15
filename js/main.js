/* ==========================================================================
   YEON AND PIL — main.js
   Plain JavaScript, no libraries. Each feature is its own small function.

   1. initHeader      header gets a background after scrolling
   2. initMobileNav   hamburger menu
   3. initActiveNav   highlights the nav link of the section on screen
   4. initReveal      fade-in on scroll
   5. initVideos      click-to-load YouTube players
   6. initCopyButtons "Copy" buttons in the press kit bios
   7. initYear        footer year
   ========================================================================== */

(function () {
  "use strict";

  // Lets the CSS know JavaScript works (see ".js .reveal" in style.css)
  document.documentElement.classList.add("js");

  /* ------------------------------------------------------------------
     1. Header background after scrolling
     ------------------------------------------------------------------ */
  function initHeader() {
    const header = document.querySelector("[data-header]");
    if (!header) return;

    const update = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ------------------------------------------------------------------
     2. Mobile navigation (hamburger)
     ------------------------------------------------------------------ */
  function initMobileNav() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const nav = document.querySelector("[data-nav]");
    if (!toggle || !nav) return;

    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    };

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Close the menu after choosing a link, or pressing Escape
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }

  /* ------------------------------------------------------------------
     3. Highlight the nav link for the section currently on screen
     ------------------------------------------------------------------ */
  function initActiveNav() {
    const links = document.querySelectorAll("[data-nav] a");
    if (!links.length || !("IntersectionObserver" in window)) return;

    const linkById = new Map();
    links.forEach((link) => linkById.set(link.getAttribute("href").slice(1), link));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) => link.classList.remove("is-active"));
          const active = linkById.get(entry.target.id);
          if (active) active.classList.add("is-active");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }   // a thin band in the middle of the screen
    );

    linkById.forEach((_, id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    // The hero has no nav link; observing it clears the highlight at the top of the page
    const hero = document.getElementById("top");
    if (hero) observer.observe(hero);
  }

  /* ------------------------------------------------------------------
     4. Fade-in on scroll
     ------------------------------------------------------------------ */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    // Old browsers: just show everything
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);        // animate only once
        });
      },
      { threshold: 0.12 }
    );
    items.forEach((item) => observer.observe(item));
  }

  /* ------------------------------------------------------------------
     5. Click-to-load YouTube videos
     The button carries data-video-id. On click we replace it with an
     iframe from youtube-nocookie.com (no tracking until the click).
     ------------------------------------------------------------------ */
  function initVideos() {
    document.querySelectorAll("[data-video-id]").forEach((button) => {
      // If the YouTube thumbnail can't load, drop the broken-image icon
      const poster = button.querySelector("img");
      if (poster) poster.addEventListener("error", () => poster.remove());

      button.addEventListener("click", () => {
        const id = button.dataset.videoId;

        const frame = document.createElement("iframe");
        frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
        frame.title = button.getAttribute("aria-label") || "YouTube video";
        frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
        frame.allowFullscreen = true;

        button.replaceChildren(frame);
        button.disabled = true;             // already playing
        button.classList.add("is-playing");
      });
    });
  }

  /* ------------------------------------------------------------------
     6. Copy buttons
     <button data-copy-target="bio-short"> copies the text of #bio-short
     ------------------------------------------------------------------ */
  function initCopyButtons() {
    document.querySelectorAll("[data-copy-target]").forEach((button) => {
      const label = button.querySelector("span");
      const originalText = label.textContent;

      button.addEventListener("click", async () => {
        const source = document.getElementById(button.dataset.copyTarget);
        if (!source) return;

        const copied = await copyText(source.textContent.trim());

        label.textContent = copied ? "Copied" : "Press Ctrl+C";
        button.classList.toggle("is-copied", copied);
        setTimeout(() => {
          label.textContent = originalText;
          button.classList.remove("is-copied");
        }, 2000);
      });
    });
  }

  // Modern clipboard API first, older fallback second. Returns true/false.
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { /* ignore */ }
      area.remove();
      return ok;
    }
  }

  /* ------------------------------------------------------------------
     7. Footer year
     ------------------------------------------------------------------ */
  function initYear() {
    const el = document.querySelector("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ------------------------------------------------------------------ */
  initHeader();
  initMobileNav();
  initActiveNav();
  initReveal();
  initVideos();
  initCopyButtons();
  initYear();
})();
