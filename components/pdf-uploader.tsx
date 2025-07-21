

'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, FileText, CheckCircle, AlertCircle, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface PdfUploaderProps {
  onStartEvaluation: () => void
  onEvaluationComplete: (data: any) => void
}

export function PdfUploader({ onStartEvaluation, onEvaluationComplete }: PdfUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [language, setLanguage] = useState('es')
  const [uploading, setUploading] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<string>('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Solo se permiten archivos PDF')
        return
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('El archivo debe ser menor a 10MB')
        return
      }
      setFile(selectedFile)
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  })

  const handleUploadAndEvaluate = async () => {
    if (!file) return

    try {
      setUploading(true)
      setError(null)
      onStartEvaluation()

      // Upload file
      const formData = new FormData()
      formData.append('file', file)
      formData.append('language', language)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.message || 'Error al subir archivo')
      }

      const uploadData = await uploadResponse.json()
      setUploading(false)
      setEvaluating(true)
      setProgress('Analizando contenido...')

      // Start evaluation with filename
      const evaluateResponse = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filename: uploadData.filename,
          language
        })
      })

      if (!evaluateResponse.ok) {
        throw new Error('Error en la evaluación')
      }

      // Handle streaming response
      const reader = evaluateResponse.body?.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                // Evaluation completed
                const finalResult = JSON.parse(buffer)
                setEvaluating(false)
                onEvaluationComplete({
                  id: uploadData.evaluationId,
                  report: finalResult
                })
                return
              }

              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  buffer += parsed.content
                  setProgress('Generando análisis detallado...')
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in upload/evaluation:', error)
      setError(error instanceof Error ? error.message : 'Error interno del servidor')
      setUploading(false)
      setEvaluating(false)
    }
  }

  const resetUploader = () => {
    setFile(null)
    setError(null)
    setUploading(false)
    setEvaluating(false)
    setProgress('')
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="border-violet-200/50 dark:border-violet-500/30 shadow-lg hover-lift bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm purple-glow">
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            {!file && (
              <motion.div
                key="uploader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  {...getRootProps()}
                  className={`
                    border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all-smooth
                    ${isDragActive 
                      ? 'border-violet-400 bg-violet-50 dark:border-violet-500 dark:bg-violet-500/10' 
                      : 'border-violet-200 hover:border-violet-300 hover:bg-violet-25 dark:border-violet-500/30 dark:hover:border-violet-400 dark:hover:bg-violet-500/5'
                    }
                  `}
                >
                  <input {...getInputProps()} />
                  <div className="space-y-4">
                    <div className="mx-auto w-fit p-3 bg-violet-100 dark:bg-violet-500/20 rounded-full">
                      <Upload className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                    </div>
                    {isDragActive ? (
                      <p className="text-lg text-violet-600 dark:text-violet-400 font-medium">
                        Suelta el archivo aquí...
                      </p>
                    ) : (
                      <div>
                        <p className="text-lg text-gray-900 dark:text-white font-medium mb-2">
                          Arrastra tu currículum PDF aquí
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          o haz clic para seleccionar un archivo
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Máximo 10MB • Solo archivos PDF
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <Label htmlFor="language" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Idioma del currículum
                    </Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="border-violet-200 dark:border-violet-500/30 focus:border-violet-400 dark:focus:border-violet-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}

            {file && !uploading && !evaluating && (
              <motion.div
                key="file-preview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-4 p-4 bg-violet-50 dark:bg-violet-500/10 rounded-lg mb-6 border border-violet-200/50 dark:border-violet-500/30">
                  <div className="p-2 bg-violet-100 dark:bg-violet-500/20 rounded-lg">
                    <FileText className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {(file.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>

                <div className="flex space-x-3">
                  <Button 
                    onClick={handleUploadAndEvaluate}
                    className="flex-1 bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white"
                    size="lg"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Evaluar Currículum
                  </Button>
                  <Button 
                    onClick={resetUploader}
                    variant="outline"
                    size="lg"
                    className="border-violet-200 hover:bg-violet-50 dark:border-violet-500/30 dark:hover:bg-violet-500/10"
                  >
                    Cambiar
                  </Button>
                </div>
              </motion.div>
            )}

            {(uploading || evaluating) && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="text-center py-8"
              >
                <div className="relative mb-6">
                  <div className="spinner-violet h-16 w-16 mx-auto"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 bg-violet-100 dark:bg-violet-500/20 rounded-full flex items-center justify-center border border-violet-200 dark:border-violet-500/30 purple-glow">
                      <Zap className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {uploading ? 'Subiendo archivo...' : 'Evaluando currículum...'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {uploading ? 'Procesando el documento PDF' : progress}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3"
            >
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
