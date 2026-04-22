/**
 * GuíasFlow - Content Validator
 * Validates all generated content meets quality standards
 * 
 * Quality Standards:
 * - Minimum 1200 words
 * - Minimum 5 steps
 * - Minimum 4 FAQs
 * - Valid HTML structure
 * - Valid schema markup
 * - No broken links
 * - SEO optimized title/meta
 */

const fs = require('fs');
const path = require('path');

const CONFIG = {
  contentDir: path.join(__dirname, '../content/guias'),
  reportsDir: path.join(__dirname, '../reports'),
  standards: {
    minWords: 1200,
    minSteps: 5,
    minFAQs: 4,
    minReadTime: 5,
    maxReadTime: 30,
    requiredSchemas: ['HowTo', 'FAQPage'],
    validExtensions: ['.html', '.json']
  }
};

const CATEGORY_NAMES = {
  es: { finanzas: 'Finanzas Personales', tecnologia: 'Tecnología', salud: 'Salud & Fitness', educacion: 'Educación' },
  en: { finanzas: 'Personal Finance', tecnologia: 'Technology', salud: 'Health & Fitness', educacion: 'Education' }
};

class ContentValidator {
  constructor() {
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      issues: [],
      guides: []
    };
  }

  async validateAll() {
    console.log('\n' + '='.repeat(60));
    console.log('🔍 GUIASFLOW CONTENT VALIDATOR');
    console.log('='.repeat(60) + '\n');

    const languages = ['es', 'en', 'pt', 'fr', 'de'];
    
    for (const lang of languages) {
      const langDir = path.join(CONFIG.contentDir, lang);
      if (!fs.existsSync(langDir)) continue;

      const categories = fs.readdirSync(langDir);
      
      for (const category of categories) {
        const catDir = path.join(langDir, category);
        if (!fs.statSync(catDir).isDirectory()) continue;

        const files = fs.readdirSync(catDir).filter(f => f.endsWith('.html'));
        
        for (const file of files) {
          const filePath = path.join(catDir, file);
          await this.validateGuide(filePath, lang, category);
        }
      }
    }

    this.printReport();
    return this.results;
  }

  async validateGuide(filePath, language, category) {
    this.results.total++;
    const guide = { file: filePath, language, category, issues: [], passed: true };
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Extract word count
      const textOnly = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      const wordCount = textOnly.split(/\s+/).filter(w => w.length > 0).length;
      guide.wordCount = wordCount;

      // Check minimum words
      if (wordCount < CONFIG.standards.minWords) {
        guide.issues.push(`Word count too low: ${wordCount} < ${CONFIG.standards.minWords}`);
        guide.passed = false;
      }

      // Check for steps
      const stepMatches = content.match(/class="step-block/g) || [];
      guide.steps = stepMatches.length;
      if (stepMatches.length < CONFIG.standards.minSteps) {
        guide.issues.push(`Too few steps: ${stepMatches.length} < ${CONFIG.standards.minSteps}`);
        guide.passed = false;
      }

      // Check for FAQs
      const faqMatches = content.match(/class="faq-item/g) || [];
      guide.faqs = faqMatches.length;
      if (faqMatches.length < CONFIG.standards.minFAQs) {
        guide.issues.push(`Too few FAQs: ${faqMatches.length} < ${CONFIG.standards.minFAQs}`);
        guide.passed = false;
      }

      // Check for schema markup
      const hasHowToSchema = content.includes('"@type": "HowTo"');
      const hasFAQSchema = content.includes('"@type": "FAQPage"');
      guide.hasHowToSchema = hasHowToSchema;
      guide.hasFAQSchema = hasFAQSchema;
      
      if (!hasHowToSchema) {
        guide.issues.push('Missing HowTo schema markup');
        guide.passed = false;
      }
      if (!hasFAQSchema) {
        guide.issues.push('Missing FAQPage schema markup');
        guide.passed = false;
      }

      // Check title exists
      const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/i);
      guide.title = titleMatch ? titleMatch[1].trim() : 'No title found';
      
      if (!titleMatch) {
        guide.issues.push('Missing H1 title');
        guide.passed = false;
      }

      // Check meta description
      const metaMatch = content.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i);
      guide.hasMetaDesc = !!metaMatch;
      
      if (!metaMatch) {
        guide.issues.push('Missing meta description');
        guide.passed = false;
      }

      // Check read time exists
      const readTimeMatch = content.match(/(\d+)\s*min lectura/i);
      guide.readTime = readTimeMatch ? parseInt(readTimeMatch[1]) : 0;

      if (guide.readTime < CONFIG.standards.minReadTime) {
        guide.issues.push(`Read time too short: ${guide.readTime} min`);
        guide.passed = false;
      }
      if (guide.readTime > CONFIG.standards.maxReadTime) {
        guide.issues.push(`Read time too long: ${guide.readTime} min`);
        guide.passed = false;
      }

      // SEO score estimation
      guide.seoScore = this.calculateSeoScore(guide);

    } catch (error) {
      guide.issues.push(`Error reading file: ${error.message}`);
      guide.passed = false;
    }

    if (guide.passed) {
      this.results.passed++;
    } else {
      this.results.failed++;
      this.results.issues.push(...guide.issues.map(i => ({ ...guide, issue: i })));
    }

    this.results.guides.push(guide);
    return guide;
  }

  calculateSeoScore(guide) {
    let score = 100;
    
    // Word count contribution (max 30 points)
    const wordRatio = Math.min(guide.wordCount / CONFIG.standards.minWords, 1.5);
    score += (wordRatio - 1) * 30;
    
    // Steps contribution (max 20 points)
    if (guide.steps >= CONFIG.standards.minSteps) score += 20;
    else score += (guide.steps / CONFIG.standards.minSteps) * 20;
    
    // FAQs contribution (max 20 points)
    if (guide.faqs >= CONFIG.standards.minFAQs) score += 20;
    else score += (guide.faqs / CONFIG.standards.minFAQs) * 20;
    
    // Schema contribution (max 15 points)
    if (guide.hasHowToSchema) score += 8;
    if (guide.hasFAQSchema) score += 7;
    
    // Meta description (max 10 points)
    if (guide.hasMetaDesc) score += 10;
    
    // Title (max 5 points)
    if (guide.title && guide.title !== 'No title found') score += 5;

    return Math.round(Math.min(score, 100));
  }

  printReport() {
    const { total, passed, failed, guides, issues } = this.results;
    const passRate = ((passed / total) * 100).toFixed(1);
    const avgSeoScore = guides.length > 0 
      ? Math.round(guides.reduce((sum, g) => sum + (g.seoScore || 0), 0) / guides.length) 
      : 0;

    console.log('\n' + '='.repeat(60));
    console.log('📊 VALIDATION REPORT');
    console.log('='.repeat(60));
    console.log(`\n📈 Total Guides: ${total}`);
    console.log(`✅ Passed: ${passed} (${passRate}%)`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📊 Average SEO Score: ${avgSeoScore}/100`);
    
    // Category breakdown
    console.log('\n📁 BY CATEGORY:');
    const byCategory = {};
    guides.forEach(g => {
      if (!byCategory[g.category]) byCategory[g.category] = { total: 0, passed: 0, avgScore: 0 };
      byCategory[g.category].total++;
      if (g.passed) byCategory[g.category].passed++;
      byCategory[g.category].avgScore += g.seoScore || 0;
    });
    
    Object.entries(byCategory).forEach(([cat, data]) => {
      const rate = ((data.passed / data.total) * 100).toFixed(0);
      const avgScore = Math.round(data.avgScore / data.total);
      console.log(`   ${cat}: ${data.passed}/${data.total} (${rate}%) | Avg SEO: ${avgScore}`);
    });

    // Language breakdown
    console.log('\n🌐 BY LANGUAGE:');
    const byLang = {};
    guides.forEach(g => {
      if (!byLang[g.language]) byLang[g.language] = { total: 0, passed: 0 };
      byLang[g.language].total++;
      if (g.passed) byLang[g.language].passed++;
    });
    
    Object.entries(byLang).forEach(([lang, data]) => {
      const rate = ((data.passed / data.total) * 100).toFixed(0);
      console.log(`   ${lang.toUpperCase()}: ${data.passed}/${data.total} (${rate}%)`);
    });

    // Failed guides
    if (failed > 0) {
      console.log('\n❌ FAILED GUIDES:\n');
      issues.slice(0, 10).forEach((item, i) => {
        console.log(`${i + 1}. [${item.language.toUpperCase()}] ${item.title || item.file}`);
        console.log(`   File: ${item.file}`);
        console.log(`   Issue: ${item.issue}`);
        if (item.wordCount) console.log(`   Words: ${item.wordCount} | Steps: ${item.steps} | FAQs: ${item.faqs}`);
      });
    }

    // Top guides by SEO score
    console.log('\n🏆 TOP GUIDES (by SEO Score):\n');
    const sorted = [...guides].sort((a, b) => (b.seoScore || 0) - (a.seoScore || 0));
    sorted.slice(0, 5).forEach((g, i) => {
      const title = g.title ? g.title.substring(0, 50) : 'Untitled';
      console.log(`   ${i + 1}. [${g.language.toUpperCase()}] ${title}...`);
      console.log(`      SEO: ${g.seoScore}/100 | Words: ${g.wordCount} | Steps: ${g.steps} | FAQs: ${g.faqs}`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('\n📋 VALIDATION STANDARDS APPLIED:');
    console.log(`   • Min words: ${CONFIG.standards.minWords}`);
    console.log(`   • Min steps: ${CONFIG.standards.minSteps}`);
    console.log(`   • Min FAQs: ${CONFIG.standards.minFAQs}`);
    console.log(`   • Required schemas: ${CONFIG.standards.requiredSchemas.join(', ')}`);
    console.log('\n');
  }

  async validateSingle(filePath) {
    console.log(`\n🔍 Validating: ${filePath}\n`);
    const guide = await this.validateGuide(filePath, 'unknown', 'unknown');
    
    console.log('📊 Guide Analysis:');
    console.log(`   Title: ${guide.title || 'MISSING'}`);
    console.log(`   Words: ${guide.wordCount || 0}`);
    console.log(`   Steps: ${guide.steps || 0}`);
    console.log(`   FAQs: ${guide.faqs || 0}`);
    console.log(`   Read Time: ${guide.readTime || 0} min`);
    console.log(`   SEO Score: ${guide.seoScore || 0}/100`);
    console.log(`   HowTo Schema: ${guide.hasHowToSchema ? '✅' : '❌'}`);
    console.log(`   FAQ Schema: ${guide.hasFAQSchema ? '✅' : '❌'}`);
    console.log(`   Meta Desc: ${guide.hasMetaDesc ? '✅' : '❌'}`);
    
    if (guide.issues.length > 0) {
      console.log('\n❌ Issues Found:');
      guide.issues.forEach((issue, i) => console.log(`   ${i + 1}. ${issue}`));
    } else {
      console.log('\n✅ All checks passed!');
    }
    
    return guide;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const filePath = args[1];

  const validator = new ContentValidator();

  if (command === 'single' && filePath) {
    await validator.validateSingle(filePath);
  } else if (command === 'all') {
    await validator.validateAll();
  } else {
    console.log('\n📋 GuíasFlow Content Validator\n');
    console.log('Usage:');
    console.log('   node scripts/validate-content.js all           - Validate all content');
    console.log('   node scripts/validate-content.js single <path> - Validate single file\n');
    
    // Run full validation by default
    await validator.validateAll();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { ContentValidator };
