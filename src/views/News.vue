<template>
  <div>
    <div class="page-header text-center mb-5 animate-fade-in-up">
      <h1 class="display-4 mb-3" style="color: var(--burgundy)">
        <i class="bi bi-newspaper me-2"></i>Church News
      </h1>
      <div class="d-flex justify-content-center gap-3">
        <p class="lead fs-5 mb-0" style="color: var(--dark-light);">
          Stay updated with the latest from our community
        </p>
        <button
          v-if="userStore.isManager"
          class="btn btn-church-primary btn-sm align-self-center"
          @click="openCreateModal"
        >
          <i class="bi bi-plus-circle me-1"></i>Add News
        </button>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-8">
        <div v-if="nStore.loading" class="text-center py-5">
          <div class="spinner-border" style="color: var(--gold);" role="status"></div>
        </div>
        <div
          v-for="(article, index) in filteredArticles"
          :key="article.id"
          class="church-card mb-4 animate-fade-in-up"
          :class="'animate-stagger-' + (index + 1)"
        >
          <div class="card-body">
            <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
              <span class="badge-church">{{ article.category }}</span>
              <small class="text-muted">
                <i class="bi bi-person me-1"></i>{{ article.author }}
              </small>
              <small class="text-muted">
                <i class="bi bi-calendar me-1"></i>{{ article.date }}
              </small>
              <small class="text-muted">
                <i class="bi bi-chat me-1"></i>{{ (article.comments || []).length }} comments
              </small>
              <div v-if="userStore.isManager" class="ms-auto d-flex gap-1">
                <button class="btn btn-church-ghost btn-sm py-1" @click="openEditModal(article)" title="Edit">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-church-ghost btn-sm py-1" style="color: var(--burgundy);" @click="openDeleteModal(article)" title="Delete">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
            <h3 class="mb-3" style="color: var(--burgundy); font-family: var(--font-heading);">
              {{ article.title }}
            </h3>
            <p class="mb-0" style="line-height: 1.8; white-space: pre-line;">{{ article.content }}</p>
            <hr class="church-divider-solid" />
            <div class="d-flex gap-2 align-items-center">
              <button class="btn btn-church-ghost" :class="{ liked: article.likedBy?.includes(userStore.uid) }" @click="handleLike(article)">
                <i class="bi" :class="article.likedBy?.includes(userStore.uid) ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'"></i>
                Like ({{ article.likes || 0 }})
              </button>
              <button class="btn btn-church-ghost" @click="handleShare(article)">
                <i class="bi bi-share me-1"></i>Share
              </button>
              <button class="btn btn-church-ghost ms-auto" @click="toggleComments(article.id)">
                <i class="bi bi-chat-dots me-1"></i>{{ showCommentsId === article.id ? 'Hide' : '' }} Comments ({{ (article.comments || []).length }})
              </button>
            </div>

            <div v-if="showCommentsId === article.id" class="mt-3 pt-3 border-top">
              <div v-if="(article.comments || []).length === 0" class="text-muted small mb-3">
                No comments yet. Be the first to comment!
              </div>
              <div v-else class="d-flex flex-column gap-2 mb-3">
                <div v-for="c in article.comments" :key="c.id" class="d-flex align-items-start gap-2">
                  <div
                    class="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                    style="width: 32px; height: 32px; background: var(--gold-light); color: var(--burgundy); font-size: 0.75rem; font-weight: 600;"
                  >
                    {{ c.userName?.charAt(0)?.toUpperCase() || '?' }}
                  </div>
                  <div class="flex-grow-1">
                    <div class="d-flex align-items-center gap-2">
                      <strong style="font-size: 0.85rem;">{{ c.userName }}</strong>
                      <small class="text-muted" style="font-size: 0.7rem;">{{ formatCommentTime(c.createdAt) }}</small>
                      <button
                        v-if="c.uid === userStore.uid || userStore.isManager"
                        class="btn btn-sm p-0 ms-auto"
                        style="color: var(--burgundy); font-size: 0.7rem;"
                        @click="handleDeleteComment(article, c.id)"
                        title="Delete comment"
                      >
                        <i class="bi bi-x-circle"></i>
                      </button>
                    </div>
                    <p class="mb-0" style="font-size: 0.85rem;">{{ c.text }}</p>
                  </div>
                </div>
              </div>
              <div class="d-flex gap-2">
                <input
                  v-model="commentText"
                  class="form-control form-control-sm"
                  style="font-size: 0.85rem;"
                  placeholder="Write a comment..."
                  @keyup.enter="handleAddComment(article)"
                  maxlength="500"
                />
                <button class="btn btn-church-primary btn-sm flex-shrink-0" @click="handleAddComment(article)" :disabled="!commentText.trim()">
                  <i class="bi bi-send me-1"></i>Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="church-card mb-4 animate-fade-in-up animate-stagger-4">
          <div class="church-card-header d-flex align-items-center">
            <i class="bi bi-tags me-2"></i>Categories
          </div>
          <div class="card-body">
            <div class="d-flex flex-wrap gap-2">
              <span
                class="badge-church cursor-pointer"
                :class="{ 'badge-active': selectedCategory === cat }"
                v-for="cat in categories"
                :key="cat"
                @click="selectedCategory = selectedCategory === cat ? '' : cat"
              >
                {{ cat }}
              </span>
            </div>
          </div>
        </div>

        <div class="church-card animate-fade-in-up animate-stagger-5">
          <div class="church-card-header d-flex align-items-center">
            <i class="bi bi-calendar me-2"></i>Recent Posts
          </div>
          <div class="card-body">
            <div v-for="(post, index) in recentPosts" :key="post.id">
              <div>
                <h6 class="mb-1" style="color: var(--burgundy);">{{ post.title }}</h6>
                <small class="text-muted">{{ post.date }}</small>
              </div>
              <hr v-if="index < recentPosts.length - 1" class="church-divider-solid" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <Transition name="popup">
      <div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
        <div class="church-card modal-card modal-card-lg">
          <div class="modal-header-custom">
            <div class="d-flex align-items-center gap-3">
              <div class="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style="width: 44px; height: 44px; background: linear-gradient(135deg, var(--gold-light) 0%, var(--cream) 100%);">
                <i class="bi" :class="editing ? 'bi-pencil-square' : 'bi-plus-lg'" style="color: var(--burgundy); font-size: 1.25rem;"></i>
              </div>
              <div>
                <h5 class="mb-0" style="color: var(--burgundy); font-family: var(--font-heading);">
                  {{ editing ? 'Edit Article' : 'New Article' }}
                </h5>
                <p class="mb-0" style="font-size: 0.75rem; color: var(--dark-light);">
                  {{ editing ? 'Update the news article details below' : 'Fill in the details to publish a new news article' }}
                </p>
              </div>
            </div>
            <button class="modal-close-btn" @click="showModal = false" type="button" aria-label="Close">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div class="modal-body-custom">
            <div v-if="formError" class="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 mb-4 small" role="alert">
              <i class="bi bi-exclamation-circle flex-shrink-0"></i>
              <span>{{ formError }}</span>
            </div>

            <div class="row g-4">
              <div class="col-12 col-lg-8 d-flex flex-column gap-4">
                <section class="form-section">
                  <div class="form-section-header">
                    <i class="bi bi-type"></i>
                    <span>Article Content</span>
                  </div>
                  <div class="form-section-body">
                    <div class="form-floating mb-3">
                      <input
                        v-model="form.title"
                        id="newsTitle"
                        class="form-control church-input form-title-input"
                        placeholder="Enter article title"
                        maxlength="200"
                        @input="formError = ''"
                      />
                      <label for="newsTitle">Article Title</label>
                      <div class="input-character-count">
                        <span :class="{ 'text-danger': form.title.length > 180 }">{{ form.title.length }}</span> / 200
                      </div>
                    </div>

                    <div class="d-flex align-items-center justify-content-between mb-2">
                      <label class="form-label small fw-semibold mb-0">Content</label>
                      <span class="input-character-count">
                        <span :class="{ 'text-danger': form.content.length > 5000 }">{{ form.content.length }}</span> / 5000
                      </span>
                    </div>
                    <div class="content-editor-wrapper">
                      <div class="content-editor-toolbar">
                        <span class="toolbar-label">Write your news story</span>
                        <div class="d-flex gap-1">
                          <button type="button" class="btn btn-sm toolbar-btn" title="Preview" @click="showPreview = !showPreview">
                            <i class="bi" :class="showPreview ? 'bi-pencil' : 'bi-eye'"></i>
                          </button>
                        </div>
                      </div>
                      <textarea
                        v-if="!showPreview"
                        v-model="form.content"
                        class="form-control church-input content-textarea"
                        placeholder="Write your news content here..."
                        rows="12"
                        @input="formError = ''"
                      ></textarea>
                      <div v-else class="content-preview">
                        <h4 class="preview-title">{{ form.title || 'Untitled Article' }}</h4>
                        <hr class="church-divider-solid" />
                        <div class="preview-body">{{ form.content || 'No content to preview.' }}</div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <div class="col-12 col-lg-4 d-flex flex-column gap-4">
                <section class="form-section">
                  <div class="form-section-header">
                    <i class="bi bi-gear"></i>
                    <span>Publishing Details</span>
                  </div>
                  <div class="form-section-body">
                    <div class="mb-3">
                      <label class="form-label small fw-semibold">Category</label>
                      <div class="d-flex flex-wrap gap-1">
                        <span
                          v-for="cat in categories"
                          :key="cat"
                          class="category-chip"
                          :class="{ active: form.category === cat }"
                          @click="form.category = cat; formError = ''"
                        >
                          {{ cat }}
                        </span>
                      </div>
                    </div>

                    <div class="mb-3">
                      <label class="form-label small fw-semibold">Author</label>
                      <div class="form-floating">
                        <input
                          v-model="form.author"
                          id="newsAuthor"
                          class="form-control church-input"
                          placeholder="Author name"
                          @input="formError = ''"
                        />
                        <label for="newsAuthor">Author Name</label>
                      </div>
                    </div>

                    <div class="mb-0">
                      <label class="form-label small fw-semibold">Publish Date</label>
                      <div class="form-floating">
                        <input
                          v-model="form.date"
                          id="newsDate"
                          type="date"
                          class="form-control church-input"
                          @input="formError = ''"
                        />
                        <label for="newsDate">Publish Date</label>
                      </div>
                    </div>
                  </div>
                </section>

                <section class="form-section">
                  <div class="form-section-header">
                    <i class="bi bi-info-circle"></i>
                    <span>Quick Tips</span>
                  </div>
                  <div class="form-section-body" style="font-size: 0.8rem; color: var(--dark-light);">
                    <ul class="list-unstyled mb-0 d-flex flex-column gap-1">
                      <li><i class="bi bi-check2 text-success me-1"></i> Use a clear, descriptive title</li>
                      <li><i class="bi bi-check2 text-success me-1"></i> Select the most relevant category</li>
                      <li><i class="bi bi-check2 text-success me-1"></i> Keep paragraphs short and scannable</li>
                    </ul>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div class="modal-footer-custom">
            <button class="btn btn-church-ghost" @click="showModal = false">
              <i class="bi bi-x me-1"></i>Cancel
            </button>
            <button class="btn btn-church-primary" @click="handleSave" :disabled="saving || !formValid">
              <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
              <template v-else>
                <i class="bi" :class="editing ? 'bi-check-lg' : 'bi-megaphone'"></i>
              </template>
              {{ editing ? 'Update Article' : 'Publish Article' }}
            </button>
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
            <h5 style="color: var(--burgundy); font-family: var(--font-heading);">Delete News</h5>
            <p class="text-muted mb-4">Are you sure you want to delete this news article?</p>
            <div class="d-flex justify-content-center gap-2">
              <button class="btn btn-church-ghost" @click="showDeleteModal = false">Cancel</button>
              <button class="btn btn-church-primary" style="background: var(--burgundy); border-color: var(--burgundy);" @click="handleDelete">Delete</button>
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
import { useNewsStore } from "../stores/news";

const userStore = useUserStore();
const nStore = useNewsStore();

const categories = [
  "Announcement", "Missions", "Community", "Youth", "Worship", "Anniversary", "Outreach", "General",
];

const selectedCategory = ref("");
const showCommentsId = ref(null);
const commentText = ref("");
const showPreview = ref(false);

const showModal = ref(false);
const showDeleteModal = ref(false);
const editing = ref(false);
const editingId = ref(null);
const saving = ref(false);
const formError = ref("");

const formValid = computed(() =>
  form.value.title.trim() && form.value.content.trim() && form.value.category && form.value.author
);

const form = ref({
  title: "",
  content: "",
  category: "",
  author: "",
  date: "",
  searchDate: "",
});

const filteredArticles = computed(() => {
  if (!selectedCategory.value) return nStore.articles;
  return nStore.articles.filter((a) => a.category === selectedCategory.value);
});

const recentPosts = computed(() =>
  nStore.articles.slice(0, 5).map((a) => ({ id: a.id, title: a.title, date: a.date }))
);

function emptyForm() {
  form.value = { title: "", content: "", category: "", author: "", date: "", searchDate: "" };
  formError.value = "";
}

function openCreateModal() {
  editing.value = false;
  editingId.value = null;
  showPreview.value = false;
  emptyForm();
  form.value.author = userStore.displayName || userStore.email || "";
  const d = new Date();
  form.value.date = d.toISOString().slice(0, 10);
  form.value.searchDate = form.value.date;
  showModal.value = true;
}

function openEditModal(article) {
  editing.value = true;
  editingId.value = article.id;
  showPreview.value = false;
  form.value = {
    title: article.title || "",
    content: article.content || "",
    category: article.category || "",
    author: article.author || "",
    date: article.date || "",
    searchDate: article.searchDate || article.date || "",
  };
  formError.value = "";
  showModal.value = true;
}

function openDeleteModal(article) {
  editingId.value = article.id;
  showDeleteModal.value = true;
}

async function handleSave() {
  if (!form.value.title.trim() || !form.value.content.trim() || !form.value.category || !form.value.author) {
    formError.value = "Title, content, category, and author are required.";
    return;
  }
  saving.value = true;
  try {
    if (editing.value && editingId.value) {
      await nStore.updateNews(editingId.value, form.value);
    } else {
      await nStore.createNews(form.value);
    }
    showModal.value = false;
    await nStore.fetchNews();
  } catch {
    formError.value = "Failed to save news. Please try again.";
  } finally {
    saving.value = false;
  }
}

async function handleDelete() {
  if (!editingId.value) return;
  try {
    await nStore.deleteNews(editingId.value);
    showDeleteModal.value = false;
    await nStore.fetchNews();
  } catch {
    formError.value = "Failed to delete news.";
  }
}

async function handleLike(article) {
  if (!userStore.uid) return;
  await nStore.toggleLike(article.id, userStore.uid, userStore.displayName || "Anonymous");
  await nStore.fetchNews();
}

async function handleAddComment(article) {
  if (!commentText.value.trim() || !userStore.uid) return;
  await nStore.addComment(article.id, userStore.uid, userStore.displayName || userStore.email || "Anonymous", commentText.value.trim());
  commentText.value = "";
  await nStore.fetchNews();
}

async function handleDeleteComment(article, commentId) {
  if (!article.comments) return;
  await nStore.deleteComment(article.id, commentId, article.comments);
  await nStore.fetchNews();
}

function toggleComments(articleId) {
  showCommentsId.value = showCommentsId.value === articleId ? null : articleId;
}

function handleShare(article) {
  const url = window.location.origin + "/news#" + article.id;
  if (navigator.share) {
    navigator.share({ title: article.title, text: article.content.slice(0, 100), url }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(() => alert("Link copied to clipboard!")).catch(() => {});
  }
}

function formatCommentTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return Math.floor(diff / 60) + "m ago";
  if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
  return d.toLocaleDateString();
}

onMounted(() => {
  nStore.fetchNews();
});
</script>

<style scoped>
.badge-active {
  background: var(--burgundy) !important;
  color: #fff !important;
}

.liked {
  color: var(--burgundy) !important;
}

.liked i {
  color: var(--burgundy) !important;
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

.modal-card-lg {
  max-width: 820px;
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

/* ---------- Modal Layout ---------- */
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

/* ---------- Form Sections ---------- */
.form-section {
  background: var(--cream);
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.form-section-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  background: rgba(128, 55, 55, 0.04);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--burgundy);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.form-section-header i {
  font-size: 0.85rem;
}

.form-section-body {
  padding: 1rem;
}

/* ---------- Title Input ---------- */
.form-title-input {
  font-size: 1.1rem !important;
  font-weight: 600;
  padding-top: 1.25rem !important;
  padding-bottom: 0.5rem !important;
  border: none;
  border-bottom: 2px solid rgba(0, 0, 0, 0.08);
  border-radius: 0;
  background: transparent;
  transition: border-color 0.2s;
}

.form-title-input:focus {
  border-bottom-color: var(--gold);
  box-shadow: none;
}

.form-title-input::placeholder {
  color: #bbb;
  font-weight: 400;
}

.form-floating > .form-title-input ~ label {
  padding-left: 0.75rem;
}

/* ---------- Character Count ---------- */
.input-character-count {
  font-size: 0.7rem;
  color: var(--dark-light);
  text-align: right;
}

/* ---------- Content Editor ---------- */
.content-editor-wrapper {
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 0.5rem;
  overflow: hidden;
  background: #fff;
}

.content-editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem 0.75rem;
  background: var(--cream);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.toolbar-label {
  font-size: 0.75rem;
  color: var(--dark-light);
  font-weight: 500;
}

.toolbar-btn {
  color: var(--dark-light);
  padding: 0.15rem 0.4rem;
  font-size: 0.8rem;
  border-radius: 0.3rem;
  transition: all 0.15s;
}

.toolbar-btn:hover {
  color: var(--burgundy);
  background: rgba(128, 55, 55, 0.06);
}

.content-textarea {
  border: none !important;
  border-radius: 0 !important;
  resize: vertical;
  min-height: 220px;
  font-size: 0.92rem;
  line-height: 1.7;
  padding: 0.85rem 0.85rem;
}

.content-textarea:focus {
  box-shadow: none;
}

/* ---------- Content Preview ---------- */
.content-preview {
  padding: 1.25rem;
  min-height: 220px;
}

.preview-title {
  color: var(--burgundy);
  font-family: var(--font-heading);
  font-size: 1.25rem;
}

.preview-body {
  font-size: 0.92rem;
  line-height: 1.7;
  color: #444;
  white-space: pre-line;
}

/* ---------- Category Chips ---------- */
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

/* ---------- Floating Label Fix ---------- */
.form-floating > .form-control:focus ~ label,
.form-floating > .form-control:not(:placeholder-shown) ~ label {
  opacity: 0.75;
  transform: scale(0.8) translateY(-0.25rem) translateX(0.15rem);
}

.form-floating > .form-control:focus {
  border-color: var(--gold);
  box-shadow: 0 0 0 0.15rem rgba(212, 175, 55, 0.15);
}

/* ---------- Scrollbar Styling ---------- */
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
</style>
