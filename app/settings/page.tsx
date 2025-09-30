'use client'

import { useEffect, useState } from 'react'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import AvatarUpload from '@/app/components/AvatarUpload'
import Button from '@/app/components/Button'

import './settings.css'

interface BlogSettings {
  title: string
  description: string
  language: string
  managingEditor: string
  webMaster: string
}

export default function SettingsPage() {
  const { data: session, status, update } = useSession()
  const [name, setName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [blogSettings, setBlogSettings] = useState<BlogSettings>({
    title: '',
    description: '',
    language: 'en-us',
    managingEditor: '',
    webMaster: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name)
    }
    fetchBlogSettings()
  }, [session])

  const fetchBlogSettings = async () => {
    try {
      const response = await fetch('/api/blog-settings')
      if (response.ok) {
        const data = await response.json()
        setBlogSettings({
          title: data.title || '',
          description: data.description || '',
          language: data.language || 'en-us',
          managingEditor: data.managingEditor || '',
          webMaster: data.webMaster || '',
        })
      }
    } catch (error) {
      console.error('Error fetching blog settings:', error)
    }
  }

  if (status === 'loading') {
    return <div className="loading">Loading...</div>
  }

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Username updated successfully!')
        // Update the session with new name
        await update({ name: data.user.name })
      } else {
        setError(data.error || 'Failed to update username')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    }

    setLoading(false)
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      setLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Password updated successfully!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setError(data.error || 'Failed to update password')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    }

    setLoading(false)
  }

  const handleBlogSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/blog-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogSettings),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Blog settings updated successfully!')
      } else {
        setError(data.error || 'Failed to update blog settings')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <Link href="/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>
        <h1 className="settings-title">Account Settings</h1>
      </div>

      <div className="settings-content">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Username Update Section */}
        <div className="settings-section">
          <h2 className="section-title">Update Username</h2>
          <form onSubmit={handleNameUpdate} className="settings-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                placeholder="Enter your username"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              loading={loading}
            >
              Update Username
            </Button>
          </form>
        </div>

        {/* Avatar Upload Section */}
        <div className="settings-section">
          <h2 className="section-title">Profile Avatar</h2>
          <div className="avatar-section">
            <AvatarUpload
              currentAvatar={null}
              onAvatarChange={(avatarUrl) => {
                // Update session with new avatar
                update({ image: avatarUrl })
              }}
              size="large"
            />
          </div>
        </div>

        {/* Password Update Section */}
        <div className="settings-section">
          <h2 className="section-title">Change Password</h2>
          <form onSubmit={handlePasswordUpdate} className="settings-form">
            <div className="form-group">
              <label htmlFor="currentPassword" className="form-label">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="form-input"
                placeholder="Enter your current password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="form-input"
                placeholder="Enter new password"
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="form-input"
                placeholder="Confirm new password"
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              disabled={
                loading || !currentPassword || !newPassword || !confirmPassword
              }
              variant="primary"
              loading={loading}
            >
              Change Password
            </Button>
          </form>
        </div>

        {/* Account Info Section */}
        <div className="settings-section">
          <h2 className="section-title">Account Information</h2>
          <div className="account-info">
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{session?.user?.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Current Username:</span>
              <span className="info-value">
                {session?.user?.name || 'Not set'}
              </span>
            </div>
          </div>
        </div>

        {/* Blog Settings Section */}
        <div className="settings-section">
          <h2 className="section-title">Blog Settings</h2>
          <form onSubmit={handleBlogSettingsUpdate} className="settings-form">
            <div className="form-group">
              <label htmlFor="blogTitle" className="form-label">
                Blog Title
              </label>
              <input
                type="text"
                id="blogTitle"
                value={blogSettings.title}
                onChange={(e) =>
                  setBlogSettings({ ...blogSettings, title: e.target.value })
                }
                required
                className="form-input"
                placeholder="My Blog"
              />
            </div>

            <div className="form-group">
              <label htmlFor="blogDescription" className="form-label">
                Blog Description
              </label>
              <textarea
                id="blogDescription"
                value={blogSettings.description}
                onChange={(e) =>
                  setBlogSettings({
                    ...blogSettings,
                    description: e.target.value,
                  })
                }
                required
                className="form-textarea"
                placeholder="A personal blog with thoughts and ideas"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="blogLanguage" className="form-label">
                Language
              </label>
              <select
                id="blogLanguage"
                value={blogSettings.language}
                onChange={(e) =>
                  setBlogSettings({ ...blogSettings, language: e.target.value })
                }
                className="form-input"
              >
                <option value="en-us">English (US)</option>
                <option value="en-gb">English (UK)</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
                <option value="ja">Japanese</option>
                <option value="zh">Chinese</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="managingEditor" className="form-label">
                Managing Editor
              </label>
              <input
                type="text"
                id="managingEditor"
                value={blogSettings.managingEditor}
                onChange={(e) =>
                  setBlogSettings({
                    ...blogSettings,
                    managingEditor: e.target.value,
                  })
                }
                className="form-input"
                placeholder="Blog Admin"
              />
            </div>

            <div className="form-group">
              <label htmlFor="webMaster" className="form-label">
                Web Master
              </label>
              <input
                type="text"
                id="webMaster"
                value={blogSettings.webMaster}
                onChange={(e) =>
                  setBlogSettings({
                    ...blogSettings,
                    webMaster: e.target.value,
                  })
                }
                className="form-input"
                placeholder="Blog Admin"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              loading={loading}
            >
              Update Blog Settings
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
