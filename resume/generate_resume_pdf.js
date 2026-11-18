const fs = require('fs');
const path = require('path');

// ==========================================
// ACCURATE HELVETICA & HELVETICA-BOLD METRICS
// ==========================================
const HELVETICA_WIDTHS = {
  32: 278, 33: 278, 34: 355, 35: 556, 36: 556, 37: 889, 38: 667, 39: 191,
  40: 333, 41: 333, 42: 389, 43: 584, 44: 278, 45: 333, 46: 278, 47: 278,
  48: 556, 49: 556, 50: 556, 51: 556, 52: 556, 53: 556, 54: 556, 55: 556,
  56: 556, 57: 556, 58: 278, 59: 278, 60: 584, 61: 584, 62: 584, 63: 556,
  64: 1015, 65: 667, 66: 667, 67: 722, 68: 722, 69: 667, 70: 611, 71: 778,
  72: 722, 73: 278, 74: 500, 75: 667, 76: 556, 77: 833, 78: 722, 79: 778,
  80: 667, 81: 778, 82: 722, 83: 667, 84: 611, 85: 722, 86: 667, 87: 944,
  88: 667, 89: 667, 90: 611, 91: 278, 92: 278, 93: 278, 94: 469, 95: 556,
  96: 333, 97: 556, 98: 556, 99: 500, 100: 556, 101: 556, 102: 278, 103: 556,
  104: 556, 105: 222, 106: 222, 107: 500, 108: 222, 109: 833, 110: 556, 111: 556,
  112: 556, 113: 556, 114: 333, 115: 500, 116: 278, 117: 556, 118: 500, 119: 722,
  120: 500, 121: 500, 122: 500, 123: 334, 124: 260, 125: 334, 126: 584,
  0x00F1: 556, 0x00D1: 722, 0x2014: 650, 0x2013: 450, 0x2022: 350
};

const HELVETICA_BOLD_WIDTHS = {
  32: 278, 33: 333, 34: 474, 35: 556, 36: 556, 37: 889, 38: 722, 39: 238,
  40: 333, 41: 333, 42: 389, 43: 584, 44: 278, 45: 333, 46: 278, 47: 278,
  48: 556, 49: 556, 50: 556, 51: 556, 52: 556, 53: 556, 54: 556, 55: 556,
  56: 556, 57: 556, 58: 333, 59: 333, 60: 584, 61: 584, 62: 584, 63: 611,
  64: 975, 65: 722, 66: 722, 67: 722, 68: 722, 69: 667, 70: 611, 71: 778,
  72: 722, 73: 278, 74: 556, 75: 722, 76: 611, 77: 833, 78: 722, 79: 778,
  80: 667, 81: 778, 82: 722, 83: 667, 84: 611, 85: 722, 86: 667, 87: 944,
  88: 667, 89: 667, 90: 611, 91: 333, 92: 278, 93: 333, 94: 584, 95: 556,
  96: 333, 97: 556, 98: 611, 99: 556, 100: 611, 101: 556, 102: 333, 103: 611,
  104: 611, 105: 278, 106: 278, 107: 556, 108: 278, 109: 889, 110: 611, 111: 611,
  112: 611, 113: 611, 114: 389, 115: 556, 116: 333, 117: 611, 118: 556, 119: 778,
  120: 556, 121: 556, 122: 500, 123: 389, 124: 280, 125: 389, 126: 584,
  0x00F1: 611, 0x00D1: 722, 0x2014: 650, 0x2013: 450, 0x2022: 350
};

function measureText(text, fontSize, isBold = false) {
  const table = isBold ? HELVETICA_BOLD_WIDTHS : HELVETICA_WIDTHS;
  let total = 0;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    const w = table[code] || 550;
    total += (w / 1000) * fontSize;
  }
  return total;
}

function escapePDF(str) {
  let out = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code === 92) {
      out += '\\\\';
    } else if (code === 40) {
      out += '\\(';
    } else if (code === 41) {
      out += '\\)';
    } else if (code === 0x00F1) {
      out += '\\361';
    } else if (code === 0x00D1) {
      out += '\\321';
    } else if (code === 0x2014) {
      out += ' - ';
    } else if (code === 0x2013) {
      out += '-';
    } else if (code === 0x2022) {
      out += '\\225';
    } else if (code === 0x2018 || code === 0x2019) {
      out += "'";
    } else if (code === 0x201C || code === 0x201D) {
      out += '"';
    } else if (code >= 32 && code <= 126) {
      out += str[i];
    } else if (code < 256) {
      out += '\\' + code.toString(8).padStart(3, '0');
    } else {
      out += str[i];
    }
  }
  return out;
}

class PDFBuilder {
  constructor(pageWidth = 612, pageHeight = 792) {
    this.pageWidth = pageWidth;
    this.pageHeight = pageHeight;
    this.margin = 46;
    this.printableWidth = this.pageWidth - (this.margin * 2);
    this.pages = [];
    this.currentPage = null;
    this.cursorY = 0;
    this.links = [];
    this.newPage();
  }

  newPage() {
    this.currentPage = { stream: [] };
    this.pages.push(this.currentPage);
    this.cursorY = this.pageHeight - this.margin;
  }

  setColor(r, g, b, isStroke = false) {
    const cmd = isStroke ? 'RG' : 'rg';
    this.currentPage.stream.push(`${(r/255).toFixed(3)} ${(g/255).toFixed(3)} ${(b/255).toFixed(3)} ${cmd}`);
  }

  drawRect(x, y, w, h, fill = true, stroke = false) {
    let cmd = 'n';
    if (fill && stroke) cmd = 'B';
    else if (fill) cmd = 'f';
    else if (stroke) cmd = 'S';
    this.currentPage.stream.push(`${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re ${cmd}`);
  }

  drawLine(x1, y1, x2, y2, lineWidth = 1, color = [0, 0, 0]) {
    this.setColor(...color, true);
    this.currentPage.stream.push(`${lineWidth.toFixed(2)} w ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`);
  }

  drawText(text, x, y, font = 'F1', size = 10, color = [0, 0, 0]) {
    this.setColor(...color);
    this.currentPage.stream.push(`BT /${font} ${size} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td (${escapePDF(text)}) Tj ET`);
  }

  drawCenteredText(text, y, font = 'F1', size = 10, color = [0, 0, 0]) {
    const isBold = (font === 'F2');
    const w = measureText(text, size, isBold);
    const x = (this.pageWidth - w) / 2;
    this.drawText(text, x, y, font, size, color);
    return { x, y, w, h: size };
  }

  drawBulletDot(x, y, radius = 2.0, color = [0, 0, 0]) {
    this.setColor(...color);
    const r = radius;
    const k = 0.5522847498 * r;
    this.currentPage.stream.push(
      `${(x).toFixed(2)} ${(y + r).toFixed(2)} m ` +
      `${(x + k).toFixed(2)} ${(y + r).toFixed(2)} ${(x + r).toFixed(2)} ${(y + k).toFixed(2)} ${(x + r).toFixed(2)} ${(y).toFixed(2)} c ` +
      `${(x + r).toFixed(2)} ${(y - k).toFixed(2)} ${(x + k).toFixed(2)} ${(y - r).toFixed(2)} ${(x).toFixed(2)} ${(y - r).toFixed(2)} c ` +
      `${(x - k).toFixed(2)} ${(y - r).toFixed(2)} ${(x - r).toFixed(2)} ${(y - k).toFixed(2)} ${(x - r).toFixed(2)} ${(y).toFixed(2)} c ` +
      `${(x - r).toFixed(2)} ${(y + k).toFixed(2)} ${(x - k).toFixed(2)} ${(y + r).toFixed(2)} ${(x).toFixed(2)} ${(y + r).toFixed(2)} c f`
    );
  }

  addLink(x, y, w, h, url) {
    this.links.push({
      pageIndex: this.pages.length - 1,
      x, y, w, h, url
    });
  }

  wrapText(text, maxWidth, fontSize, isBold = false) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      const candidate = currentLine ? `${currentLine} ${word}` : word;
      const w = measureText(candidate, fontSize, isBold);
      if (w <= maxWidth) {
        currentLine = candidate;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  buildPDF() {
    const objects = [];
    function addObj(content) {
      objects.push(content);
      return objects.length;
    }

    const catalogId = addObj('');
    const pagesId = addObj('');
    const f1Id = addObj(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`);
    const f2Id = addObj(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>`);
    const f3Id = addObj(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>`);

    const pageObjIds = [];

    for (let p = 0; p < this.pages.length; p++) {
      const pageData = this.pages[p];
      const streamContent = pageData.stream.join('\n');
      const streamBuf = Buffer.from(streamContent, 'latin1');
      const contentId = addObj(`<< /Length ${streamBuf.length} >>\nstream\n${streamContent}\nendstream`);

      const pageLinks = this.links.filter(l => l.pageIndex === p);
      const annotIds = [];
      for (const link of pageLinks) {
        const linkObj = `<< /Type /Annot /Subtype /Link /Rect [${link.x.toFixed(2)} ${link.y.toFixed(2)} ${(link.x + link.w).toFixed(2)} ${(link.y + link.h).toFixed(2)}] /Border [0 0 0] /A << /S /URI /URI (${escapePDF(link.url)}) >> >>`;
        annotIds.push(addObj(linkObj));
      }

      let annotsStr = '';
      if (annotIds.length > 0) {
        annotsStr = `/Annots [${annotIds.map(id => `${id} 0 R`).join(' ')}]`;
      }

      const pageObj = `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${this.pageWidth} ${this.pageHeight}] /Contents ${contentId} 0 R /Resources << /Font << /F1 ${f1Id} 0 R /F2 ${f2Id} 0 R /F3 ${f3Id} 0 R >> >> ${annotsStr} >>`;
      pageObjIds.push(addObj(pageObj));
    }

    objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
    objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageObjIds.map(id => `${id} 0 R`).join(' ')}] /Count ${pageObjIds.length} >>`;

    let output = '%PDF-1.4\n';
    const offsets = [0];

    for (let i = 0; i < objects.length; i++) {
      offsets.push(Buffer.byteLength(output, 'latin1'));
      output += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
    }

    const startXref = Buffer.byteLength(output, 'latin1');
    output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (let i = 1; i <= objects.length; i++) {
      const offStr = String(offsets[i]).padStart(10, '0');
      output += `${offStr} 00000 n \n`;
    }

    output += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;
    return Buffer.from(output, 'latin1');
  }
}

// ==========================================
// RESUME CONTENT GENERATION FOR MARK PIOLO A. MORENTE
// EXACTLY PROPORTIONED TO MATCH NESTOR'S RESUME VISUALLY
// Large, legible 10.5pt typography, 20-22pt table rows, perfectly filled pages
// ==========================================
function generateResumePDF(outputPath) {
  const pdf = new PDFBuilder(612, 792);
  const leftX = pdf.margin;
  const rightX = pdf.pageWidth - pdf.margin;
  const width = pdf.printableWidth;

  const COLOR_BLACK = [0, 0, 0];
  const COLOR_SUBTITLE = [30, 64, 175];     // #1e40af Blue
  const COLOR_LINK = [37, 99, 235];         // #2563eb Blue
  const COLOR_BORDER_DARK = [0, 0, 0];      // 1.5pt solid black section divider
  const COLOR_TABLE_LINE = [210, 215, 222]; // Clean table divider
  const COLOR_FOOTER = [107, 114, 128];     // Muted gray for footer

  function renderSectionHeader(title) {
    pdf.drawText(title.toUpperCase(), leftX, pdf.cursorY, 'F2', 11.5, COLOR_BLACK);
    pdf.cursorY -= 4.5;
    pdf.drawLine(leftX, pdf.cursorY, rightX, pdf.cursorY, 1.4, COLOR_BORDER_DARK);
    pdf.cursorY -= 14;
  }

  // ========================================
  // PAGE 1
  // ========================================
  pdf.cursorY = pdf.pageHeight - pdf.margin - 4;

  // Header (Centered, bold, legible font sizes matching Nestor's exactly)
  pdf.drawCenteredText("Mark Piolo A. Morente", pdf.cursorY, 'F2', 23, COLOR_BLACK);
  pdf.cursorY -= 19;

  pdf.drawCenteredText("Web Developer  |  Information Technology Student", pdf.cursorY, 'F2', 11.5, COLOR_SUBTITLE);
  pdf.cursorY -= 15;

  const contactLine = "Peñaranda, Nueva Ecija, Philippines  |  09678493459  |  morentemarkypiolo@gmail.com  |";
  const cRes = pdf.drawCenteredText(contactLine, pdf.cursorY, 'F1', 10, COLOR_BLACK);

  // Email link
  const emailPart = "morentemarkypiolo@gmail.com";
  const emailStart = contactLine.indexOf(emailPart);
  const emailOffset = measureText(contactLine.substring(0, emailStart), 10, false);
  const emailWidth = measureText(emailPart, 10, false);
  pdf.addLink(cRes.x + emailOffset, pdf.cursorY - 1, emailWidth, 11, "mailto:morentemarkypiolo@gmail.com");

  // Phone link
  const phonePart = "09678493459";
  const phoneStart = contactLine.indexOf(phonePart);
  const phoneOffset = measureText(contactLine.substring(0, phoneStart), 10, false);
  const phoneWidth = measureText(phonePart, 10, false);
  pdf.addLink(cRes.x + phoneOffset, pdf.cursorY - 1, phoneWidth, 11, "tel:09678493459");

  pdf.cursorY -= 13;

  const ghUrl = "https://github.com/kyoujin-pio";
  const ghRes = pdf.drawCenteredText(ghUrl, pdf.cursorY, 'F1', 10, COLOR_LINK);
  pdf.drawLine(ghRes.x, pdf.cursorY - 1, ghRes.x + ghRes.w, pdf.cursorY - 1, 0.7, COLOR_LINK);
  pdf.addLink(ghRes.x, pdf.cursorY - 1, ghRes.w, 11, ghUrl);

  pdf.cursorY -= 24;

  // 1. PROFESSIONAL SUMMARY
  renderSectionHeader("Professional Summary");
  const summaryText = "Motivated 4th-year Information Technology student at Nueva Ecija University of Science and Technology (NEUST) with practical experience in frontend web development using HTML5, CSS3, JavaScript, and Tailwind CSS, along with foundational knowledge in PHP and MySQL. Skilled in designing clean, responsive web layouts and building functional project-based applications. A dedicated and fast learner seeking an On-the-Job Training opportunity as a Junior Web Developer where I can contribute to real-world tasks, learn from industry mentors, and expand my technical capabilities.";
  const summaryLines = pdf.wrapText(summaryText, width, 10.5, false);
  for (const line of summaryLines) {
    pdf.drawText(line, leftX, pdf.cursorY, 'F1', 10.5, COLOR_BLACK);
    pdf.cursorY -= 15.5;
  }
  pdf.cursorY -= 12;

  // 2. TECHNICAL SKILLS (Table format matching Nestor's exactly)
  renderSectionHeader("Technical Skills");

  const col1W = 185;
  // Header top & bottom border
  pdf.drawLine(leftX, pdf.cursorY + 12, rightX, pdf.cursorY + 12, 1, COLOR_BLACK);
  pdf.drawText("Domain / Category", leftX, pdf.cursorY, 'F2', 10, COLOR_BLACK);
  pdf.drawText("Technologies, Frameworks & Core Competencies", leftX + col1W, pdf.cursorY, 'F2', 10, COLOR_BLACK);
  pdf.cursorY -= 5;
  pdf.drawLine(leftX, pdf.cursorY, rightX, pdf.cursorY, 1, COLOR_BLACK);
  pdf.cursorY -= 15;

  const skillsData = [
    { cat: "Programming Languages", items: "PHP, JavaScript, HTML5, CSS3" },
    { cat: "Frontend Development", items: "HTML5, CSS3, Tailwind CSS, Bootstrap" },
    { cat: "Backend Development", items: "PHP" },
    { cat: "Databases", items: "MySQL" },
    { cat: "Web Design & Principles", items: "Responsive Web Design, Basic UI/UX" },
    { cat: "Development Tools &\nDeployment", items: "Git, GitHub, Figma, Visual Studio Code, Vercel" }
  ];

  for (const sk of skillsData) {
    const isMultiLine = sk.cat.includes('\n');
    pdf.drawLine(leftX, pdf.cursorY + 13, rightX, pdf.cursorY + 13, 0.5, COLOR_TABLE_LINE);

    if (isMultiLine) {
      const parts = sk.cat.split('\n');
      pdf.drawText(parts[0], leftX, pdf.cursorY, 'F2', 10, COLOR_BLACK);
      pdf.drawText(parts[1], leftX, pdf.cursorY - 12, 'F2', 10, COLOR_BLACK);
      pdf.drawText(sk.items, leftX + col1W, pdf.cursorY - 5, 'F1', 10, COLOR_BLACK);
      pdf.cursorY -= 26;
    } else {
      pdf.drawText(sk.cat, leftX, pdf.cursorY, 'F2', 10, COLOR_BLACK);
      pdf.drawText(sk.items, leftX + col1W, pdf.cursorY, 'F1', 10, COLOR_BLACK);
      pdf.cursorY -= 19;
    }
  }
  pdf.cursorY -= 10;

  // 3. EDUCATION
  renderSectionHeader("Education");
  pdf.drawText("Bachelor of Science in Information Technology (BSIT)", leftX, pdf.cursorY, 'F2', 11, COLOR_BLACK);
  const eduDates = "Aug 2023 - Present";
  const eduDatesW = measureText(eduDates, 10.5, false);
  pdf.drawText(eduDates, rightX - eduDatesW, pdf.cursorY, 'F1', 10.5, COLOR_BLACK);
  pdf.cursorY -= 14;

  pdf.drawText("Nueva Ecija University of Science and Technology (NEUST)  |  Cabanatuan City, Nueva Ecija, Philippines", leftX, pdf.cursorY, 'F3', 10, COLOR_BLACK);
  pdf.cursorY -= 14;

  pdf.drawBulletDot(leftX + 6, pdf.cursorY + 3.2, 2.2, COLOR_BLACK);
  pdf.drawText("Relevant Coursework: ", leftX + 16, pdf.cursorY, 'F2', 10, COLOR_BLACK);
  const rcW = measureText("Relevant Coursework: ", 10, true);
  pdf.drawText("Web Systems and Technologies", leftX + 16 + rcW, pdf.cursorY, 'F1', 10, COLOR_BLACK);
  pdf.cursorY -= 20;

  // 4. PROJECT EXPERIENCE (Heading & Project 1 filling out Page 1 completely)
  renderSectionHeader("Project Experience");

  // Project 1: SmartBand
  pdf.drawText("SmartBand: Member Portal & Event System", leftX, pdf.cursorY, 'F2', 11, COLOR_BLACK);
  const p1Tech = "Vue.js 3, Vite, Tailwind CSS, JavaScript, PWA, Vercel";
  const p1TechW = measureText(p1Tech, 10, false);
  pdf.drawText(p1Tech, rightX - p1TechW, pdf.cursorY, 'F1', 10, COLOR_BLACK);
  pdf.cursorY -= 14;

  const p1Url = "https://band1870.vercel.app/";
  pdf.drawText(p1Url, leftX, pdf.cursorY, 'F1', 10, COLOR_LINK);
  const p1UrlW = measureText(p1Url, 10, false);
  pdf.drawLine(leftX, pdf.cursorY - 1, leftX + p1UrlW, pdf.cursorY - 1, 0.7, COLOR_LINK);
  pdf.addLink(leftX, pdf.cursorY - 1, p1UrlW, 12, p1Url);
  pdf.cursorY -= 16;

  const p1Bullets = [
    "Developed a progressive web application for Peñaranda Band 1870 to streamline member coordination, rehearsal schedules, and call-time dispatch using Vue.js 3, Vite, and Tailwind CSS.",
    "Implemented member engagement and attendance management features, along with automated call-time siren notifications and digital roll-call tracking.",
    "Built an interactive 3D officer directory carousel, user authentication portal, and dark/light responsive interface.",
    "Integrated service worker caching strategies for reliable offline schedule accessibility and attendance reliability scoring.",
    "Configured production build workflows and deployed the live application on Vercel."
  ];

  for (const bullet of p1Bullets) {
    pdf.drawBulletDot(leftX + 6, pdf.cursorY + 3.2, 2.2, COLOR_BLACK);
    const lines = pdf.wrapText(bullet, width - 20, 10, false);
    for (let li = 0; li < lines.length; li++) {
      pdf.drawText(lines[li], leftX + 16, pdf.cursorY, 'F1', 10, COLOR_BLACK);
      pdf.cursorY -= 14.5;
    }
    pdf.cursorY -= 4;
  }

  // Page 1 Footer (matching Nestor's bottom-right format)
  const footer1 = "Mark Piolo A. Morente — Page 1 of 2";
  const f1W = measureText(footer1, 9, false);
  pdf.drawText(footer1, rightX - f1W, 26, 'F1', 9, COLOR_FOOTER);

  console.log("Page 1 ended cleanly at Y:", pdf.cursorY);

  // ========================================
  // PAGE 2
  // ========================================
  pdf.newPage();
  pdf.cursorY = pdf.pageHeight - pdf.margin - 8;

  // Project 2: Personal Portfolio Website
  pdf.drawText("Personal Portfolio Website", leftX, pdf.cursorY, 'F2', 11, COLOR_BLACK);
  const p2Tech = "HTML, JavaScript, CSS";
  const p2TechW = measureText(p2Tech, 10, false);
  pdf.drawText(p2Tech, rightX - p2TechW, pdf.cursorY, 'F1', 10, COLOR_BLACK);
  pdf.cursorY -= 14;

  const p2Url = "https://kyoujin-pio.github.io/project-1/";
  pdf.drawText(p2Url, leftX, pdf.cursorY, 'F1', 10, COLOR_LINK);
  const p2UrlW = measureText(p2Url, 10, false);
  pdf.drawLine(leftX, pdf.cursorY - 1, leftX + p2UrlW, pdf.cursorY - 1, 0.7, COLOR_LINK);
  pdf.addLink(leftX, pdf.cursorY - 1, p2UrlW, 12, p2Url);
  pdf.cursorY -= 16;

  const p2Bullets = [
    "Developed a modern, single-page personal IT portfolio using semantic HTML5, custom CSS3, and vanilla JavaScript.",
    "Designed an interactive bento-grid layout featuring animated skill progress indicators, project modal popups, and verified certificate previews.",
    "Implemented full mobile responsiveness across different screen sizes and added interactive client-side form validation.",
    "Managed version control using Git and successfully published the live website via GitHub Pages."
  ];

  for (const bullet of p2Bullets) {
    pdf.drawBulletDot(leftX + 6, pdf.cursorY + 3.2, 2.0, COLOR_BLACK);
    const lines = pdf.wrapText(bullet, width - 20, 10, false);
    for (let li = 0; li < lines.length; li++) {
      pdf.drawText(lines[li], leftX + 16, pdf.cursorY, 'F1', 10, COLOR_BLACK);
      pdf.cursorY -= 14.5;
    }
    pdf.cursorY -= 4;
  }

  pdf.cursorY -= 28;

  // CERTIFICATIONS & PROFESSIONAL DEVELOPMENT
  renderSectionHeader("Certifications & Professional Development");

  const certCol2X = leftX + 295;

  // Table top & bottom border
  pdf.drawLine(leftX, pdf.cursorY + 12, rightX, pdf.cursorY + 12, 1, COLOR_BLACK);
  pdf.drawText("Certification / Training Program", leftX, pdf.cursorY, 'F2', 10, COLOR_BLACK);
  pdf.drawText("Credential Type", certCol2X, pdf.cursorY, 'F2', 10, COLOR_BLACK);
  const dHead = "Date Issued";
  const dHeadW = measureText(dHead, 10, true);
  pdf.drawText(dHead, rightX - dHeadW, pdf.cursorY, 'F2', 10, COLOR_BLACK);
  pdf.cursorY -= 5;
  pdf.drawLine(leftX, pdf.cursorY, rightX, pdf.cursorY, 1, COLOR_BLACK);
  pdf.cursorY -= 16;

  const certsData = [
    { name: "Pearson IT Specialist — HTML & CSS", type: "Specialist Certification", date: "October 2026" },
    { name: "Database 101: Data Storage, SQL and Query Optimization", type: "Certificate of Participation", date: "August 2026" },
    { name: "AI Tools 101: How to Use Google Gemini Like a Pro", type: "Certificate of Participation", date: "August 2026" },
    { name: "Learning Advocate 2026 Series: Emerging IT Innovations", type: "Certificate of Participation", date: "August 2026" },
    { name: "The 3 P's: Plan, Prepare, Progress —\nAI Safety & Career Launch", type: "Certificate of Participation", date: "October 2026" }
  ];

  for (const c of certsData) {
    const isMultiLine = c.name.includes('\n');
    pdf.drawLine(leftX, pdf.cursorY + 14, rightX, pdf.cursorY + 14, 0.5, COLOR_TABLE_LINE);

    const dW = measureText(c.date, 10, false);
    if (isMultiLine) {
      const parts = c.name.split('\n');
      pdf.drawText(parts[0], leftX, pdf.cursorY, 'F2', 10, COLOR_BLACK);
      pdf.drawText(parts[1], leftX, pdf.cursorY - 12, 'F2', 10, COLOR_BLACK);
      pdf.drawText(c.type, certCol2X, pdf.cursorY, 'F1', 10, COLOR_BLACK);
      pdf.drawText(c.date, rightX - dW, pdf.cursorY, 'F1', 10, COLOR_BLACK);
      pdf.cursorY -= 26;
    } else {
      pdf.drawText(c.name, leftX, pdf.cursorY, 'F2', 10, COLOR_BLACK);
      pdf.drawText(c.type, certCol2X, pdf.cursorY, 'F1', 10, COLOR_BLACK);
      pdf.drawText(c.date, rightX - dW, pdf.cursorY, 'F1', 10, COLOR_BLACK);
      pdf.cursorY -= 21;
    }
  }

  // Page 2 Footer
  const footer2 = "Mark Piolo A. Morente — Page 2 of 2";
  const f2W = measureText(footer2, 9, false);
  pdf.drawText(footer2, rightX - f2W, 26, 'F1', 9, COLOR_FOOTER);

  const buffer = pdf.buildPDF();
  fs.writeFileSync(outputPath, buffer);
  console.log(`Successfully generated updated 2-page resume PDF: ${outputPath} (${buffer.length} bytes, ${pdf.pages.length} page(s))`);
}

const destDir = path.resolve('C:/sirprince/resume');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const pdfPath = path.join(destDir, 'Mark_Piolo_Morente_Resume.pdf');
generateResumePDF(pdfPath);
