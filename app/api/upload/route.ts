
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

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

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const uniqueId = Date.now() + '-' + Math.random().toString(36).substring(2)
    const filename = `${uniqueId}.pdf`
    const filePath = join(uploadsDir, filename)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Generate evaluation ID without database
    const evaluationId = `eval_${uniqueId}`

    return NextResponse.json({
      message: 'Archivo subido exitosamente',
      evaluationId,
      filename,
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
