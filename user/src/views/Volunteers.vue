<template>
  <div>
    <div class="page-header text-center mb-5 animate-fade-in-up">
      <h1 class="display-4 mb-3" style="color: var(--burgundy)">
        <i class="bi bi-people me-2"></i>Our Volunteers
      </h1>
      <p class="lead fs-5 mb-0" style="color: var(--dark-light);">
        Serving with love and dedication
      </p>
    </div>

    <div v-if="volStore.loading" class="text-center py-5">
      <div class="spinner-border" style="color: var(--gold);" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-if="pageError" class="alert d-flex align-items-center gap-2 mb-4 py-2 px-3" style="background: rgba(114, 47, 55, 0.08); border: 1px solid rgba(114, 47, 55, 0.2); color: var(--burgundy); border-radius: var(--radius-sm); font-size: 0.9rem;">
      <i class="bi bi-exclamation-circle"></i>
      {{ pageError }}
      <button class="btn btn-sm ms-auto p-0 border-0 bg-transparent" style="color: var(--burgundy);" @click="pageError = ''">&times;</button>
    </div>

    <div v-else-if="volStore.volunteers.length === 0" class="text-center py-5 animate-fade-in-up">
      <i class="bi bi-people fs-1" style="color: var(--gold); opacity: 0.5;"></i>
      <p class="mt-3" style="color: var(--dark-light);">No volunteers are listed yet.</p>
    </div>

    <div v-else class="row g-4 mb-5">
      <div
        v-for="(v, index) in volStore.volunteers"
        :key="v.id"
        class="col-sm-6 col-md-4 col-lg-3 animate-fade-in-up"
        :class="'animate-stagger-' + (index + 1)"
      >
        <div class="volunteer-card text-center h-100 d-flex flex-column align-items-center">
          <div class="avatar-circle mb-3" style="width: 80px; height: 80px; font-size: 2rem;">
            {{ getInitials(v.name) }}
          </div>

          <h5 class="mb-1" style="color: var(--burgundy); font-family: var(--font-heading);">
            {{ v.name }}
          </h5>

          <div class="d-flex flex-wrap gap-1 mb-2 justify-content-center">
            <span v-for="pos in toArray(v.positions || v.position)" :key="pos" class="badge-church">
              {{ pos }}
            </span>
          </div>

          <div v-if="hasMusician(v)" class="d-flex flex-wrap gap-1 mb-2 justify-content-center">
            <span
              v-for="inst in toArray(v.instruments || v.instrument)"
              :key="inst"
              class="badge-church-gold d-inline-flex align-items-center gap-1"
            >
              <i class="bi bi-music-note"></i>{{ inst }}
            </span>
          </div>

          <p class="text-muted mt-auto mb-0" style="font-size: 0.85rem;">
            <i class="bi bi-clock me-1"></i>Serving since {{ formatDate(v.createdAt) }}
          </p>
        </div>
      </div>
    </div>

    <div class="animate-fade-in-up">
      <div class="church-card">
        <div class="church-card-header d-flex align-items-center">
          <i class="bi bi-clipboard-check me-2"></i>Volunteer Opportunities
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4" v-for="opportunity in opportunities" :key="opportunity.id">
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
import { onMounted, ref } from "vue";
import { useVolunteersStore } from "../stores/volunteers";

const volStore = useVolunteersStore();
const pageError = ref("");

function toArray(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === "string" && val) return [val];
  return [];
}

function hasMusician(v) {
  return toArray(v.positions || v.position).includes("Musician");
}

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function formatDate(timestamp) {
  if (!timestamp) return "-";
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

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

onMounted(() => {
  volStore.fetchVolunteers();
});
</script>
