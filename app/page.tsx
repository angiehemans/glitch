import { prisma } from '@/lib/prisma'

import Header from './components/Header'
import PostCard from './components/PostCard'
import './home.css'

// Force TypeScript to reload Prisma types

interface Post {
  id: string
  title: string | null
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
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return posts
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

async function getBlogSettings(): Promise<BlogSettings> {
  try {
    let blogSettings = await prisma.blogSettings.findFirst()

    if (!blogSettings) {
      blogSettings = await prisma.blogSettings.create({
        data: {},
      })
    }

    return {
      title: blogSettings.title,
      description: blogSettings.description,
    }
  } catch (error) {
    console.error('Error fetching blog settings:', error)
    return {
      title: 'My Blog',
      description: 'A personal blog',
    }
  }
}

export default async function Home() {
  // Fetch data server-side
  const [posts, blogSettings] = await Promise.all([
    getPosts(),
    getBlogSettings(),
  ])

  return (
    <div className="home-container">
      

      <main className="main">
        <Header title={blogSettings.title} />
        <div className="posts-container">
          {posts.length === 0 ? (
            <div className="no-posts">
              <h2>No posts yet!</h2>
              <p>Be the first to share something interesting.</p>
            </div>
          ) : (
            <div className="posts-list">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
