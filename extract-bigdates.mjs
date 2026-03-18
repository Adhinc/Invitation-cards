import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://www.bigdates.ai/', { waitUntil: 'networkidle', timeout: 30000 });

// Extract complete homepage structure section by section
const data = await page.evaluate(() => {
  const getStyles = (el) => {
    const cs = getComputedStyle(el);
    return {
      bg: cs.backgroundColor,
      color: cs.color,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      fontFamily: cs.fontFamily,
      lineHeight: cs.lineHeight,
      letterSpacing: cs.letterSpacing,
      padding: cs.padding,
      margin: cs.margin,
      borderRadius: cs.borderRadius,
      border: cs.border,
      boxShadow: cs.boxShadow,
      textAlign: cs.textAlign,
      display: cs.display,
      gap: cs.gap,
      maxWidth: cs.maxWidth,
      width: cs.width,
      height: cs.height,
      textTransform: cs.textTransform,
      opacity: cs.opacity,
      backgroundImage: cs.backgroundImage,
    };
  };

  // Get all top-level sections
  const sections = [];
  const allElements = document.querySelectorAll('section, [class*="section"], main > div, body > div > div');
  
  // Get body and main container styles
  const body = document.body;
  const bodyStyles = getStyles(body);
  
  // Get navbar
  const nav = document.querySelector('nav, header, [class*="nav"]');
  let navData = null;
  if (nav) {
    navData = {
      html: nav.outerHTML.substring(0, 3000),
      styles: getStyles(nav),
      height: nav.offsetHeight,
      links: [...nav.querySelectorAll('a')].map(a => ({
        text: a.textContent.trim(),
        styles: getStyles(a),
      })).slice(0, 15),
    };
  }

  // Walk through all direct children of main content area to find sections
  const mainContent = document.querySelector('main') || document.body;
  const directChildren = [...mainContent.children];
  
  const sectionData = [];
  for (const child of directChildren) {
    if (child.offsetHeight < 20) continue;
    const rect = child.getBoundingClientRect();
    const cs = getStyles(child);
    
    // Get text content summary
    const headings = [...child.querySelectorAll('h1, h2, h3, h4')].map(h => ({
      tag: h.tagName,
      text: h.textContent.trim().substring(0, 100),
      styles: getStyles(h),
    }));
    
    const paragraphs = [...child.querySelectorAll('p')].slice(0, 5).map(p => ({
      text: p.textContent.trim().substring(0, 150),
      styles: getStyles(p),
    }));
    
    const buttons = [...child.querySelectorAll('button, a[class*="btn"], a[class*="button"], [role="button"]')].slice(0, 5).map(b => ({
      text: b.textContent.trim().substring(0, 50),
      styles: getStyles(b),
    }));
    
    // Get the first 2000 chars of HTML structure
    const htmlSnippet = child.outerHTML.substring(0, 2500);
    
    sectionData.push({
      tag: child.tagName,
      className: child.className?.substring?.(0, 200) || '',
      rect: { top: rect.top, height: rect.height, width: rect.width },
      styles: cs,
      headings,
      paragraphs,
      buttons,
      htmlSnippet,
      childCount: child.children.length,
    });
  }
  
  return {
    url: location.href,
    title: document.title,
    bodyStyles,
    navData,
    sectionCount: sectionData.length,
    sections: sectionData,
  };
});

// Also take a full page screenshot
await page.screenshot({ path: 'screenshots/bigdates-home-full.png', fullPage: true });

// Take section-by-section screenshots
const sectionScreenshots = await page.evaluate(() => {
  const main = document.querySelector('main') || document.body;
  const children = [...main.children].filter(c => c.offsetHeight > 50);
  return children.map((c, i) => {
    const rect = c.getBoundingClientRect();
    return { i, top: rect.top + window.scrollY, height: rect.height, width: rect.width };
  });
});

for (let i = 0; i < Math.min(sectionScreenshots.length, 12); i++) {
  const s = sectionScreenshots[i];
  await page.screenshot({
    path: `screenshots/bd-section-${i}.png`,
    clip: { x: 0, y: s.top, width: 1440, height: Math.min(s.height, 2000) }
  });
}

await browser.close();

// Write the extracted data
import { writeFileSync } from 'fs';
writeFileSync('screenshots/bigdates-structure.json', JSON.stringify(data, null, 2));
console.log(`Extracted ${data.sectionCount} sections`);
console.log('Nav:', data.navData ? 'found' : 'not found');
data.sections.forEach((s, i) => {
  console.log(`Section ${i}: ${s.headings[0]?.text || '(no heading)'} | bg: ${s.styles.bg} | h: ${Math.round(s.rect.height)}px`);
});
