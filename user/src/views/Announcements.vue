<template>
  <div>
    <div class="page-header text-center mb-5 animate-fade-in-up">
      <h1 class="display-4 mb-3" style="color: var(--burgundy)">
        <i class="bi bi-megaphone me-2"></i>Announcements
      </h1>
      <p class="lead fs-5 mb-0" style="color: var(--dark-light);">
        Stay informed with the latest church announcements
      </p>
    </div>

    <div class="row g-4">
      <div class="col-lg-8">
        <div v-if="aStore.loading" class="text-center py-5">
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
                <i class="bi bi-calendar me-1"></i>{{ article.startPublishDate || article.date }}{{ article.endPublishDate ? " - " + article.endPublishDate : "" }}
              </small>
              <small class="text-muted">
                <i class="bi bi-chat me-1"></i>{{ (article.comments || []).length }} comments
              </small>
            </div>

            <h3 class="mb-3" style="color: var(--burgundy); font-family: var(--font-heading);">
              {{ article.title }}
            </h3>
            <p class="mb-0" style="line-height: 1.8; white-space: pre-line;">{{ article.content }}</p>

            <hr class="church-divider-solid" />
            <div class="d-flex gap-2 align-items-center">
              <button
                class="btn btn-church-ghost"
                :class="{ liked: article.likedBy?.includes(currentUid) }"
                @click="handleLike(article)"
                :disabled="!currentUid"
              >
                <i class="bi" :class="article.likedBy?.includes(currentUid) ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'"></i>
                Like ({{ article.likes || 0 }})
              </button>
              <button class="btn btn-church-ghost" @click="handleShare(article)">
                <i class="bi bi-share me-1"></i>Share
              </button>
              <button class="btn btn-church-ghost ms-auto" @click="toggleComments(article.id)">
                <i class="bi bi-chat-dots me-1"></i>{{ showCommentsId === article.id ? "Hide" : "" }} Comments ({{ (article.comments || []).length }})
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
                    {{ c.userName?.charAt(0)?.toUpperCase() || "?" }}
                  </div>
                  <div class="flex-grow-1">
                    <div class="d-flex align-items-center gap-2">
                      <strong style="font-size: 0.85rem;">{{ c.userName }}</strong>
                      <small class="text-muted" style="font-size: 0.7rem;">{{ formatCommentTime(c.createdAt) }}</small>
                      <button
                        v-if="c.uid === currentUid"
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
                  :disabled="!currentUid"
                />
                <button
                  class="btn btn-church-primary btn-sm flex-shrink-0"
                  @click="handleAddComment(article)"
                  :disabled="!currentUid || !commentText.trim()"
                >
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
                <small class="text-muted">{{ post.startPublishDate || post.date }}{{ post.endPublishDate ? " - " + post.endPublishDate : "" }}</small>
              </div>
              <hr v-if="index < recentPosts.length - 1" class="church-divider-solid" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useUserStore } from "../stores/user";
import { useAnnouncementsStore } from "../stores/announcement";

const userStore = useUserStore();
const aStore = useAnnouncementsStore();

const categories = [
  "Announcement", "Missions", "Community", "Youth", "Worship", "Anniversary", "Outreach", "General",
];

const selectedCategory = ref("");
const showCommentsId = ref(null);
const commentText = ref("");

const currentUid = computed(() => userStore.user?.uid || "");
const currentName = computed(() => userStore.username || userStore.email || "Anonymous");

const filteredArticles = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().slice(0, 10);

  return aStore.announcements.filter((a) => {
    const start = a.startPublishDate || a.date;
    if (!start) return true;
    if (start > todayStr) return false;
    const end = a.endPublishDate;
    if (end && end < todayStr) return false;
    if (selectedCategory.value && a.category !== selectedCategory.value) return false;
    return true;
  });
});

const recentPosts = computed(() =>
  aStore.announcements.slice(0, 5).map((a) => ({
    id: a.id,
    title: a.title,
    date: a.startPublishDate || a.date,
    startPublishDate: a.startPublishDate,
    endPublishDate: a.endPublishDate,
  }))
);

async function handleLike(article) {
  if (!currentUid.value) return;
  await aStore.toggleLike(article.id, currentUid.value, currentName.value);
  await aStore.fetchAnnouncements();
}

async function handleAddComment(article) {
  if (!commentText.value.trim() || !currentUid.value) return;
  await aStore.addComment(article.id, currentUid.value, currentName.value, commentText.value.trim());
  commentText.value = "";
  await aStore.fetchAnnouncements();
}

async function handleDeleteComment(article, commentId) {
  if (!article.comments || !currentUid.value) return;
  await aStore.deleteComment(article.id, commentId, article.comments);
  await aStore.fetchAnnouncements();
}

function toggleComments(articleId) {
  showCommentsId.value = showCommentsId.value === articleId ? null : articleId;
}

function handleShare(article) {
  const url = window.location.origin + "/announcements#" + article.id;
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
  aStore.fetchAnnouncements();
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
</style>
