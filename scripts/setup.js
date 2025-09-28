#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Setting up Glitch Blog...\n')

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.log('⚠️  .env file not found. Creating from .env.example...')
  if (fs.existsSync('.env.example')) {
    fs.copyFileSync('.env.example', '.env')
    console.log(
      '✅ .env file created. Please configure your DATABASE_URL and other environment variables.\n'
    )
  } else {
    console.log(
      '❌ .env.example not found. Please create a .env file manually.\n'
    )
  }
} else {
  console.log('✅ .env file found.\n')
}

try {
  console.log('📦 Installing dependencies...')
  execSync('npm install', { stdio: 'inherit' })
  console.log('✅ Dependencies installed.\n')

  console.log('🗄️  Generating Prisma client...')
  execSync('npx prisma generate', { stdio: 'inherit' })
  console.log('✅ Prisma client generated.\n')

  console.log('🔄 Pushing database schema...')
  execSync('npx prisma db push', { stdio: 'inherit' })
  console.log('✅ Database schema updated.\n')

  console.log('🌱 Seeding database...')
  try {
    execSync('npm run db:seed', { stdio: 'inherit' })
    console.log('✅ Database seeded.\n')
  } catch (seedError) {
    console.log(
      '⚠️  Database seeding failed (this might be okay if data already exists).\n'
    )
  }

  console.log('🎉 Setup complete! You can now run:')
  console.log('   npm run dev     - Start development server')
  console.log('   npm run db:studio - Open Prisma Studio')
  console.log('   npm run build   - Build for production')
} catch (error) {
  console.error('❌ Setup failed:', error.message)
  console.log('\n🔧 Manual setup steps:')
  console.log('1. Make sure your DATABASE_URL is correctly set in .env')
  console.log('2. Run: npm install')
  console.log('3. Run: npx prisma generate')
  console.log('4. Run: npx prisma db push')
  console.log('5. Run: npm run db:seed (optional)')
  process.exit(1)
}
