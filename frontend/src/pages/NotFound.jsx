import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="error-container">
      <h1>Page Not Found</h1>
      <p className="error-message">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/" className="btn btn-primary">
        Back to Library
      </Link>
    </div>
  )
}
