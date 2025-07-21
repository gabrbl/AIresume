

import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const EVALUATION_PROMPT = `
Eres un experto evaluador de currículums del sector tecnológico. Tu tarea es analizar el currículum proporcionado y generar una evaluación detallada basada en los siguientes criterios profesionales:

## CRITERIOS DE EVALUACIÓN:

### 1. HABILIDADES TÉCNICAS (25 puntos)
- Lenguajes de programación relevantes y actualizados
- Frameworks y librerías modernas 
- Herramientas de DevOps y Cloud (AWS, Azure, Docker, Kubernetes)
- Bases de datos (SQL y NoSQL)
- Metodologías ágiles (Scrum, Kanban)

### 2. EXPERIENCIA PROFESIONAL (25 puntos)
- Años de experiencia relevante
- Progresión de carrera clara
- Logros cuantificables (métricas, porcentajes, impacto)
- Responsabilidades técnicas complejas
- Experiencia en equipos diversos

### 3. PROYECTOS Y CONTRIBUCIONES (20 puntos)
- Proyectos personales destacados
- Contribuciones a código abierto
- Portafolio técnico en GitHub
- Complejidad y relevancia de proyectos
- Innovación y creatividad

### 4. COMPATIBILIDAD ATS (15 puntos)
- Formato limpio y estructurado
- Uso de palabras clave técnicas relevantes
- Estructura lógica de secciones
- Legibilidad para sistemas automatizados
- Formato PDF estándar

### 5. PRESENTACIÓN PROFESIONAL (10 puntos)
- Diseño visual profesional
- Organización clara de información
- Datos de contacto completos (LinkedIn, GitHub)
- Ausencia de errores ortográficos
- Longitud apropiada (1-2 páginas)

### 6. FORMACIÓN Y CERTIFICACIONES (5 puntos)
- Relevancia de la formación académica
- Certificaciones técnicas oficiales
- Cursos de actualización continua
- Especialización en el área

## INSTRUCCIONES DE RESPUESTA:

IMPORTANTE: Extrae el nombre completo de la persona del currículum. Si no encuentras un nombre claro, usa "Candidato" como valor por defecto.

Responde en formato JSON con la siguiente estructura exacta:

{
  "candidateName": "Nombre completo de la persona del currículum",
  "overallScore": [puntuación global 0-100],
  "technicalSkillsScore": [puntuación 0-100],
  "experienceScore": [puntuación 0-100], 
  "projectsScore": [puntuación 0-100],
  "atsCompatibilityScore": [puntuación 0-100],
  "presentationScore": [puntuación 0-100],
  "educationScore": [puntuación 0-100],
  "strengths": [
    "Fortaleza específica 1",
    "Fortaleza específica 2",
    "Fortaleza específica 3"
  ],
  "weaknesses": [
    "Debilidad específica 1", 
    "Debilidad específica 2",
    "Debilidad específica 3"
  ],
  "recommendations": [
    "Recomendación práctica y específica 1",
    "Recomendación práctica y específica 2", 
    "Recomendación práctica y específica 3",
    "Recomendación práctica y específica 4"
  ],
  "technicalAnalysis": "Análisis detallado de las competencias técnicas, stack tecnológico, experiencia con herramientas específicas y nivel de actualización tecnológica",
  "marketComparison": "Comparación con estándares actuales del mercado tecnológico, expectativas de la industria y posicionamiento competitivo del candidato"
}

Asegúrate de que todas las puntuaciones sean números enteros entre 0 y 100, y que el análisis sea específico, constructivo y basado en evidencia del currículum.
`

export async function POST(req: NextRequest) {
  try {
    const { fileData, filename, language } = await req.json()

    if (!fileData) {
      return NextResponse.json({ message: 'Datos de archivo requeridos' }, { status: 400 })
    }

    if (!filename) {
      return NextResponse.json({ message: 'Nombre de archivo requerido' }, { status: 400 })
    }

    if (!process.env.ABACUSAI_API_KEY) {
      console.error('ABACUSAI_API_KEY not configured')
      return NextResponse.json({ message: 'API key no configurada' }, { status: 500 })
    }

    // Use the base64 data directly (no file system access needed)
    const base64String = fileData

    // Verify base64 string is not too long (AbacusAI limits)
    if (base64String.length > 10000000) { // ~7MB limit
      return NextResponse.json({ message: 'Archivo muy grande para procesar' }, { status: 413 })
    }

    console.log('Processing file:', filename, 'Base64 length:', base64String.length)

    // Prepare messages for LLM API
    const messages = [
      {
        role: "user",
        content: [
          {
            type: "file",
            file: {
              filename: filename,
              file_data: `data:application/pdf;base64,${base64String}`
            }
          },
          {
            type: "text", 
            text: EVALUATION_PROMPT
          }
        ]
      }
    ]

    // Call LLM API with streaming
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Cambio de modelo
        messages: messages,
        stream: true,
        max_tokens: 4000, // Aumentado para respuestas más largas
        temperature: 0.1, // Añadida consistencia
        response_format: { type: "json_object" }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', response.status, errorText)
      throw new Error(`Error en la API de evaluación: ${response.status} - ${errorText}`)
    }

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          const reader = response.body?.getReader()
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
                    // Process complete response
                    try {
                      const finalResult = JSON.parse(buffer)
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify(finalResult)}\n\n`))
                    } catch (error) {
                      console.error('Error processing final result:', error)
                    }
                    
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                    controller.close()
                    return
                  }
                  
                  try {
                    const parsed = JSON.parse(data)
                    if (parsed.choices?.[0]?.delta?.content) {
                      buffer += parsed.choices[0].delta.content
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({content: parsed.choices[0].delta.content})}\n\n`))
                    }
                  } catch (e) {
                    // Skip invalid JSON
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('Streaming error:', error)
          controller.error(error)
        }
      }
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })

  } catch (error) {
    console.error('Error in evaluation:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
