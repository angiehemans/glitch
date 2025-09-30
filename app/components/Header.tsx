
import RssButton from './RssButton'
import './Header.css'

interface HeaderProps {
  title: string
  showAuth?: boolean
  showRss?: boolean
}

export default function Header({
  title,
  showAuth = true,
  showRss = true
}: HeaderProps) {
  return (
    <header className="header">
      <div className='header-left'>
      </div>
      <div className="header-center">
        <h1 className="blog-title">{title}</h1>
      </div>
      <div className='header-right'>{showRss && <RssButton />}</div>
    </header>
  )
}