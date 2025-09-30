import Link from 'next/link'
import {
  IconHome,
  IconPlus,
  IconRss,
  IconSettings,
  IconLogout
} from '@tabler/icons-react'

import Button from './Button'
import './DashboardNav.css'

interface DashboardNavProps {
  onLogout: () => void
  user?: {
    name?: string | null
    email: string
    avatar?: string | null
  }
}

export default function DashboardNav({ onLogout, user }: DashboardNavProps) {
  return (
    <div className="dashboard-nav-section">
      <div className="dashboard-nav">
        <Link href="/" className="nav-link">
          <IconHome size={18} className='icon'/>
        </Link>
        <Link href="/create-post" className="nav-link">
          <IconPlus size={18} className='icon' />
        </Link>
        <Link href="/feeds" className="nav-link">
          <IconRss size={18} className='icon' />
        </Link>
        <Link href="/settings" className="nav-link">
          <IconSettings size={18} className='icon' />
        </Link>

        {/* <Button onClick={onLogout} variant="outline" className="logout-btn">
          <IconLogout size={18} />
        </Button> */}
      </div>
    </div>
  )
}