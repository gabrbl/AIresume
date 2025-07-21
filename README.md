# AIresume 🤖📄

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel)](https://vercel.com/)

> **Evaluador profesional de currículums con Inteligencia Artificial**  
> Análisis avanzado del sector tecnológico con métricas detalladas y recomendaciones específicas.

## ✨ Características

- 🤖 **IA Avanzada**: Análisis profesional con AbacusAI
- 📊 **Métricas Detalladas**: Evaluación específica por categorías
- 📱 **Responsive Design**: Optimizado para todos los dispositivos
- 🎨 **UI Moderna**: Diseño profesional con Tailwind CSS y Radix UI
- 📄 **Exportación PDF**: Reportes personalizados sin puntuaciones
- ⚡ **Rendimiento**: Next.js 14 con App Router
- 🌙 **Tema Oscuro**: Soporte completo para modo oscuro

## 🚀 Tecnologías

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Componentes**: Radix UI + shadcn/ui
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React

### Backend & IA
- **API**: Next.js API Routes
- **IA**: AbacusAI para análisis de currículums
- **PDF**: jsPDF para generación de reportes

### Deployment
- **Plataforma**: Vercel (optimizado)
- **Variables de entorno**: Configuración segura

## 🛠️ Instalación

### Prerrequisitos
- Node.js 18+
- npm, yarn o pnpm

### Configuración

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/cv-evaluator.git
   cd cv-evaluator
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   # o
   pnpm install
   ```

3. **Variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   
   Configurar en `.env.local`:
   ```env
   ABACUSAI_API_KEY=tu_api_key_de_abacusai
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=tu_secret_aleatorio
   ```

4. **Desarrollo**
   ```bash
   npm run dev
   ```
   Visitar: [http://localhost:3000](http://localhost:3000)

## 📦 Scripts Disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build para producción
npm run start      # Servidor de producción
npm run lint       # Linter de código
```

## 🌐 Despliegue en Vercel

### Deploy Automático
1. **Fork/Clone** este repositorio
2. **Conectar** con Vercel (vercel.com)
3. **Configurar** variables de entorno:
   - `ABACUSAI_API_KEY`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
4. **Deploy** automático ✅

### Deploy Manual
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login a Vercel
vercel login

# Deploy
vercel --prod
```

## 📱 Responsive Design

El proyecto está completamente optimizado para:
- 📱 **Móviles**: 320px - 768px
- 📱 **Tablets**: 768px - 1024px  
- 💻 **Desktop**: 1024px+
- 🖥️ **Large Screens**: 1440px+

### Breakpoints Tailwind
```css
sm: 640px   /* Tablets */
md: 768px   /* Pequeñas laptops */
lg: 1024px  /* Laptops */
xl: 1280px  /* Escritorio */
2xl: 1536px /* Pantallas grandes */
```

## 🔧 Configuración de Proyecto

### Estructura Optimizada
```
cv-evaluator/
├── app/                    # App Router (Next.js 14)
│   ├── api/               # API Routes
│   ├── globals.css        # Estilos globales + responsive
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página principal
│   └── favicon.ico        # Favicon personalizado
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── evaluation-results.tsx
│   ├── main-evaluator.tsx
│   └── pdf-uploader.tsx
├── lib/                  # Utilidades y tipos
├── public/               # Assets estáticos
├── vercel.json          # Configuración Vercel
└── tailwind.config.ts   # Configuración Tailwind
```


## 👨‍💻 Autor

**Desarrollado con ❤️ por [gabrbl](https://github.com/gabrbl)**

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

⭐ ¡Dale una estrella si este proyecto te fue útil!
