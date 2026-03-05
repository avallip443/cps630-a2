import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function MeetingNotes() {
  const { id } = useParams();
  const [fileData, setFileData] = useState(null);

  useEffect(() => {
    async function fetchFile() {
      try {
        const res = await fetch(`http://localhost:8080/api/file-data/item/${id}`);
        const data = await res.json();
        setFileData(data.fileData || {});
      } catch (err) {
        console.error(err);
      }
    }
    fetchFile();
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
      console.error(err);
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
        <h1>📝 Meeting Notes</h1>
        <p className="subtitle">Template for documenting meetings</p>
      </div>

      <div className="container">
        <div className="section">
          <h2>Meeting Details</h2>
          <input
            type="date"
            value={fileData.meetingDate || ""}
            onChange={e => handleChange("meetingDate", e.target.value)}
          />
          <input
            type="time"
            value={fileData.meetingTime || ""}
            onChange={e => handleChange("meetingTime", e.target.value)}
          />
          <textarea
            rows={3}
            value={fileData.attendees || ""}
            onChange={e => handleChange("attendees", e.target.value)}
          />
        </div>

        <div className="section">
          <h2>Discussion Points</h2>
          <textarea
            rows={4}
            value={fileData.discussion || ""}
            onChange={e => handleChange("discussion", e.target.value)}
          />
        </div>

        <div className="section">
          <h2>Key Takeaways</h2>
          <textarea
            rows={4}
            value={fileData.takeaways || ""}
            onChange={e => handleChange("takeaways", e.target.value)}
          />
        </div>

        <button className="save" onClick={handleSave}>Save</button>
        <button className="delete" onClick={handleDelete}> Delete File</button>      
      </div>
    </div>
  );
}