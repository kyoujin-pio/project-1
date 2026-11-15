/* ==========================================================================
   PIOLO — PERSONAL PORTFOLIO
   --------------------------------------------------------------------------
   Vanilla JavaScript only. The file is split into small, independent
   modules so each feature is easy to find and update.

   1. Theme (light / dark)
   2. Header scroll state
   3. Mobile navigation
   4. Active section + back-to-top
   5. Scroll reveal
   6. Footer year
   7. Projects (filter + dialog)  [in the next section of this file]
   8. Contact form validation    [in the next section of this file]
   ========================================================================== */
"use strict";

/* ==========================================================================
   1. THEME (LIGHT / DARK)
   ========================================================================== */
(function initTheme() {
  var root = document.documentElement;
  var toggle = document.querySelector("[data-theme-toggle]");
  var metaColors = document.querySelectorAll('meta[name="theme-color"]');
  var storageKey = "portfolio-theme";

  if (!toggle) return;

  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function applyTheme(theme, persist) {
    var isDark = theme === "dark";
    root.setAttribute("data-theme", isDark ? "dark" : "light");
    toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    toggle.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");

    metaColors.forEach(function (meta) {
      meta.setAttribute("content", isDark ? "#111214" : "#FFFFFF");
    });

    if (persist) {
      try {
        localStorage.setItem(storageKey, isDark ? "dark" : "light");
      } catch (error) {
        /* Private browsing may block storage; theme still works for this visit. */
      }
    }
  }

  applyTheme(currentTheme(), false);

  toggle.addEventListener("click", function () {
    applyTheme(currentTheme() === "dark" ? "light" : "dark", true);
  });
})();

/* ==========================================================================
   2. HEADER SCROLL STATE
   ========================================================================== */
(function initHeaderState() {
  var header = document.querySelector("[data-header]");
  if (!header) return;

  function updateHeader() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();
})();

/* ==========================================================================
   3. MOBILE NAVIGATION
   ========================================================================== */
(function initMobileMenu() {
  var header = document.querySelector("[data-header]");
  var menuToggle = document.querySelector("[data-menu-toggle]");
  var mobileMenu = document.querySelector("[data-mobile-menu]");
  var desktopQuery = window.matchMedia("(min-width: 981px)");
  var isOpen = false;

  if (!header || !menuToggle || !mobileMenu) return;

  function isFocusable(item) {
    return (
      item.getClientRects().length > 0 &&
      window.getComputedStyle(item).visibility !== "hidden"
    );
  }

  function focusableItems() {
    return Array.prototype.slice
      .call(header.querySelectorAll("a[href], button:not([disabled])"))
      .filter(isFocusable);
  }

  function setMenu(open, restoreFocus) {
    isOpen = open;

    menuToggle.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");

    mobileMenu.classList.toggle("is-open", open);
    mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
    if ("inert" in mobileMenu) mobileMenu.inert = !open;

    header.classList.toggle("menu-active", open);
    document.body.classList.toggle("menu-open", open);

    if (open) {
      // Force a style flush so the newly opened panel is visible before focus moves.
      void mobileMenu.offsetWidth;
      var firstLink = mobileMenu.querySelector("a[href]");
      if (firstLink) firstLink.focus({ preventScroll: true });
    } else if (restoreFocus) {
      menuToggle.focus({ preventScroll: true });
    }
  }

  menuToggle.addEventListener("click", function () {
    setMenu(!isOpen, !isOpen ? false : true);
  });

  // Close after tapping a link, but let the browser follow the anchor.
  header.addEventListener("click", function (event) {
    var link = event.target.closest("a[href]");
    if (!isOpen || !link) return;
    setMenu(false, false);
  });

  document.addEventListener("keydown", function (event) {
    if (!isOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      setMenu(false, true);
      return;
    }

    if (event.key !== "Tab") return;

    var items = focusableItems();
    if (!items.length) return;

    var first = items[0];
    var last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  function handleDesktopChange(event) {
    if (event.matches && isOpen) setMenu(false, false);
  }

  if (typeof desktopQuery.addEventListener === "function") {
    desktopQuery.addEventListener("change", handleDesktopChange);
  } else if (typeof desktopQuery.addListener === "function") {
    desktopQuery.addListener(handleDesktopChange);
  }
})();

/* ==========================================================================
   4. ACTIVE SECTION + BACK-TO-TOP
   ========================================================================== */
(function initScrollUI() {
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
  var sectionIds = ["home", "about", "skills", "projects", "education", "contact"];
  var sections = sectionIds
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);
  var header = document.querySelector("[data-header]");
  var backToTop = document.querySelector("[data-back-to-top]");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var activeSection = "";
  var backToTopVisible = false;
  var ticking = false;

  function setActiveSection(sectionId) {
    if (sectionId === activeSection) return;
    activeSection = sectionId;

    navLinks.forEach(function (link) {
      var isActive = link.getAttribute("data-nav") === sectionId;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function updateActiveSection() {
    if (!sections.length) return;

    var headerHeight = header ? header.offsetHeight : 0;
    var probeLine = headerHeight + Math.min(window.innerHeight * 0.32, 240);
    var current = sections[0].id;

    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= probeLine) {
        current = section.id;
      }
    });

    var pageBottom = window.scrollY + window.innerHeight;
    if (pageBottom >= document.documentElement.scrollHeight - 4) {
      current = "contact";
    }

    setActiveSection(current);
  }

  function updateBackToTop() {
    var shouldShow = window.scrollY > 600;
    if (shouldShow === backToTopVisible || !backToTop) return;

    backToTopVisible = shouldShow;
    backToTop.classList.toggle("is-visible", shouldShow);
    backToTop.setAttribute("aria-hidden", shouldShow ? "false" : "true");
    backToTop.tabIndex = shouldShow ? 0 : -1;
  }

  function update() {
    updateActiveSection();
    updateBackToTop();
    ticking = false;
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  update();

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion.matches ? "auto" : "smooth"
      });
    });
  }
})();

/* ==========================================================================
   5. SCROLL REVEAL
   ========================================================================== */
(function initScrollReveal() {
  var elements = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function revealAll() {
    elements.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  if (!elements.length) return;

  if (!("IntersectionObserver" in window) || reducedMotion.matches) {
    revealAll();
    return;
  }

  var observer = new IntersectionObserver(
    function (entries, instance) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        instance.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  elements.forEach(function (el) {
    observer.observe(el);
  });
})();

/* ==========================================================================
   6. FOOTER YEAR
   ========================================================================== */
(function initFooterYear() {
  var year = document.getElementById("current-year");
  if (year) year.textContent = new Date().getFullYear();
})();

/* ==========================================================================
   6b. PRINT / SAVE AS PDF
   ========================================================================== */
(function initPrintButton() {
  var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-print]"));
  if (!buttons.length) return;

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      window.print();
    });
  });
})();
/* ==========================================================================
   7. PROJECTS — FILTERING + ACCESSIBLE DETAIL DIALOG
   ==========================================================================
   When you replace a sample project, update:
   - its card in index.html
   - its matching entry in the PROJECTS object below
   - the repository / live URLs (placeholders point to github.com/yourusername)
   ========================================================================== */
(function initProjects() {
  var PROJECTS = {
    smartband: {
      title: "SmartBand",
      category: "Academic Project",
      description:
        "SmartBand is an academic project concept for a progressive web app that would help a community band stay organized. The idea brings announcements, rehearsal schedules, and member coordination into one calm, mobile-first space.",
      problem:
        "Band updates and rehearsal details were scattered across group chats and memory, so members could miss schedule changes and announcements.",
      objectives: [
        "Centralize announcements and rehearsal schedules for a community band.",
        "Give members a mobile-first way to check updates without digging through group chats.",
        "Practice building a progressive web app with plain HTML, CSS, and JavaScript."
      ],
      contribution:
        "Planned the content structure, designed the mobile-first layout, and built the interface prototype with HTML, CSS, and JavaScript. The project is still a concept, so the features and content are being tested and refined.",
      output:
        "A clickable interface concept with a member dashboard, rehearsal schedule, and announcement views.",
      tech: ["HTML5", "CSS3", "JavaScript", "PWA"],
      highlights: [
        "Mobile-first dashboard for schedules and announcements",
        "Progressive web app approach for app-like use in a browser",
        "Designed around the needs of a community band",
        "Concept stage — details will evolve as the project develops"
      ],
      screenshots: [
        {
          src: "assets/images/projects/smartband.svg",
          alt: "SmartBand dashboard concept with schedules, announcements, and member cards",
          caption: "Member dashboard"
        },
        {
          src: "assets/images/projects/smartband-schedule.svg",
          alt: "SmartBand schedule screen concept with rehearsal dates and a mobile announcement view",
          caption: "Schedule and announcements"
        }
      ],
      status:
        "Academic concept in progress. Repository and live demo links are placeholders until the project is published.",
      live: "",
      repo: "https://github.com/yourusername/smartband"
    },
    portfolio: {
      title: "Personal Portfolio",
      category: "Personal Project",
      description:
        "A fully responsive personal portfolio designed and developed from scratch with semantic HTML5, modern CSS3, and vanilla JavaScript. It includes accessible navigation, project filtering, a light/dark theme, scroll reveals, and client-side form validation.",
      problem:
        "A résumé alone could not show how I design and build, so I needed one accessible place to present my profile, skills, and project work together.",
      objectives: [
        "Present my profile, skills, and projects in one clear, accessible single page.",
        "Practice semantic HTML, modern CSS, and vanilla JavaScript without frameworks.",
        "Meet responsive, keyboard, and reduced-motion requirements."
      ],
      contribution:
        "Designed and built the entire site: layout, visual system, responsive behavior, interactions, and content structure. Wrote the HTML, CSS, and JavaScript, then tested the pages across desktop and mobile screen sizes.",
      output:
        "A responsive portfolio website with project filtering, an accessible project-detail dialog, and a contact form that validates locally.",
      tech: ["HTML5", "CSS3", "JavaScript", "Accessibility"],
      highlights: [
        "Mobile-first responsive layout with no frameworks",
        "Keyboard-friendly navigation and project filtering",
        "Light and dark themes with saved preferences",
        "Reduced-motion support and semantic markup"
      ],
      screenshots: [
        {
          src: "assets/images/projects/portfolio.svg",
          alt: "Portfolio homepage concept with a large name, navigation, and introduction",
          caption: "Homepage"
        },
        {
          src: "assets/images/projects/portfolio-about.svg",
          alt: "Portfolio about and skills page concept with profile details and skill categories",
          caption: "About and skills view"
        }
      ],
      status:
        "Built and tested as a static site. Add the deployed URL and repository link when they are ready.",
      live: "",
      repo: "https://github.com/yourusername/portfolio"
    },
    studyflow: {
      title: "StudyFlow",
      category: "Personal Project",
      description:
        "StudyFlow is a lightweight study planner concept for keeping coursework, deadlines, and focus sessions in one calm dashboard. The project explores how small, well-organized interfaces can reduce the friction of planning a busy semester.",
      problem:
        "Study tasks, deadlines, and focus time lived in separate notes and apps, which made it hard to see what needed attention each week.",
      objectives: [
        "Design a calm study planner that keeps tasks, deadlines, and focus sessions together.",
        "Practice local-first data storage and simple state handling in vanilla JavaScript.",
        "Explore a minimal interface that stays usable on small screens."
      ],
      contribution:
        "Defined the task structure, designed the dashboard, and prototyped the column layout and focus timer in HTML, CSS, and JavaScript. The project is being refined as a personal experiment.",
      output:
        "An interactive planner concept with a task board, deadline labels, and a focus-session view.",
      tech: ["HTML5", "CSS3", "JavaScript", "localStorage"],
      highlights: [
        "Simple task board organized around study priorities",
        "Local-first storage concept for quick, private use",
        "Small interface with a clear visual hierarchy",
        "Ongoing personal experiment"
      ],
      screenshots: [
        {
          src: "assets/images/projects/studyflow.svg",
          alt: "StudyFlow task board concept with columns of study tasks and deadlines",
          caption: "Task board"
        },
        {
          src: "assets/images/projects/studyflow-focus.svg",
          alt: "StudyFlow focus session screen concept with a timer and today's study plan",
          caption: "Focus session"
        }
      ],
      status:
        "Personal concept in progress. Repository and live demo links are placeholders until the project is published.",
      live: "",
      repo: "https://github.com/yourusername/studyflow"
    },
    shelfwise: {
      title: "Shelfwise",
      category: "Academic Project",
      description:
        "A console-based library inventory exercise built to practice object-oriented programming, relational data, and CRUD operations. The project focuses on keeping book records, borrowers, and availability organized with a clear data model.",
      objectives: [
        "Practice object-oriented design with books, borrowers, and loan records.",
        "Model library inventory in MySQL and implement create, read, update, and delete operations.",
        "Keep records consistent with clear validation and relationships."
      ],
      contribution:
        "Designed the data model and table structure, wrote the Java classes for books and loans, and implemented the CRUD and query operations for the coursework exercise.",
      output:
        "A console-based inventory program backed by MySQL that can add, search, update, and remove book and borrower records.",
      tech: ["Java", "MySQL", "OOP", "CRUD"],
      highlights: [
        "Object-oriented structure for books, borrowers, and loans",
        "MySQL tables and queries for inventory data",
        "Create, read, update, and delete operations",
        "Coursework exercise in clean data modeling"
      ],
      screenshots: [
        {
          src: "assets/images/projects/shelfwise.svg",
          alt: "Shelfwise library inventory table concept with book records and availability",
          caption: "Inventory table"
        },
        {
          src: "assets/images/projects/shelfwise-record.svg",
          alt: "Shelfwise book record and loan details concept with a simple data relationship diagram",
          caption: "Book record and data model"
        }
      ],
      status:
        "Academic coursework project. Repository link is a placeholder until the code is published.",
      live: "",
      repo: "https://github.com/yourusername/shelfwise"
    }
  };

  var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
  var cards = Array.prototype.slice.call(
    document.querySelectorAll("#projects-grid [data-categories]")
  );
  var countLabel = document.getElementById("projects-count");
  var dialog = document.getElementById("project-dialog");
  var dialogClose = dialog ? dialog.querySelector("[data-dialog-close]") : null;
  var dialogImage = document.getElementById("project-dialog-image");
  var dialogCategory = document.getElementById("project-dialog-category");
  var dialogTitle = document.getElementById("project-dialog-title");
  var dialogDescription = document.getElementById("project-dialog-description");
  var dialogTech = document.getElementById("project-dialog-tech");
  var dialogProblem = document.getElementById("project-dialog-problem");
  var dialogObjectives = document.getElementById("project-dialog-objectives");
  var dialogContribution = document.getElementById("project-dialog-contribution");
  var dialogOutput = document.getElementById("project-dialog-output");
  var dialogHighlights = document.getElementById("project-dialog-highlights");
  var dialogGallery = document.getElementById("project-dialog-gallery");
  var dialogShotCount = document.getElementById("project-dialog-shot-count");
  var dialogStatus = document.getElementById("project-dialog-status");
  var dialogLive = document.getElementById("project-dialog-live");
  var dialogRepo = document.getElementById("project-dialog-repo");
  var lastTrigger = null;
  var enterTimers = new WeakMap();
  var activeFilter = "all";
  var currentScreenshots = [];
  var currentShotIndex = 0;

  /* ---------------------------- Filtering ---------------------------- */
  function updateCount(visibleCount, filter) {
    if (!countLabel) return;
    var noun = visibleCount === 1 ? "project" : "projects";
    countLabel.textContent =
      filter === "all"
        ? "Showing all " + visibleCount + " " + noun
        : "Showing " + visibleCount + " " + noun;
  }

  function applyFilter(filter, animate) {
    var visibleCount = 0;

    cards.forEach(function (card) {
      var categories = (card.getAttribute("data-categories") || "")
        .split(/\s+/)
        .filter(Boolean);
      var matches = filter === "all" || categories.indexOf(filter) !== -1;

      card.classList.toggle("is-filtered-out", !matches);
      card.classList.remove("is-entering");

      if (matches) {
        visibleCount += 1;
        card.classList.add("is-visible"); // Ensures filtered-in cards are never invisible.

        if (animate) {
          window.clearTimeout(enterTimers.get(card));
          void card.offsetWidth;
          card.classList.add("is-entering");
          enterTimers.set(
            card,
            window.setTimeout(function () {
              card.classList.remove("is-entering");
            }, 500)
          );
        }
      }
    });

    filterButtons.forEach(function (button) {
      var isActive = button.getAttribute("data-filter") === filter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    updateCount(visibleCount, filter);
    activeFilter = filter;
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var nextFilter = button.getAttribute("data-filter") || "all";
      if (nextFilter === activeFilter && nextFilter !== "all") {
        // Still re-run so a visitor can refresh the animation if they wish.
      }
      applyFilter(nextFilter, true);
    });
  });

  if (countLabel) {
    var initialCount = cards.filter(function (card) {
      return !card.classList.contains("is-filtered-out");
    }).length;
    updateCount(initialCount, "all");
  }

  /* ------------------------- Project dialog -------------------------- */
  if (
    !dialog ||
    !dialogClose ||
    !dialogImage ||
    !dialogCategory ||
    !dialogTitle ||
    !dialogDescription ||
    !dialogTech ||
    !dialogProblem ||
    !dialogObjectives ||
    !dialogContribution ||
    !dialogOutput ||
    !dialogHighlights ||
    !dialogGallery ||
    !dialogShotCount ||
    !dialogStatus ||
    !dialogLive ||
    !dialogRepo
  ) {
    return;
  }

  function createTag(text) {
    var item = document.createElement("li");
    item.textContent = text;
    return item;
  }

  function showScreenshot(index) {
    if (!currentScreenshots.length) return;

    currentShotIndex = Math.min(Math.max(index, 0), currentScreenshots.length - 1);
    var shot = currentScreenshots[currentShotIndex];

    dialogImage.src = shot.src;
    dialogImage.alt = shot.alt;
    dialogShotCount.textContent =
      "Screenshot " +
      (currentShotIndex + 1) +
      " of " +
      currentScreenshots.length +
      " — " +
      shot.caption;

    Array.prototype.forEach.call(
      dialogGallery.querySelectorAll("[data-screenshot]"),
      function (button) {
        var isActive = Number(button.getAttribute("data-screenshot")) === currentShotIndex;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
      }
    );
  }

  function buildGallery(project) {
    currentScreenshots = project.screenshots || [];
    dialogGallery.replaceChildren();

    currentScreenshots.forEach(function (shot, index) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "project-dialog__thumb";
      button.setAttribute("data-screenshot", String(index));
      button.setAttribute("aria-pressed", "false");
      button.setAttribute(
        "aria-label",
        "View screenshot " + (index + 1) + ": " + shot.caption
      );

      var image = document.createElement("img");
      image.src = shot.src;
      image.alt = "";
      image.width = 1200;
      image.height = 750;
      image.loading = "lazy";
      image.decoding = "async";

      var caption = document.createElement("span");
      caption.className = "project-dialog__thumb-caption";
      caption.textContent = shot.caption;

      button.appendChild(image);
      button.appendChild(caption);
      button.addEventListener("click", function () {
        showScreenshot(index);
      });
      dialogGallery.appendChild(button);
    });

    showScreenshot(0);
  }

  function openProjectDialog(projectId, trigger) {
    var project = PROJECTS[projectId];
    if (!project) return;

    lastTrigger = trigger || null;

    dialogCategory.textContent = project.category;
    dialogTitle.textContent = project.title;
    dialogDescription.textContent = project.description;
    dialogStatus.textContent = project.status;

    dialogTech.replaceChildren();
    project.tech.forEach(function (tech) {
      dialogTech.appendChild(createTag(tech));
    });

    dialogObjectives.replaceChildren();
    project.objectives.forEach(function (objective) {
      dialogObjectives.appendChild(createTag(objective));
    });

    dialogContribution.textContent = project.contribution;
    dialogOutput.textContent = project.output;

    dialogHighlights.replaceChildren();
    project.highlights.forEach(function (highlight) {
      dialogHighlights.appendChild(createTag(highlight));
    });

    buildGallery(project);

    if (project.live) {
      dialogLive.href = project.live;
      dialogLive.hidden = false;
    } else {
      dialogLive.hidden = true;
      dialogLive.removeAttribute("href");
    }

    if (project.repo) {
      dialogRepo.href = project.repo;
      dialogRepo.hidden = false;
    } else {
      dialogRepo.hidden = true;
      dialogRepo.removeAttribute("href");
    }

    document.documentElement.classList.add("dialog-open");

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  function restoreDialogFocus() {
    document.documentElement.classList.remove("dialog-open");
    if (lastTrigger) {
      lastTrigger.focus({ preventScroll: true });
      lastTrigger = null;
    }
  }

  function closeProjectDialog() {
    if (typeof dialog.close === "function" && dialog.open) {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
      restoreDialogFocus();
    }
  }

  document.querySelectorAll("[data-project]").forEach(function (button) {
    button.addEventListener("click", function () {
      openProjectDialog(button.getAttribute("data-project"), button);
    });
  });

  dialogClose.addEventListener("click", closeProjectDialog);

  dialog.addEventListener("click", function (event) {
    // Clicks on the dialog itself (the backdrop area) close it.
    if (event.target === dialog) closeProjectDialog();
  });

  dialog.addEventListener("close", restoreDialogFocus);
})();
/* ==========================================================================
   8. CONTACT FORM
   ==========================================================================
   IMPORTANT — a static site cannot send email by itself.
   1. Create a form endpoint (Formspree is a simple option).
   2. Paste the endpoint URL into CONTACT_CONFIG.endpoint below.
   3. Change the email address in CONTACT_CONFIG and in index.html.
   With no endpoint configured, the form switches to an honest demo mode:
   it validates locally, sends nothing, and offers a pre-filled mailto link.
   ========================================================================== */
(function initContactForm() {
  var CONTACT_CONFIG = {
    endpoint: "", // e.g. "https://formspree.io/f/your-form-id"
    email: "piolo@example.com"
  };

  var form = document.getElementById("contact-form");
  if (!form) return;

  var statusEl = document.getElementById("form-status");
  var submitButton = document.getElementById("form-submit");
  var submitLabel = submitButton ? submitButton.querySelector("[data-submit-label]") : null;
  var messageInput = document.getElementById("contact-message");
  var messageCount = document.getElementById("message-count");
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var submitted = false;
  var isSending = false;

  var fields = [
    {
      input: document.getElementById("contact-name"),
      error: document.getElementById("name-error"),
      validate: function (value) {
        if (!value) return "Please enter your full name.";
        if (value.length < 2) return "Your name needs at least 2 characters.";
        return "";
      }
    },
    {
      input: document.getElementById("contact-email"),
      error: document.getElementById("email-error"),
      validate: function (value) {
        if (!value) return "Please enter your email address.";
        if (!emailPattern.test(value)) {
          return "Enter a valid email address, like name@example.com.";
        }
        return "";
      }
    },
    {
      input: document.getElementById("contact-subject"),
      error: document.getElementById("subject-error"),
      validate: function (value) {
        if (!value) return "Please add a subject.";
        if (value.length < 3) return "Give the subject at least 3 characters.";
        return "";
      }
    },
    {
      input: messageInput,
      error: document.getElementById("message-error"),
      validate: function (value) {
        if (!value) return "Please write a message.";
        if (value.length < 10) return "Your message needs at least 10 characters.";
        return "";
      }
    }
  ].filter(function (field) {
    return field.input && field.error;
  });

  function setFieldError(field, message) {
    var wrapper = field.input.closest(".field");
    if (wrapper) wrapper.classList.toggle("has-error", Boolean(message));
    field.error.textContent = message;

    if (message) {
      field.input.setAttribute("aria-invalid", "true");
    } else {
      field.input.removeAttribute("aria-invalid");
    }
  }

  function validateField(field) {
    var message = field.validate(field.input.value.trim());
    setFieldError(field, message);
    return message === "";
  }

  function validateForm() {
    var firstInvalid = null;

    fields.forEach(function (field) {
      var isValid = validateField(field);
      if (!isValid && !firstInvalid) firstInvalid = field;
    });

    return firstInvalid;
  }

  function setSubmitting(sending) {
    isSending = sending;

    if (submitButton) {
      submitButton.disabled = sending;
      submitButton.setAttribute("aria-busy", sending ? "true" : "false");
    }

    if (submitLabel) {
      submitLabel.textContent = sending ? "Sending..." : "Send message";
    }
  }

  function updateMessageCount() {
    if (!messageInput || !messageCount) return;
    messageCount.textContent = messageInput.value.length + " / 1000";
  }

  function showStatus(type, message, link) {
    if (!statusEl) return;

    statusEl.hidden = false;
    statusEl.className = "form-status is-" + type;
    statusEl.textContent = message;

    if (link && link.text && link.href) {
      statusEl.appendChild(document.createTextNode(" "));
      var anchor = document.createElement("a");
      anchor.href = link.href;
      anchor.textContent = link.text;
      statusEl.appendChild(anchor);

      if (link.suffix) {
        statusEl.appendChild(document.createTextNode(link.suffix));
      }
    }
  }

  function buildMailto(values) {
    var subject = "[Portfolio] " + values.subject;
    var body =
      "Hi Piolo,\n\n" +
      values.message +
      "\n\n— " +
      values.name +
      "\n" +
      values.email;

    return (
      "mailto:" +
      CONTACT_CONFIG.email +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body)
    );
  }

  fields.forEach(function (field) {
    field.input.addEventListener("blur", function () {
      if (submitted || field.input.value.trim()) validateField(field);
    });

    field.input.addEventListener("input", function () {
      if (field.input === messageInput) updateMessageCount();

      if (submitted || field.input.closest(".field").classList.contains("has-error")) {
        validateField(field);
      }
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (isSending) return;
    submitted = true;

    var firstInvalid = validateForm();

    if (firstInvalid) {
      showStatus("error", "Please review the highlighted fields and try again.");
      firstInvalid.input.focus();
      return;
    }

    var values = {
      name: document.getElementById("contact-name").value.trim(),
      email: document.getElementById("contact-email").value.trim(),
      subject: document.getElementById("contact-subject").value.trim(),
      message: messageInput.value.trim()
    };

    // No endpoint yet: never pretend a message was sent.
    if (!CONTACT_CONFIG.endpoint.trim()) {
      showStatus(
        "info",
        "Demo mode — your message has not been sent. Connect a form endpoint in js/script.js to receive messages, or",
        {
          text: "open a pre-filled email instead",
          href: buildMailto(values),
          suffix: "."
        }
      );
      return;
    }

    setSubmitting(true);
    showStatus("info", "Sending your message...");

    fetch(CONTACT_CONFIG.endpoint, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form)
    })
      .then(function (response) {
        if (!response.ok) throw new Error("The form service returned an error.");
        return response;
      })
      .then(function () {
        showStatus(
          "success",
          "Thanks — your message has been sent. I'll get back to you as soon as I can."
        );
        form.reset();
        submitted = false;
        fields.forEach(function (field) {
          setFieldError(field, "");
        });
        updateMessageCount();
      })
      .catch(function () {
        showStatus(
          "error",
          "Something went wrong while sending your message. Please try again, or email me directly at",
          {
            text: CONTACT_CONFIG.email,
            href: "mailto:" + CONTACT_CONFIG.email,
            suffix: "."
          }
        );
      })
      .finally(function () {
        setSubmitting(false);
      });
  });

  updateMessageCount();
})();
