import { Link } from 'react-router-dom';
import { getFileUrl } from '../api';

export default function FileCard({ file }) {
  const url = getFileUrl(file);
  return (
    <div
      className="file-card"
      style={{ borderLeft: `6px solid ${file.colour || ''}` }}
    >
      {url ? (
        <Link to={url} className="file-card-link">
          <h2>{file.icon} {file.name}</h2>
          <p>{file.description}</p>
        </Link>
      ) : (
        <>
          <h2>{file.icon} {file.name}</h2>
          <p>{file.description}</p>
        </>
      )}
    </div>
  );
}
