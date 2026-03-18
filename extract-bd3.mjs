import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://www.bigdates.ai/', { waitUntil: 'networkidle', timeout: 45000 });

// Scroll to load everything
await page.evaluate(async () => {
  for (let i = 0; i < document.body.scrollHeight; i += 400) {
    window.scrollTo(0, i);
    await new Promise(r => setTimeout(r, 150));
  }
  window.scrollTo(0, 0);
  await new Promise(r => setTimeout(r, 1000));
});
await page.waitForTimeout(2000);

// Extract section-by-section details
const sections = await page.evaluate(() => {
  const getCS = (el) => {
    if (!el) return {};
    const cs = getComputedStyle(el);
    return {
      bg: cs.backgroundColor, bgImage: cs.backgroundImage?.substring(0,300),
      color: cs.color, fontSize: cs.fontSize, fontWeight: cs.fontWeight,
      fontFamily: cs.fontFamily.substring(0,80), lineHeight: cs.lineHeight,
      letterSpacing: cs.letterSpacing, padding: cs.padding, margin: cs.margin,
      borderRadius: cs.borderRadius, border: cs.border?.substring(0,100),
      boxShadow: cs.boxShadow?.substring(0,150), textAlign: cs.textAlign,
      display: cs.display, flexDirection: cs.flexDirection, gap: cs.gap,
      maxWidth: cs.maxWidth, width: cs.width, height: cs.height,
      justifyContent: cs.justifyContent, alignItems: cs.alignItems,
      gridTemplateColumns: cs.gridTemplateColumns, textTransform: cs.textTransform,
      position: cs.position, overflow: cs.overflow, backdropFilter: cs.backdropFilter,
    };
  };

  // Manually identify each section by known class names from extraction
  const sectionSelectors = [
    { name: 'NAV', sel: 'nav, header' },
    { name: 'HERO', sel: '.hero' },
    { name: 'SHOWCASE', sel: '.showcase_section' },
    { name: 'CATEGORIES', sel: '.categories' },
    { name: 'HOW_IT_WORKS', sel: '.how_it_works' },
    { name: 'WHATSAPP', sel: '.whatsapp_animation_section' },
    { name: 'QR_SECTION', sel: '.qr_animation_section' },
    { name: 'WHY_CHOOSE', sel: '.why_choose_bg' },
    { name: 'TESTIMONIALS', sel: '.testimonials' },
    { name: 'FINAL_CTA', sel: '.final_cta' },
    { name: 'FOOTER', sel: '.secound_container' },
  ];

  const results = {};
  for (const { name, sel } of sectionSelectors) {
    const el = document.querySelector(sel);
    if (!el) { results[name] = null; continue; }

    const rect = el.getBoundingClientRect();
    const innerHtml = el.innerHTML;
    
    // Get key children with styles
    const children = [...el.children].slice(0, 15).map(c => ({
      tag: c.tagName,
      cls: (c.className?.toString?.() || '').substring(0, 100),
      styles: getCS(c),
      text: c.textContent?.substring(0, 100).trim(),
      childCount: c.children.length,
    }));

    results[name] = {
      styles: getCS(el),
      rect: { top: Math.round(rect.top + window.scrollY), height: Math.round(rect.height) },
      children,
      html: innerHtml.substring(0, 4000),
    };
  }

  // Also get the hero CTA button specifically
  const ctaBtn = document.querySelector('.hero a[href*="event"], .hero button, .hero .cta_btn, .hero a.cta');
  if (!ctaBtn) {
    // Try broader search
    const allLinks = [...document.querySelectorAll('.hero a')];
    const createBtn = allLinks.find(a => a.textContent.includes('Create'));
    if (createBtn) {
      results.HERO_CTA = { styles: getCS(createBtn), text: createBtn.textContent.trim() };
    }
  } else {
    results.HERO_CTA = { styles: getCS(ctaBtn), text: ctaBtn.textContent.trim() };
  }

  // Get "loved by" pill in hero
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const pills = [...heroSection.querySelectorAll('span, div, p')].filter(el => el.textContent.includes('Loved') || el.textContent.includes('loved') || el.textContent.includes('famil'));
    if (pills.length) {
      results.HERO_PILL = { styles: getCS(pills[0]), text: pills[0].textContent.trim(), html: pills[0].outerHTML.substring(0, 500) };
    }
  }

  // Category cards  
  const catCards = [...document.querySelectorAll('.categories a, .categories button, [class*="category_card"]')].slice(0, 8);
  results.CATEGORY_CARDS = catCards.map(c => ({
    text: c.textContent.trim().substring(0, 60),
    styles: getCS(c),
    innerElements: [...c.children].slice(0, 5).map(ch => ({
      tag: ch.tagName,
      styles: getCS(ch),
      text: ch.textContent?.trim().substring(0, 50),
    })),
  }));

  // How it works steps
  const steps = [...document.querySelectorAll('.steps_container > *, .how_it_works .step, [class*="step_card"]')].slice(0, 5);
  results.HOW_STEPS = steps.map(s => ({
    styles: getCS(s),
    text: s.textContent.trim().substring(0, 100),
    children: [...s.children].slice(0, 5).map(c => ({ tag: c.tagName, styles: getCS(c), text: c.textContent?.trim().substring(0, 50) })),
  }));

  // Why choose cards
  const whyCards = [...document.querySelectorAll('.why_choose_content .card, .why_choose_content > div > div')].slice(0, 6);
  results.WHY_CARDS = whyCards.map(c => ({
    styles: getCS(c),
    text: c.textContent.trim().substring(0, 100),
  }));

  // Testimonial cards
  const testCards = [...document.querySelectorAll('.testimonials_grid > *, .testimonials .card')].slice(0, 4);
  results.TESTIMONIAL_CARDS = testCards.map(c => ({
    styles: getCS(c),
    text: c.textContent.trim().substring(0, 150),
  }));

  return results;
});

writeFileSync('screenshots/bd-sections.json', JSON.stringify(sections, null, 2));

// Print key findings
for (const [name, data] of Object.entries(sections)) {
  if (!data) { console.log(`${name}: NOT FOUND`); continue; }
  if (data.styles) {
    console.log(`\n=== ${name} ===`);
    console.log(`  bg: ${data.styles.bg} | bgImage: ${data.styles.bgImage?.substring(0,80) || 'none'}`);
    console.log(`  padding: ${data.styles.padding} | maxWidth: ${data.styles.maxWidth}`);
    if (data.rect) console.log(`  position: @${data.rect.top}px, h=${data.rect.height}px`);
    if (data.text) console.log(`  text: ${data.text.substring(0,80)}`);
  }
  if (Array.isArray(data)) {
    data.forEach((item, i) => {
      console.log(`  [${i}] ${item.text?.substring(0,60)} | bg:${item.styles?.bg} | radius:${item.styles?.borderRadius}`);
    });
  }
}

await browser.close();
