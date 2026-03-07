export const API = 'http://localhost:8080';

export function getFileUrl(file) {
  return file?.fileType && file?._id ? `/${file.fileType}/${file._id}` : null;
}

/** GET file + fileData by fileId. Returns { file, fileData }. */
export async function fetchFileWithData(fileId) {
  const res = await fetch(`${API}/api/file-data/${fileId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load file');
  return data;
}

export async function saveFileData(fileId, fileData) {
  const res = await fetch(`${API}/api/file-data/${fileId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileData }),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
}

export async function deleteFileData(fileId) {
  const res = await fetch(`${API}/api/file-data/${fileId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error((await res.json()).error || 'Delete failed');
}
