<template>
  <div>
    <div class="page-header text-center mb-5 animate-fade-in-up">
      <h1 class="display-4 mb-3" style="color: var(--burgundy)">
        <i class="bi bi-people me-2"></i>Our Volunteers
      </h1>
      <p class="lead fs-5" style="color: var(--dark-light);">
        Serving with love and dedication
      </p>
    </div>

    <div class="row g-4 mb-5">
      <div
        v-for="(volunteer, index) in volunteers"
        :key="volunteer.id"
        class="col-sm-6 col-md-4 col-lg-3 animate-fade-in-up"
        :class="'animate-stagger-' + (index + 1)"
      >
        <div class="volunteer-card text-center h-100 d-flex flex-column align-items-center">
          <div
            class="avatar-circle mb-3"
            style="width: 80px; height: 80px; font-size: 2rem;"
          >
            {{ volunteer.initials }}
          </div>
          <h5 class="mb-1" style="color: var(--burgundy); font-family: var(--font-heading);">
            {{ volunteer.name }}
          </h5>
          <span class="badge-church mb-2">{{ volunteer.role }}</span>
          <p class="text-muted mb-2" style="font-size: 0.9rem;">{{ volunteer.ministry }}</p>
          <div class="mb-2">
            <i class="bi bi-star-fill" style="color: var(--gold); font-size: 0.85rem;"></i>
            <i class="bi bi-star-fill" style="color: var(--gold); font-size: 0.85rem;"></i>
            <i class="bi bi-star-fill" style="color: var(--gold); font-size: 0.85rem;"></i>
            <i class="bi bi-star-fill" style="color: var(--gold); font-size: 0.85rem;"></i>
            <i class="bi bi-star-half" style="color: var(--gold); font-size: 0.85rem;"></i>
          </div>
          <p class="mt-auto mb-0" style="font-size: 0.85rem; color: var(--dark-light);">
            <i class="bi bi-clock me-1"></i>{{ volunteer.years }} years serving
          </p>
        </div>
      </div>
    </div>

    <div class="animate-fade-in-up animate-stagger-5">
      <div class="church-card">
        <div class="church-card-header d-flex align-items-center">
          <i class="bi bi-clipboard-check me-2"></i>Volunteer Opportunities
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div
              class="col-md-4"
              v-for="opportunity in opportunities"
              :key="opportunity.id"
            >
              <div class="volunteer-card h-100 d-flex flex-column">
                <div
                  class="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                  style="width: 48px; height: 48px; background: linear-gradient(135deg, var(--gold-light) 0%, var(--cream) 100%); color: var(--burgundy); font-size: 1.25rem;"
                >
                  <i :class="opportunity.icon"></i>
                </div>
                <h6 class="mb-2" style="color: var(--burgundy); font-family: var(--font-heading);">
                  {{ opportunity.title }}
                </h6>
                <p class="mb-3 flex-grow-1" style="font-size: 0.9rem;">{{ opportunity.description }}</p>
                <button class="btn btn-church-primary align-self-start">
                  <i class="bi bi-person-plus me-2"></i>Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const volunteers = [
  {
    id: 1,
    name: "Michael Brown",
    role: "Head Usher",
    ministry: "Hospitality",
    years: 8,
    initials: "MB",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Worship Leader",
    ministry: "Music Ministry",
    years: 5,
    initials: "SJ",
  },
  {
    id: 3,
    name: "David Lee",
    role: "Teacher",
    ministry: "Children Ministry",
    years: 3,
    initials: "DL",
  },
  {
    id: 4,
    name: "Emily White",
    role: "Coordinator",
    ministry: "Greeting Team",
    years: 4,
    initials: "EW",
  },
  {
    id: 5,
    name: "James Wilson",
    role: "Sound Engineer",
    ministry: "Technical Team",
    years: 6,
    initials: "JW",
  },
  {
    id: 6,
    name: "Lisa Chen",
    role: "Nursery Worker",
    ministry: "Nursery",
    years: 2,
    initials: "LC",
  },
  {
    id: 7,
    name: "Robert Taylor",
    role: "Driver",
    ministry: "Transportation",
    years: 7,
    initials: "RT",
  },
  {
    id: 8,
    name: "Maria Garcia",
    role: "Interpreter",
    ministry: "Translation",
    years: 3,
    initials: "MG",
  },
];

const opportunities = [
  {
    id: 1,
    title: "Sunday School Teacher",
    description: "Help teach our children about God's love every Sunday morning.",
    icon: "bi bi-book",
  },
  {
    id: 2,
    title: "Choir Member",
    description: "Join our choir and lift your voice in praise and worship.",
    icon: "bi bi-music-note",
  },
  {
    id: 3,
    title: "Tech Team Volunteer",
    description: "Help with sound, lighting, and projection during services.",
    icon: "bi bi-display",
  },
];
</script>
