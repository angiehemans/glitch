import Link from 'next/link'
import { IconHeart, IconMessageCircle } from '@tabler/icons-react'

import './PostCard.css'

interface Post {
  id: string
  title: string | null
  content: string
  createdAt: Date
  author: {
    name?: string | null
    email: string
    avatar?: string | null
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
            <div className="avatar">
              {post.author.avatar ? (
                <img src={post.author.avatar} alt={post.author.name || 'User avatar'} />
              ) : (
                <div className="avatar-placeholder">
                  {(post.author.name?.[0] || post.author.email[0]).toUpperCase()}
                </div>
              )}
            </div>
            {post.author.name}
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
        <div className='post-actions'>
          <div className="action-icons">
            <button className="action-button like-button" type="button">
              <IconHeart size={18} />
              <span>0</span>
            </button>
            <button className="action-button comment-button" type="button">
              <IconMessageCircle size={18} />
              <span>0</span>
            </button>
          </div>
          <Link href={`/posts/${post.id}`} className="post-card-link">
            <div className="read-more">Read More</div>
          </Link>
        </div>
    </div>
  )
}
