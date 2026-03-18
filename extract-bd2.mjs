import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://www.bigdates.ai/', { waitUntil: 'networkidle', timeout: 45000 });

// Scroll the entire page to trigger lazy-loading
await page.evaluate(async () => {
  for (let i = 0; i < document.body.scrollHeight; i += 400) {
    window.scrollTo(0, i);
    await new Promise(r => setTimeout(r, 200));
  }
  window.scrollTo(0, 0);
  await new Promise(r => setTimeout(r, 1000));
});

await page.waitForTimeout(2000);

// Take full page screenshot
await page.screenshot({ path: 'screenshots/bd-full-home.png', fullPage: true });

// Extract ALL elements with their computed styles
const data = await page.evaluate(() => {
  const getCS = (el) => {
    const cs = getComputedStyle(el);
    return {
      bg: cs.backgroundColor,
      bgImage: cs.backgroundImage,
      color: cs.color,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      fontFamily: cs.fontFamily.substring(0, 100),
      lineHeight: cs.lineHeight,
      letterSpacing: cs.letterSpacing,
      padding: cs.padding,
      margin: cs.margin,
      borderRadius: cs.borderRadius,
      border: cs.border,
      boxShadow: cs.boxShadow,
      textAlign: cs.textAlign,
      display: cs.display,
      flexDirection: cs.flexDirection,
      gap: cs.gap,
      maxWidth: cs.maxWidth,
      justifyContent: cs.justifyContent,
      alignItems: cs.alignItems,
      gridTemplateColumns: cs.gridTemplateColumns,
      textTransform: cs.textTransform,
      position: cs.position,
    };
  };

  // Get everything in the page
  const allNodes = document.querySelectorAll('*');
  const pageHeight = document.body.scrollHeight;
  
  // Find all visually distinct sections by scanning Y positions
  const sectionBreaks = [];
  let lastBg = '';
  for (const node of allNodes) {
    if (node.offsetHeight < 80 || node.offsetWidth < 800) continue;
    const cs = getComputedStyle(node);
    const bg = cs.backgroundColor + cs.backgroundImage;
    const rect = node.getBoundingClientRect();
    if (bg !== lastBg && rect.height > 100) {
      sectionBreaks.push({
        tag: node.tagName,
        className: (node.className?.toString?.() || '').substring(0, 200),
        top: rect.top + window.scrollY,
        height: rect.height,
        bg: cs.backgroundColor,
        bgImage: cs.backgroundImage?.substring(0, 200),
      });
      lastBg = bg;
    }
  }

  // Get all headings
  const headings = [...document.querySelectorAll('h1, h2, h3, h4, h5')].map(h => ({
    tag: h.tagName,
    text: h.textContent.trim().substring(0, 150),
    styles: getCS(h),
    top: h.getBoundingClientRect().top + window.scrollY,
  }));

  // Get all buttons/CTAs
  const buttons = [...document.querySelectorAll('button, a[href]')].filter(b => {
    const text = b.textContent.trim();
    return text.length > 0 && text.length < 50 && b.offsetHeight > 20;
  }).slice(0, 30).map(b => ({
    text: b.textContent.trim(),
    tag: b.tagName,
    href: b.href || '',
    styles: getCS(b),
    top: b.getBoundingClientRect().top + window.scrollY,
  }));

  // Get all images
  const images = [...document.querySelectorAll('img')].filter(i => i.offsetHeight > 30).slice(0, 30).map(i => ({
    src: i.src?.substring(0, 200),
    alt: i.alt,
    width: i.offsetWidth,
    height: i.offsetHeight,
    top: i.getBoundingClientRect().top + window.scrollY,
  }));

  // Get the nav
  const nav = document.querySelector('nav') || document.querySelector('header');
  let navInfo = null;
  if (nav) {
    navInfo = {
      styles: getCS(nav),
      html: nav.innerHTML.substring(0, 5000),
      links: [...nav.querySelectorAll('a')].map(a => ({
        text: a.textContent.trim(),
        href: a.href,
        styles: getCS(a),
      })),
    };
  }

  // Get the footer
  const footer = document.querySelector('footer') || [...document.querySelectorAll('*')].filter(n => n.offsetHeight > 100 && n.getBoundingClientRect().top + window.scrollY > pageHeight - 600)[0];
  let footerInfo = null;
  if (footer) {
    footerInfo = {
      styles: getCS(footer),
      html: footer.innerHTML.substring(0, 5000),
    };
  }

  // Get full page HTML structure (just tags and classes)
  const getStructure = (el, depth = 0) => {
    if (depth > 4 || !el || el.offsetHeight < 10) return '';
    const cls = (el.className?.toString?.() || '').substring(0, 80);
    const tag = el.tagName?.toLowerCase();
    if (!tag) return '';
    let result = '  '.repeat(depth) + `<${tag}` + (cls ? ` class="${cls}"` : '') + `>\n`;
    for (const child of el.children) {
      result += getStructure(child, depth + 1);
    }
    return result;
  };
  
  const body = document.body;
  const structure = getStructure(body);

  return {
    pageHeight,
    title: document.title,
    bodyBg: getCS(body).bg,
    sectionBreaks: sectionBreaks.slice(0, 30),
    headings,
    buttons,
    images,
    navInfo,
    footerInfo,
    structure: structure.substring(0, 15000),
  };
});

writeFileSync('screenshots/bd-data.json', JSON.stringify(data, null, 2));

console.log('Page height:', data.pageHeight);
console.log('Body bg:', data.bodyBg);
console.log('\n=== HEADINGS ===');
data.headings.forEach(h => console.log(`${h.tag} @${Math.round(h.top)}px: "${h.text}" | ${h.styles.fontSize}/${h.styles.fontWeight} | color:${h.styles.color} | font:${h.styles.fontFamily.substring(0,30)}`));
console.log('\n=== SECTION BACKGROUNDS ===');
data.sectionBreaks.forEach((s, i) => console.log(`${i}: @${Math.round(s.top)}px h=${Math.round(s.height)}px | bg:${s.bg} | ${s.bgImage?.substring(0,60) || 'none'} | ${s.className.substring(0,50)}`));
console.log('\n=== CTA BUTTONS ===');
data.buttons.filter(b => b.styles.bg !== 'rgba(0, 0, 0, 0)' || b.styles.border !== '0px none rgb(0, 0, 0)').slice(0, 15).forEach(b => console.log(`"${b.text}" | bg:${b.styles.bg} | color:${b.styles.color} | radius:${b.styles.borderRadius} | shadow:${b.styles.boxShadow?.substring(0,60)}`));
console.log('\n=== NAV LINKS ===');
data.navInfo?.links.forEach(l => console.log(`"${l.text}" | ${l.styles.fontSize}/${l.styles.fontWeight} | color:${l.styles.color} | bg:${l.styles.bg} | radius:${l.styles.borderRadius} | border:${l.styles.border?.substring(0,60)}`));

await browser.close();
