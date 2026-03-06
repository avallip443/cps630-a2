export default function CustomizeFileForm({
  values,
  onChange,
  onSubmit,
  onCancel,
  error,
}) {
  return (
    <form onSubmit={onSubmit} className="modal-body">
      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}
      <div className="field">
        <label htmlFor="file-name">Name (must be unique)</label>
        <input
          id="file-name"
          value={values.name}
          onChange={(e) => onChange((v) => ({ ...v, name: e.target.value }))}
          placeholder="e.g. Bug Report"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="file-description">Description</label>
        <input
          id="file-description"
          value={values.description}
          onChange={(e) =>
            onChange((v) => ({ ...v, description: e.target.value }))
          }
          placeholder="Short description"
        />
      </div>
      <div className="field">
        <label htmlFor="file-colour">Colour (e.g. #FFD5D5)</label>
        <input
          id="file-colour"
          value={values.colour}
          onChange={(e) => onChange((v) => ({ ...v, colour: e.target.value }))}
          placeholder="#FFD5D5"
        />
      </div>
      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Create file
        </button>
      </div>
    </form>
  );
}
