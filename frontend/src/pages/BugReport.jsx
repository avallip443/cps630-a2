export default function BugReport() {
  return (
    <>
      <div className="header">
        <h1>🐛 Bug Report</h1>
        <p className="subtitle">Template for reporting bugs</p>
      </div>

      <div>
        <div className="container">
          <div className="section">
            <h2>Bug Information</h2>
            <div className="field">
              <label htmlFor="bug-id">Bug ID</label>
              <input type="text" id="bug-id" />
            </div>
            <div className="field">
              <label htmlFor="bug-title">Title</label>
              <input type="text" id="bug-title" />
            </div>
            <div>
              <div className="field">
                <label htmlFor="severity">Severity</label>
                <select id="severity">
                  <option value="">Select level</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="status">Status</label>
                <select id="status">
                  <option value="">Select status</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="fixed">Fixed</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="section">
            <h2>Description</h2>
            <textarea rows={4} />
          </div>
        </div>
      </div>
    </>
  )
}
