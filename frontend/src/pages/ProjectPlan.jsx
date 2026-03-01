export default function ProjectPlan() {
  return (
    <>
      <div className="header">
        <h1>📊 Project Plan</h1>
        <p className="subtitle">Template for planning and tracking project milestones</p>
      </div>

      <div>
        <div className="container">
          <div className="section">
            <h2>Project Overview</h2>
            <div className="field">
              <label htmlFor="project-name">Project Name</label>
              <input type="text" id="project-name" />
            </div>
            <div className="field">
              <label htmlFor="start-date">Start Date</label>
              <input type="date" id="start-date" />
            </div>
            <div className="field">
              <label htmlFor="end-date">End Date</label>
              <input type="date" id="end-date" />
            </div>
          </div>

          <div className="section">
            <h2>Goals</h2>
            <div className="stack">
              <div className="grid-cols">
                <input type="text" />
                <input type="date" />
              </div>
              <div className="grid-cols">
                <input type="text" />
                <input type="date" />
              </div>
              <div className="grid-cols">
                <input type="text" />
                <input type="date" />
              </div>
            </div>
          </div>

          <div className="section">
            <h2>Team Members</h2>
            <textarea rows={4} />
          </div>
        </div>
      </div>
    </>
  )
}
