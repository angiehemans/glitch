import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import './post.css'

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

async function getPost(id: string): Promise<Post | null> {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
        published: true
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    if (!post) {
      return null
    }

    return post
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getPost(id)

  if (!post) {
    notFound()
  }

  return (
    <div className="post-page-container">
      <div className="post-header">
        <Link href="/" className="back-link">← Back to Home</Link>
      </div>

      <article className="post-article">
        <header className="post-article-header">
          <h1 className="post-article-title">{post.title}</h1>
          <div className="post-article-meta">
            <span className="post-article-author">
              By {post.author.name || post.author.email}
            </span>
            <span className="post-article-date">
              {formatDate(post.createdAt)}
            </span>
          </div>
        </header>

        <div className="post-article-content">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} className="post-paragraph">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </div>
  )
}