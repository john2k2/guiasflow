/**
 * GuíasFlow - Social Media Manager
 * Creates and schedules posts for X (Twitter) and Instagram
 * 
 * NOTE: Currently in setup mode. This script will:
 * 1. Generate social media copy for each guide
 * 2. Store ready-to-post content in scheduled/ folder
 * 3. When @guiasflow accounts are created, this will auto-post
 */

const fs = require('fs');
const path = require('path');

const CONFIG = {
  scheduledDir: path.join(__dirname, '../scheduled'),
  guidesDir: path.join(__dirname, '../content/guias'),
  accounts: {
    x: {
      handle: '@guiasflow',
      ready: false,
      apiKey: process.env.X_API_KEY,
      apiSecret: process.env.X_API_SECRET,
      accessToken: process.env.X_ACCESS_TOKEN,
      accessSecret: process.env.X_ACCESS_SECRET
    },
    instagram: {
      handle: '@guiasflow',
      ready: false,
      username: process.env.IG_USERNAME,
      password: process.env.IG_PASSWORD
    }
  },
  platforms: {
    twitter: {
      maxChars: 280,
      recommendedHook: 100,
      hashtags: 3,
      optimalPostingTime: '09:00,13:00,18:00'
    },
    linkedin: {
      maxChars: 3000,
      recommendedHook: 150,
      hashtags: 5,
      optimalPostingTime: '08:00,12:00'
    },
    instagram: {
      maxChars: 2200,
      recommendedHook: 150,
      hashtags: 30,
      optimalPostingTime: '11:00,17:00,20:00'
    }
  }
};

const SOCIAL_TEMPLATES = {
  twitter: {
    hook_formulas: [
      "Aprende {topic} en {number} pasos",
      "El secreto que nadie te cuenta sobre {topic}",
      "{stat} personas ya dominan {topic} - ¿Y tú?",
      "Guía definitiva de {topic}: todo lo que necesitas saber",
      "{question}? Te lo explico paso a paso"
    ],
    body_templates: [
      "📚 Nuevo artículo en @guiasflow\n\n{hook}\n\n👉 Léelo completo (link en bio)",
      "{hook}\n\n📖 Aprende más en @guiasflow\n🔗 Link en bio #guias #tutorial"
    ],
    hashtag_strategy: {
      primary: ['#guias', '#tutorial', '#howto'],
      topic_tags: {
        finanzas: ['#finanzas', '#invertir', '#ahorro', '#dinero'],
        salud: ['#salud', '#fitness', '#ejercicio', '#bienestar'],
        tecnologia: ['#tech', '#programacion', '#ia', '#software'],
        educacion: ['#educacion', '#aprende', '#skills', '#desarrollo']
      }
    }
  },
  linkedin: {
    hook_formulas: [
      "Hace años cometí este error con {topic}...",
      "Después de analizar +1000 casos de {topic}, esto es lo que encontré:",
      "La guía más completa sobre {topic} que vas a encontrar:",
      "{topic}: Por qué la mayoría lo hace mal (y cómo hacerlo bien)"
    ],
    body_template: `📌 {title}

{intro}

Lo que cubre esta guía:

✅ {benefits_list}

👇 ¿Ya conocías este tema? Cuéntame en los comentarios.

---
#guiasflow #educacion #tutorial`,

    hashtag_strategy: {
      primary: ['#GuíasFlow', '#EducationalContent', '#HowTo', '#Tutorial'],
      topic_tags: {
        finanzas: ['#PersonalFinance', '#Investing', '#MoneyTips', '#FinancialLiteracy'],
        salud: ['#HealthAndWellness', '#FitnessTips', '#HealthyLiving'],
        tecnologia: ['#Technology', '#Programming', '#SoftwareDevelopment'],
        educacion: ['#Education', '#Learning', '#SkillBuilding']
      }
    }
  },
  instagram: {
    caption_template: `📚 GUÍA COMPLETA: {title}

{hook}

━━━━━━━━━━━━━━━━━
📌 EN ESTA GUÍA APRENDERÁS:
• {benefits_list}
━━━━━━━━━━━━━━━━━

👉 Swipe left para más tips 👈

✅ Dale like si te pareció útil
✅ Comenta si quieres más guías así
✅ Comparte con alguien que lo necesite

━━━━━━━━━━━━━━━━━
🔗 Link completo en bio
━━━━━━━━━━━━━━━━━
{hashtags}`,

    story_template: {
      slide1: '📚 Nueva guía: {title}',
      slide2: '¿{question}?',
      slide3: '👉 Swipe para ver cómo',
      slide4: '#guiasflow #tutorial'
    },

    hashtag_strategy: {
      primary: ['#guiasflow', '#tutoriales', '#educacion', '#aprende', '#howto', '#learn'],
      topic_tags: {
        finanzas: ['#finanzasparatodos', '#finanzaspersonales', '#ahorrar', '#invertir'],
        salud: ['#vidasaludable', '#fitness', '#gimnasioencasa', '#nutricion'],
        tecnologia: ['#tecnologia', '#programacion', '#codigo', '#tech'],
        educacion: ['#educaciononline', '#cursos', '#aprendizaje', '#skills']
      },
      trending_tags: ['#viral', '#trending', '#fyp', '#parati']
    }
  }
};

class SocialMediaManager {
  constructor() {
    this.scheduledPosts = [];
    this.createdAccounts = [];
  }

  async checkAccounts() {
    console.log('\n📱 Social Media Account Status:\n');
    
    const accounts = [
      { name: 'X (Twitter)', handle: CONFIG.accounts.x.handle, ready: CONFIG.accounts.x.ready },
      { name: 'Instagram', handle: CONFIG.accounts.instagram.handle, ready: CONFIG.accounts.instagram.ready }
    ];

    accounts.forEach(acc => {
      const status = acc.ready ? '✅ Listo' : '⏳ Pendiente';
      console.log(`   ${status}: ${acc.name} (${acc.handle})`);
    });

    console.log('\n⚠️  Para activar posting automático:');
    console.log('   1. Crear cuenta X: @guiasflow');
    console.log('   2. Crear cuenta Instagram: @guiasflow');  
    console.log('   3. Obtener API keys de X Dev Portal');
    console.log('   4. Configurar en .env\n');

    return accounts;
  }

  generatePostContent(guideMeta, platform = 'twitter') {
    const template = SOCIAL_TEMPLATES[platform];
    const { title, topic, category } = guideMeta;
    
    // Generate hook based on template
    const hookFormula = template.hook_formulas[Math.floor(Math.random() * template.hook_formulas.length)];
    const hook = hookFormula
      .replace('{topic}', title.toLowerCase().replace('cómo ', '').replace('cómo', ''))
      .replace('{number}', '5')
      .replace('{stat}', '10,000')
      .replace('{question}', topic);

    // Get topic-specific hashtags
    const topicHashtags = template.hashtag_strategy?.topic_tags?.[category] || [];
    const primaryHashtags = template.hashtag_strategy?.primary || [];
    const allHashtags = [...primaryHashtags, ...topicHashtags].slice(0, platform === 'instagram' ? 30 : platform === 'linkedin' ? 5 : 3);

    return {
      hook,
      hashtags: allHashtags,
      post_text: this.buildPostText(hook, guideMeta, platform, allHashtags),
      scheduled_time: this.getOptimalPostingTime(platform)
    };
  }

  buildPostText(hook, guideMeta, platform, hashtags) {
    const { title } = guideMeta;
    const hashtagsStr = hashtags.map(t => typeof t === 'string' && !t.startsWith('#') ? `#${t.replace(/\s/g, '')}` : t).join(' ');

    if (platform === 'twitter') {
      return `${hook}\n\n📖 "${title}"\n\n${hashtagsStr}`;
    }
    
    if (platform === 'linkedin') {
      return `${hook}\n\n📚 He publicado una guía completa sobre "${title}" en @guiasflow.\n\nEnlace en comentarios.\n\n${hashtagsStr}`;
    }

    if (platform === 'instagram') {
      return `📚 GUÍA: ${title}\n\n${hook}\n\n👆 Swipe para más info\n\n${hashtagsStr}`;
    }

    return hook;
  }

  getOptimalPostingTime(platform) {
    const times = CONFIG.platforms[platform]?.optimalPostingTime?.split(',') || ['09:00'];
    const baseDate = new Date();
    const today = baseDate.toISOString().split('T')[0];
    
    // Schedule for next optimal time slot
    const timesWithDates = times.map(time => {
      const [hour, minute] = time.split(':').map(Number);
      const date = new Date(today);
      date.setHours(hour, minute, 0, 0);
      if (date < new Date()) date.setDate(date.getDate() + 1);
      return date;
    });

    return timesWithDates.sort((a, b) => a - b)[0];
  }

  async loadGuideSnippets() {
    console.log('\n📂 Loading guide social snippets...\n');
    
    const snippets = [];
    const guidesDir = path.join(CONFIG.guidesDir);
    
    if (!fs.existsSync(guidesDir)) {
      console.log('⚠️  No guides found. Run generate-guide.js first.');
      return snippets;
    }

    // Walk through languages and categories
    const languages = ['es', 'en', 'pt', 'fr', 'de'];
    
    for (const lang of languages) {
      const langDir = path.join(guidesDir, lang);
      if (!fs.existsSync(langDir)) continue;

      const categories = fs.readdirSync(langDir);
      
      for (const category of categories) {
        const catDir = path.join(langDir, category);
        if (!fs.statSync(catDir).isDirectory()) continue;

        const files = fs.readdirSync(catDir).filter(f => f.endsWith('-social.json'));
        
        for (const file of files) {
          try {
            const content = fs.readFileSync(path.join(catDir, file), 'utf8');
            const social = JSON.parse(content);
            const metaFile = file.replace('-social.json', '-meta.json');
            const metaPath = path.join(catDir, metaFile);
            
            let meta = {};
            if (fs.existsSync(metaPath)) {
              meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
            }

            snippets.push({
              ...meta,
              social,
              lang,
              category,
              slug: meta.slug || file.replace('-social.json', '')
            });
          } catch (e) {
            console.error(`⚠️ Error loading ${file}:`, e.message);
          }
        }
      }
    }

    console.log(`📊 Found ${snippets.length} guides with social snippets\n`);
    return snippets;
  }

  async generateScheduledPosts() {
    console.log('📅 Generating scheduled posts...\n');
    
    const snippets = await this.loadGuideSnippets();
    const scheduled = [];

    for (const guide of snippets) {
      const platforms = ['twitter', 'linkedin', 'instagram'];
      
      for (const platform of platforms) {
        const socialData = guide.social?.[platform];
        
        if (socialData && socialData.hook) {
          const post = {
            id: `${guide.slug}-${platform}-${Date.now()}`,
            guideSlug: guide.slug,
            language: guide.lang,
            category: guide.category,
            platform,
            hook: socialData.hook,
            body: socialData.body || '',
            hashtags: socialData.hashtags || [],
            post_text: `${socialData.hook}${socialData.body ? '\n\n' + socialData.body : ''}`,
            scheduled_time: this.getOptimalPostingTime(platform),
            status: 'ready',
            createdAt: new Date().toISOString()
          };

          scheduled.push(post);
        }
      }
    }

    // Save to scheduled directory
    fs.mkdirSync(CONFIG.scheduledDir, { recursive: true });
    const outputFile = path.join(CONFIG.scheduledDir, `scheduled-${Date.now()}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(scheduled, null, 2));

    console.log(`📊 Generated ${scheduled.length} scheduled posts:`);
    scheduled.forEach(p => {
      console.log(`   📌 [${p.platform.toUpperCase()}] ${p.hook.substring(0, 50)}...`);
    });

    this.scheduledPosts = scheduled;
    return scheduled;
  }

  async generateAllPostsForGuide(guideMeta) {
    console.log(`\n📱 Generating social posts for: ${guideMeta.title}\n`);
    
    const posts = {};
    const platforms = ['twitter', 'linkedin', 'instagram'];

    for (const platform of platforms) {
      const content = this.generatePostContent(guideMeta, platform);
      posts[platform] = content;
      console.log(`   ✅ ${platform}: "${content.hook.substring(0, 50)}..."`);
    }

    return posts;
  }

  async printReadyToPost() {
    await this.checkAccounts();
    
    const snippets = await this.loadGuideSnippets();
    
    console.log('\n📋 GUÍAS LISTAS PARA SOCIAL MEDIA:\n');
    console.log('='.repeat(60));
    
    snippets.forEach((guide, i) => {
      console.log(`\n${i + 1}. [${guide.lang.toUpperCase()}] ${guide.title}`);
      console.log(`   📁 Slug: ${guide.slug}`);
      console.log(`   📁 Category: ${guide.category}`);
      
      if (guide.social) {
        if (guide.social.twitter?.hook) {
          console.log(`   🐦 Twitter: "${guide.social.twitter.hook.substring(0, 60)}..."`);
        }
        if (guide.social.linkedin?.hook) {
          console.log(`   💼 LinkedIn: "${guide.social.linkedin.hook.substring(0, 60)}..."`);
        }
        if (guide.social.instagram?.caption) {
          console.log(`   📷 Instagram: "${guide.social.instagram.caption.substring(0, 60)}..."`);
        }
      }
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('\n⚠️  NOTA: Para activar posting automático, necesitas:');
    console.log('   1. Crear cuenta X: @guiasflow');
    console.log('   2. Crear cuenta IG: @guiasflow');
    console.log('   3. Configurar API keys en variables de entorno');
    console.log('   4. Actualizar CONFIG.accounts en este archivo\n');
  }

  async demo() {
    console.log('\n🎯 SOCIAL MEDIA MANAGER - Demo de generación\n');
    
    const demoGuide = {
      title: 'Cómo Invertir en Fondos Indexados desde Cero',
      topic: 'inversión fondos indexados',
      category: 'finanzas',
      slug: 'como-invertir-fondos-indexados'
    };

    console.log('Generando posts para demo guide...\n');
    
    const platforms = ['twitter', 'linkedin', 'instagram'];
    
    for (const platform of platforms) {
      const content = this.generatePostContent(demoGuide, platform);
      
      console.log(`\n📌 ${platform.toUpperCase()} POST:`);
      console.log('-'.repeat(50));
      console.log(content.post_text.substring(0, 200) + '...\n');
      console.log(`Hashtags: ${content.hashtags.join(' ')}`);
      console.log(`Scheduled: ${content.scheduled_time}`);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'status';

  const manager = new SocialMediaManager();

  switch (command) {
    case 'status':
      await manager.printReadyToPost();
      break;
    
    case 'generate':
      await manager.generateScheduledPosts();
      break;
    
    case 'demo':
      await manager.demo();
      break;
    
    case 'accounts':
      await manager.checkAccounts();
      break;
    
    default:
      console.log('\n📱 GuíasFlow Social Media Manager\n');
      console.log('Comandos disponibles:');
      console.log('   node social-media.js status    - Ver estado de cuentas y guías listas');
      console.log('   node social-media.js generate  - Generar posts programados');
      console.log('   node social-media.js demo     - Demo de generación');
      console.log('   node social-media.js accounts - Ver estado de cuentas\n');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SocialMediaManager };
