import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import RssButton from './components/RssButton'
import AuthNav from './components/AuthNav'
import './home.css'

// Force TypeScript to reload Prisma types

interface Post {
  id: string
  title: string
  content: string
  createdAt: Date
  author: {
    name: string | null
    email: string
  }
}

interface BlogSettings {
  title: string
  description: string
}

// Server-side data fetching
async function getPosts(): Promise<Post[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return posts
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

async function getBlogSettings(): Promise<BlogSettings> {
  try {
    let blogSettings = await (prisma as any).blogSettings.findFirst()

    if (!blogSettings) {
      blogSettings = await (prisma as any).blogSettings.create({
        data: {}
      })
    }

    return {
      title: blogSettings.title,
      description: blogSettings.description
    }
  } catch (error) {
    console.error('Error fetching blog settings:', error)
    return {
      title: 'My Blog',
      description: 'A personal blog'
    }
  }
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default async function Home() {
  // Fetch data server-side
  const [posts, blogSettings] = await Promise.all([
    getPosts(),
    getBlogSettings()
  ])

  return (
    <div className="home-container">
      <header className="header">
        <div className="header-content">
          <div className="blog-title-section">
            <h1 className="blog-title">{blogSettings.title}</h1>
            <RssButton />
          </div>
          <nav className="nav">
            <AuthNav />
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="posts-container">
          {posts.length === 0 ? (
            <div className="no-posts">
              <h2>No posts yet!</h2>
              <p>Be the first to share something interesting.</p>
            </div>
          ) : (
            <div className="posts-list">
              {posts.map((post) => (
                <Link key={post.id} href={`/posts/${post.id}`} className="post-card-link">
                  <article className="post-card">
                    <h2 className="post-title">{post.title}</h2>
                    <div className="post-meta">
                      <span className="post-author">
                        By {post.author.name || post.author.email}
                      </span>
                      <span className="post-date">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                    <div className="post-content">
                      {post.content.slice(0, 200)}
                      {post.content.length > 200 && '...'}
                    </div>
                    <div className="read-more">
                      Click to read more →
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
