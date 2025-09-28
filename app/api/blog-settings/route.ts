import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get or create blog settings (only one record should exist)
    let settings = await prisma.blogSettings.findFirst()

    if (!settings) {
      // Create default settings if none exist
      settings = await prisma.blogSettings.create({
        data: {},
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching blog settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, language, managingEditor, webMaster } =
      await req.json()

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    // Get existing settings or create if none exist
    let settings = await prisma.blogSettings.findFirst()

    if (settings) {
      // Update existing settings
      settings = await prisma.blogSettings.update({
        where: { id: settings.id },
        data: {
          title,
          description,
          language: language || 'en-us',
          managingEditor: managingEditor || 'Blog Admin',
          webMaster: webMaster || 'Blog Admin',
          generator: 'Glitch RSS',
        },
      })
    } else {
      // Create new settings
      settings = await prisma.blogSettings.create({
        data: {
          title,
          description,
          language: language || 'en-us',
          managingEditor: managingEditor || 'Blog Admin',
          webMaster: webMaster || 'Blog Admin',
          generator: 'Glitch RSS',
        },
      })
    }

    return NextResponse.json({
      message: 'Blog settings updated successfully',
      settings,
    })
  } catch (error) {
    console.error('Blog settings update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
