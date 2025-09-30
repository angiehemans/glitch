import bcrypt from 'bcryptjs'

import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const userCount = await prisma.user.count()
    return NextResponse.json({ needsSetup: userCount === 0 })
  } catch (error) {
    console.error('Setup check error:', error)
    return NextResponse.json(
      { error: 'Failed to check setup status' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check if any users already exist
    const userCount = await prisma.user.count()
    if (userCount > 0) {
      return NextResponse.json(
        { error: 'Setup already completed' },
        { status: 400 }
      )
    }

    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Create the admin user
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    // Create default blog settings
    await prisma.blogSettings.create({
      data: {
        title: 'My Blog',
        description: 'A personal blog with thoughts and ideas',
      },
    })

    return NextResponse.json({
      message: 'Setup completed successfully',
      user,
    })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: 'Setup failed. Please try again.' },
      { status: 500 }
    )
  }
}
