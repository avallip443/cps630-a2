import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Sidebar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar-header">
        <div className="icon">📋</div>
        <h2>Thinkr</h2>
      </Link>

      <nav className="sidebar-nav">
        <button
          type="button"
          className="nav-item"
          onClick={() => setDropdownOpen((open) => !open)}
        >
          <span className="side-folder-name">&gt; Recent</span>
        </button>

        <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
          {/* Recent items go here when functionality is added */}
        </div>
      </nav>
    </aside>
  )
}
