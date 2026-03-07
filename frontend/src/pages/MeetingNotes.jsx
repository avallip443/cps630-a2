import { useFileData } from '../hooks/useFileData';
import { Link } from 'react-router-dom';

export default function MeetingNotes() {
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
        <h1>📝 {file.name}</h1>
        <p className="subtitle">Template for documenting meetings</p>
      </div>

      <div className="container">
        <div className="section">
          <h2>Meeting Details</h2>
          <input
            type="date"
            value={fileData.meetingDate || ''}
            onChange={(e) => handleChange('meetingDate', e.target.value)}
          />
          <input
            type="time"
            value={fileData.meetingTime || ''}
            onChange={(e) => handleChange('meetingTime', e.target.value)}
          />
          <textarea
            rows={3}
            value={fileData.attendees || ''}
            onChange={(e) => handleChange('attendees', e.target.value)}
          />
        </div>

        <div className="section">
          <h2>Discussion Points</h2>
          <textarea
            rows={4}
            value={fileData.discussion || ''}
            onChange={(e) => handleChange('discussion', e.target.value)}
          />
        </div>
        
        <div className="section">
          <h2>Key Takeaways</h2>
          <textarea
            rows={4}
            value={fileData.takeaways || ''}
            onChange={(e) => handleChange('takeaways', e.target.value)}
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
