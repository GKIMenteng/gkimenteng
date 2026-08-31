<template>
  <div>
    <div class="page-header text-center mb-5 animate-fade-in-up">
      <h1 class="display-4 mb-3" style="color: var(--burgundy)">
        <i class="bi bi-newspaper me-2"></i>Weekly News
      </h1>
      <p class="lead fs-5 mb-0" style="color: var(--dark-light);">
        Official newsletters, bulletins, and documents from our church
      </p>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" style="color: var(--gold);" role="status"></div>
      <p class="mt-3" style="color: var(--dark-light);">Loading documents...</p>
    </div>

    <div v-else-if="documents.length === 0" class="text-center py-5 animate-fade-in-up">
      <div class="church-card d-inline-block p-5" style="max-width: 480px;">
        <div class="mb-4">
          <i class="bi bi-file-earmark-pdf" style="font-size: 3rem; color: var(--burgundy); opacity: 0.4;"></i>
        </div>
        <h5 style="color: var(--burgundy); font-family: var(--font-heading);">No Documents Yet</h5>
        <p class="text-muted mb-0" style="font-size: 0.9rem;">
          Church newsletters, bulletins, and official documents will appear here once available.
        </p>
      </div>
    </div>

    <div v-else class="row g-4 stagger-children">
      <div v-for="(doc, index) in documents" :key="doc.id" class="col-12 col-sm-6 col-lg-4">
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
              <a :href="doc.previewUrl" target="_blank" rel="noopener noreferrer" class="btn btn-church-primary btn-sm flex-grow-1">
                <i class="bi bi-eye me-1"></i>View
              </a>
              <a :href="doc.downloadUrl" target="_blank" rel="noopener noreferrer" class="btn btn-church-outline btn-sm flex-grow-1">
                <i class="bi bi-download me-1"></i>Download
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getPDFs } from "../services/googleDrive";

const documents = ref([]);
const loading = ref(true);

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

@media (max-width: 575.98px) {
  .document-icon {
    width: 52px;
    height: 52px;
    font-size: 1.4rem;
  }
}
</style>
