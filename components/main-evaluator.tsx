

'use client'

import { useState } from 'react'
import { PdfUploader } from '@/components/pdf-uploader'
import { EvaluationResults } from '@/components/evaluation-results'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, Zap, TrendingUp, Award } from 'lucide-react'
import { motion } from 'framer-motion'

interface EvaluationData {
  id: string
  report: any
}

export function MainEvaluator() {
  const [evaluationData, setEvaluationData] = useState<EvaluationData | null>(null)
  const [isEvaluating, setIsEvaluating] = useState(false)

  const handleEvaluationComplete = (data: EvaluationData) => {
    setEvaluationData(data)
    setIsEvaluating(false)
  }

  const handleStartEvaluation = () => {
    setIsEvaluating(true)
    setEvaluationData(null)
  }

  const features = [
    {
      icon: FileText,
      title: "Análisis PDF",
      description: "Extracción inteligente de contenido profesional",
      color: "violet"
    },
    {
      icon: Zap,
      title: "IA Avanzada",
      description: "Evaluación con criterios específicos del sector tech",
      color: "purple"
    },
    {
      icon: TrendingUp,
      title: "Métricas Detalladas",
      description: "Puntuaciones específicas y recomendaciones prácticas",
      color: "indigo"
    },
    {
      icon: Award,
      title: "Estándares Pro",
      description: "Comparación con mejores prácticas del mercado",
      color: "violet"
    }
  ]

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Sección principal - Subir currículum */}
      {!isEvaluating && !evaluationData && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <PdfUploader onStartEvaluation={handleStartEvaluation} onEvaluationComplete={handleEvaluationComplete} />
        </motion.div>
      )}

      {/* Características principales */}
      {!isEvaluating && !evaluationData && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + 0.1 * index }}
            >
              <Card className="text-center p-4 sm:p-6 hover-lift border-violet-500/20 bg-card/80 backdrop-blur-sm dark:border-violet-500/30 dark:bg-card/50 purple-glow-hover transition-all-smooth h-full">
                <CardContent className="pt-4">
                  <div className={`p-3 bg-violet-500/10 dark:bg-violet-500/20 rounded-xl mx-auto mb-4 w-fit border border-violet-500/20`}>
                    <feature.icon className={`h-6 w-6 sm:h-8 sm:w-8 text-violet-600 dark:text-violet-400`} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {isEvaluating && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center py-12 sm:py-16"
        >
          <div className="relative mb-6 sm:mb-8">
            <div className="spinner-violet h-16 w-16 sm:h-20 sm:w-20 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-violet-500/20 dark:bg-violet-500/30 rounded-full flex items-center justify-center border border-violet-500/30 purple-glow">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-violet-600 dark:text-violet-400" />
              </div>
            </div>
          </div>
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl sm:text-2xl font-semibold text-foreground mb-3 px-4"
          >
            Analizando currículum...
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground max-w-md mx-auto px-4 text-sm sm:text-base"
          >
            Nuestro sistema de IA está evaluando el documento con criterios profesionales del sector tecnológico
          </motion.p>
        </motion.div>
      )}
      
      {evaluationData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <EvaluationResults evaluation={evaluationData} />
        </motion.div>
      )}
    </div>
  )
}
