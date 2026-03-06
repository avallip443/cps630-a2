import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Sidebar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [userFiles, setUserFiles] = useState([])

  // Fetch user files when sidebar mounts
  useEffect(() => {
    async function fetchUserFiles() {
      try {
        const res = await fetch('http://localhost:8080/api/file-data')
        const data = await res.json()
        setUserFiles(data)
      } catch (err) {
        console.error('Error fetching user files:', err)
      }
    }

    fetchUserFiles()
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
          {userFiles.length === 0 ? (
            <p className="no-files">No files yet</p>
          ) : (
            [...userFiles].reverse().map(file => {
              const pathName = `${file.fileId.name.toLowerCase().replace(/\s+/g, '-')}/${file._id}`;
              return (
                <Link 
                  key={file._id} 
                  to={`/${pathName}`} 
                  className="dropdown-item"
                  style={{ borderLeft: `4px solid ${file.fileId.colour}` }}
                >
                  {file.fileId.icon} {file.fileType}
                </Link>
              );
            })
          )}
        </div>
      </nav>
    </aside>
  )
}