import Parser from 'rss-parser'

import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const parser = new Parser()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: session.user.id },
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

    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error('Error fetching feeds:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Validate RSS feed by parsing it
    let feedData
    try {
      feedData = await parser.parseURL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid RSS feed URL' },
        { status: 400 }
      )
    }

    // Check if feed already exists
    let feed = await prisma.rssFeed.findUnique({
      where: { url },
    })

    // Create feed if it doesn't exist
    if (!feed) {
      feed = await prisma.rssFeed.create({
        data: {
          url,
          title: feedData.title || 'Unknown Feed',
          description: feedData.description || null,
          lastFetchedAt: new Date(),
        },
      })

      // Add feed items
      if (feedData.items && feedData.items.length > 0) {
        const feedItems = feedData.items.slice(0, 20).map((item) => ({
          feedId: feed!.id,
          title: item.title || 'Untitled',
          description: item.contentSnippet || item.summary || null,
          link: item.link || '',
          pubDate: item.pubDate ? new Date(item.pubDate) : null,
          guid: item.guid || item.link || null,
        }))

        await prisma.feedItem.createMany({
          data: feedItems,
          skipDuplicates: true,
        })
      }
    }

    // Check if user is already subscribed
    const existingSubscription = await prisma.subscription.findUnique({
      where: {
        userId_feedId: {
          userId: session.user.id,
          feedId: feed.id,
        },
      },
    })

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'Already subscribed to this feed' },
        { status: 400 }
      )
    }

    // Create subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId: session.user.id,
        feedId: feed.id,
      },
      include: {
        feed: true,
      },
    })

    return NextResponse.json(subscription, { status: 201 })
  } catch (error) {
    console.error('Error adding feed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
