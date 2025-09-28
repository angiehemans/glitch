import Parser from 'rss-parser'

import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const parser = new Parser()

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all feeds the user is subscribed to
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: session.user.id },
      include: { feed: true },
    })

    const refreshResults = []

    for (const subscription of subscriptions) {
      try {
        const feedData = await parser.parseURL(subscription.feed.url)

        // Update feed metadata
        await prisma.rssFeed.update({
          where: { id: subscription.feed.id },
          data: {
            title: feedData.title || subscription.feed.title,
            description: feedData.description || subscription.feed.description,
            lastFetchedAt: new Date(),
          },
        })

        // Add new feed items
        if (feedData.items && feedData.items.length > 0) {
          const feedItems = feedData.items.slice(0, 20).map((item) => ({
            feedId: subscription.feed.id,
            title: item.title || 'Untitled',
            description: item.contentSnippet || item.summary || null,
            link: item.link || '',
            pubDate: item.pubDate ? new Date(item.pubDate) : null,
            guid: item.guid || item.link || null,
          }))

          const result = await prisma.feedItem.createMany({
            data: feedItems,
            skipDuplicates: true,
          })

          refreshResults.push({
            feedId: subscription.feed.id,
            feedTitle: subscription.feed.title,
            newItems: result.count,
          })
        }
      } catch (error) {
        console.error(`Error refreshing feed ${subscription.feed.url}:`, error)
        refreshResults.push({
          feedId: subscription.feed.id,
          feedTitle: subscription.feed.title,
          error: 'Failed to refresh feed',
        })
      }
    }

    return NextResponse.json({
      message: 'Feeds refreshed',
      results: refreshResults,
    })
  } catch (error) {
    console.error('Error refreshing feeds:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
