export default function Home() {
  return (
    <>
      <div className="header">
        <h1>Home</h1>
        <p className="subtitle">Manage Your Work</p>
      </div>

      <div className="add-template">
        <button type="button" className="btn btn-primary">
          + New Template
        </button>
      </div>

      <div className="templates-container">
        <div className="empty-state">
          <h1>No templates yet</h1>
          <p>Add your first template using the + New Template button</p>
        </div>
      </div>
    </>
  )
}
