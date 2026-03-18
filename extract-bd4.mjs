import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://www.bigdates.ai/', { waitUntil: 'networkidle', timeout: 45000 });
await page.evaluate(async () => {
  for (let i = 0; i < document.body.scrollHeight; i += 400) { window.scrollTo(0, i); await new Promise(r => setTimeout(r, 150)); }
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 1000));
});
await page.waitForTimeout(2000);

const html = await page.evaluate(() => {
  const sections = {};
  // Get hero inner structure
  const hero = document.querySelector('.hero');
  if (hero) sections.hero = hero.innerHTML;
  
  const showcase = document.querySelector('.showcase_section');
  if (showcase) sections.showcase = showcase.innerHTML;
  
  const cats = document.querySelector('.categories');
  if (cats) sections.categories = cats.innerHTML;
  
  const how = document.querySelector('.how_it_works');
  if (how) sections.howItWorks = how.innerHTML;
  
  const wa = document.querySelector('.whatsapp_animation_section');
  if (wa) sections.whatsapp = wa.innerHTML;
  
  const qr = document.querySelector('.qr_animation_section');
  if (qr) sections.qr = qr.innerHTML;
  
  const why = document.querySelector('.why_choose_bg');
  if (why) sections.whyChoose = why.innerHTML;
  
  const test = document.querySelector('.testimonials');
  if (test) sections.testimonials = test.innerHTML;
  
  const cta = document.querySelector('.final_cta');
  if (cta) sections.finalCta = cta.innerHTML;

  const nav = document.querySelector('nav');
  if (nav) sections.nav = nav.innerHTML;

  const footer = document.querySelector('.secound_container');
  if (footer) sections.footer = footer.innerHTML;
  
  return sections;
});

for (const [name, content] of Object.entries(html)) {
  writeFileSync(`screenshots/bd-html-${name}.html`, content);
  console.log(`${name}: ${content.length} chars`);
}

await browser.close();
