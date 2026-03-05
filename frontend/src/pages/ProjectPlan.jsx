import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProjectPlan() {
  const { id } = useParams(); // FileData ID
  const [fileData, setFileData] = useState(null);

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
    <>
      <div className="header">
        <h1>📊 Project Plan</h1>
        <p className="subtitle">Template for planning and tracking project milestones</p>
      </div>

      <div className="container">
        <div className="section">
          <h2>Project Overview</h2>
          <div className="field">
            <label>Project Name</label>
            <input
              type="text"
              value={fileData.projectName || ""}
              onChange={e => handleChange("projectName", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Start Date</label>
            <input
              type="date"
              value={fileData.startDate || ""}
              onChange={e => handleChange("startDate", e.target.value)}
            />
          </div>
          <div className="field">
            <label>End Date</label>
            <input
              type="date"
              value={fileData.endDate || ""}
              onChange={e => handleChange("endDate", e.target.value)}
            />
          </div>
        </div>

        <div className="section">
          <h2>Goals</h2>
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="grid-cols">
                <input
                  type="text"
                  value={fileData.goals?.[index]?.name || ""}
                  onChange={e =>
                    handleChange("goals", [
                      ...(fileData.goals || []),
                      { ...fileData.goals?.[index], name: e.target.value }
                    ])
                  }
                  placeholder="Goal name"
                />
                <input
                  type="date"
                  value={fileData.goals?.[index]?.date || ""}
                  onChange={e =>
                    handleChange("goals", [
                      ...(fileData.goals || []),
                      { ...fileData.goals?.[index], date: e.target.value }
                    ])
                  }
                />
              </div>
            ))}
        </div>

        <div className="section">
          <h2>Team Members</h2>
          <textarea
            rows={4}
            value={fileData.teamMembers || ""}
            onChange={e => handleChange("teamMembers", e.target.value)}
          />
        </div>

        <button className="save" onClick={handleSave}>Save</button>
        <button className="delete" onClick={handleDelete}> Delete File</button>
      </div>
    </>
  );
}