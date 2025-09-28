'use client'

import { useState } from 'react'

import Button from '@/app/components/Button'

interface FeedItem {
  id: string
  title: string
  description: string | null
  link: string
  pubDate: Date | null
  feed: {
    id: string
    title: string
    url: string
  }
}

interface Feed {
  id: string
  feedId: string
  feed: {
    id: string
    title: string
    description: string | null
    url: string
    feedItems: FeedItem[]
  }
}

interface FeedClientProps {
  initialFeeds: Feed[]
  initialFeedItems: FeedItem[]
}

export default function FeedClient({
  initialFeeds,
  initialFeedItems,
}: FeedClientProps) {
  const [feeds, setFeeds] = useState(initialFeeds)
  const [feedItems, setFeedItems] = useState(initialFeedItems)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [newFeedUrl, setNewFeedUrl] = useState('')
  const [activeTab, setActiveTab] = useState<'timeline' | 'subscriptions'>(
    'timeline'
  )

  const addFeed = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFeedUrl.trim()) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/feeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newFeedUrl.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add feed')
      }

      setFeeds((prev) => [data, ...prev])
      setNewFeedUrl('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add feed')
    } finally {
      setLoading(false)
    }
  }

  const removeFeed = async (feedId: string) => {
    try {
      const response = await fetch(`/api/feeds/${feedId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to unsubscribe')
      }

      setFeeds((prev) => prev.filter((feed) => feed.feed.id !== feedId))
      setFeedItems((prev) => prev.filter((item) => item.feed.id !== feedId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unsubscribe')
    }
  }

  const refreshFeeds = async () => {
    setRefreshing(true)
    setError('')

    try {
      const response = await fetch('/api/feeds/refresh', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to refresh feeds')
      }

      // Refetch the feeds data
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh feeds')
    } finally {
      setRefreshing(false)
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="feeds-content">
      {error && <div className="error-message">{error}</div>}

      <div className="feeds-actions">
        <form onSubmit={addFeed} className="add-feed-form">
          <input
            type="url"
            value={newFeedUrl}
            onChange={(e) => setNewFeedUrl(e.target.value)}
            placeholder="Enter RSS feed URL (e.g., https://example.com/rss.xml)"
            className="feed-url-input"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            loading={loading}
          >
            Add Feed
          </Button>
        </form>

        <Button
          onClick={refreshFeeds}
          disabled={refreshing}
          variant="secondary"
          loading={refreshing}
        >
          Refresh All Feeds
        </Button>
      </div>

      <div className="feeds-tabs">
        <button
          className={`tab-button ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          Timeline ({feedItems.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'subscriptions' ? 'active' : ''}`}
          onClick={() => setActiveTab('subscriptions')}
        >
          Subscriptions ({feeds.length})
        </button>
      </div>

      {activeTab === 'timeline' && (
        <div className="timeline-section">
          {feedItems.length === 0 ? (
            <div className="no-items">
              <p>
                No feed items yet. Subscribe to some RSS feeds to see their
                latest posts here.
              </p>
            </div>
          ) : (
            <div className="feed-items">
              {feedItems.map((item) => (
                <div key={item.id} className="feed-item">
                  <div className="feed-item-header">
                    <h3 className="feed-item-title">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.title}
                      </a>
                    </h3>
                    <div className="feed-item-source">
                      from {item.feed.title}
                    </div>
                  </div>
                  {item.description && (
                    <p className="feed-item-description">{item.description}</p>
                  )}
                  <div className="feed-item-meta">
                    <span className="feed-item-date">
                      {formatDate(item.pubDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'subscriptions' && (
        <div className="subscriptions-section">
          {feeds.length === 0 ? (
            <div className="no-feeds">
              <p>
                No RSS feed subscriptions yet. Add a feed URL above to get
                started.
              </p>
            </div>
          ) : (
            <div className="feed-list">
              {feeds.map((subscription) => (
                <div key={subscription.id} className="feed-card">
                  <div className="feed-card-header">
                    <div className="feed-info">
                      <h3 className="feed-title">{subscription.feed.title}</h3>
                      <p className="feed-url">{subscription.feed.url}</p>
                      {subscription.feed.description && (
                        <p className="feed-description">
                          {subscription.feed.description}
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={() => removeFeed(subscription.feed.id)}
                      variant="danger"
                      size="small"
                    >
                      Unsubscribe
                    </Button>
                  </div>
                  <div className="feed-stats">
                    <span className="feed-item-count">
                      {subscription.feed.feedItems.length} recent items
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
