

import { MainEvaluator } from '@/components/main-evaluator'
import { Header } from '@/components/header'

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex flex-col">
      <Header />
      <main className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
            Evaluador de <span className="text-violet-400">Currículums</span> con IA
          </h1>
          <p className="text-lg sm:text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed px-4">
            Analiza currículums del sector tecnológico con inteligencia artificial avanzada. 
            Obtén puntuaciones detalladas y recomendaciones específicas.
          </p>
        </div>
        <MainEvaluator />
      </main>
      
      {/* Footer con referencia al creador */}
      <footer className="py-6 sm:py-8 border-t border-violet-500/20 bg-slate-900/50 backdrop-blur-sm mt-auto">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-purple-200/80 text-sm sm:text-base">
            Desarrollado con ❤️ por{' '}
            <a 
              href="https://github.com/gabrbl" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-violet-400 font-medium hover:text-violet-300 transition-colors duration-200 underline decoration-violet-400/50 hover:decoration-violet-300"
            >
              gabrbl
            </a>
            {' '}- Evaluador de Currículums con IA
          </p>
          <p className="text-purple-300/60 text-xs sm:text-sm mt-2">
            © {new Date().getFullYear()} CV Analyzer. Optimizando perfiles profesionales.
          </p>
        </div>
      </footer>
    </div>
  )
}
