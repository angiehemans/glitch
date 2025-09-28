'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import '../edit-post.css'

interface Post {
  id: string
  title: string
  content: string
  published: boolean
  createdAt: string
  updatedAt: string
}

export default function EditPostPage() {
  const { data: session, status } = useSession()
  const [post, setPost] = useState<Post | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated' && params.id) {
      fetchPost()
    }
  }, [status, params.id, router])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
        setTitle(data.title)
        setContent(data.content)
      } else {
        setError('Post not found')
      }
    } catch (error) {
      setError('Error fetching post')
    } finally {
      setFetchLoading(false)
    }
  }

  if (status === 'loading' || fetchLoading) {
    return <div className="loading">Loading...</div>
  }

  if (status === 'unauthenticated') {
    return null
  }

  if (error && !post) {
    return (
      <div className="edit-post-container">
        <div className="edit-post-header">
          <Link href="/dashboard" className="back-link">← Back to Dashboard</Link>
          <h1 className="edit-post-title">Edit Post</h1>
        </div>
        <div className="error-state">
          <h2>Post not found</h2>
          <p>The post you're looking for doesn't exist or has been deleted.</p>
          <Link href="/dashboard" className="dashboard-link">Back to Dashboard</Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent, published?: boolean) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const updateData: any = { title, content }
      if (published !== undefined) {
        updateData.published = published
      }

      const response = await fetch(`/api/posts/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/dashboard')
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    }

    setLoading(false)
  }

  const handleSaveDraft = (e: React.FormEvent) => {
    handleSubmit(e, false)
  }

  const handlePublish = (e: React.FormEvent) => {
    handleSubmit(e, true)
  }

  const handleUpdate = (e: React.FormEvent) => {
    handleSubmit(e)
  }

  return (
    <div className="edit-post-container">
      <div className="edit-post-header">
        <Link href="/dashboard" className="back-link">← Back to Dashboard</Link>
        <h1 className="edit-post-title">Edit Post</h1>
      </div>

      <div className="edit-post-card">
        <form onSubmit={handleSubmit} className="edit-post-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">Post Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-input"
              placeholder="Enter your post title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content" className="form-label">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="form-textarea"
              placeholder="Write your post content here..."
              rows={10}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <Link href="/dashboard" className="cancel-button">Cancel</Link>
            {post && !post.published && (
              <button
                type="button"
                onClick={handlePublish}
                disabled={loading}
                className="publish-button"
              >
                {loading ? 'Publishing...' : 'Publish Post'}
              </button>
            )}
            {post && post.published && (
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={loading}
                className="draft-button"
              >
                {loading ? 'Saving...' : 'Save as Draft'}
              </button>
            )}
            <button
              type="button"
              onClick={handleUpdate}
              disabled={loading}
              className="submit-button"
            >
              {loading ? 'Updating...' : 'Update Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}