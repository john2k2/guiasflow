/**
 * GuíasFlow - Batch Content Generator
 * Generates multiple guides in one run
 */

const { generateGuide } = require('./generate-guide');

const BATCH_TOPICS = [
  { topic: 'Cómo invertir en fondos indexados desde cero', category: 'finanzas', languages: ['es', 'en', 'pt'] },
  { topic: 'Cómo ahorrar dinero aunque ganes poco', category: 'finanzas', languages: ['es', 'en'] },
  { topic: 'Cómo mejorar tu historial crediticio', category: 'finanzas', languages: ['es', 'en'] },
  { topic: 'Cómo hacer ejercicio en casa sin equipo', category: 'salud', languages: ['es', 'en', 'fr'] },
  { topic: 'Cómo perder peso saludablemente', category: 'salud', languages: ['es', 'en'] },
  { topic: 'Cómo aprender inglés en 30 días', category: 'educacion', languages: ['es', 'en', 'pt', 'fr', 'de'] },
  { topic: 'Cómo usar ChatGPT para trabajar más rápido', category: 'tecnologia', languages: ['es', 'en'] },
  { topic: 'Cómo cocinar arroz perfecto', category: 'cocina', languages: ['es', 'en', 'pt'] },
  { topic: 'Cómo ahorrar para tu retiro a los 30', category: 'finanzas', languages: ['es', 'en'] },
  { topic: 'Cómo conseguir trabajo remoto', category: 'educacion', languages: ['es', 'en', 'pt'] }
];

async function generateBatch(apiKey) {
  process.env.MINIMAX_API_KEY = apiKey;
  
  console.log('🚀 GuíasFlow Batch Generator\n');
  console.log(`📦 Generando ${BATCH_TOPICS.length} guías...\n`);
  
  const results = [];
  
  for (const item of BATCH_TOPICS) {
    console.log(`\n📝 Procesando: ${item.topic}`);
    
    for (const lang of item.languages) {
      try {
        const result = await generateGuide(item.topic, item.category, lang);
        results.push(result);
        console.log(`   ✅ ${lang}: ${result.title}`);
      } catch (error) {
        console.error(`   ❌ ${lang}: ${error.message}`);
      }
    }
  }
  
  console.log('\n\n✨ Batch completado!');
  console.log(`📊 ${results.length} guías creadas`);
  
  return results;
}

if (require.main === module) {
  const apiKey = process.env.MINIMAX_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Error: MINIMAX_API_KEY no está configurada');
    console.error('   Usage: MINIMAX_API_KEY=your-key node scripts/batch-generate.js');
    process.exit(1);
  }
  
  generateBatch(apiKey).catch(console.error);
}

module.exports = { generateBatch, BATCH_TOPICS };
