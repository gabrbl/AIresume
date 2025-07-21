

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Download, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb,
  Code,
  Briefcase,
  GraduationCap,
  FileText,
  Eye,
  Target
} from 'lucide-react'
import { motion } from 'framer-motion'
import jsPDF from 'jspdf'

interface EvaluationResultsProps {
  evaluation: {
    id: string
    report: {
      candidateName?: string
      overallScore: number
      technicalSkillsScore: number
      experienceScore: number
      educationScore: number
      projectsScore: number
      atsCompatibilityScore: number
      presentationScore: number
      strengths: string[]
      weaknesses: string[]
      recommendations: string[]
      technicalAnalysis: string
      marketComparison: string
    }
  }
}

// Función para generar el PDF con diseño profesional (solo secciones)
const generatePDF = (evaluation: EvaluationResultsProps['evaluation']) => {
  const { report } = evaluation;
  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Colores (en RGB)
  const primaryColor = [109, 40, 217]; // Violet-600
  const secondaryColor = [139, 69, 233]; // Violet-500
  const textColor = [30, 41, 59]; // Slate-800
  const grayColor = [100, 116, 139]; // Slate-500
  
  let yPosition = 20;
  
    // Header con título
  pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.rect(0, 0, pageWidth, 25, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('AIresume', pageWidth / 2, 12, { align: 'center' });
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Reporte de Evaluación de Currículum', pageWidth / 2, 21, { align: 'center' });
  
  yPosition = 35;
  
  // Información del candidato - sin fecha/ID
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Candidato: ${report.candidateName || 'No especificado'}`, 20, yPosition);
  
  yPosition += 15; // Menos espacio después del candidato
  
  // Fortalezas
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(34, 197, 94); // Green
  pdf.text('FORTALEZAS', 20, yPosition);
  yPosition += 10; // Reducido de 12 a 10
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  
  report.strengths?.forEach((strength, index) => {
    const lines = pdf.splitTextToSize(`• ${strength}`, pageWidth - 40);
    pdf.text(lines, 25, yPosition);
    yPosition += lines.length * 4 + 1; // Reducido espaciado
  });
  
  yPosition += 5; // Reducido espaciado entre secciones
  
  // Áreas de mejora
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(234, 179, 8); // Yellow
  pdf.text('ÁREAS DE MEJORA', 20, yPosition);
  yPosition += 10; // Reducido de 12 a 10
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  
  report.weaknesses?.forEach((weakness, index) => {
    const lines = pdf.splitTextToSize(`• ${weakness}`, pageWidth - 40);
    pdf.text(lines, 25, yPosition);
    yPosition += lines.length * 4 + 1; // Reducido espaciado
  });
  
  yPosition += 5; // Reducido espaciado entre secciones
  
  // Recomendaciones
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.text('RECOMENDACIONES', 20, yPosition);
  yPosition += 10; // Reducido de 12 a 10
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  
  report.recommendations?.forEach((recommendation, index) => {
    const lines = pdf.splitTextToSize(`• ${recommendation}`, pageWidth - 40);
    pdf.text(lines, 25, yPosition);
    yPosition += lines.length * 4 + 1; // Reducido espaciado
  });
  
  yPosition += 6; // Espaciado antes del análisis técnico
  
  // Análisis técnico - SIEMPRE incluido
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.text('ANÁLISIS TÉCNICO', 20, yPosition);
  yPosition += 10; // Reducido de 12 a 10
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  
  if (report.technicalAnalysis) {
    // Calcular espacio disponible
    const remainingSpace = pageHeight - yPosition - 35;
    
    if (remainingSpace > 20) {
      // Hay espacio suficiente para mostrar el análisis
      const maxLines = Math.floor(remainingSpace / 5) - 2;
      const technicalLines = pdf.splitTextToSize(report.technicalAnalysis, pageWidth - 40);
      
      if (technicalLines.length <= maxLines) {
        // Cabe completo
        pdf.text(technicalLines, 20, yPosition);
        yPosition += technicalLines.length * 5;
      } else {
        // Truncar con indicador
        const truncatedLines = technicalLines.slice(0, maxLines - 1);
        pdf.text(truncatedLines, 20, yPosition);
        yPosition += truncatedLines.length * 5;
        
        // Agregar indicador de texto truncado
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
        pdf.text('... (análisis completo disponible en la plataforma)', 20, yPosition + 5);
      }
    } else {
      // Poco espacio, mostrar mensaje compacto
      pdf.setFontSize(9);
      pdf.text('Análisis técnico detallado disponible en la plataforma web.', 20, yPosition);
    }
  } else {
    // No hay análisis técnico
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    pdf.text('Análisis técnico no disponible para este currículum.', 20, yPosition);
  }
  
  // Footer con referencia al creador
  const footerY = pageHeight - 15;
  pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.rect(0, footerY - 5, pageWidth, 20, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Generado por AIresume - Creado por gabrbl', pageWidth / 2, footerY + 2, { align: 'center' });
  
  // Generar nombre del archivo
  const candidateName = report.candidateName || 'candidato';
  const fileName = `reporte-cv-${candidateName.toLowerCase().replace(/\s+/g, '-')}.pdf`;
  
  // Descargar el PDF
  pdf.save(fileName);
};

export function EvaluationResults({ evaluation }: EvaluationResultsProps) {
  const { report } = evaluation

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600'
    if (score >= 60) return 'from-yellow-500 to-yellow-600'
    return 'from-red-500 to-red-600'
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const metrics = [
    { 
      key: 'technicalSkillsScore', 
      label: 'Habilidades Técnicas', 
      icon: Code, 
      color: 'violet',
      description: 'Lenguajes, frameworks y herramientas'
    },
    { 
      key: 'experienceScore', 
      label: 'Experiencia Profesional', 
      icon: Briefcase, 
      color: 'purple',
      description: 'Progresión de carrera y logros'
    },
    { 
      key: 'projectsScore', 
      label: 'Proyectos', 
      icon: Target, 
      color: 'indigo',
      description: 'Portafolio y contribuciones'
    },
    { 
      key: 'atsCompatibilityScore', 
      label: 'Compatibilidad ATS', 
      icon: FileText, 
      color: 'violet',
      description: 'Optimización para sistemas automatizados'
    },
    { 
      key: 'presentationScore', 
      label: 'Presentación', 
      icon: Eye, 
      color: 'purple',
      description: 'Diseño y organización visual'
    },
    { 
      key: 'educationScore', 
      label: 'Formación', 
      icon: GraduationCap, 
      color: 'indigo',
      description: 'Educación y certificaciones'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 sm:space-y-8"
    >
      {/* Información del Candidato */}
      <motion.div variants={itemVariants}>
        <Card className="text-center border-violet-500/30 shadow-lg hover-lift bg-card/80 backdrop-blur-sm dark:border-violet-500/50 purple-glow">
          <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 mb-2">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-violet-500/20 dark:bg-violet-500/30 rounded-full flex items-center justify-center border border-violet-500/30">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                  {report.candidateName || "Candidato"}
                </h1>
                <p className="text-sm text-muted-foreground">Evaluación de Currículum</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Puntuación General */}
      <motion.div variants={itemVariants}>
        <Card className="text-center border-violet-500/30 shadow-lg hover-lift bg-card/80 backdrop-blur-sm dark:border-violet-500/50 purple-glow-hover transition-all-smooth">
          <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
            <div className="relative inline-block mb-4 sm:mb-6">
              <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br ${getScoreBgColor(report.overallScore)} flex items-center justify-center text-white shadow-lg`}>
                <span className="text-2xl sm:text-3xl font-bold">{report.overallScore}</span>
              </div>
              <div className="absolute -top-2 -right-2 bg-background border border-violet-500/30 rounded-full p-1.5 sm:p-2 shadow-md">
                <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-violet-600 dark:text-violet-400" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Puntuación General</h2>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base px-2">
              {report.overallScore >= 80 ? 'Excelente perfil profesional' :
               report.overallScore >= 60 ? 'Buen perfil con áreas de mejora' :
               'Perfil con potencial, requiere optimización'}
            </p>
            <div className="flex justify-center space-x-2 sm:space-x-4">
              <Button 
                onClick={() => {
                  // Generar y descargar PDF del reporte
                  generatePDF(evaluation);
                }}
                className="bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 text-sm sm:text-base"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Métricas Detalladas */}
      <motion.div variants={itemVariants}>
        <Card className="border-violet-500/30 shadow-lg bg-card/80 backdrop-blur-sm dark:border-violet-500/50">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600 dark:text-violet-400" />
              <span className="text-foreground">Análisis Detallado</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {metrics.map((metric, index) => {
                const score = report[metric.key as keyof typeof report] as number
                const IconComponent = metric.icon
                return (
                  <motion.div
                    key={metric.key}
                    variants={itemVariants}
                    className="space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <div className="p-2 bg-violet-500/10 dark:bg-violet-500/20 rounded-lg border border-violet-500/20 flex-shrink-0">
                          <IconComponent className="h-3 w-3 sm:h-4 sm:w-4 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground text-sm sm:text-base truncate">{metric.label}</p>
                          <p className="text-xs text-muted-foreground">{metric.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`${getScoreColor(score)} border-current text-xs sm:text-sm ml-2 flex-shrink-0`}>
                        {score}/100
                      </Badge>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={score} 
                        className="h-2 bg-gray-200"
                      />
                      <div 
                        className={`absolute top-0 left-0 h-2 rounded-full ${getProgressColor(score)} transition-all duration-1000 ease-out`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Fortalezas, Debilidades y Recomendaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <motion.div variants={itemVariants}>
          <Card className="h-full border-green-500/30 bg-green-500/5 dark:bg-green-500/10 backdrop-blur-sm">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-center space-x-2 text-green-700 dark:text-green-400 text-base sm:text-lg">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Fortalezas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <ul className="space-y-2 sm:space-y-3">
                {report.strengths?.map((strength, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start space-x-2"
                  >
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 dark:text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-foreground leading-relaxed">{strength}</span>
                  </motion.li>
                )) || []}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full border-yellow-500/30 bg-yellow-500/5 dark:bg-yellow-500/10 backdrop-blur-sm">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-center space-x-2 text-yellow-700 dark:text-yellow-400 text-base sm:text-lg">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Áreas de Mejora</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <ul className="space-y-2 sm:space-y-3">
                {report.weaknesses?.map((weakness, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start space-x-2"
                  >
                    <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 dark:text-yellow-400 mt-1 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-foreground leading-relaxed">{weakness}</span>
                  </motion.li>
                )) || []}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full border-violet-500/30 bg-violet-500/5 dark:bg-violet-500/10 backdrop-blur-sm">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-center space-x-2 text-violet-700 dark:text-violet-400 text-base sm:text-lg">
                <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Recomendaciones</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <ul className="space-y-2 sm:space-y-3">
                {report.recommendations?.map((recommendation, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start space-x-2"
                  >
                    <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4 text-violet-500 dark:text-violet-400 mt-1 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-foreground leading-relaxed">{recommendation}</span>
                  </motion.li>
                )) || []}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Análisis Técnico */}
      <motion.div variants={itemVariants}>
        <Card className="border-violet-500/30 bg-card/80 backdrop-blur-sm dark:border-violet-500/50">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <Code className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600 dark:text-violet-400" />
              <span className="text-foreground">Análisis Técnico</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <p className="text-foreground leading-relaxed text-sm sm:text-base">
              {report.technicalAnalysis || 'Análisis técnico no disponible'}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Acción final */}
      <motion.div 
        variants={itemVariants}
        className="text-center pt-4"
      >
        <Card className="border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-purple-500/5 dark:from-violet-500/10 dark:to-purple-500/10 backdrop-blur-sm dark:border-violet-500/50 purple-glow">
          <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6 px-4 sm:px-6">
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
              ¿Quieres evaluar otro currículum?
            </h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base px-2">
              Continúa optimizando perfiles profesionales con nuestro evaluador IA
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 text-sm sm:text-base"
            >
              <FileText className="h-4 w-4 mr-2" />
              Nueva Evaluación
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
