export default function EmptyState({ title = "No files yet", description }) {
  return (
    <div className="empty-state">
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}
