# GuíasFlow - Multi-language How-To Guides for AdSense Monetization

![GuíasFlow](https://img.shields.io/badge/Gu%C3%ADasFlow-v1.0-orange)
![Languages](https://img.shields.io/badge/Languages-5-green)
![License](https://img.shields.io/badge/License-MIT-blue)

Plataforma automatizada de guías paso a paso en 5 idiomas, optimizada para generar tráfico y monetizar con Google AdSense.

## 🎯 Características

- **5 Idiomas**: Español, Inglés, Portugués, Francés, Alemán
- **Alto CPC Categories**: Finanzas, Tecnología, Salud, Legal, Educación
- **100% Automatizado**: Research, generación de contenido, traducción y publicación
- **SEO Optimizado**: Schema markup (HowTo, FAQ, Article), meta tags, sitemap
- **AI SEO**: Optimizado para Google AI Overviews, ChatGPT, Perplexity
- **AdSense Ready**: Estructura optimizada para maximizar RPM

## 🚀 Inicio Rápido

### 1. Configurar API Key de MiniMax

```bash
export MINIMAX_API_KEY="tu-api-key-aqui"
```

### 2. Generar una guía

```bash
cd guiasflow
npm install
node scripts/generate-guide.js "Cómo invertir en fondos indexados" finanzas es
```

### 3. Investigación de tendencias

```bash
node scripts/research-trends.js es
```

## 📁 Estructura del Proyecto

```
guiasflow/
├── src/                    # Contenido estático (generado)
│   ├── es/                 # Versión español
│   ├── en/                 # Versión inglés
│   ├── pt/                 # Versión portugués
│   ├── fr/                 # Versión francés
│   ├── de/                 # Versión alemán
│   ├── index.html          # Página principal
│   ├── sitemap.xml         # Sitemap XML
│   └── robots.txt          # Configuración robots
├── content/
│   └── guias/              # Guías generadas por idioma/categoría
├── templates/
│   └── guide-template.html # Template para guías
├── scripts/
│   ├── generate-guide.js   # Generador de guías
│   ├── research-trends.js # Investigador de tendencias
│   └── generate-sitemap.js # Generador de sitemap
├── config/
│   └── .env.example       # Variables de entorno
└── .github/workflows/
    └── deploy.yml          # GitHub Actions para deploy
```

## ⚙️ API de MiniMax

Este proyecto utiliza la API de MiniMax para:

- **Generación de contenido** (MiniMax M2.7)
- **Búsquedas web** (web_search MCP)
- **Generación de imágenes** (futuro)

### Obtener API Key

1. Visitar [MiniMax Platform](https://platform.minimax.io)
2. Ir a User Center > API Keys
3. Crear nueva key

## 📊 Categorías de Alto CPC

| Categoría | CPC Estimado | Idiomas |
|-----------|------------|---------|
| 💰 Finanzas Personales | $15-50 | ES, EN, PT |
| 🏥 Salud & Fitness | $12-35 | ES, EN, FR |
| ⚖️ Legal/Derecho | $15-40 | ES, EN |
| 💻 Tecnología | $10-30 | ES, EN |
| 🎓 Educación | $8-20 | TODOS |

## 🔄 Pipeline de Automatización

```
┌─────────────────────────────────────────────────────────┐
│                    AUTOMATION FLOW                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. RESEARCH (semanal)                                   │
│     └→ node scripts/research-trends.js es                │
│     └→ Identifica topics trending                        │
│     └→ Calcula priority score                            │
│                                                          │
│  2. GENERATE (2-3 guías/semana)                          │
│     └→ node scripts/generate-guide.js [topic] [cat] [lang]│
│     └→ MiniMax M2.7 genera contenido                    │
│     └→ Auto-traduce a 5 idiomas                         │
│     └→ Genera schema markup SEO                         │
│                                                          │
│  3. PUBLISH (automático)                                 │
│     └→ GitHub Actions trigger                            │
│     └→ Deploy a GitHub Pages                             │
│     └→ Update sitemap                                    │
│                                                          │
│  4. MONITOR (semanal)                                    │
│     └→ Squirrel audit                                    │
│     └→ Score tracking                                    │
│     └→ AI citation monitoring                           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 🎨 Monetización AdSense

El sitio está optimizado para AdSense con:

- **3 espacios de anuncios por guía**: Header, in-article (2x), footer
- **Altos CPC**: Categorías Finance, Health, Legal
- **Contenido evergreen**: Temas que siempre buscan люди
- **Mobile-first**: Optimizado para tráfico móvil
- **Core Web Vitals**: Velocidad optimizada

## 🔒 Configuración SEO/AI

El archivo `robots.txt` está configurado para:

- ✅ Permitir todos los bots de IA para citación
- ✅ Permitir Googlebot, Bingbot
- ✅ Bloquear bots de scraping (Ahrefs, Semrush)
- ✅ Auto-discovery via sitemap

## 📦 Scripts Disponibles

```bash
# Generar una guía
npm run generate-guide -- "Cómo invertir" finanzas es

# Investigar tendencias
npm run research-trends -- es 10

# Generar sitemap
npm run sitemap

# Deploy a GitHub Pages
npm run deploy

# Audit SEO
npm run audit
```

## 🎯 Roadmap

- [ ] Integrar generación de imágenes con MiniMax
- [ ] Auto-generar contenido en burst (batch de 10 guías)
- [ ] Dashboard de métricas en /analytics
- [ ] Sistema de comentarios
- [ ] Newsletter integration
- [ ] Multi-domain support

## 📄 Licencia

MIT - Ver LICENSE para más detalles.

---

Hecho con ❤️ para la comunidad de creadores de contenido.
