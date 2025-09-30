'use client'

import { IconCamera, IconTrash, IconUpload } from '@tabler/icons-react'
import { useState } from 'react'

import Button from './Button'
import './AvatarUpload.css'

interface AvatarUploadProps {
  currentAvatar?: string | null
  onAvatarChange?: (avatarUrl: string | null) => void
  size?: 'small' | 'medium' | 'large'
}

export default function AvatarUpload({
  currentAvatar,
  onAvatarChange,
  size = 'medium',
}: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatar || null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setError(null)
    setUploading(true)

    try {
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Upload file
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      setPreviewUrl(data.avatarUrl)
      onAvatarChange?.(data.avatarUrl)
    } catch (error) {
      console.error('Upload error:', error)
      setError(error instanceof Error ? error.message : 'Upload failed')
      setPreviewUrl(currentAvatar || null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveAvatar = async () => {
    setUploading(true)
    setError(null)

    try {
      const response = await fetch('/api/upload/avatar', {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Remove failed')
      }

      setPreviewUrl(null)
      onAvatarChange?.(null)
    } catch (error) {
      console.error('Remove error:', error)
      setError(error instanceof Error ? error.message : 'Remove failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={`avatar-upload avatar-upload-${size}`}>
      <div className="avatar-preview">
        {previewUrl ? (
          <img src={previewUrl} alt="Avatar" className="avatar-image" />
        ) : (
          <div className="avatar-placeholder">
            <IconCamera size={size === 'large' ? 32 : size === 'medium' ? 24 : 16} />
          </div>
        )}

        <div className="avatar-overlay">
          <label htmlFor="avatar-input" className="upload-trigger">
            <IconUpload size={16} />
          </label>
          {previewUrl && (
            <button
              type="button"
              onClick={handleRemoveAvatar}
              className="remove-trigger"
              disabled={uploading}
            >
              <IconTrash size={16} />
            </button>
          )}
        </div>
      </div>

      <input
        id="avatar-input"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="file-input"
        disabled={uploading}
      />

      <div className="avatar-controls">
        <label htmlFor="avatar-input" className="upload-button-label">
          <span className={`button button--outline button--small ${uploading ? 'button--loading button--disabled' : ''}`}>
            {uploading ? (
              <span className="button__content">
                <span className="button__spinner"></span>
                Loading...
              </span>
            ) : (
              previewUrl ? 'Change Avatar' : 'Upload Avatar'
            )}
          </span>
        </label>

        {previewUrl && (
          <Button
            variant="danger"
            size="small"
            onClick={handleRemoveAvatar}
            loading={uploading}
            disabled={uploading}
          >
            Remove
          </Button>
        )}
      </div>

      {error && <div className="avatar-error">{error}</div>}
    </div>
  )
}