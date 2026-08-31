<template>
  <div>
    <div class="page-header text-center mb-5 animate-fade-in-up">
      <h1 class="display-4 mb-3" style="color: var(--burgundy)">
        <i class="bi bi-newspaper me-2"></i>Weekly News
      </h1>
      <div class="d-flex justify-content-center gap-3">
        <p class="lead fs-5 mb-0" style="color: var(--dark-light);">
          Official newsletters, bulletins, and documents from our church
        </p>
        <button
          v-if="userStore.isManager"
          class="btn btn-church-primary btn-sm align-self-center"
          @click="openUploadModal"
        >
          <i class="bi bi-cloud-upload me-1"></i>Upload Document
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" style="color: var(--gold);" role="status"></div>
      <p class="mt-3" style="color: var(--dark-light);">Loading documents...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="documents.length === 0" class="text-center py-5 animate-fade-in-up">
      <div class="church-card d-inline-block p-5" style="max-width: 480px;">
        <div class="mb-4">
          <i class="bi bi-file-earmark-pdf" style="font-size: 3rem; color: var(--burgundy); opacity: 0.4;"></i>
        </div>
        <h5 style="color: var(--burgundy); font-family: var(--font-heading);">No Documents Yet</h5>
        <p class="text-muted mb-4" style="font-size: 0.9rem;">
          Church newsletters, bulletins, and official documents will appear here once uploaded.
        </p>
        <button v-if="userStore.isManager" class="btn btn-church-primary" @click="openUploadModal">
          <i class="bi bi-cloud-upload me-1"></i>Upload First Document
        </button>
      </div>
    </div>

    <!-- Document Grid -->
    <div v-else class="row g-4 stagger-children">
      <div
        v-for="(doc, index) in documents"
        :key="doc.id"
        class="col-12 col-sm-6 col-lg-4"
      >
        <div class="church-card document-card h-100" :class="'animate-stagger-' + (index + 1)">
          <div class="card-body d-flex flex-column">
            <div class="document-icon-wrapper mb-3">
              <div class="document-icon">
                <i class="bi bi-filetype-pdf"></i>
              </div>
            </div>

            <h6 class="document-title mb-2">{{ doc.title }}</h6>

            <div class="document-meta mb-3">
              <span class="meta-item">
                <i class="bi bi-calendar3 me-1"></i>{{ doc.date }}
              </span>
              <span v-if="doc.size" class="meta-item">
                <i class="bi bi-file-earmark me-1"></i>{{ doc.size }}
              </span>
            </div>

            <div class="mt-auto d-flex gap-2">
              <a
                :href="doc.previewUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-church-primary btn-sm flex-grow-1"
              >
                <i class="bi bi-eye me-1"></i>View
              </a>
              <a
                :href="doc.downloadUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-church-outline btn-sm flex-grow-1"
              >
                <i class="bi bi-download me-1"></i>Download
              </a>
              <button
                v-if="userStore.isManager"
                class="btn btn-church-ghost btn-sm px-2"
                style="color: var(--burgundy);"
                @click="confirmDelete(doc)"
                title="Delete document"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <Transition name="popup">
      <div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
        <div class="church-card modal-card modal-card-md">
          <div class="modal-header-custom">
            <div class="d-flex align-items-center gap-3">
              <div class="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style="width: 44px; height: 44px; background: linear-gradient(135deg, var(--gold-light) 0%, var(--cream) 100%);">
                <i class="bi bi-cloud-upload" style="color: var(--burgundy); font-size: 1.25rem;"></i>
              </div>
              <div>
                <h5 class="mb-0" style="color: var(--burgundy); font-family: var(--font-heading);">
                  Upload Document
                </h5>
                <p class="mb-0" style="font-size: 0.75rem; color: var(--dark-light);">
                  Upload a PDF newsletter, bulletin, or official document
                </p>
              </div>
            </div>
            <button class="modal-close-btn" @click="showModal = false" type="button">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div class="modal-body-custom">
            <div v-if="formError" class="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 mb-4 small" role="alert">
              <i class="bi bi-exclamation-circle flex-shrink-0"></i>
              <span>{{ formError }}</span>
            </div>

            <!-- File Drop Zone -->
            <div
              class="drop-zone mb-4"
              :class="{ 'drop-zone-active': dragging, 'drop-zone-has-file': selectedFile }"
              @dragenter.prevent="dragging = true"
              @dragover.prevent="dragging = true"
              @dragleave.prevent="dragging = false"
              @drop.prevent="handleDrop"
              @click="fileInput?.click()"
            >
              <input
                ref="fileInput"
                type="file"
                accept=".pdf,application/pdf"
                class="d-none"
                @change="handleFileSelect"
              />
              <template v-if="!selectedFile">
                <div class="drop-zone-icon">
                  <i class="bi bi-cloud-arrow-up"></i>
                </div>
                <p class="drop-zone-text mb-1">
                  <strong>Click to upload</strong> or drag and drop
                </p>
                <p class="drop-zone-hint mb-0">PDF files only, max 20 MB</p>
              </template>
              <template v-else>
                <div class="file-preview d-flex align-items-center gap-3">
                  <div class="file-preview-icon">
                    <i class="bi bi-file-earmark-pdf-fill"></i>
                  </div>
                  <div class="flex-grow-1 text-start">
                    <p class="file-preview-name mb-0">{{ selectedFile.name }}</p>
                    <p class="file-preview-size mb-0">{{ formatSize(selectedFile.size) }}</p>
                  </div>
                  <button class="btn btn-sm file-remove-btn" @click.stop="removeFile" title="Remove file">
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
              </template>
            </div>

            <!-- Title -->
            <div class="form-floating mb-3">
              <input
                v-model="docTitle"
                id="docTitle"
                class="form-control church-input"
                placeholder="Document title"
                maxlength="200"
                @input="formError = ''"
              />
              <label for="docTitle">Document Title</label>
            </div>

            <!-- Category -->
            <div class="mb-0">
              <label class="form-label small fw-semibold">Category</label>
              <div class="d-flex flex-wrap gap-1">
                <span
                  v-for="cat in categories"
                  :key="cat"
                  class="category-chip"
                  :class="{ active: docCategory === cat }"
                  @click="docCategory = cat; formError = ''"
                >
                  {{ cat }}
                </span>
              </div>
            </div>
          </div>

          <div class="modal-footer-custom">
            <button class="btn btn-church-ghost" @click="showModal = false">
              <i class="bi bi-x me-1"></i>Cancel
            </button>
            <button class="btn btn-church-primary" @click="handleUpload" :disabled="uploading || !canUpload">
              <span v-if="uploading" class="spinner-border spinner-border-sm me-1"></span>
              <template v-else>
                <i class="bi bi-cloud-upload me-1"></i>
              </template>
              {{ uploading ? 'Uploading...' : 'Upload Document' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Upload Progress Toast -->
    <Transition name="popup">
      <div v-if="showProgress" class="progress-toast">
        <div class="progress-toast-card">
          <div class="d-flex align-items-center gap-3 mb-2">
            <div class="spinner-border spinner-border-sm" style="color: var(--burgundy);"></div>
            <span style="font-size: 0.9rem; font-weight: 500; color: var(--burgundy);">Uploading to Google Drive...</span>
          </div>
          <div class="progress" style="height: 4px;">
            <div class="progress-bar" style="width: 100%; background: linear-gradient(90deg, var(--gold), var(--burgundy));"></div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirmation Modal -->
    <Transition name="popup">
      <div class="modal-overlay" v-if="showDeleteModal" @click.self="showDeleteModal = false">
        <div class="church-card modal-card modal-card-sm">
          <div class="p-4 text-center">
            <div class="mb-3">
              <i class="bi bi-exclamation-triangle fs-1" style="color: var(--burgundy);"></i>
            </div>
            <h5 style="color: var(--burgundy); font-family: var(--font-heading);">Delete Document</h5>
            <p class="text-muted mb-1">Are you sure you want to delete</p>
            <p class="fw-semibold mb-4" style="color: var(--burgundy); font-size: 0.9rem;">{{ deletingDoc?.title }}</p>
            <div class="d-flex justify-content-center gap-2">
              <button class="btn btn-church-ghost" @click="showDeleteModal = false">Cancel</button>
              <button class="btn btn-church-primary" style="background: var(--burgundy); border-color: var(--burgundy);" @click="handleDelete" :disabled="deleting">
                <span v-if="deleting" class="spinner-border spinner-border-sm me-1"></span>
                <template v-else><i class="bi bi-trash me-1"></i></template>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "../stores/user";
import { getPDFs, uploadFile, deleteFile } from "../services/googleDrive";

const userStore = useUserStore();

const documents = ref([]);
const loading = ref(true);
const showModal = ref(false);
const showDeleteModal = ref(false);
const showProgress = ref(false);
const deletingDoc = ref(null);
const deleting = ref(false);
const uploading = ref(false);
const formError = ref("");
const selectedFile = ref(null);
const docTitle = ref("");
const docCategory = ref("");
const dragging = ref(false);
const fileInput = ref(null);

const categories = [
  "Newsletter", "Bulletin", "Annual Report", "Minutes", "Form", "Letter", "Other",
];

const canUpload = computed(() =>
  selectedFile.value && docTitle.value.trim() && docCategory.value
);

const MAX_FILE_SIZE = 20 * 1024 * 1024;

function formatSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

function openUploadModal() {
  selectedFile.value = null;
  docTitle.value = "";
  docCategory.value = "";
  formError.value = "";
  showModal.value = true;
}

function handleFileSelect(e) {
  const file = e.target.files?.[0];
  validateAndSetFile(file);
}

function handleDrop(e) {
  dragging.value = false;
  const file = e.dataTransfer?.files?.[0];
  validateAndSetFile(file);
}

function validateAndSetFile(file) {
  if (!file) return;
  if (file.type !== "application/pdf") {
    formError.value = "Only PDF files are accepted.";
    return;
  }
  if (file.size > MAX_FILE_SIZE) {
    formError.value = "File is too large. Maximum size is 20 MB.";
    return;
  }
  selectedFile.value = file;
  if (!docTitle.value) {
    docTitle.value = file.name.replace(/\.pdf$/i, "").replace(/[_-]/g, " ");
  }
  formError.value = "";
}

function removeFile() {
  selectedFile.value = null;
  if (fileInput.value) fileInput.value.value = "";
}

async function handleUpload() {
  if (!canUpload.value) {
    formError.value = "Please select a file, enter a title, and choose a category.";
    return;
  }
  uploading.value = true;
  showProgress.value = true;
  try {
    await uploadFile(selectedFile.value, {
      title: docTitle.value.trim(),
      folderId: import.meta.env.VITE_GOOGLE_DRIVE_WARTA_FOLDER_ID || "",
    });
    showModal.value = false;
    showProgress.value = false;
    await fetchDocuments();
  } catch (err) {
    formError.value = err.message || "Upload failed. Please try again.";
    showProgress.value = false;
  } finally {
    uploading.value = false;
  }
}

function confirmDelete(doc) {
  deletingDoc.value = doc;
  showDeleteModal.value = true;
}

async function handleDelete() {
  if (!deletingDoc.value) return;
  deleting.value = true;
  try {
    await deleteFile(deletingDoc.value.id);
    showDeleteModal.value = false;
    deletingDoc.value = null;
    await fetchDocuments();
  } catch (err) {
    formError.value = err.message || "Failed to delete document.";
  } finally {
    deleting.value = false;
  }
}

async function fetchDocuments() {
  loading.value = true;
  try {
    documents.value = await getPDFs();
  } catch (err) {
    console.warn("Failed to fetch PDFs:", err.message);
    documents.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchDocuments();
});
</script>

<style scoped>
/* Document Card */
.document-card {
  transition: transform 0.3s var(--ease-smooth), box-shadow 0.3s var(--ease-smooth);
}

.document-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}

.document-icon-wrapper {
  display: flex;
  justify-content: center;
}

.document-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(201, 168, 76, 0.12) 0%, rgba(201, 168, 76, 0.06) 100%);
  border-radius: 16px;
  border: 2px solid rgba(201, 168, 76, 0.2);
  font-size: 1.75rem;
  color: var(--burgundy);
  transition: all 0.3s var(--ease-smooth);
}

.document-card:hover .document-icon {
  background: linear-gradient(135deg, var(--burgundy) 0%, var(--burgundy-dark) 100%);
  border-color: var(--burgundy);
  color: var(--gold);
  transform: scale(1.05);
}

.document-title {
  color: var(--burgundy);
  font-family: var(--font-heading);
  font-size: 0.95rem;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.document-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.78rem;
  color: var(--dark-light);
}

.meta-item {
  display: inline-flex;
  align-items: center;
}

/* Drop Zone */
.drop-zone {
  border: 2px dashed rgba(201, 168, 76, 0.35);
  border-radius: 12px;
  padding: 2rem 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s var(--ease-smooth);
  background: var(--cream);
}

.drop-zone:hover {
  border-color: var(--gold);
  background: rgba(201, 168, 76, 0.05);
}

.drop-zone-active {
  border-color: var(--gold);
  background: rgba(201, 168, 76, 0.08);
  transform: scale(1.01);
}

.drop-zone-has-file {
  border-style: solid;
  border-color: var(--gold);
  background: rgba(201, 168, 76, 0.06);
}

.drop-zone-icon {
  font-size: 2.5rem;
  color: var(--gold);
  margin-bottom: 0.75rem;
}

.drop-zone-text {
  font-size: 0.9rem;
  color: var(--dark-light);
}

.drop-zone-hint {
  font-size: 0.78rem;
  color: var(--dark-light);
  opacity: 0.7;
}

/* File Preview */
.file-preview {
  text-align: left;
}

.file-preview-icon {
  font-size: 2rem;
  color: var(--burgundy);
}

.file-preview-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--dark);
  word-break: break-all;
}

.file-preview-size {
  font-size: 0.75rem;
  color: var(--dark-light);
}

.file-remove-btn {
  color: var(--burgundy);
  background: rgba(128, 55, 55, 0.08);
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.2s;
}

.file-remove-btn:hover {
  background: var(--burgundy);
  color: #fff;
}

/* Progress Toast */
.progress-toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1060;
  max-width: 360px;
  width: calc(100% - 2rem);
}

.progress-toast-card {
  background: var(--white);
  border: 2px solid rgba(201, 168, 76, 0.3);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  box-shadow: var(--shadow-lg);
}

/* Category Chips */
.category-chip {
  display: inline-block;
  padding: 0.3rem 0.7rem;
  font-size: 0.78rem;
  border-radius: 100px;
  background: #fff;
  color: var(--dark-light);
  border: 1px solid rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
}

.category-chip:hover {
  border-color: var(--gold);
  color: var(--burgundy);
}

.category-chip.active {
  background: var(--burgundy);
  color: #fff;
  border-color: var(--burgundy);
}

/* Modal */
.modal-card-md {
  max-width: 520px;
}

/* =============================================
   MODAL OVERLAY & CARD (popup base)
   ============================================= */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(44, 24, 16, 0.55);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1rem;
}

.modal-card {
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  border: 2px solid rgba(201, 168, 76, 0.25);
  box-shadow: 0 20px 60px rgba(44, 24, 16, 0.25);
}

.modal-card-sm {
  max-width: 400px;
}

.modal-header-custom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, rgba(245, 240, 232, 0.6) 0%, rgba(232, 220, 200, 0.3) 100%);
  border-bottom: 2px solid rgba(201, 168, 76, 0.2);
  border-radius: calc(var(--radius-md) - 1px) calc(var(--radius-md) - 1px) 0 0;
}

.modal-close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(201, 168, 76, 0.25);
  border-radius: 50%;
  background: var(--white);
  color: var(--dark-light);
  font-size: 0.8rem;
  transition: all 0.2s;
  cursor: pointer;
}

.modal-close-btn:hover {
  border-color: var(--burgundy);
  color: var(--burgundy);
}

.modal-body-custom {
  padding: 1.5rem 1.75rem;
  max-height: 70vh;
  overflow-y: auto;
}

.modal-footer-custom {
  padding: 1rem 1.75rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* =============================================
   POPUP TRANSITION (scale + fade)
   ============================================= */
.popup-enter-active {
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.popup-leave-active {
  transition: all 0.18s ease-in;
}

.popup-enter-from {
  opacity: 0;
}

.popup-enter-from .modal-card {
  transform: scale(0.92) translateY(20px);
  opacity: 0;
}

.popup-leave-to {
  opacity: 0;
}

.popup-leave-to .modal-card {
  transform: scale(0.96) translateY(8px);
  opacity: 0;
}

.modal-overlay,
.modal-card {
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* =============================================
   Floating Label
   ============================================= */
.form-floating > .form-control:focus ~ label,
.form-floating > .form-control:not(:placeholder-shown) ~ label {
  opacity: 0.75;
  transform: scale(0.8) translateY(-0.25rem) translateX(0.15rem);
}

.form-floating > .form-control:focus {
  border-color: var(--gold);
  box-shadow: 0 0 0 0.15rem rgba(212, 175, 55, 0.15);
}

/* =============================================
   Scrollbar
   ============================================= */
.modal-body-custom::-webkit-scrollbar {
  width: 5px;
}

.modal-body-custom::-webkit-scrollbar-track {
  background: transparent;
}

.modal-body-custom::-webkit-scrollbar-thumb {
  background: rgba(128, 55, 55, 0.2);
  border-radius: 10px;
}

.modal-body-custom::-webkit-scrollbar-thumb:hover {
  background: rgba(128, 55, 55, 0.35);
}

/* =============================================
   Responsive
   ============================================= */
@media (max-width: 575.98px) {
  .document-icon {
    width: 52px;
    height: 52px;
    font-size: 1.4rem;
  }

  .drop-zone {
    padding: 1.5rem 1rem;
  }

  .drop-zone-icon {
    font-size: 2rem;
  }
}
</style>
