# Lesson 6 — IT Portfolio Submission Guide

**Student:** Piolo  
**Program:** BS Information Technology  
**Project:** Single-page IT portfolio built with HTML5, CSS3, and vanilla JavaScript  
**Assignment:** Lesson 6 — Preparing an IT Portfolio

This file turns the finished website into a submittable package. It lists what is complete, what is still a placeholder, how to publish the site, how to regenerate the PDF, and how to present the work.

---

## 1. What is already built

| Requirement | Where it lives | Status |
| --- | --- | --- |
| Personal profile: full name, photo, introduction, career objective, education, contact | `index.html` — About and Education sections | Complete with clearly marked editable placeholders |
| Technical skills, including development tools | `index.html` — Skills section; six cards including Development Tools | Complete |
| Three or more IT projects | `index.html` — Projects section; `js/script.js` — `PROJECTS` data | Four sample projects |
| Project title, description, objectives, technologies, contribution, output, screenshots, links | Project dialog and `documentation.html` | Each project has two screenshots |
| Certifications and training | `index.html` — Certifications & training panel | Editable placeholder panel |
| Experience and accomplishments | `index.html` — Achievements & experience cards, including OJT & Internships | Editable placeholder cards |
| Contact information and social links | `index.html` — Contact and footer | Placeholder email, GitHub, Facebook |
| GitHub profile and repository links | Contact, footer, project cards, project dialog | Placeholder `github.com/yourusername` URLs |
| Source code and documentation | `README.md`, `SUBMISSION.md`, `documentation.html`, PDF | Complete |
| Published URL | Not deployed yet | Follow the deployment steps below |
| PDF or screenshot documentation | `assets/documents/portfolio-documentation.pdf` | Generated, five pages |
| Short presentation | Outline in section 7 below | Ready to adapt |

The site is responsive, keyboard-friendly, and tested at 1440, 1200, 1024, 768, 480, 390, and 320 px with no horizontal overflow.

---

## 2. What is still a placeholder

Do not submit invented credentials. Replace these honestly, or leave the clearly labelled placeholders if your teacher allows a template submission.

| Placeholder | Where to change it |
| --- | --- |
| Full name “Piolo” | `index.html`, `documentation.html`, `js/script.js` metadata/`CONTACT_CONFIG`, `README.md`, `SUBMISSION.md` |
| Email `piolo@example.com` | `index.html`, `documentation.html`, `js/script.js`, metadata |
| GitHub `github.com/yourusername` | Project cards, dialog data, contact, footer, `documentation.html`, JSON-LD |
| Facebook `facebook.com/yourusername` | Contact, footer, `documentation.html` |
| Portfolio URL `yourusername.github.io` | Metadata, contact, footer, `documentation.html` |
| Education names and years | About/Education sections, `documentation.html` |
| Certifications, OJT, achievements, leadership, organizations | Achievements and certifications sections, `documentation.html` |
| Instrument, ensemble, performances, teaching | Music & brass band panel |
| Project write-ups and repository URLs | `js/script.js` `PROJECTS`, project cards, `documentation.html` |
| Project preview images | `assets/images/projects/*.svg` (replace with real screenshots) |
| Portrait and about images | `assets/images/profile.jpg`, `assets/images/about.jpg` |
| Résumé | `assets/documents/resume.pdf` |
| Open Graph URL/image | `<head>` of `index.html` |

The four projects are currently presented as clearly labelled concepts/coursework. Replace them with projects you actually built if you have them. The screenshots are illustrative interface previews, not screenshots of finished software. The contact form does **not** send email in demo mode.

---

## 3. Files to submit

```text
index.html
documentation.html
css/style.css
css/documentation.css
js/script.js
assets/
  documents/portfolio-documentation.pdf
  documents/resume.pdf
  images/...
README.md
SUBMISSION.md
```

The website has no build step and no dependencies. Keep the folder structure unchanged so all relative links continue to work.

---

## 4. Publish the site

### Option A — GitHub Pages

1. Create a GitHub repository, for example `portfolio`.
2. Open a terminal in this folder and run:

```bash
git init
git add .
git commit -m "Complete IT portfolio"
git branch -M main
git remote add origin https://github.com/yourusername/portfolio.git
git push -u origin main
```

3. On GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and the `/ (root)` folder, then save.
6. Wait for the deployment and visit:

```text
https://yourusername.github.io/portfolio/
```

7. Replace every `yourusername` placeholder with your real GitHub username before and after deployment.

### Option B — Netlify Drop

1. Open <https://app.netlify.com/drop>.
2. Drag the whole project folder onto the page.
3. Rename the site in **Site configuration → Site details** if you want a cleaner URL.
4. Copy the live URL into your submission and into the portfolio metadata.

### After deploying

Update these values in `index.html`:

- `og:url` and the Twitter/Open Graph URLs
- JSON-LD `url` and `sameAs`
- Contact and footer portfolio links
- Any project repository links that now exist

Then regenerate the PDF and test every link on the live site.

---

## 5. Regenerate the documentation PDF

The current PDF was generated from `documentation.html` with Microsoft Edge.

1. Start a local server (VS Code **Live Server**, or `npx serve .`).
2. Open `http://127.0.0.1:5500/documentation.html`.
3. Click **Print / save as PDF**.
4. Choose **Save as PDF**, **A4**, default margins, and enable **Background graphics**.
5. Save over:

```text
assets/documents/portfolio-documentation.pdf
```

Command-line alternative for Windows with Edge:

```powershell
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" `
  --headless=new --disable-gpu --no-pdf-header-footer `
  --print-to-pdf="C:\sirprince\assets\documents\portfolio-documentation.pdf" `
  "http://localhost:5500/documentation.html"
```

The document should be **five pages**:

1. Profile, education, and contact
2. Technical skills, projects introduction, SmartBand
3. Personal Portfolio
4. StudyFlow
5. Shelfwise, certifications, experience, contact

Each project must show its objectives, contribution, output, technologies, two screenshots, and source link.

---

## 6. Screenshot documentation

If your teacher asks for screenshots instead of a PDF, capture:

1. Desktop homepage at 1440 px.
2. Skills section showing all six cards.
3. Projects grid with filters visible.
4. One project dialog with the two-screenshot gallery.
5. Mobile menu at 390 px.
6. Contact section.
7. Page 1 and one project page of the documentation PDF.

Save them in a folder such as `assets/documents/screenshots/` and include them in your submission ZIP or slide deck. Compress large PNGs if the submission portal has a size limit.

---

## 7. Short presentation outline

Target length: 3–5 minutes.

### Slide 1 — Introduction (30 seconds)

- Name, program, and year level.
- One sentence: “I’m an IT student focused on web development and UI/UX.”
- State the purpose: present my skills, projects, and documentation.

### Slide 2 — Profile and skills (45 seconds)

- Show the About section and career objective.
- Point out the six skill groups, especially Development Tools.
- Mention education and the brass band interest as part of the personal profile.

### Slide 3 — Projects (90 seconds)

- Show the project grid and apply one filter.
- Open one project dialog.
- Explain the problem, objectives, technologies, your contribution, and output.
- Show both screenshots.
- Repeat briefly for one or two more projects; do not read every bullet.

### Slide 4 — Source code and documentation (45 seconds)

- Show the GitHub repository or local folder structure.
- Open `documentation.html` or the PDF.
- Mention responsive design, keyboard access, reduced-motion support, and the honest contact-form demo mode.

### Slide 5 — Reflection and close (30 seconds)

- What you learned: semantic structure, responsive layout, accessibility, testing.
- What you would improve next: real screenshots, real project links, more advanced JavaScript.
- Thank the audience and show the contact links.

### Likely questions

- **Why did you use vanilla JavaScript?** To demonstrate fundamentals and keep the site dependency-free.
- **How is the site accessible?** Skip link, semantic landmarks, focus states, keyboard dialog, ARIA labels, reduced-motion support.
- **Which project are you proudest of?** Answer honestly and explain one specific technical decision.
- **What is still a placeholder?** Be direct: personal details, repositories, screenshots, certifications, and the contact endpoint still need real data.

---

## 8. Final QA checklist

Run through this before submitting:

- [ ] The site opens from the published URL, not only from a local file.
- [ ] No 404s: résumé, documentation PDF, project repository links, GitHub profile, social links.
- [ ] All project cards open the correct dialog.
- [ ] Each dialog shows both screenshots and the counter changes when you click a thumbnail.
- [ ] Project filters show the correct count and restore all cards.
- [ ] Mobile menu opens, traps focus, closes with Escape, and returns focus.
- [ ] Theme toggle works and remembers the choice after reload.
- [ ] Contact form validation works; demo mode does not claim to send.
- [ ] Back-to-top button works.
- [ ] No horizontal scrolling at 320, 390, 768, 1024, and 1440 px.
- [ ] `documentation.html` prints to five A4 pages with two screenshots per project.
- [ ] `assets/documents/portfolio-documentation.pdf` is the latest version.
- [ ] Résumé and PDF links download correctly.
- [ ] Placeholder notices are either updated or intentionally kept.
- [ ] Presentation is rehearsed and fits the time limit.

---

## 9. Suggested submission package

Submit or upload:

1. **Live URL** — GitHub Pages or Netlify.
2. **Repository URL** — source code.
3. **PDF** — `portfolio-documentation.pdf`.
4. **Screenshots** — desktop, mobile, and one project dialog.
5. **Presentation** — PDF or slide link.
6. **This guide** — optional, but useful for the teacher to see the checklist.

If the submission portal only accepts one file, zip the project folder, the PDF, and the screenshots together. Keep the live URL in the submission comments so the teacher can interact with the site.

---

## 10. Honest status summary

**Complete:** design, responsive layout, semantic structure, navigation, filters, dialog gallery, theme toggle, form validation, print support, accessibility checks, source code, README, and a five-page PDF.

**Needs your real information:** name, photo, email, social links, education details, certifications, OJT/experience, achievements, project screenshots, repository URLs, live demo URLs, résumé, and the deployed URL.

**Not implemented on purpose:** fake certificates, fake work experience, fake live demos, and a contact form that pretends to send email.
