'use client'

import { useEffect, useState } from 'react'

import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import Button from '@/app/components/Button'
import DashboardNav from '@/app/components/DashboardNav'
import Header from '@/app/components/Header'

import './dashboard.css'

interface Post {
  id: string
  title: string
  content: string
  published: boolean
  createdAt: string
  updatedAt: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    fetchPosts()
  }, [session, status, router])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts/all')
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      } else {
        setError('Failed to fetch posts')
      }
    } catch (error) {
      setError('Error fetching posts')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== postId))
      } else {
        setError('Failed to delete post')
      }
    } catch (error) {
      setError('Error deleting post')
    }
  }

  const togglePublished = async (postId: string, published: boolean) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !published }),
      })

      if (response.ok) {
        setPosts(
          posts.map((post) =>
            post.id === postId ? { ...post, published: !published } : post
          )
        )
      } else {
        setError('Failed to update post')
      }
    } catch (error) {
      setError('Error updating post')
    }
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  const publishedPosts = posts.filter((post) => post.published)
  const draftPosts = posts.filter((post) => !post.published)

  return (
    <div className="dashboard-container">
      <main className="main">
        <Header title="Dashboard" showRss={false} />

        <DashboardNav
          onLogout={handleLogout}
          user={session?.user ? {
            name: session.user.name,
            email: session.user.email || '',
            avatar: session.user.image
          } : undefined}
        />

        <div className="dashboard-content">
          {error && <div className="error-message">{error}</div>}

          {/* Published Posts Section */}
          <div className="posts-section">
            <div className="section-header">
              <h2 className="section-title">Published Posts</h2>
              <div className="posts-count">
                {publishedPosts.length}{' '}
                {publishedPosts.length === 1 ? 'post' : 'posts'}
              </div>
            </div>

            {publishedPosts.length === 0 ? (
              <div className="no-posts">
                <h3>No published posts yet</h3>
                <p>
                  Publish your first blog post to make it visible to readers.
                </p>
              </div>
            ) : (
              <div className="posts-grid">
                {publishedPosts.map((post) => (
                  <div key={post.id} className="post-card">
                    <div className="post-card-header">
                      <h3 className="post-card-title">{post.title}</h3>
                      <div className="post-status">
                        <span className="status-badge published">
                          Published
                        </span>
                      </div>
                    </div>

                    <div className="post-card-content">
                      <p className="post-excerpt">
                        {post.content.length > 150
                          ? post.content.substring(0, 150) + '...'
                          : post.content}
                      </p>
                    </div>

                    <div className="post-card-meta">
                      <span className="post-date">
                        Created: {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      {post.updatedAt !== post.createdAt && (
                        <span className="post-updated">
                          Updated:{' '}
                          {new Date(post.updatedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div className="post-card-actions">
                      <Link href={`/posts/${post.id}`} className="view-link">
                        View
                      </Link>
                      <Link
                        href={`/edit-post/${post.id}`}
                        className="edit-link"
                      >
                        Edit
                      </Link>
                      <Button
                        onClick={() => togglePublished(post.id, post.published)}
                        variant="secondary"
                        size="small"
                      >
                        Unpublish
                      </Button>
                      <Button
                        onClick={() => handleDelete(post.id)}
                        variant="danger"
                        size="small"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Draft Posts Section */}
          <div className="posts-section">
            <div className="section-header">
              <h2 className="section-title">Draft Posts</h2>
              <div className="posts-count">
                {draftPosts.length}{' '}
                {draftPosts.length === 1 ? 'draft' : 'drafts'}
              </div>
            </div>

            {draftPosts.length === 0 ? (
              <div className="no-posts">
                <h3>No drafts yet</h3>
                <p>Save posts as drafts to work on them before publishing.</p>
                <Link href="/create-post" className="create-first-post">
                  Create Your First Post
                </Link>
              </div>
            ) : (
              <div className="posts-grid">
                {draftPosts.map((post) => (
                  <div key={post.id} className="post-card">
                    <div className="post-card-header">
                      <h3 className="post-card-title">{post.title}</h3>
                      <div className="post-status">
                        <span className="status-badge draft">Draft</span>
                      </div>
                    </div>

                    <div className="post-card-content">
                      <p className="post-excerpt">
                        {post.content.length > 150
                          ? post.content.substring(0, 150) + '...'
                          : post.content}
                      </p>
                    </div>

                    <div className="post-card-meta">
                      <span className="post-date">
                        Created: {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      {post.updatedAt !== post.createdAt && (
                        <span className="post-updated">
                          Updated:{' '}
                          {new Date(post.updatedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div className="post-card-actions">
                      <Link
                        href={`/edit-post/${post.id}`}
                        className="edit-link"
                      >
                        Edit
                      </Link>
                      <Button
                        onClick={() => togglePublished(post.id, post.published)}
                        variant="primary"
                        size="small"
                      >
                        Publish
                      </Button>
                      <Button
                        onClick={() => handleDelete(post.id)}
                        variant="danger"
                        size="small"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Show create post prompt if no posts at all */}
          {posts.length === 0 && (
            <div className="posts-section">
              <div className="no-posts">
                <h3>No posts yet</h3>
                <p>Start writing your first blog post to get started.</p>
                <Link href="/create-post" className="create-first-post">
                  Create Your First Post
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
