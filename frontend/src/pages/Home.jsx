import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import FileCard from "../components/FileCard";
import EmptyState from "../components/EmptyState";
import TemplateOption from "../components/TemplateOption";
import CustomizeFileForm from "../components/CustomizeFileForm";

const API = "http://localhost:8080";

export default function Home() {
  const [userFiles, setUserFiles] = useState([]);
  const [defaultTemplates, setDefaultTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    colour: "",
  });
  const [formError, setFormError] = useState("");

  const fetchFiles = async () => {
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
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    if (!showModal) return;
    let cancelled = false;
    fetch(`${API}/api/templates/default`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setDefaultTemplates(data);
      })
      .catch((err) => console.error("Error fetching templates:", err));
    return () => {
      cancelled = true;
    };
  }, [showModal]);

  const openEditPopup = (template) => {
    setEditingTemplate(template);
    setFormValues({
      name: template.name ?? "",
      description: template.description ?? "",
      colour: template.colour ?? "",
    });
    setFormError("");
  };

  const closeEditPopup = () => {
    setEditingTemplate(null);
    setFormError("");
  };

  const closeModal = () => {
    closeEditPopup();
    setShowModal(false);
  };

  const handleSubmitFile = async (e) => {
    e.preventDefault();
    setFormError("");

    const name = formValues.name.trim();
    if (!name) {
      setFormError("Name is required.");
      return;
    }

    const description =
      formValues.description.trim() || (editingTemplate?.description ?? "");
    const colour =
      formValues.colour.trim() || (editingTemplate?.colour ?? "");
    const icon = editingTemplate?.icon ?? "📄";

    try {
      const response = await fetch(`${API}/api/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, icon, description, colour }),
      });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setFormError(
            "A file with this name already exists. Choose a unique name."
          );
          return;
        }
        throw new Error(data.error ?? "Failed to add file");
      }

      closeModal();
      fetchFiles();
    } catch (err) {
      console.error("Error adding file:", err);
      setFormError(err.message ?? "Error adding file");
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
          <EmptyState description="Create one using + New Template" />
        ) : (
          userFiles.map((file) => <FileCard key={file.name} file={file} />)
        )}
      </div>

      {showModal && (
        <Modal
          title={editingTemplate ? "Customize file" : "Select Template"}
          onClose={editingTemplate ? closeEditPopup : closeModal}
        >
          {editingTemplate ? (
            <CustomizeFileForm
              values={formValues}
              onChange={setFormValues}
              onSubmit={handleSubmitFile}
              onCancel={closeEditPopup}
              error={formError}
            />
          ) : (
            <div className="modal-body">
              <div className="items-list">
                {defaultTemplates.map((template) => (
                  <TemplateOption
                    key={template.name}
                    template={template}
                    onSelect={openEditPopup}
                  />
                ))}
              </div>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
