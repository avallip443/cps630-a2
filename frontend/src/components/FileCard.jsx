export default function FileCard({ file }) {
  return (
    <div
      className="file-card"
      style={{ borderLeft: `6px solid ${file.colour || ""}` }}
    >
      <h2>
        {file.icon} {file.name}
      </h2>
      <p>{file.description}</p>
    </div>
  );
}
