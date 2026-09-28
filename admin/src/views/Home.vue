<template>
  <div>
    <div class="page-header text-center mb-5 animate-fade-in-up">
      <h1 class="display-4 mb-3" style="color: var(--burgundy)">
        <i class="bi bi-speedometer2 me-2"></i>Admin Dashboard
      </h1>
      <p class="lead fs-5" style="color: var(--dark-light); max-width: 680px; margin: 0 auto">
        Manage weekly news documents, calendar events, and volunteer data.
      </p>
      <span class="verse-ref">Signed in as {{ userStore.username }} - {{ roleLabel }}</span>
    </div>

    <div class="row g-4 mb-5">
      <div v-for="(item, index) in stats" :key="item.label" class="col-6 col-lg-3">
        <div class="church-card stat-card h-100 animate-fade-in-up" :class="'animate-stagger-' + (index + 1)">
          <div class="stat-icon">
            <i :class="item.icon"></i>
          </div>
          <p class="stat-label mb-1">{{ item.label }}</p>
          <h3 class="mb-0">{{ item.value }}</h3>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-5">
      <div v-for="(action, index) in actions" :key="action.to" class="col-md-6 col-xl-3">
        <router-link
          :to="action.to"
          class="church-card dashboard-action h-100 text-decoration-none animate-fade-in-up d-flex flex-column"
          :class="'animate-stagger-' + (index + 1)"
        >
          <div class="dashboard-action-icon mb-3">
            <i :class="action.icon"></i>
          </div>
          <h5 class="mb-2">{{ action.title }}</h5>
          <p class="mb-0 flex-grow-1">{{ action.description }}</p>
          <span class="dashboard-action-link mt-3">
            Open <i class="bi bi-arrow-right ms-1"></i>
          </span>
        </router-link>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-6">
        <div class="church-card h-100">
          <div class="church-card-header d-flex align-items-center">
            <i class="bi bi-calendar-event me-2"></i>Upcoming Events
          </div>
          <div class="card-body">
            <div v-if="upcomingEvents.length === 0" class="text-muted">No upcoming events scheduled.</div>
            <div v-for="(event, index) in upcomingEvents" :key="event.id">
              <div class="d-flex gap-3">
                <div class="text-center flex-shrink-0" style="width: 50px">
                  <div class="fw-bold fs-4" style="color: var(--burgundy); font-family: var(--font-heading); line-height: 1">
                    {{ event.day }}
                  </div>
                  <div style="color: var(--gold); font-size: 0.75rem; font-weight: 600; text-transform: uppercase">
                    {{ event.month }}
                  </div>
                </div>
                <div class="flex-grow-1">
                  <h6 class="mb-1" style="color: var(--burgundy)">{{ event.title }}</h6>
                  <p class="mb-1" style="font-size: 0.85rem; color: var(--dark-light)">
                    <i class="bi bi-clock me-1"></i>{{ event.time || "No time set" }}
                  </p>
                  <p class="mb-0" style="font-size: 0.9rem">{{ event.description }}</p>
                </div>
              </div>
              <hr v-if="index < upcomingEvents.length - 1" class="church-divider-solid" />
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="church-card h-100">
          <div class="church-card-header d-flex align-items-center">
            <i class="bi bi-calendar-event me-2"></i>Upcoming Events
          </div>
          <div class="card-body">
            <div v-if="upcomingEvents.length === 0" class="text-muted">No upcoming events scheduled.</div>
            <div v-for="(event, index) in upcomingEvents" :key="event.id">
              <div class="d-flex gap-3">
                <div class="text-center flex-shrink-0" style="width: 50px">
                  <div class="fw-bold fs-4" style="color: var(--burgundy); font-family: var(--font-heading); line-height: 1">
                    {{ event.day }}
                  </div>
                  <div style="color: var(--gold); font-size: 0.75rem; font-weight: 600; text-transform: uppercase">
                    {{ event.month }}
                  </div>
                </div>
                <div class="flex-grow-1">
                  <h6 class="mb-1" style="color: var(--burgundy)">{{ event.title }}</h6>
                  <p class="mb-1" style="font-size: 0.85rem; color: var(--dark-light)">
                    <i class="bi bi-clock me-1"></i>{{ event.time || "No time set" }}
                  </p>
                  <p class="mb-0" style="font-size: 0.9rem">{{ event.description }}</p>
                </div>
              </div>
              <hr v-if="index < upcomingEvents.length - 1" class="church-divider-solid" />
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
import { useEventsStore } from "../stores/events";
import { useVolunteersStore } from "../stores/volunteers";
import { getPDFs } from "../services/googleDrive";

const userStore = useUserStore();
const eStore = useEventsStore();
const vStore = useVolunteersStore();
const documentCount = ref("...");

const today = new Date().toISOString().split("T")[0];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const roleLabel = computed(() => {
  const labels = { admin: "Admin", manager: "Manager" };
  return labels[userStore.role] || "Manager";
});

const upcomingEventsRaw = computed(() => {
  return eStore.events
    .filter((ev) => ev.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
});

const stats = computed(() => [
  { label: "Weekly News", value: documentCount.value, icon: "bi bi-file-earmark-pdf" },
  { label: "Upcoming Events", value: upcomingEventsRaw.value.length, icon: "bi bi-calendar-event" },
  { label: "Volunteers", value: vStore.volunteers.length, icon: "bi bi-people" },
]);

const actions = [
  {
    to: "/news",
    icon: "bi bi-cloud-upload",
    title: "Upload Weekly News",
    description: "Upload and manage PDF weekly news documents from Google Drive.",
  },
  {
    to: "/calendar",
    icon: "bi bi-calendar-plus",
    title: "Add Event Calendar",
    description: "Schedule events and assign ministry volunteers by position.",
  },
  {
    to: "/volunteers",
    icon: "bi bi-person-plus",
    title: "Manage Volunteers",
    description: "Add, edit, and delete volunteer profiles and serving positions.",
  },
];

const upcomingEvents = computed(() => {
  return upcomingEventsRaw.value.slice(0, 4).map((ev) => {
    const d = new Date(ev.date + "T00:00:00");
    return {
      id: ev.id,
      title: ev.name,
      day: String(d.getDate()),
      month: months[d.getMonth()],
      time: ev.time || "",
      description: ev.location || ev.notes || "",
    };
  });
});

onMounted(async () => {
  eStore.fetchEvents();
  vStore.fetchVolunteers();

  try {
    const documents = await getPDFs();
    documentCount.value = documents.length;
  } catch {
    documentCount.value = 0;
  }
});
</script>

<style scoped>
.stat-card {
  padding: 1.5rem;
}

.stat-icon,
.dashboard-action-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
  color: var(--burgundy-dark);
  box-shadow: var(--shadow-gold);
  font-size: 1.35rem;
}

.stat-label {
  color: var(--dark-light);
  font-size: 0.85rem;
  font-weight: 600;
}

.stat-card h3,
.dashboard-action h5 {
  color: var(--burgundy);
  font-family: var(--font-heading);
}

.dashboard-action {
  padding: 1.5rem;
  color: var(--dark);
  transition: all var(--transition);
}

.dashboard-action:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
  color: var(--dark);
}

.dashboard-action p {
  color: var(--dark-light);
  font-size: 0.92rem;
}

.dashboard-action-link {
  color: var(--gold-dark);
  font-weight: 700;
  font-size: 0.9rem;
}
</style>
