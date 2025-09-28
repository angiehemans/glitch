'use client'

import { useState } from 'react'

export default function RssButton() {
  const [rssCopied, setRssCopied] = useState(false)

  const copyRssUrl = async () => {
    const rssUrl = `${window.location.origin}/rss.xml`
    try {
      await navigator.clipboard.writeText(rssUrl)
      setRssCopied(true)
      setTimeout(() => setRssCopied(false), 2000)
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = rssUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setRssCopied(true)
      setTimeout(() => setRssCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={copyRssUrl}
      className="rss-button"
      title="Copy RSS feed URL"
    >
      📡 {rssCopied ? 'Copied!' : 'RSS'}
    </button>
  )
}