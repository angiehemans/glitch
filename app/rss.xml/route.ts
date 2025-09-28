import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get blog settings
    let blogSettings = await prisma.blogSettings.findFirst()

    // If no settings exist, create default ones
    if (!blogSettings) {
      blogSettings = await prisma.blogSettings.create({
        data: {},
      })
    }

    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20, // Limit to latest 20 posts
    })

    const siteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const currentDate = new Date().toUTCString()

    // Escape XML for blog settings
    const escapeXml = (str: string) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
    }

    const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(blogSettings.title)}</title>
    <description>${escapeXml(blogSettings.description)}</description>
    <link>${siteUrl}</link>
    <language>${blogSettings.language}</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <managingEditor>${escapeXml(blogSettings.managingEditor)}</managingEditor>
    <webMaster>${escapeXml(blogSettings.webMaster)}</webMaster>
    <generator>${escapeXml(blogSettings.generator)}</generator>
    <ttl>60</ttl>
${posts
  .map((post) => {
    const postUrl = `${siteUrl}/posts/${post.id}`
    const pubDate = new Date(post.createdAt).toUTCString()
    const authorName = post.author.name || 'Blog Author'

    const title = escapeXml(post.title)
    const content = escapeXml(post.content)
    const description = escapeXml(
      post.content.length > 200
        ? post.content.substring(0, 200) + '...'
        : post.content
    )

    return `    <item>
      <title>${title}</title>
      <description>${description}</description>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(authorName)}</author>
      <content:encoded><![CDATA[
        <h1>${title}</h1>
        <p><strong>By:</strong> ${escapeXml(authorName)} | <strong>Published:</strong> ${pubDate}</p>
        ${content
          .split('\n')
          .map((paragraph) =>
            paragraph.trim() ? `<p>${escapeXml(paragraph)}</p>` : ''
          )
          .join('\n        ')}
        <p><a href="${postUrl}">Read full post</a></p>
      ]]></content:encoded>
    </item>`
  })
  .join('\n')}
  </channel>
</rss>`

    return new NextResponse(rssContent, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new NextResponse('Error generating RSS feed', { status: 500 })
  }
}
