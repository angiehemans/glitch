import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required')
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (existingUser) {
    console.log(`Admin user with email ${adminEmail} already exists`)
    return
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  const adminUser = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin'
    }
  })

  console.log(`Admin user created with email: ${adminUser.email}`)

  // Create initial blog settings
  const existingSettings = await prisma.blogSettings.findFirst()

  if (!existingSettings) {
    const blogSettings = await prisma.blogSettings.create({
      data: {
        title: 'My Blog',
        description: 'A personal blog with thoughts and ideas',
        language: 'en-us',
        managingEditor: 'Blog Admin',
        webMaster: 'Blog Admin',
        generator: 'Glitch RSS'
      }
    })

    console.log(`Blog settings created with title: ${blogSettings.title}`)
  } else {
    console.log('Blog settings already exist')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })