# GuíasFlow

> Plataforma premium de guías paso a paso multilingüe para monetización con Google AdSense.

![Version](https://img.shields.io/badge/version-2.0.0-orange)
![Languages](https://img.shields.io/badge/languages-5-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🎯 Proyecto

Sistema automatizado de generación de contenido que crea guías **perfectas** para ranking SEO y monetización AdSense.

### Características Principales

- ✅ **Calidad sobre cantidad** - 2-3 guías/semana optimizadas al máximo
- ✅ **Multi-idioma** - ES, EN, PT, FR, DE
- ✅ **100% Validado** - Sin errores, contenido completo
- ✅ **SEO Premimum** - Schema markup, meta tags, estructura optimizada
- ✅ **Alto CPC** - Categorías de máximo valor (Finanzas, Salud, Legal)
- ✅ **Social Ready** - Posts pre-generados para X/Instagram

## 🚀 Quick Start

### 1. Configurar API Key

```bash
export MINIMAX_API_KEY="tu-api-key-aqui"
```

Obtener key en: [platform.minimax.io](https://platform.minimax.io)

### 2. Generar Primera Guía

```bash
# Solo español
npm run generate -- "Cómo invertir en fondos indexados" finanzas es

# Con research automático (tarda más)
npm run research -- es

# Batch premium (2-3 guías optimizadas)
npm run batch
```

### 3. Ver en GitHub Pages

```bash
https://john2k2.github.io/guiasflow/
```

## 📁 Estructura del Proyecto

```
guiasflow/
├── content/
│   └── guias/
│       ├── es/
│       │   ├── finanzas/
│       │   │   ├── como-invertir-...html
│       │   │   ├── como-invertir-...social.json
│       │   │   └── como-invertir-...meta.json
│       │   ├── salud/
│       │   └── tecnologia/
│       ├── en/, pt/, fr/, de/...
├── scripts/
│   ├── generate-guide.js      # ⭐ Generador premium
│   ├── batch-premium.js       # Batch de 2-3 guías
│   ├── research-trends.js      # Research de tendencias
│   ├── validate-content.js     # Validador de contenido
│   ├── social-media.js         # Social media manager
│   └── generate-sitemap.js     # Generador de sitemap
├── templates/
│   └── guide-template.html    # Template con Schema markup
├── scheduled/                   # Posts para redes (pending)
└── reports/                    # Reportes de validación
```

## 📋 Scripts Disponibles

### Generación de Contenido

```bash
# Generar una guía
npm run generate -- "título del topic" categoría idioma

# Research de tendencias
npm run research -- es 10

# Batch premium (2-3 guías optimizadas)
npm run batch
```

### Validación

```bash
# Validar todo el contenido
npm run validate

# Validar una guía específica
npm run validate -- single path/to/guide.html
```

### Social Media

```bash
# Ver estado de cuentas y guías listas
npm run social:status

# Generar posts programados
npm run social:generate

# Demo de generación
npm run social:demo
```

### Deployment

```bash
# Deploy a GitHub Pages
npm run deploy

# Generar sitemap
npm run sitemap
```

## 📊 Pipeline de Generación Premium

```
┌─────────────────────────────────────────────────────────────┐
│                    PREMIUM GENERATION PIPELINE              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. RESEARCH (AI-powered)                                    │
│     └→ Búsqueda de intención real del usuario              │
│     └→ Identificación de content gaps                       │
│     └→ Datos específicos y estadísticas                      │
│     └→ Estructura óptima                                    │
│                                                              │
│  2. GENERATION (MiniMax M2.7)                              │
│     └→ Title SEO-optimized con keyword al inicio            │
│     └→ Meta description 155 caracteres                      │
│     └→ 1200-3000 palabras de contenido real                 │
│     └→ 5-15 steps detalhados (100+ palabras cada uno)      │
│     └→ 4+ FAQs con objeciones reales                        │
│                                                              │
│  3. VALIDATION (automatic)                                  │
│     └→ Word count check                                     │
│     └→ Steps/FAQs count check                              │
│     └→ Schema markup validation                              │
│     └→ SEO score calculation (target: 85+)                 │
│                                                              │
│  4. SOCIAL SNIPPETS                                        │
│     └→ Twitter/X post                                      │
│     └→ LinkedIn post                                        │
│     └→ Instagram caption + hashtags                         │
│     └→ Scheduled for optimal posting times                  │
│                                                              │
│  5. SAVE & OUTPUT                                          │
│     └→ HTML file                                           │
│     └→ Social snippets JSON                                 │
│     └→ Metadata JSON (SEO score, wordcount, etc)          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🎓 Categorías Alto CPC

| Categoría | CPC | Idiomas | Prioridad |
|-----------|-----|---------|-----------|
| 💰 Finanzas Personales | $15-50 | ES, EN, PT | 🔴 Alta |
| 🏥 Salud & Fitness | $12-35 | ES, EN, FR | 🔴 Alta |
| ⚖️ Legal/Asesoría | $15-40 | ES, EN | 🟡 Media |
| 💻 Tecnología | $10-30 | ES, EN | 🟡 Media |
| 🎓 Educación | $8-20 | TODOS | 🟢 Media |

## 🌐 Multi-idioma

El sistema genera contenido en 5 idiomas:

| Código | Idioma | Mercado |
|--------|--------|---------|
| `es` | Español | Latinoamérica + España |
| `en` | English | US, UK, CA, AU |
| `pt` | Português | Brasil + Portugal |
| `fr` | Français | Francia + África francófona |
| `de` | Deutsch | Alemania + Austria |

## 📱 Social Media (Próximamente)

### Estado Actual

| Plataforma | Estado | Cuenta |
|------------|--------|--------|
| X (Twitter) | ⏳ Pendiente | @guiasflow |
| Instagram | ⏳ Pendiente | @guiasflow |

El sistema ya genera los snippets optimizados para cada plataforma. Una vez creadas las cuentas y configuradas las API keys, se activará el posting automático.

### Para Activar

1. Crear cuenta X: **@guiasflow**
2. Crear cuenta Instagram: **@guiasflow**
3. Obtener API keys de [X Dev Portal](https://developer.twitter.com)
4. Configurar en `.env`:

```bash
X_API_KEY=tu_key
X_API_SECRET=tu_secret
X_ACCESS_TOKEN=tu_token
X_ACCESS_SECRET=tu_access_secret
IG_USERNAME=guiasflow
IG_PASSWORD=tu_password
```

## 🔒 SEO & Schema Markup

Cada guía incluye:

- ✅ **HowTo Schema** - Para rich snippets en Google
- ✅ **FAQPage Schema** - Preguntas frecuentes en SERP
- ✅ **Article Schema** - Datos del artículo
- ✅ **Breadcrumb Schema** - Navegación estructurada
- ✅ **Open Graph** - Para social sharing
- ✅ **Twitter Cards** - Preview en Twitter

## 📊 Monetización AdSense

### Optimizaciones Implementadas

- Espacios de anuncios: Header + 2 in-article + Footer
- Categorías de alto CPC para maximizar RPM
- Contenido evergreen (tráfico constante)
- Mobile-first responsive design
- Core Web Vitals optimizados
- Sin JavaScript blocking (CSS inline)
- Estructura clara para crawler de Google

### Requisitos AdSense

- [x] Dominio propio (en proceso: GitHub Pages)
- [x] Contenido sustancial (+50 páginas)
- [x] Políticas de privacidad
- [x] Términos y condiciones
- [ ] Aprobar cuenta AdSense

## 🔄 Workflow de Contenido Semanal

```
LUNES          → Research de tendencias (research-trends.js)
MARTES         → Generar 1 guía premium (batch-premium.js)
MIÉRCOLES      → Validar contenido (validate-content.js)
JUEVES         → Generar 1 guía premium
VIERNES        → Revisar guías, generar social snippets
SÁBADO/DOMINGO → Descanso / Planning semanal
```

## 📦 Agregar Nuevo Topic

Edita `BATCH_CONFIG.topicIdeas` en `scripts/batch-premium.js`:

```javascript
topicIdeas: {
  finanzas: [
    'Cómo invertir en fondos indexados paso a paso',
    'Tu nuevo topic aquí'
  ],
  // ... otras categorías
}
```

## 🛠️ Desarrollo

### Requisitos

- Node.js 18+
- npm
- MiniMax API Key

### Instalación

```bash
git clone https://github.com/john2k2/guiasflow.git
cd guiasflow
npm install
export MINIMAX_API_KEY="tu-key"
```

### Test Local

```bash
npm run dev
# Abre http://localhost:3000
```

## 📄 Licencia

MIT - Libre para usar y modificar.

---

**GuíasFlow** - Generando contenido de calidad desde 2025.
