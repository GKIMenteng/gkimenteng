<template>
  <div>
    <div class="page-header text-center mb-5 animate-fade-in-up">
      <h1 class="display-4 mb-3" style="color: var(--burgundy)">
        <i class="bi bi-newspaper me-2"></i>Church News
      </h1>
      <p class="lead fs-5" style="color: var(--dark-light);">
        Stay updated with the latest from our community
      </p>
    </div>

    <div class="row g-4">
      <div class="col-lg-8">
        <div
          v-for="(article, index) in newsArticles"
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
                <i class="bi bi-chat me-1"></i>{{ article.comments }} comments
              </small>
            </div>
            <h3 class="mb-3" style="color: var(--burgundy); font-family: var(--font-heading);">
              {{ article.title }}
            </h3>
            <p class="mb-0" style="line-height: 1.8;">{{ article.content }}</p>
            <hr class="church-divider-solid" />
            <div class="d-flex gap-2">
              <button class="btn btn-church-ghost">
                <i class="bi bi-hand-thumbs-up me-1"></i>Like ({{ article.likes }})
              </button>
              <button class="btn btn-church-ghost">
                <i class="bi bi-share me-1"></i>Share
              </button>
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
              <span class="badge-church cursor-pointer" v-for="cat in categories" :key="cat">
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
  </div>
</template>

<script setup>
const newsArticles = [
  {
    id: 1,
    title: "Grace Church Celebrates 50 Years of Ministry",
    category: "Anniversary",
    author: "Pastor Michael Brown",
    date: "July 15, 2024",
    content:
      "This month, Grace Church celebrates five decades of serving the community. From humble beginnings in a small hall to our current sanctuary, God has been faithful. Join us for a special anniversary service this Sunday as we reflect on God's goodness and look forward to the future.",
    likes: 24,
    comments: 5,
  },
  {
    id: 2,
    title: "Mission Trip to Tanzania: A Life-Changing Experience",
    category: "Missions",
    author: "Sarah Johnson",
    date: "July 12, 2024",
    content:
      "Our team of 15 volunteers returned from a two-week mission trip to Tanzania with incredible stories of faith and transformation. We built two classrooms, conducted medical clinics, and shared the Gospel with hundreds of families.",
    likes: 18,
    comments: 8,
  },
  {
    id: 3,
    title: "New Children's Ministry Director Announced",
    category: "Announcement",
    author: "Church Board",
    date: "July 10, 2024",
    content:
      "We are excited to welcome Rebecca Martinez as our new Children's Ministry Director. Rebecca brings 15 years of experience in children's education and ministry.",
    likes: 15,
    comments: 3,
  },
];

const categories = [
  "Announcement",
  "Missions",
  "Community",
  "Youth",
  "Worship",
  "Anniversary",
  "Outreach",
];
const recentPosts = [
  { id: 1, title: "Prayer Meeting Schedule Update", date: "July 14, 2024" },
  { id: 2, title: "Volunteer Appreciation Dinner", date: "July 11, 2024" },
  { id: 3, title: "Summer Camp Registration Open", date: "July 8, 2024" },
];
</script>
