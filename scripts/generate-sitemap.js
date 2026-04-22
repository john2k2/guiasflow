/**
 * Sitemap Generator for GuíasFlow
 * Creates sitemap.xml for all guides in all languages
 */

const fs = require('fs');
const path = require('path');

const CONFIG = {
  baseUrl: 'https://guiasflow.github.io',
  languages: ['es', 'en', 'pt', 'fr', 'de'],
  categories: ['finanzas', 'tecnologia', 'salud', 'cocina', 'educacion', 'hogar'],
  outputFile: path.join(__dirname, '../src/sitemap.xml'),
  contentDir: path.join(__dirname, '../src/content/guias')
};

function getAllGuides() {
  const guides = [];
  
  for (const lang of CONFIG.languages) {
    const langDir = path.join(CONFIG.contentDir, lang);
    
    if (!fs.existsSync(langDir)) continue;
    
    for (const category of CONFIG.categories) {
      const categoryDir = path.join(langDir, category);
      
      if (!fs.existsSync(categoryDir)) continue;
      
      const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.html'));
      
      for (const file of files) {
        const slug = file.replace('.html', '');
        guides.push({
          language: lang,
          category: category,
          slug: slug,
          url: `${CONFIG.baseUrl}/${lang}/guides/${slug}/`
        });
      }
    }
  }
  
  return guides;
}

function generateSitemap() {
  const guides = getAllGuides();
  const today = new Date().toISOString().split('T')[0];
  
  const urls = [
    CONFIG.languages.map(lang => `
    <url>
      <loc>${CONFIG.baseUrl}/${lang}/</loc>
      <lastmod>${today}</lastmod>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>`).join(''),
    CONFIG.categories.map(cat => CONFIG.languages.map(lang => `
    <url>
      <loc>${CONFIG.baseUrl}/${lang}/category/${cat}/</loc>
      <lastmod>${today}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`).join('')).join(''),
    guides.map(guide => `
    <url>
      <loc>${guide.url}</loc>
      <lastmod>${today}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
      <xhtml:link rel="alternate" hreflang="es" href="${CONFIG.baseUrl}/es/guides/${guide.slug}/"/>
      <xhtml:link rel="alternate" hreflang="en" href="${CONFIG.baseUrl}/en/guides/${guide.slug}/"/>
      <xhtml:link rel="alternate" hreflang="pt" href="${CONFIG.baseUrl}/pt/guides/${guide.slug}/"/>
      <xhtml:link rel="alternate" hreflang="fr" href="${CONFIG.baseUrl}/fr/guides/${guide.slug}/"/>
      <xhtml:link rel="alternate" hreflang="de" href="${CONFIG.baseUrl}/de/guides/${guide.slug}/"/>
    </url>`).join('')
  ].join('');
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;
  
  fs.writeFileSync(CONFIG.outputFile, sitemap);
  console.log(`✅ Sitemap generado: ${CONFIG.outputFile}`);
  console.log(`📊 Total URLs: ${guides.length + CONFIG.languages.length + (CONFIG.languages.length * CONFIG.categories.length)}`);
}

if (require.main === module) {
  generateSitemap();
}

module.exports = { generateSitemap, getAllGuides };
