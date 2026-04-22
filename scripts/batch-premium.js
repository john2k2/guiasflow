/**
 * GuíasFlow - PREMIUM BATCH Generator
 * Generates 2-3 perfect guides per week
 * 
 * Quality Checklist:
 * ✓ Research before writing
 * ✓ 1200+ words per guide
 * ✓ 5+ steps detalhados
 * ✓ 4+ FAQs with real objections
 * ✓ SEO optimized (title, meta, structure)
 * ✓ Schema markup (HowTo, FAQ, Article)
 * ✓ Social media snippets
 * ✓ Multi-language (ES, EN, PT, FR, DE)
 * ✓ Validation before commit
 */

const { generateGuide } = require('./generate-guide');

const BATCH_CONFIG = {
  guidesPerWeek: 3,
  languagesPerGuide: ['es', 'en'], // Start with 2, expand later
  priorityCategories: ['finanzas', 'salud', 'tecnologia'],
  
  // High CPC keywords by category
  topicIdeas: {
    finanzas: [
      'Cómo invertir en fondos indexados paso a paso',
      'Cómo ahorrar dinero aunque ganes poco',
      'Cómo mejorar tu historial crediticio',
      'Cómo empezar a invertir en bolsa desde cero',
      'Cómo crear un fondo de emergencia',
      'Cómo invertir en bienes raíces con poco capital',
      'Cómo ahorrar para el retiro a los 30',
      'Cómo salir de deudas rápidamente'
    ],
    salud: [
      'Cómo hacer ejercicio en casa sin equipamiento',
      'Cómo perder peso saludablemente',
      'Cómo empezar a correr desde cero',
      'Cómo mejorar tu postura de trabajo',
      'Cómo comer saludable en presupuesto limitado',
      'Cómo dormir mejor cada noche',
      'Cómo crear una rutina de ejercicios',
      'Cómo meditar para principiantes'
    ],
    tecnologia: [
      'Cómo aprender a programar desde cero',
      'Cómo usar ChatGPT para trabajar más rápido',
      'Cómo crear una página web gratis',
      'Cómo proteger tu privacidad online',
      'Cómo empezar con笔记本电脑desde cero',
      'Cómo usar IA para generar ingresos',
      'Cómo hacer tu primera app móvil',
      'Cómo automatizar tareas con Python'
    ],
    legal: [
      'Cómo hacer un contrato sin abogado',
      'Cómo知是你的权利劳务法',
      'Cómo crear una sociedad limitadas',
      'Cómo reclamar tus derechos laborales',
      'Cómo hacer un testamento',
      'Cómo denunciar un fraude'
    ],
    educacion: [
      'Cómo aprender inglés en 30 días',
      'Cómo estudiar para exámenes effectively',
      'Cómo mejorar tu concentración',
      'Cómo aprender cualquier habilidad quickly',
      'Cómo tomar notas effectively',
      'Cómo desarrollar disciplina de estudio',
      'Cómo aprender a leer más rápido'
    ]
  }
};

async function runPremiumBatch() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 GUIASFLOW PREMIUM BATCH GENERATOR');
  console.log('='.repeat(60));
  console.log('\n📋 Config:');
  console.log(`   • Guías/semana: ${BATCH_CONFIG.guidesPerWeek}`);
  console.log(`   • Idiomas: ${BATCH_CONFIG.languagesPerGuide.join(', ')}`);
  console.log(`   • Categorías: ${BATCH_CONFIG.priorityCategories.join(', ')}`);
  console.log('\n');

  const results = {
    generated: [],
    failed: [],
    totalTime: 0
  };

  const startTime = Date.now();

  // Select topics based on priority categories
  const topicsToGenerate = [];
  
  for (const category of BATCH_CONFIG.priorityCategories) {
    const categoryTopics = BATCH_CONFIG.topicIdeas[category] || [];
    // Take 1 topic per category to diversify
    if (categoryTopics.length > 0) {
      const randomIndex = Math.floor(Math.random() * categoryTopics.length);
      topicsToGenerate.push({
        topic: categoryTopics[randomIndex],
        category
      });
    }
  }

  console.log(`📝 Topics seleccionados: ${topicsToGenerate.length}`);
  topicsToGenerate.forEach((t, i) => {
    console.log(`   ${i + 1}. [${t.category}] ${t.topic}`);
  });
  console.log('');

  // Generate each guide
  for (const { topic, category } of topicsToGenerate) {
    console.log('\n' + '='.repeat(60));
    console.log(`📝 GENERATING: ${topic}`);
    console.log('='.repeat(60));

    for (const lang of BATCH_CONFIG.languagesPerGuide) {
      try {
        const result = await generateGuide(topic, category, lang);
        
        if (result.success) {
          results.generated.push(result);
          console.log(`\n   ✅ [${lang.toUpperCase()}] ✓ ${result.title}`);
          console.log(`       📊 SEO: ${result.seoScore} | 📝 ${result.wordCount} palabras`);
        } else {
          results.failed.push({ topic, category, lang, error: result.error });
          console.log(`\n   ❌ [${lang.toUpperCase()}] ✗ ${result.error || 'Unknown error'}`);
        }
      } catch (error) {
        results.failed.push({ topic, category, lang, error: error.message });
        console.log(`\n   ❌ [${lang.toUpperCase()}] ✗ ${error.message}`);
      }

      // Rate limiting - wait between API calls
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  results.totalTime = ((Date.now() - startTime) / 1000).toFixed(1);

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 BATCH GENERATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`\n✅ Generadas: ${results.generated.length}`);
  console.log(`❌ Fallidas: ${results.failed.length}`);
  console.log(`⏱️ Tiempo total: ${results.totalTime}s`);
  
  if (results.generated.length > 0) {
    console.log('\n📋 GUÍAS GENERADAS:\n');
    results.generated.forEach((g, i) => {
      console.log(`${i + 1}. [${g.language.toUpperCase()}] ${g.title}`);
      console.log(`   📁 /${g.category}/${g.slug}`);
      console.log(`   📊 SEO: ${g.seoScore}/100 | 📝 ${g.wordCount} palabras | ⏱️ ${g.readTime} min`);
    });
  }

  if (results.failed.length > 0) {
    console.log('\n❌ GUÍAS FALLIDAS:\n');
    results.failed.forEach((f, i) => {
      console.log(`${i + 1}. [${f.lang.toUpperCase()}] ${f.topic}`);
      console.log(`   Error: ${f.error}`);
    });
  }

  // Next steps
  console.log('\n📋 PRÓXIMOS PASOS:');
  console.log('1. Revisar guías generadas en /content/guias/');
  console.log('2. Commit to GitHub: git add . && git commit -m "New guides batch"');
  console.log('3. Push: git push origin main');
  console.log('4. GitHub Actions deployará automáticamente');
  console.log('5. Verificar en https://john2k2.github.io/guiasflow/');

  return results;
}

async function main() {
  const args = process.argv.slice(2);
  const apiKey = process.env.MINIMAX_API_KEY;

  if (!apiKey) {
    console.error('\n❌ Error: MINIMAX_API_KEY no configurada');
    console.error('   Usage: MINIMAX_API_KEY=your-key node scripts/batch-premium.js');
    console.error('   Obtener key en: https://platform.minimax.io');
    process.exit(1);
  }

  console.log('\n🔑 API Key: ✓ Configurada');
  console.log('🌐 Iniciando batch premium...\n');

  await runPremiumBatch();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { runPremiumBatch, BATCH_CONFIG };
