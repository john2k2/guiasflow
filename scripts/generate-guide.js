/**
 * GuíasFlow - Content Generation Script
 * Uses MiniMax API to generate SEO-optimized guides
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  apiHost: process.env.MINIMAX_API_HOST || 'https://api.minimax.io',
  apiKey: process.env.MINIMAX_API_KEY,
  outputDir: path.join(__dirname, '../content/guias'),
  templateFile: path.join(__dirname, '../templates/guide-template.html'),
  languages: ['es', 'en', 'pt', 'fr', 'de'],
  highCpcCategories: ['finanzas', 'tecnologia', 'salud', 'legal', 'educacion']
};

const CATEGORY_INFO = {
  finanzas: {
    name: 'Finanzas Personales',
    nameEn: 'Personal Finance',
    keywords: ['invertir', 'ahorrar', 'fondos', 'bolsa', 'crypto', 'bitcoin', 'bancos', 'crédito'],
    cpcRange: '$15-50'
  },
  tecnologia: {
    name: 'Tecnología',
    nameEn: 'Technology',
    keywords: ['programación', 'código', 'python', 'javascript', 'apps', 'software', 'IA', 'AI', 'chatgpt'],
    cpcRange: '$10-30'
  },
  salud: {
    name: 'Salud & Fitness',
    nameEn: 'Health & Fitness',
    keywords: ['ejercicio', 'gimnasio', 'dieta', 'nutrición', 'yoga', 'correr', 'perder peso', 'musculo'],
    cpcRange: '$12-35'
  },
  legal: {
    name: 'Asesoría Legal',
    nameEn: 'Legal Advice',
    keywords: ['ley', 'abogado', 'derecho', 'contrato', 'demanda', 'tribunal', 'inmigración'],
    cpcRange: '$15-40'
  },
  educacion: {
    name: 'Educación',
    nameEn: 'Education',
    keywords: ['aprender', 'estudiar', 'universidad', 'cursos', 'certificación', 'idiomas', 'inglés'],
    cpcRange: '$8-20'
  },
  cocina: {
    name: 'Cocina & Recetas',
    nameEn: 'Cooking & Recipes',
    keywords: ['receta', 'cocinar', 'comida', 'horno', 'plancha', 'saludable', 'fácil', 'rápido'],
    cpcRange: '$5-15'
  },
  hogar: {
    name: 'Hogar & Bricolaje',
    nameEn: 'Home & DIY',
    keywords: ['casa', 'reparar', 'decorar', 'jardín', 'pintar', 'carpintería', 'baño', 'cocina'],
    cpcRange: '$5-15'
  }
};

async function callMiniMaxAPI(prompt, systemPrompt = '') {
  return new Promise((resolve, reject) => {
    if (!CONFIG.apiKey) {
      reject(new Error('MINIMAX_API_KEY not configured'));
      return;
    }

    const body = JSON.stringify({
      model: 'MiniMax-M2.7',
      messages: [
        { role: 'system', content: systemPrompt || 'You are a helpful assistant that generates SEO-optimized content in multiple languages.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    const options = {
      hostname: 'api.minimax.io',
      path: '/v1/text/chatcompletion_v2',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.apiKey}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.choices && parsed.choices[0] && parsed.choices[0].message) {
            resolve(parsed.choices[0].message.content);
          } else {
            reject(new Error(`API Error: ${JSON.stringify(parsed)}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function generateGuideContent(topic, category, language = 'es') {
  const langPrompt = {
    es: 'Genera el contenido en ESPAÑOL.',
    en: 'Generate the content in ENGLISH.',
    pt: 'Gere o conteúdo em PORTUGUÊS.',
    fr: 'Générez le contenu en FRANÇAIS.',
    de: 'Generieren Sie den Inhalt in DEUTSCH.'
  };

  const systemPrompt = `Eres un escritor experto en crear guías paso a paso SEO-optimizadas. 
Sigue exactamente el formato JSON especificado. El contenido debe ser informativo, útil y estar estructurado para maximizar la monetización con Google AdSense.
Incluye secciones claras, pasos numerados, tips y preguntas frecuentes.`;

  const prompt = `${langPrompt[language]}
Topic: ${topic}
Category: ${category}

Generate a complete guide in JSON format:
{
  "title": "SEO-optimized title with 'Cómo' prefix",
  "meta_description": "155 char meta description for search results",
  "intro": "2-3 paragraph introduction that hooks the reader",
  "total_time": "PT15M or similar ISO duration",
  "supplies": ["item1", "item2"],
  "tools": ["tool1", "tool2"],
  "steps": [
    {
      "title": "Step 1 title",
      "content": "Detailed paragraph explaining this step",
      "tip": "Optional tip for this step"
    }
  ],
  "faqs": [
    {
      "question": "Common question",
      "answer": "Clear concise answer"
    }
  ],
  "related_topics": ["topic1", "topic2", "topic3"]
}`;

  try {
    const content = await callMiniMaxAPI(prompt, systemPrompt);
    const jsonMatch = content.match(/\{[\s\S]*?"steps"[\s\S]*?"faqs"[\s\S]*?\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function generateGuideHTML(guideData, category, language) {
  const template = fs.readFileSync(CONFIG.templateFile, 'utf8');
  
  const categoryInfo = CATEGORY_INFO[category] || CATEGORY_INFO.cocina;
  const categoryName = language === 'en' ? categoryInfo.nameEn : categoryInfo.name;
  
  const stepsHTML = guideData.steps.map((step, i) => `
    <div class="step-block">
      <div class="step-number">${i + 1}</div>
      <h3>${step.title}</h3>
      <p>${step.content}</p>
      ${step.tip ? `<div class="tip-box"><strong>Tip:</strong> ${step.tip}</div>` : ''}
    </div>
  `).join('\n');

  const faqHTML = guideData.faqs.map(faq => `
    <div class="faq-item">
      <h3>${faq.question}</h3>
      <p>${faq.answer}</p>
    </div>
  `).join('\n');

  const today = new Date().toISOString().split('T')[0];
  const publishedDate = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

  const stepsJSON = guideData.steps.map(step => `
    {
      "@type": "HowToStep",
      "name": "${step.title.replace(/"/g, '\\"')}",
      "text": "${step.content.replace(/"/g, '\\"').substring(0, 200)}",
      "position": ${guideData.steps.indexOf(step) + 1}
    }
  `).join(',');

  const suppliesJSON = guideData.supplies.map(s => `"${s.replace(/"/g, '\\"')}"`).join(',');
  const toolsJSON = guideData.tools.map(t => `"${t.replace(/"/g, '\\"')}"`).join(',');
  const faqJSON = guideData.faqs.map(faq => `
    {
      "@type": "Question",
      "name": "${faq.question.replace(/"/g, '\\"')}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "${faq.answer.replace(/"/g, '\\"')}"
      }
    }
  `).join(',');

  let html = template
    .replace(/\{TITLE\}/g, guideData.title)
    .replace(/\{META_DESCRIPTION\}/g, guideData.meta_description)
    .replace(/\{CATEGORY\}/g, category)
    .replace(/\{CATEGORY_NAME\}/g, categoryName)
    .replace(/\{CATEGORY_SLUG\}/g, category)
    .replace(/\{SLUG\}/g, slugify(guideData.title))
    .replace(/\{INTRO\}/g, guideData.intro)
    .replace(/\{CONTENT\}/g, stepsHTML)
    .replace(/\{FAQ_CONTENT\}/g, faqHTML)
    .replace(/\{PUBLISHED_DATE\}/g, today)
    .replace(/\{MODIFIED_DATE\}/g, today)
    .replace(/\{PUBLISHED_DATE_FORMATTED\}/g, publishedDate)
    .replace(/\{READ_TIME\}/g, guideData.total_time || '15')
    .replace(/\{VIEWS\}/g, '0')
    .replace(/\{TOTAL_TIME\}/g, guideData.total_time || 'PT15M')
    .replace(/\{STEPS_JSON\}/g, stepsJSON)
    .replace(/\{SUPPLIES\}/g, suppliesJSON)
    .replace(/\{TOOLS\}/g, toolsJSON)
    .replace(/\{FAQ_JSON\}/g, faqJSON)
    .replace(/\{LANG\}/g, language)
    .replace(/\{BASE_URL\}/g, 'https://guiasflow.github.io')
    .replace(/\{CANONICAL_URL\}/g, `https://guiasflow.github.io/${language}/guides/${slugify(guideData.title)}/`)
    .replace(/\{HERO_IMAGE\}/g, 'https://guiasflow.github.io/assets/images/default-guide.jpg')
    .replace(/\{RELATED_GUIDES\}/g, '');

  return html;
}

async function generateGuide(topic, category, language = 'es') {
  console.log(`🎯 Generando guía: "${topic}" (${language})`);
  
  const guideData = await generateGuideContent(topic, category, language);
  const html = generateGuideHTML(guideData, category, language);
  
  const slug = slugify(guideData.title);
  const outputDir = path.join(CONFIG.outputDir, language, category);
  fs.mkdirSync(outputDir, { recursive: true });
  
  const outputFile = path.join(outputDir, `${slug}.html`);
  fs.writeFileSync(outputFile, html);
  
  console.log(`✅ Guía creada: ${outputFile}`);
  return { slug, title: guideData.title, category, language };
}

async function main() {
  const args = process.argv.slice(2);
  const topic = args[0] || 'Cómo ahorrar dinero';
  const category = args[1] || 'finanzas';
  const languages = args[2] ? args[2].split(',') : CONFIG.languages;

  console.log('🚀 GuíasFlow Content Generator\n');
  console.log(`📝 Topic: ${topic}`);
  console.log(`📁 Category: ${category}`);
  console.log(`🌐 Languages: ${languages.join(', ')}\n`);

  if (!CONFIG.apiKey) {
    console.error('❌ Error: MINIMAX_API_KEY no está configurada');
    console.error('   Ejecuta: export MINIMAX_API_KEY="tu-key-aqui"');
    process.exit(1);
  }

  const results = [];
  for (const lang of languages) {
    try {
      const result = await generateGuide(topic, category, lang);
      results.push(result);
    } catch (error) {
      console.error(`❌ Error generando guía en ${lang}:`, error.message);
    }
  }

  console.log('\n✨ Generación completada!');
  console.log(`📊 ${results.length}/${languages.length} guías creadas`);
  
  results.forEach(r => console.log(`   - ${r.language}: ${r.title}`));
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { generateGuide, generateGuideContent, slugify };
