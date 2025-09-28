import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="post-page-container">
      <div className="post-header">
        <Link href="/" className="back-link">← Back to Home</Link>
      </div>
      <div className="error-state">
        <h1>Post Not Found</h1>
        <p>The post you are looking for does not exist or has been removed.</p>
        <Link href="/" className="home-link">Go back to home</Link>
      </div>
    </div>
  )
}