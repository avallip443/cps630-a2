import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

export default function Home() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userFiles, setUserFiles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/files")
      .then(res => res.json())
      .then(data => {
        setTemplates(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching templates:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
  async function fetchUserFiles() {
    try {
      const res = await fetch("http://localhost:8080/api/file-data"); // backend route to get all user files
      const data = await res.json();
      setUserFiles(data);
    } catch (err) {
      console.error("Error fetching user files:", err);
    }
  }

  fetchUserFiles();
  }, []);
const createNewFile = async (template) => {
  const fileName = prompt("Enter a name for your new file:");
  if (!fileName) return; // Cancelled

  try {
    const response = await fetch("http://localhost:8080/api/file-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fileId: template._id,
        fileType: fileName, // The name user gives
        fileData: {}        // Empty data to start
      })
    });

    const data = await response.json();
    console.log("Created file:", data);

    setShowModal(false);
    alert(`File "${fileName}" created! You can now edit it.`);

    // Optionally: redirect to a file editor page
    // navigate(`/file/${data._id}`) if using react-router

  } catch (err) {
    console.error("Error creating file:", err);
  }
};

  return (
    <>
      <div className="header">
        <h1>Home</h1>
        <p className="subtitle">Manage Your Work</p>
      </div>

      <button
        type="button"
        className="btn btn-primary"
        onClick={() => setShowModal(true)}
      >
        + New Template
      </button>

      <div className="templates-container">
        {loading ? (
          <p>Loading templates...</p>
        ) : templates.length === 0 ? (
          <div className="empty-state">
            <h1>No templates yet</h1>
            <p>Add your first template using the + New Template button</p>
          </div>
        ) : (
          templates.map(template => (
            <div
              key={template._id}
              className="template-card"
              style={{ borderLeft: `6px solid ${template.color}` }}
            >
              <h2>
                {template.icon} {template.name}
              </h2>
              <p>{template.description}</p>
            </div>
          ))
        )}
      </div>

    <div className="user-files-container">
      {userFiles.length === 0 ? (
        <p>No files created yet</p>
      ) : (
        userFiles.map(file => (
          <Link 
            key={file._id} 
            to={`/${file.fileId.name.toLowerCase().replace(" ", "-")}/${file._id}`}
            className="file-card"
            style={{ borderLeft: `6px solid ${file.fileId.color}` }}
          >
            <h2>
              {file.fileId.icon} {file.fileType}
            </h2>
            <p>{file.fileId.description}</p>
          </Link>
        ))
      )}
    </div>
      {showModal && (
  <div className="modal">
    <div className="modal-content">
      
      <div className="modal-header">
        <h2>Select Template</h2>
        <button
          className="modal-close"
          onClick={() => setShowModal(false)}
        >
          ×
        </button>
      </div>

      <div className="modal-body">
        <div className="items-list">
          {templates.map(template => (
            <button
              key={template._id}
              className="item-option"
              onClick={() => createNewFile(template)}
            >
              <div className="icon">
                {template.icon}
              </div>

              <div className="item-option-content">
                <div className="item-option-title">
                  {template.name}
                </div>
                <div className="item-option-desc">
                  {template.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  </div>
)}
        </>
  );
}