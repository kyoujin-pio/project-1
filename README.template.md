# Piolo — Personal Portfolio

A complete single-page portfolio built with **HTML5, CSS3, and vanilla JavaScript** — no frameworks, no build step, no dependencies. It is designed to be easy to read, easy to edit, and safe to publish.

> **Project note:** this is a portfolio **template / school project**. Every personal detail is a clearly marked placeholder: the name, email, education entries, achievements, brass band details, project write-ups, social links, and résumé. Replace them with truthful information (or keep the neutral placeholders) before sharing the site publicly. The contact form does **not** claim to send messages until you connect a form endpoint.

---

## Contents

- [What is included](#what-is-included)
- [Requirements](#requirements)
- [Folder structure](#folder-structure)
- [Run the site locally](#run-the-site-locally)
- [Personalize the site](#personalize-the-site)
  - [1. Name, email, and social links](#1-name-email-and-social-links)
  - [2. Photos and images](#2-photos-and-images)
  - [3. Projects and filters](#3-projects-and-filters)
  - [4. Education, achievements, band, and interests](#4-education-achievements-band-and-interests)
  - [5. Résumé](#5-résumé)
  - [6. Contact form](#6-contact-form)
  - [7. Colors, fonts, and theme](#7-colors-fonts-and-theme)
  - [8. SEO and social sharing](#8-seo-and-social-sharing)
  - [9. Documentation PDF and printing](#9-documentation-pdf-and-printing)
- [Deploy the site](#deploy-the-site)
  - [GitHub Pages](#github-pages)
  - [Netlify](#netlify)
- [Accessibility and QA notes](#accessibility-and-qa-notes)
- [Honesty checklist before publishing](#honesty-checklist-before-publishing)
- [Assignment submission](#assignment-submission)

---

## What is included

- Sticky, responsive navigation with a mobile menu, focus trap, Escape-to-close, and active-section highlighting.
- Hero, about, technical skills, projects, education timeline, achievements, certifications, brass band feature, interests, contact, and footer sections.
- Project category filtering with an `aria-live` result count.
- Accessible project-detail dialog with keyboard/backdrop close, objectives, contribution, output, key features, and a two-screenshot gallery.
- A print-ready `documentation.html` page and `assets/documents/portfolio-documentation.pdf` for the assignment submission.
- Print styles on the main page so visitors can save a clean copy as PDF.
- Scroll-reveal animations using `IntersectionObserver`, with reduced-motion support.
- Light and dark themes, saved in `localStorage`; the site starts in the light theme unless a saved preference exists.
- Back-to-top button, smooth anchor scrolling, and automatic footer year.
- Client-side contact-form validation. With no endpoint configured it runs an honest demo mode and offers a pre-filled `mailto:` link.
- Semantic HTML, skip link, alt text, visible focus states, responsive layouts, meta description, Open Graph/Twitter metadata, and JSON-LD.
- Illustrated placeholder images and project previews so nothing on the site pretends to be a real personal photograph or credential.

There is no framework, package manager, or build command. Open the folder in VS Code, start a local server, and edit.

---

## Requirements

- Any modern browser (Chrome, Edge, Firefox, Safari).
- [Visual Studio Code](https://code.visualstudio.com/) — recommended.
- Optional: the **Live Server** extension for VS Code, or Python/Node for a one-line local server.

No internet connection is required for the site itself. Google Fonts loads Inter from the web; if it cannot load, the CSS falls back to the system UI font.

---

## Folder structure

```text
portfolio/
├── index.html                  Main single-page portfolio
├── documentation.html          Print-ready assignment documentation
├── README.md                   Setup and customization guide
├── SUBMISSION.md               Assignment checklist and presentation outline
├── css/
│   ├── style.css               Design tokens, layout, components, themes, print rules
│   └── documentation.css       Screen and print layout for documentation.html
├── js/
│   └── script.js               Theme, navigation, filtering, dialog, form, print, footer year
├── assets/
│   ├── images/
│   │   ├── profile.jpg         Hero portrait placeholder (1000 × 1250)
│   │   ├── about.jpg           About image placeholder (1000 × 1250)
│   │   ├── og-image.png        Social sharing image (1200 × 630)
│   │   └── projects/
│   │       ├── smartband.svg
│   │       ├── smartband-schedule.svg
│   │       ├── portfolio.svg
│   │       ├── portfolio-about.svg
│   │       ├── studyflow.svg
│   │       ├── studyflow-focus.svg
│   │       ├── shelfwise.svg
│   │       └── shelfwise-record.svg
│   ├── icons/
│   │   └── favicon.svg
│   └── documents/
│       ├── resume.pdf          Placeholder résumé PDF
│       └── portfolio-documentation.pdf
├── .vscode/                    Recommended extensions and editor settings
└── .gitignore
```

---

## Run the site locally

### Option A — VS Code Live Server (recommended)

1. Open the folder in VS Code.
2. Install the recommended **Live Server** extension when prompted (or from the Extensions view).
3. Right-click `index.html` and choose **Open with Live Server**.
4. Your browser opens at an address such as `http://127.0.0.1:5500`.

### Option B — Python

From the project folder:

```bash
python -m http.server 5500
```

Then visit `http://localhost:5500`.

### Option C — Node

```bash
npx serve .
```

Then open the URL shown in the terminal.

> Opening `index.html` directly as a file also works for most features, but a local server is closer to a real deployment and avoids browser restrictions on local files.

---

## Personalize the site

All content is plain HTML/CSS/JS. You do not need a build step.

### 1. Name, email, and social links

Search `index.html` and `js/script.js` for:

- `Piolo` — hero heading, brand, titles, metadata, footer, and JSON-LD.
- `piolo@example.com` — header menu, contact section, footer, form config, and the mailto body.
- `github.com/yourusername` — project cards, dialog data, contact section, footer, and social links.
- `facebook.com/yourusername` — contact section, footer, and social links.

Replace them with your own details. Also update:

- `<meta name="author">`
- `<title>` and the meta description
- Open Graph and Twitter titles/descriptions
- The JSON-LD `Person` block (name, email, URL, and `sameAs`)
- The `og:url` placeholder once you know your deployed address

The contact email also appears in `CONTACT_CONFIG` near the bottom of `js/script.js`.

### 2. Photos and images

| File | Recommended use | Recommended size |
| --- | --- | --- |
| `assets/images/profile.jpg` | Hero portrait | 1000 × 1250 (4:5) |
| `assets/images/about.jpg` | About-section photo/graphic | 1000 × 1250 (4:5) |
| `assets/images/og-image.png` | Link preview image | 1200 × 630 |
| `assets/images/projects/*.svg` | Project previews | 1200 × 750 (16:10) |

You can replace the JPGs with your own photos using the same filenames. Compress them first (for example with [Squoosh](https://squoosh.app/)) so the page stays fast. If you change the aspect ratio, also update the `width`/`height` attributes on the `<img>` elements in `index.html` and check the layout.

If you replace the project previews with screenshots, either export them as JPG/PNG and update the file paths, or keep the SVG paths and overwrite the SVGs. Update the `alt` text in both `index.html` and the `PROJECTS` object in `js/script.js` to describe the new image.

The current images are intentionally **illustrated placeholders**, not fake personal photographs.

### 3. Projects and filters

Projects appear in two places:

1. **`index.html`** — the visible project cards inside `#projects-grid`.
2. **`js/script.js`** — the `PROJECTS` object that fills the project dialog.

Each card has:

```html
<article class="project-card" data-categories="academic web" data-reveal>
```

`data-categories` can contain one or more of: `academic`, `web`, `personal`. These values match the filter buttons. If you add a new category, add a matching filter button near the top of the projects section.

Each card's **View project** button uses a `data-project` value, for example:

```html
<button class="text-link" type="button" data-project="smartband">
```

Add or update the corresponding entry in `PROJECTS` in `js/script.js`:

```js
smartband: {
  title: "SmartBand",
  category: "Academic Project",
  description: "…",
  objectives: ["…", "…"],
  contribution: "…",
  output: "…",
  tech: ["HTML5", "CSS3", "JavaScript"],
  highlights: ["…"],
  screenshots: [
    {
      src: "assets/images/projects/smartband.svg",
      alt: "…",
      caption: "Member dashboard"
    },
    {
      src: "assets/images/projects/smartband-schedule.svg",
      alt: "…",
      caption: "Schedule and announcements"
    }
  ],
  status: "…",
  live: "", // leave empty if there is no live demo
  repo: "https://github.com/yourusername/smartband"
}
```

Keep `live: ""` unless a live demo really exists; the dialog hides the button automatically. Every project should have at least two entries in `screenshots`, because the assignment requires two or more screenshots per project. Replace the placeholder GitHub URLs with real repository links, or remove the links entirely if a project is not public. Update the `alt` text and `caption` for each screenshot when you replace the illustrated previews with real images.

### 4. Education, achievements, band, and interests

These sections use realistic but clearly editable placeholders:

- **University Name**, **Senior High School Name**, **Junior High School Name**
- **Academic Achievements**, **Organizational Involvement**, **Leadership Experience**, **OJT & Internships**
- The **Certifications & training** panel, including its `EDITABLE` badge and note
- The **Music & brass band** panel, including the `EDITABLE` tags and editable hint
- The **Interests** cards

Replace them with verified information only. If you do not have an achievement, internship, or certificate yet, remove the card or panel rather than inventing one. Once a section contains real content, remove the dashed `EDITABLE` badges and the “Editable space…” hints. The certifications panel is also linked from the footer and can be removed entirely if it does not apply.

The band section is a separate featured panel by design, so you can describe your instrument, ensemble, performances, or teaching experience without mixing it into academic achievements.

### 5. Résumé

Replace:

```text
assets/documents/resume.pdf
```

with your final résumé, keeping the same filename. If you rename it, update every link in:

- the header/mobile menu
- the about section
- the education section (“View full résumé”)
- the contact section
- the footer
- the mobile menu’s download button

The included PDF is a **placeholder** that says so on the page; it is not a real résumé.

### 6. Contact form

A static website cannot send email by itself. The form is wired for a form service.

**Current behavior with no endpoint configured:**

- Validates name, email, subject, and message locally.
- Never says the message was sent.
- Shows a demo-mode notice and a pre-filled `mailto:` link.

**To receive messages with Formspree:**

1. Create a free form at [formspree.io](https://formspree.io/).
2. Copy the endpoint URL (for example `https://formspree.io/f/abcdwxyz`).
3. Open `js/script.js` and set:

```js
var CONTACT_CONFIG = {
  endpoint: "https://formspree.io/f/your-form-id",
  email: "you@example.com"
};
```

4. Replace the email address in `index.html` too.
5. Submit a real test message from your deployed site and confirm it arrives.

When an endpoint is present, the script sends `FormData` to it with `fetch`, shows a sending state, and only displays the success message after an OK response. If the request fails, it shows an error and a direct email link.

**Netlify Forms alternative:** if you deploy to Netlify, you can use Netlify Forms instead of Formspree. Add `data-netlify="true"` and a `name` attribute to the form, add a hidden `form-name` field, and point the submission to `/`. Because this project already uses JavaScript validation and `fetch`, you would need to adapt the submit handler; Formspree is the simpler path if you do not want to change the JavaScript.

### 7. Colors, fonts, and theme

Design tokens live at the top of `css/style.css` in `:root` and the dark-theme override:

- `--bg`, `--bg-elevated`, `--text`, `--muted`, `--border`, `--accent`.
- The default palette is white/near-white, near-black, neutral gray, and slate blue (`#526B8A`).
- Inter is loaded from Google Fonts in `index.html`; change the `<link>` and the `font-family` stack to use another typeface.

The light/dark toggle stores the visitor's preference in `localStorage` under `portfolio-theme`. The theme bootstrap script in the `<head>` prevents a flash of the wrong theme on reload.

### 8. SEO and social sharing

Before publishing:

- Set a real `<title>` and meta description.
- Replace the placeholder `og:url`.
- Make the Open Graph/Twitter image URL absolute once the site is live, for example:

```html
<meta property="og:image" content="https://yourdomain.com/assets/images/og-image.png">
```

Some social platforms do not resolve relative image URLs. After deploying, use a link-preview debugger (such as the Facebook Sharing Debugger or LinkedIn Post Inspector) to refresh the cached preview.

The JSON-LD block at the top of `index.html` describes a `Person`; update the name, URL, email, and social profiles, or remove the block if you prefer not to include structured data.

### 9. Documentation PDF and printing

The assignment documentation lives in two places:

- `documentation.html` — the editable source page.
- `assets/documents/portfolio-documentation.pdf` — the submitted PDF.

Update `documentation.html` whenever you change project details, screenshots, or contact information, then regenerate the PDF:

1. Start the site with Live Server (or any local server).
2. Open `http://127.0.0.1:5500/documentation.html`.
3. Click **Print / save as PDF**, or use the browser's print dialog.
4. Choose **Save as PDF**, A4 paper, default margins, and background graphics enabled.
5. Save over `assets/documents/portfolio-documentation.pdf`.

With Microsoft Edge installed, you can also regenerate it from the command line:

```powershell
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" `
  --headless=new --disable-gpu --no-pdf-header-footer `
  --print-to-pdf="C:\sirprince\assets\documents\portfolio-documentation.pdf" `
  "http://localhost:5500/documentation.html"
```

The PDF is laid out one project per page with two screenshots each. If you replace the placeholder previews with real screenshots, keep them close to a 16:10 aspect ratio for the cleanest result. The main portfolio also has print styles: `data-print` buttons trigger the browser print dialog, and navigation, forms, and dialogs are hidden automatically.

---

## Deploy the site

This is a static site. Any static host works.

### GitHub Pages

1. Create a GitHub repository (for example `portfolio`).
2. Initialize Git in this folder and push:

```bash
git init
git add .
git commit -m "Build personal portfolio"
git branch -M main
git remote add origin https://github.com/yourusername/portfolio.git
git push -u origin main
```

3. On GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select `main`, and choose the repository root (`/`).
5. Wait for the Pages deployment, then visit `https://yourusername.github.io/portfolio/`.

If the site is served from a subpath, all asset paths in this project are relative, so they continue to work. Update `og:url` to the final address.

### Netlify

**Fastest option:**

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag the whole project folder onto the page.
3. Netlify gives you a live URL immediately. You can rename the site in **Site configuration → Site details**.

**Git-connected option:**

1. Push the folder to GitHub.
2. In Netlify, choose **Add new site → Import an existing project**.
3. Select the repository.
4. Leave the build command empty and set the publish directory to `.` (the repository root).
5. Deploy. Netlify will redeploy on each push.

The contact form remains in demo mode until you add a form endpoint, as described above.

---

## Accessibility and QA notes

The project includes:

- One `<h1>` and a logical heading hierarchy.
- A skip-to-content link, semantic landmarks, and labelled sections.
- Visible `:focus-visible` outlines and keyboard-operable menus, filters, and dialog.
- `aria-expanded`, `aria-current`, `aria-pressed`, `aria-live`, and `inert` where appropriate.
- Alt text for images, `aria-hidden` on decorative SVG icons, and descriptive link labels.
- Reduced-motion support, responsive breakpoints, and no horizontal scrolling down to 320 px.
- Sufficient contrast for body text and interface controls in both themes.

A quick manual check before publishing:

1. Tab through the header, mobile menu, project filters, dialog, and form.
2. Open the mobile menu with a keyboard, close it with Escape, and confirm focus returns to the menu button.
3. Filter each project category and check the result count.
4. Open a project dialog, scroll it, switch between both screenshots, and close it with Escape and with the close button.
5. Submit the contact form empty, then with valid values, and verify the demo message is honest.
6. Toggle light/dark mode, reload, and confirm the preference is remembered.
7. Open `documentation.html`, confirm all four projects show two screenshots, then print it or save it as PDF.
8. Check the page at 320 px, 390 px, 768 px, 1024 px, and 1440 px.

---

## Honesty checklist before publishing

This template was built to avoid inventing credentials. Before you publish it:

- [ ] Replace the placeholder name, email, and social URLs (or keep the neutral placeholders).
- [ ] Replace any education details you have not actually completed.
- [ ] Remove achievement/certificate cards you cannot verify.
- [ ] Remove the `EDITABLE` badges and hint text once real content is in place.
- [ ] Add only projects you have actually built; update the GitHub links.
- [ ] Add at least two real screenshots for each project and replace the illustrated previews.
- [ ] Replace the placeholder résumé PDF.
- [ ] Connect a real form endpoint if you want messages, and test it.
- [ ] Update the Open Graph URL and image URL.
- [ ] Regenerate `assets/documents/portfolio-documentation.pdf` after the final edits.
- [ ] Remove the demo/placeholder language if it no longer applies.

If this site is being submitted as a school project and you do not want to add personal information, that is fine: keep the illustrated placeholders, leave the contact form in demo mode, and label sample content clearly.

---

## Assignment submission

`SUBMISSION.md` contains the Lesson 6 checklist, deployment steps, PDF and screenshot instructions, and a short presentation outline. Read it before submitting. The short version:

1. Replace the placeholders you can truthfully replace.
2. Publish the site (GitHub Pages or Netlify) and note the live URL.
3. Regenerate the documentation PDF.
4. Test every link, project dialog, filter, form message, and theme toggle.
5. Screenshot or print the final pages for the PDF/screenshot requirement.
6. Present the profile, three or more projects, source code, and one lesson learned.

---

Built with semantic HTML, modern CSS, and plain JavaScript. No trackers, no frameworks, no build step.
