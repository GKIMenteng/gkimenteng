const CONFIG = {
  API_KEY: import.meta.env.VITE_GOOGLE_API_KEY || "",
  WARTA_FOLDER_ID: import.meta.env.VITE_GOOGLE_DRIVE_WARTA_FOLDER_ID || "",
};

function getDirectUrl(fileId) {
  if (!fileId) return "";
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

function formatFileSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

function normalizePDFFile(item) {
  const name = item.name || "";
  const title = name.replace(/\.[^.]+$/, "").replace(/[_-]/g, " ") || "Untitled";
  return {
    id: item.id,
    title: title.charAt(0).toUpperCase() + title.slice(1),
    url: getDirectUrl(item.id),
    previewUrl: `https://drive.google.com/file/d/${item.id}/preview`,
    downloadUrl: `https://drive.google.com/uc?export=download&id=${item.id}`,
    name,
    mimeType: item.mimeType || "application/pdf",
    size: item.size ? formatFileSize(Number(item.size)) : "",
    sizeBytes: item.size ? Number(item.size) : 0,
    createdTime: item.createdTime || "",
    modifiedTime: item.modifiedTime || "",
    date: (item.createdTime || item.modifiedTime || new Date().toISOString()).split("T")[0],
  };
}

export function getFileUrl(fileId) {
  return getDirectUrl(fileId);
}

export function getThumbUrl(fileId) {
  if (!fileId) return "";
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=s400`;
}

export function isConfigured() {
  return !!CONFIG.API_KEY;
}

export async function getPDFs(folderId) {
  if (!CONFIG.API_KEY) {
    throw new Error("Google Drive not configured. Set VITE_GOOGLE_API_KEY in .env");
  }

  const folder = folderId || CONFIG.WARTA_FOLDER_ID;
  const conditions = ["mimeType = 'application/pdf'", "trashed = false"];
  if (folder) conditions.push(`'${folder}' in parents`);

  const params = new URLSearchParams({
    q: conditions.join(" and "),
    fields: "files(id,name,mimeType,webViewLink,createdTime,modifiedTime,size)",
    pageSize: "100",
    orderBy: "createdTime desc",
    key: CONFIG.API_KEY,
  });

  const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google Drive API error (${res.status}): ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  return (data.files || []).map(normalizePDFFile);
}
