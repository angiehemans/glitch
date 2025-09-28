# Glitch Blog

A modern, fullstack blog application built with Next.js 15, Prisma, PostgreSQL, and NextAuth.js. Features server-side rendering (SSR) for optimal SEO and performance.

## Features

- 🚀 **Server-Side Rendering (SSR)** - Optimized for SEO and performance
- 📝 **Rich Blog Management** - Create, edit, and manage blog posts
- 🔐 **Authentication** - Secure user authentication with NextAuth.js
- 🗄️ **Database** - PostgreSQL with Prisma ORM
- 📱 **Responsive Design** - Works on all devices
- 🔗 **RSS Feed** - Automatic RSS feed generation
- ⚡ **Fast Development** - Turbopack for lightning-fast builds

## Quick Setup

For a complete automated setup, run:

```bash
npm run setup
```

This will:
- Install all dependencies
- Generate Prisma client
- Set up the database schema
- Seed initial data (optional)

## Manual Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### 1. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/glitch_blog"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Optional: Seed with sample data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your blog.

## Available Scripts

### Development
- `npm run dev` - Start development server with automatic Prisma client generation
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run setup` - Complete project setup (recommended for first-time setup)

### Database Management
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset database (⚠️ destructive)

### Other
- `npm run lint` - Run ESLint

## Contributing

We welcome contributions to Glitch Blog! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### Getting Started

1. **Fork the repository** and clone your fork locally
2. **Set up the development environment**:
   ```bash
   npm run setup
   ```
3. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development Workflow

1. **Make your changes** following the existing code style
2. **Test your changes**:
   ```bash
   npm run dev        # Start development server
   npm run lint       # Check code style
   npm run build      # Test production build
   ```
3. **Database changes**:
   - If you modify the Prisma schema, run `npm run db:push` to update your local database
   - For production changes, create a migration: `npm run db:migrate`

### Code Style and Standards

- **TypeScript**: All code should be properly typed
- **ESLint**: Run `npm run lint` to check code style
- **Components**: Follow the existing pattern of server components with client components for interactivity
- **Database**: Use Prisma for all database operations
- **Security**: Never commit secrets or API keys

### Pull Request Guidelines

1. **Ensure your code passes all checks**:
   - `npm run lint` shows no errors
   - `npm run build` completes successfully
   - All TypeScript errors are resolved

2. **Write clear commit messages**:
   ```
   feat: add dark mode toggle
   fix: resolve SSR hydration issue
   docs: update contributing guidelines
   ```

3. **Test your changes thoroughly**:
   - Test both development and production builds
   - Verify database operations work correctly
   - Check responsive design on different screen sizes

4. **Update documentation** if you:
   - Add new features
   - Change existing APIs
   - Modify the database schema
   - Add new environment variables

### Reporting Issues

When reporting bugs, please include:
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Environment details** (Node.js version, OS, database)
- **Error messages** or console logs
- **Screenshots** if applicable

### Feature Requests

For feature requests, please:
- **Search existing issues** to avoid duplicates
- **Describe the use case** and why the feature would be valuable
- **Provide examples** or mockups if possible
- **Consider the scope** - start with smaller, focused features

### Development Tips

- Use `npm run db:studio` to visually inspect and modify database data
- The `npm run setup` script can be re-run safely to reset your development environment
- Check the background Bash processes if you encounter database connection issues
- Use TypeScript strict mode - it will catch potential issues early

### Questions?

If you have questions about contributing, feel free to:
- Open an issue with the "question" label
- Check existing issues and discussions
- Review the codebase for examples of similar implementations

Thank you for contributing to Glitch Blog! 🎉

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
