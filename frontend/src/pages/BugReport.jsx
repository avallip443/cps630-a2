import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function BugReport() {
  const { id } = useParams(); // FileData ID
  const [fileData, setFileData] = useState(null);

  // Fetch the saved file data when the page loads
  useEffect(() => {
    async function fetchFileData() {
      try {
        const res = await fetch(`http://localhost:8080/api/file-data/item/${id}`);
        const data = await res.json();
        setFileData(data.fileData || {});
      } catch (err) {
        console.error("Error fetching file data:", err);
      }
    }
    fetchFileData();
  }, [id]);

  const handleChange = (key, value) => {
    setFileData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await fetch(`http://localhost:8080/api/file-data/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileData })
      });
      alert("File saved!");
    } catch (err) {
      console.error("Error saving file data:", err);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Confirm Delete File?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8080/api/file-data/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        alert("File Deleted!");
        window.location.href = "/";
      }
      else {
        const err = await res.json();
        alert("Delete failed: " + err.error);
      }
    }
    catch (err) {
      console.error("Error Deleting File:", err);
    }
  };

  if (!fileData) return <p>Loading...</p>;

return (
  <div>
    <div className="header">
      <h1>🐛 Bug Report</h1>
      <p className="subtitle">Template for reporting bugs</p>
    </div>

    <div className="container">
      <div className="section">
        <h2>Bug Information</h2>

        <div className="field">
          <label>Bug ID</label>
          <input
            type="text"
            value={fileData.bugId || ""}
            onChange={e => handleChange("bugId", e.target.value)}
          />
        </div>

        <div className="field">
          <label>Title</label>
          <input
            type="text"
            value={fileData.title || ""}
            onChange={e => handleChange("title", e.target.value)}
          />
        </div>

        <div className="field">
          <label>Severity</label>
          <select
            value={fileData.severity || ""}
            onChange={e => handleChange("severity", e.target.value)}
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
            value={fileData.status || ""}
            onChange={e => handleChange("status", e.target.value)}
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
          value={fileData.description || ""}
          onChange={e => handleChange("description", e.target.value)}
        />
      </div>

      <div className="button-container">
        <button className="save" onClick={handleSave}>Save</button>
        <button className="delete" onClick={handleDelete}>Delete File</button>
      </div>

    </div>
  </div>
);
}