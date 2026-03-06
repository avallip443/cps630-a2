import { useEffect, useState } from "react";

const API = "http://localhost:8080";

export default function Home() {
  const [userFiles, setUserFiles] = useState([]);
  const [defaultTemplates, setDefaultTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  async function fetchFiles() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/files`);
      const files = await res.json();
      setUserFiles(files);
    } catch (err) {
      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    if (!showModal) return;
    let cancelled = false;
    fetch(`${API}/api/templates/default`)
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setDefaultTemplates(data); })
      .catch((err) => console.error("Error fetching templates:", err));
    return () => { cancelled = true; };
  }, [showModal]);

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
      fetchFiles();
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
          userFiles.map((item) => (
            <div
              key={item._id}
              className="file-card"
              style={{ borderLeft: `6px solid ${item.colour || ""}` }}
            >
              <h2>{item.icon} {item.name}</h2>
              <p>{item.description}</p>
            </div>
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
                {defaultTemplates.map((template) => (
                  <button
                    key={template.name}
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