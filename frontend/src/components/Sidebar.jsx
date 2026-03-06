import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API = 'http://localhost:8080'

export default function Sidebar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [files, setFiles] = useState([])

  useEffect(() => {
    async function fetchFiles() {
      try {
        const res = await fetch(`${API}/api/files`)
        const data = await res.json()
        setFiles(data)
      } catch (err) {
        console.error('Error fetching files:', err)
      }
    }

    fetchFiles()
  }, [])

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
          onClick={() => setDropdownOpen(open => !open)}
        >
          <span className="side-folder-name">&gt; Recent</span>
        </button>

        <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
          {files.length === 0 ? (
            <p className="no-files">No files yet</p>
          ) : (
            [...files].reverse().map(file => (
              <button
                key={file.name}
                type="button"
                className="dropdown-item"
                style={{ borderLeft: `4px solid ${file.colour || 'transparent'}` }}
              >
                {file.icon} {file.name}
              </button>
            ))
          )}
        </div>
      </nav>
    </aside>
  )
}