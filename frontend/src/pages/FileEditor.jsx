import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function FileEditor() {
  const { id } = useParams(); // FileData _id
  const [file, setFile] = useState(null);

  useEffect(() => {
    async function fetchFile() {
      try {
        const res = await fetch(`http://localhost:8080/api/file-data/item/${id}`);
        const data = await res.json();
        setFile(data);
      } catch (err) {
        console.error("Error fetching file:", err);
      }
    }
    fetchFile();
  }, [id]);

  if (!file) return <p>Loading...</p>;

  return (
    <div className="file-editor">
      <h1>{file.fileType}</h1>
      <h2>{file.fileId.icon} {file.fileId.name}</h2>
      <p>{file.fileId.description}</p>

      <textarea
        rows={10}
        cols={50}
        value={JSON.stringify(file.fileData, null, 2)}
        onChange={(e) => setFile({ ...file, fileData: JSON.parse(e.target.value) })}
      />

      <button
        onClick={async () => {
          try {
            await fetch(`http://localhost:8080/api/file-data/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ fileData: file.fileData })
            });
            alert("Saved!");
          } catch (err) {
            console.error(err);
          }
        }}
      >
        Save
      </button>
    </div>
  );
}