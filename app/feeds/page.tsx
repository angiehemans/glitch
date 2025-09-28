import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

import FeedClient from './FeedClient'
import './feeds.css'

async function getFeeds(userId: string) {
  return await prisma.subscription.findMany({
    where: { userId },
    include: {
      feed: {
        include: {
          feedItems: {
            orderBy: { pubDate: 'desc' },
            take: 10,
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

async function getAllFeedItems(userId: string) {
  const subscriptions = await prisma.subscription.findMany({
    where: { userId },
    select: { feedId: true },
  })

  const feedIds = subscriptions.map((sub) => sub.feedId)

  if (feedIds.length === 0) return []

  return await prisma.feedItem.findMany({
    where: {
      feedId: { in: feedIds },
    },
    include: {
      feed: true,
    },
    orderBy: { pubDate: 'desc' },
    take: 50,
  })
}

export default async function FeedsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const [feeds, allFeedItems] = await Promise.all([
    getFeeds(session.user.id),
    getAllFeedItems(session.user.id),
  ])

  return (
    <div className="feeds-container">
      <div className="feeds-header">
        <a href="/dashboard" className="back-link">
          ← Back to Dashboard
        </a>
        <h1 className="feeds-title">RSS Feeds</h1>
        <p className="feeds-subtitle">
          Subscribe to RSS feeds from other Glitch instances
        </p>
      </div>

      <FeedClient initialFeeds={feeds} initialFeedItems={allFeedItems} />
    </div>
  )
}
