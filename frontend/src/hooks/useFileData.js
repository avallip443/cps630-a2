import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchFileWithData, saveFileData, deleteFileData } from '../api';

/** Load file + fileData by fileId; save/delete by fileId. Just populates form from fileData. */
export function useFileData() {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fileId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetchFileWithData(fileId)
      .then(({ file: f, fileData: fd }) => {
        setFile(f);
        setFileData(fd || {});
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [fileId]);

  const handleChange = (key, value) => {
    setFileData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!fileId) return;
    try {
      await saveFileData(fileId, fileData);
      alert('File saved!');
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Confirm Delete File?')) return;
    try {
      await deleteFileData(fileId);
      alert('File Deleted!');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Delete failed');
    }
  };

  return { file, fileData, handleChange, handleSave, handleDelete, loading, error };
}
