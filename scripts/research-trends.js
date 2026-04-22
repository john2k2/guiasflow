/**
 * GuíasFlow - Trend Research Script
 * Uses MiniMax web search to find trending topics
 */

const https = require('https');

const CONFIG = {
  apiHost: process.env.MINIMAX_API_HOST || 'https://api.minimax.io',
  apiKey: process.env.MINIMAX_API_KEY,
  languages: {
    es: 'español',
    en: 'english',
    pt: 'português',
    fr: 'français',
    de: 'alemán'
  },
  highCpcCategories: {
    finanzas: { priority: 10, cpc: '$15-50', markets: ['es', 'en', 'pt'] },
    tecnologia: { priority: 8, cpc: '$10-30', markets: ['es', 'en'] },
    salud: { priority: 9, cpc: '$12-35', markets: ['es', 'en', 'fr'] },
    legal: { priority: 7, cpc: '$15-40', markets: ['es', 'en'] },
    educacion: { priority: 6, cpc: '$8-20', markets: ['es', 'en', 'pt', 'fr', 'de'] }
  }
};

const TREND_SEEDS = {
  es: [
    'cómo ahorrar dinero 2025',
    'cómo invertir en fondos indexados',
    'cómo hacer ejercicio en casa',
    'cómo mejorar mi crédito',
    'cómo emprender un negocio',
    'cómo aprender inglés rápido',
    'cómo cocinar arroz perfecto',
    'cómo usar ChatGPT para trabajo',
    'cómo conseguir trabajo remoto',
    'cómo perder peso sin dieta'
  ],
  en: [
    'how to invest money 2025',
    'how to save for retirement',
    'how to build muscle at home',
    'how to improve credit score',
    'how to start a business',
    'how to learn programming',
    'how to cook rice perfectly',
    'how to use AI for work',
    'how to find remote jobs',
    'how to lose weight fast'
  ],
  pt: [
    'como economizar dinheiro 2025',
    'como investir em fundos',
    'como fazer exercício em casa',
    'como melhorar crédito',
    'como abrir negócio',
    'como aprender inglês',
    'como cozinhar arroz perfeito',
    'como usar IA no trabalho',
    'como conseguir trabalho remoto',
    'como emagrecer'
  ],
  fr: [
    'comment économiser de l\'argent 2025',
    'comment investir dans des fonds',
    'comment faire du sport à la maison',
    'comment améliorer son crédit',
    'comment créer une entreprise',
    'comment apprendre l\'anglais',
    'comment cuisiner le riz parfait',
    'comment utiliser l\'IA au travail',
    'comment trouver un travail à distance',
    'comment perdre du poids'
  ],
  de: [
    'wie man geld spart 2025',
    'wie man in indexfonds investiert',
    'wie man zu hause trainiert',
    'wie man kredit verbessert',
    'wie man ein business startet',
    'wie man englisch lernt',
    'wie man perfekten reis kocht',
    'wie man KI für arbeit nutzt',
    'wie man fernarbeit findet',
    'wie man gewicht verliert'
  ]
};

async function webSearch(query) {
  return new Promise((resolve, reject) => {
    if (!CONFIG.apiKey) {
      reject(new Error('MINIMAX_API_KEY not configured'));
      return;
    }

    const body = JSON.stringify({
      query: query,
      recursion: 3,
      num_results: 5
    });

    const options = {
      hostname: 'api.minimax.io',
      path: '/v1/search',
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
          resolve(parsed);
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

async function researchTrends(language = 'es') {
  console.log(`🔍 Investigando tendencias para ${language}...\n`);
  
  const seeds = TREND_SEEDS[language] || TREND_SEEDS.es;
  const trends = [];
  const seenQueries = new Set();

  for (const seed of seeds.slice(0, 5)) {
    try {
      console.log(`   📊 Buscando: "${seed}"`);
      const results = await webSearch(seed);
      
      if (results.data && results.data.web) {
        for (const result of results.data.web.slice(0, 3)) {
          const query = result.title.substring(0, 60);
          if (!seenQueries.has(query)) {
            seenQueries.add(query);
            trends.push({
              query: query,
              title: result.title,
              url: result.url,
              snippet: result.snippet,
              language: language,
              priority: calculatePriority(result.snippet)
            });
          }
        }
      }
    } catch (error) {
      console.error(`   ⚠️ Error en búsqueda: ${error.message}`);
    }
  }

  return trends.sort((a, b) => b.priority - a.priority);
}

function calculatePriority(snippet) {
  let priority = 5;
  
  const highCpcTerms = ['invertir', 'dinero', 'crédito', 'préstamo', 'hipoteca', 'seguro', 'salud', 'médico', 'legal', 'abogado'];
  const mediumTerms = ['cómo', 'tutorial', 'guía', 'aprende', 'mejorar', 'consejos'];
  const commercialTerms = ['mejor', 'top', 'review', 'comparar'];
  
  highCpcTerms.forEach(term => {
    if (snippet.toLowerCase().includes(term)) priority += 3;
  });
  
  mediumTerms.forEach(term => {
    if (snippet.toLowerCase().includes(term)) priority += 1;
  });
  
  commercialTerms.forEach(term => {
    if (snippet.toLowerCase().includes(term)) priority += 2;
  });
  
  return priority;
}

async function main() {
  const args = process.argv.slice(2);
  const language = args[0] || 'es';
  const limit = parseInt(args[1]) || 10;

  console.log('🚀 GuíasFlow Trend Research\n');
  console.log(`🌐 Idioma: ${language}`);
  console.log(`📊 Límite: ${limit} tendencias\n`);

  if (!CONFIG.apiKey) {
    console.error('❌ Error: MINIMAX_API_KEY no está configurada');
    console.error('   Ejecuta: export MINIMAX_API_KEY="tu-key-aqui"');
    process.exit(1);
  }

  const trends = await researchTrends(language);

  console.log('\n📈 Tendencias identificadas:\n');
  trends.slice(0, limit).forEach((trend, i) => {
    console.log(`${i + 1}. [${trend.language.toUpperCase()}] ${trend.query}`);
    console.log(`   Prioridad: ${trend.priority}/15`);
    console.log(`   Snippet: ${trend.snippet.substring(0, 80)}...\n`);
  });

  console.log('\n💡 Próximos pasos:');
  console.log('   Para generar guías, ejecuta:');
  console.log('   node scripts/generate-guide.js "título del topic" categoría idioma');
  
  return trends;
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { researchTrends, webSearch };
