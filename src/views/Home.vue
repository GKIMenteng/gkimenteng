<template>
  <div>
    <!-- Hero Section -->
    <div class="page-header text-center mb-5 animate-fade-in-up">
      <h1 class="display-4 mb-3" style="color: var(--burgundy)">
        <i class="bi bi-church me-2"></i>Welcome to Grace Church
      </h1>
      <p class="lead fs-5" style="color: var(--dark-light); max-width: 600px; margin: 0 auto;">
        "For where two or three gather in my name, there am I with them."
      </p>
      <span class="verse-ref">— Matthew 18:20</span>
    </div>

    <!-- Daily Reflection -->
    <div class="row mb-5 stagger-children">
      <div class="col-12">
        <div class="church-card reflection-card p-4 p-lg-5">
          <div class="d-flex align-items-start gap-3">
            <div class="reflection-icon d-none d-sm-flex">
              <i class="bi bi-book"></i>
            </div>
            <div>
              <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
                <span class="badge-church-gold">Daily Reflection</span>
              </div>
              <h3 class="mb-2" style="color: var(--burgundy); font-family: var(--font-heading);">
                "The Light of the World"
              </h3>
              <p class="verse-text fs-5 mb-3">
                "You are the light of the world. A town built on a hill cannot be hidden."
              </p>
              <p class="mb-0" style="color: var(--dark-light);">
                Today, let us reflect on being a beacon of hope and love in our community. Through our
                actions and words, we can illuminate the path for others to find faith, hope, and
                purpose.
              </p>
              <button class="btn btn-church-primary mt-4">
                <i class="bi bi-journal-text me-2"></i>Read More Reflections
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Events & Latest News -->
    <div class="row g-4">
      <div class="col-lg-6 animate-fade-in-up animate-stagger-1">
        <div class="church-card h-100">
          <div class="church-card-header d-flex align-items-center">
            <i class="bi bi-calendar-event me-2"></i>Upcoming Events
          </div>
          <div class="card-body">
            <div v-for="(event, index) in upcomingEvents" :key="event.id">
              <div class="d-flex gap-3">
                <div class="text-center flex-shrink-0" style="width: 50px;">
                  <div class="fw-bold fs-4" style="color: var(--burgundy); font-family: var(--font-heading); line-height: 1;">
                    {{ event.day }}
                  </div>
                  <div style="color: var(--gold); font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">
                    {{ event.month }}
                  </div>
                </div>
                <div class="flex-grow-1">
                  <h6 class="mb-1" style="color: var(--burgundy);">{{ event.title }}</h6>
                  <p class="mb-1" style="font-size: 0.85rem; color: var(--dark-light);">
                    <i class="bi bi-clock me-1"></i>{{ event.time }}
                  </p>
                  <p class="mb-0" style="font-size: 0.9rem;">{{ event.description }}</p>
                </div>
              </div>
              <hr v-if="index < upcomingEvents.length - 1" class="church-divider-solid" />
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-6 animate-fade-in-up animate-stagger-2">
        <div class="church-card h-100">
          <div class="church-card-header d-flex align-items-center">
            <i class="bi bi-newspaper me-2"></i>Latest News
          </div>
          <div class="card-body">
            <div v-for="(item, index) in latestNews" :key="item.id">
              <div>
                <div class="d-flex align-items-center gap-2 mb-1">
                  <span class="badge-church" style="font-size: 0.7rem;">{{ item.category }}</span>
                  <small class="text-muted">{{ item.date }}</small>
                </div>
                <h6 class="mb-2" style="color: var(--burgundy);">{{ item.title }}</h6>
                <p class="mb-2" style="font-size: 0.9rem;">{{ item.excerpt }}</p>
                <router-link to="/news" class="text-decoration-none fw-medium" style="color: var(--gold); font-size: 0.85rem;">
                  Read more <i class="bi bi-arrow-right ms-1"></i>
                </router-link>
              </div>
              <hr v-if="index < latestNews.length - 1" class="church-divider-solid" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const upcomingEvents = [
  {
    id: 1,
    title: "Sunday Service",
    date: "July 21, 2024",
    day: "21",
    month: "Jul",
    time: "9:00 AM & 11:00 AM",
    description: "Join us for worship, prayer, and fellowship.",
  },
  {
    id: 2,
    title: "Bible Study Group",
    date: "July 24, 2024",
    day: "24",
    month: "Jul",
    time: "7:00 PM",
    description: "Deep dive into the Book of Romans.",
  },
  {
    id: 3,
    title: "Youth Night",
    date: "July 26, 2024",
    day: "26",
    month: "Jul",
    time: "6:30 PM",
    description: "Games, worship, and message for youth.",
  },
];

const latestNews = [
  {
    id: 1,
    title: "Community Outreach Program",
    date: "July 15, 2024",
    category: "Outreach",
    excerpt: "Our church launches a new initiative to support local families in need.",
  },
  {
    id: 2,
    title: "New Worship Team Members",
    date: "July 12, 2024",
    category: "Worship",
    excerpt: "Welcome to our three new worship team members joining us this month.",
  },
  {
    id: 3,
    title: "Building Renovation Update",
    date: "July 10, 2024",
    category: "Announcement",
    excerpt: "Phase 2 of our church renovation is now complete. See the transformation!",
  },
];
</script>
