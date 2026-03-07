import { useFileData } from '../hooks/useFileData';
import { Link } from 'react-router-dom';

export default function BugReport() {
  const { 
    file, 
    fileData, 
    handleChange, 
    handleSave, 
    handleDelete, 
    loading, 
    error 
  } = useFileData();

  if (error) return (
    <p className="error">
      {error} 
      <Link to="/">
        Back to Home
      </Link>
    </p>
  );

  if (loading || !file) return (
    <p>Loading...</p>
  );

  return (
    <div>
      <div className="header">
        <h1>🐛 {file.name}</h1>
        <p className="subtitle">Template for reporting bugs</p>
      </div>
      <div className="container">
        <div className="section">
          <h2>Bug Information</h2>

          <div className="field">
            <label>Bug ID</label>
            <input
              type="text"
              value={fileData.bugId || ''}
              onChange={(e) => handleChange('bugId', e.target.value)}
            />
          </div>

          <div className="field">
            <label>Title</label>
            <input
              type="text"
              value={fileData.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>

          <div className="field">
            <label>Severity</label>
            <select
              value={fileData.severity || ''}
              onChange={(e) => handleChange('severity', e.target.value)}
            >
              <option value="">Select level</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="field">
            <label>Status</label>
            <select
              value={fileData.status || ''}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <option value="">Select status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="fixed">Fixed</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="section">
          <h2>Description</h2>
          <textarea
            rows={4}
            value={fileData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>
        
        <div className="button-container">
          <button type="button" className="save" onClick={handleSave}>Save</button>
          <button type="button" className="delete" onClick={handleDelete}>Delete File</button>
        </div>
      </div>
    </div>
  );
}
