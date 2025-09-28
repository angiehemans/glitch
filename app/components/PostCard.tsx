import Link from 'next/link'

import './PostCard.css'

interface Post {
  id: string
  title: string | null
  content: string
  createdAt: Date
  author: {
    name?: string | null
    email: string
  }
}

interface PostCardProps {
  post: Post
  showExcerpt?: boolean
  excerptLength?: number
  showTitle?: boolean
}

export default function PostCard({
  post,
  showExcerpt = true,
  excerptLength = 200,
  showTitle = true,
}: PostCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="post-card">
              <div className="post-meta">
          <span className="post-author">
            By {post.author.name || post.author.email}
          </span>
          <span className="post-date">{formatDate(post.createdAt)}</span>
        </div>
        {showTitle && post.title && <h2 className="post-title">{post.title}</h2>}

        {showExcerpt && (
          <div className="post-content">
            {post.content.slice(0, excerptLength)}
            {post.content.length > excerptLength && '...'}
          </div>
        )}
        <Link href={`/posts/${post.id}`} className="post-card-link">
          <div className="read-more">Read More</div>
        </Link>
    
    </div>
  )
}
