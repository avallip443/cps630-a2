import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

const API = "http://localhost:8080";

export default function Home() {
  const [userFiles, setUserFiles] = useState([]);
  const [defaultTemplates, setDefaultTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  async function fetchAll() {
    setLoading(true);
    try {
      const [filesRes, fileDataRes, templatesRes] = await Promise.all([
        fetch(`${API}/api/files`),
        fetch(`${API}/api/file-data`),
        fetch(`${API}/api/templates/default`)
      ]);
      const [files, fileData, templates] = await Promise.all([
        filesRes.json(),
        fileDataRes.json(),
        templatesRes.json()
      ]);
      setUserFiles([...files, ...fileData]);
      setDefaultTemplates(templates);
    } catch (err) {
      console.error("Error fetching:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  const createNewFile = async (template) => {
    const fileName = prompt("Enter a name for your new file:");
    if (!fileName) return;
    try {
      const body = { fileType: fileName, fileData: {} };
      if (template._id) {
        body.fileId = template._id;
      } else {
        body.templateName = template.name;
      }
      const response = await fetch(`${API}/api/file-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create file");
      setShowModal(false);
      alert(`File "${fileName}" created!`);
      await fetchAll();
    } catch (err) {
      console.error("Error creating file:", err);
      alert(err.message || "Error creating file");
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

      <div className="user-files-container">
        {loading ? (
          <p>Loading...</p>
        ) : userFiles.length === 0 ? (
          <div className="empty-state">
            <h1>No files yet</h1>
            <p>Create one using + New Template</p>
          </div>
        ) : (
          userFiles.map((item) => {
            const isFileData = item.fileId != null;
            const name = isFileData ? item.fileId.name : item.name;
            const icon = isFileData ? item.fileId.icon : item.icon;
            const description = isFileData ? item.fileId.description : item.description;
            const colour = isFileData ? item.fileId.colour : item.colour;
            const label = isFileData ? item.fileType : item.name;

            if (isFileData) {
              const slug = name.toLowerCase().replace(/\s+/g, "-");
              return (
                <Link
                  key={item._id}
                  to={`/${slug}/${item._id}`}
                  className="file-card"
                  style={{ borderLeft: `6px solid ${colour}` }}
                >
                  <h2>{icon} {label}</h2>
                  <p>{description}</p>
                </Link>
              );
            }
            return (
              <div
                key={item._id}
                className="file-card"
                style={{ borderLeft: `6px solid ${colour}` }}
              >
                <h2>{icon} {label}</h2>
                <p>{description}</p>
              </div>
            );
          })
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
          {defaultTemplates.map((template) => (
            <button
              key={template._id ?? template.name}
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