import { useFileData } from '../hooks/useFileData';
import { Link } from 'react-router-dom';

export default function ProjectPlan() {
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
        <h1>📊 {file.name}</h1>
        <p className="subtitle">Template for planning and tracking project milestones</p>
      </div>

      <div className="container">
        <div className="section">
          <h2>Project Overview</h2>
          <div className="field">
            <label>Project Name</label>
            <input
              type="text"
              value={fileData.projectName || ''}
              onChange={(e) => handleChange('projectName', e.target.value)}
            />
          </div>
          <div className="field">
            <label>Start Date</label>
            <input
              type="date"
              value={fileData.startDate || ''}
              onChange={(e) => handleChange('startDate', e.target.value)}
            />
          </div>
          <div className="field">
            <label>End Date</label>
            <input
              type="date"
              value={fileData.endDate || ''}
              onChange={(e) => handleChange('endDate', e.target.value)}
            />
          </div>
        </div>

        <div className="section">
          <h2>Goals</h2>
          {Array(3).fill(null).map((_, i) => {
            const goals = [...(fileData.goals || [])];
            while (goals.length <= i) goals.push({});
            return (
              <div key={i} className="grid-cols">
                <input
                  type="text"
                  value={fileData.goals?.[i]?.name || ''}
                  onChange={(e) => {
                    goals[i] = { ...goals[i], name: e.target.value };
                    handleChange('goals', goals);
                  }}
                  placeholder="Goal name"
                />
                <input
                  type="date"
                  value={fileData.goals?.[i]?.date || ''}
                  onChange={(e) => {
                    goals[i] = { ...goals[i], date: e.target.value };
                    handleChange('goals', goals);
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="section">
          <h2>Team Members</h2>
          <textarea
            rows={4}
            value={fileData.teamMembers || ''}
            onChange={(e) => handleChange('teamMembers', e.target.value)}
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

