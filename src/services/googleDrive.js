import { ref } from "vue";

const CONFIG = {
  API_KEY: import.meta.env.VITE_GOOGLE_API_KEY || "",
  WARTA_FOLDER_ID: import.meta.env.VITE_GOOGLE_DRIVE_WARTA_FOLDER_ID || "",
  CLIENT_ID: import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID || "",
};

// --- OAuth state ---
let tokenClient = null;
let _accessToken = null;
let _tokenExpiresAt = 0;

export const authStatus = ref("idle");
export const authError = ref(null);

function getDirectUrl(fileId) {
  if (!fileId) return "";
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
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
    name: name,
    mimeType: item.mimeType || "application/pdf",
    size: item.size ? formatFileSize(Number(item.size)) : "",
    sizeBytes: item.size ? Number(item.size) : 0,
    createdTime: item.createdTime || "",
    modifiedTime: item.modifiedTime || "",
    date: (item.createdTime || item.modifiedTime || new Date().toISOString()).split("T")[0],
  };
}

function formatFileSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

async function fetchPDFsViaDirectAPI(folderId) {
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

async function uploadWithOAuth(file, metadata) {
  const token = await getAccessToken();

  const folderId = metadata.folderId || CONFIG.WARTA_FOLDER_ID;
  const metadataObj = { name: metadata.title || file.name };
  if (folderId) metadataObj.parents = [folderId];

  const boundary = `drive_boundary_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const encoder = new TextEncoder();

  const metaPart = encoder.encode(
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadataObj)}\r\n`
  );
  const fileHeader = encoder.encode(
    `--${boundary}\r\nContent-Type: ${file.type || "application/octet-stream"}\r\n\r\n`
  );
  const closePart = encoder.encode(`\r\n--${boundary}--\r\n`);

  const body = new Blob([metaPart, fileHeader, file, closePart]);

  const url =
    "https://www.googleapis.com/upload/drive/v3/files" +
    "?uploadType=multipart" +
    "&supportsAllDrives=true" +
    "&fields=id,name,mimeType,size,webViewLink,webContentLink,thumbnailLink";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": `multipart/related; boundary=${boundary}`,
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed (${res.status}): ${text.slice(0, 200)}`);
  }

  return res.json();
}

// --- OAuth helpers ---

async function loadGIS() {
  if (window.google?.accounts?.oauth2) return;
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Failed to load Google Identity Services"));
    document.head.appendChild(script);
  });
}

async function initOAuth() {
  if (tokenClient) return;
  if (!CONFIG.CLIENT_ID) throw new Error("VITE_GOOGLE_DRIVE_CLIENT_ID is not set in .env");
  await loadGIS();
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CONFIG.CLIENT_ID,
    scope: "https://www.googleapis.com/auth/drive.file",
    callback: (response) => {
      if (response.access_token) {
        _accessToken = response.access_token;
        _tokenExpiresAt = Date.now() + (response.expires_in || 3600) * 1000;
        authStatus.value = "authenticated";
        authError.value = null;
      }
    },
    error_callback: (error) => {
      authStatus.value = "error";
      authError.value = error.message || error.type || "Authentication failed";
    },
  });
}

async function getAccessToken() {
  if (_accessToken && Date.now() < _tokenExpiresAt - 120000) return _accessToken;
  return authenticate();
}

export async function authenticate() {
  authStatus.value = "authenticating";
  authError.value = null;
  try {
    await initOAuth();
    return new Promise((resolve, reject) => {
      tokenClient.callback = (response) => {
        if (response.access_token) {
          _accessToken = response.access_token;
          _tokenExpiresAt = Date.now() + (response.expires_in || 3600) * 1000;
          authStatus.value = "authenticated";
          resolve(_accessToken);
        } else {
          authStatus.value = "error";
          const msg = response.error || response.error_description || "Sign in cancelled";
          authError.value = msg;
          reject(new Error(msg));
        }
      };
      tokenClient.requestAccessToken({ prompt: "" });
    });
  } catch (err) {
    authStatus.value = "error";
    authError.value = err.message;
    throw err;
  }
}

export function isOAuthConfigured() {
  return !!CONFIG.CLIENT_ID;
}

export function signOut() {
  if (_accessToken && window.google?.accounts?.oauth2) {
    google.accounts.oauth2.revoke(_accessToken, () => {});
  }
  _accessToken = null;
  _tokenExpiresAt = 0;
  authStatus.value = "idle";
  authError.value = null;
}

// --- Public API ---

export function getFileUrl(fileId) {
  if (!fileId) return "";
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

export function getThumbUrl(fileId) {
  if (!fileId) return "";
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=s400`;
}

export function isConfigured() {
  return !!(CONFIG.API_KEY || CONFIG.CLIENT_ID);
}

export async function getPDFs(folderId) {
  if (CONFIG.API_KEY) return fetchPDFsViaDirectAPI(folderId);
  throw new Error(
    "Google Drive not configured. Set VITE_GOOGLE_API_KEY in .env"
  );
}

export async function uploadFile(file, metadata) {
  if (CONFIG.CLIENT_ID) return uploadWithOAuth(file, metadata);
  throw new Error(
    "Upload not configured. Set VITE_GOOGLE_DRIVE_CLIENT_ID in .env with OAuth consent."
  );
}

export async function deleteFile(fileId) {
  if (!CONFIG.CLIENT_ID) throw new Error("OAuth not configured. Set VITE_GOOGLE_DRIVE_CLIENT_ID in .env");
  const token = await getAccessToken();
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok && res.status !== 404) {
    const text = await res.text();
    throw new Error(`Delete failed (${res.status}): ${text.slice(0, 200)}`);
  }
}
