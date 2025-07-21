
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const language = formData.get('language') as string || 'es'

    if (!file) {
      return NextResponse.json({ message: 'No se encontró archivo' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ message: 'Solo se permiten archivos PDF' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      return NextResponse.json({ message: 'El archivo es muy grande' }, { status: 400 })
    }

    // Convert file to base64 for temporary storage
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64String = buffer.toString('base64')

    // Generate unique evaluation ID
    const uniqueId = Date.now() + '-' + Math.random().toString(36).substring(2)
    const evaluationId = `eval_${uniqueId}`

    return NextResponse.json({
      message: 'Archivo procesado exitosamente',
      evaluationId,
      fileData: base64String,
      filename: file.name,
      language
    })

  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
