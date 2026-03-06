export default function TemplateOption({ template, onSelect }) {
  return (
    <button
      type="button"
      className="item-option"
      onClick={() => onSelect(template)}
    >
      <div className="icon">{template.icon}</div>
      <div className="item-option-content">
        <div className="item-option-title">{template.name}</div>
        <div className="item-option-desc">{template.description}</div>
      </div>
    </button>
  );
}
