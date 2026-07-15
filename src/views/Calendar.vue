<template>
  <div>
    <div class="page-header text-center mb-5 animate-fade-in-up">
      <h1 class="display-4 mb-3" style="color: var(--burgundy)">
        <i class="bi bi-calendar3 me-2"></i>Church Calendar
      </h1>
      <p class="lead fs-5" style="color: var(--dark-light);">
        Stay connected with our events and activities
      </p>
    </div>

    <div class="church-card p-3 p-lg-4 mb-4 animate-fade-in-up">
      <div class="d-flex justify-content-between align-items-center mb-4 px-2">
        <button class="btn btn-church-outline px-3" @click="previousMonth">
          <i class="bi bi-chevron-left"></i>
        </button>
        <h3 class="mb-0" style="color: var(--burgundy); font-family: var(--font-heading);">
          {{ currentMonthName }} {{ currentYear }}
        </h3>
        <button class="btn btn-church-outline px-3" @click="nextMonth">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>

      <!-- Day headers -->
      <div class="row g-1 mb-2">
        <div
          class="col text-center fw-semibold py-2"
          style="color: var(--burgundy-light); font-size: 0.85rem; letter-spacing: 0.5px; text-transform: uppercase;"
          v-for="day in daysOfWeek"
          :key="day"
        >
          {{ day }}
        </div>
      </div>

      <!-- Calendar grid -->
      <div class="row g-1">
        <div
          class="col-1-7 p-1"
          v-for="(day, index) in calendarDays"
          :key="index"
        >
          <div
            class="calendar-day p-1 p-md-2 d-flex flex-column"
            :class="{ today: isToday(day), 'has-event': day && getEventsForDay(day).length > 0 }"
            v-if="day"
          >
            <div class="day-number mb-1">{{ day }}</div>
            <div class="flex-grow-1 d-flex flex-column gap-1">
              <div v-for="event in getEventsForDay(day).slice(0, 2)" :key="event.id">
                <span
                  class="badge-church d-inline-block text-truncate"
                  style="font-size: 0.6rem; padding: 0.15rem 0.4rem; max-width: 100%;"
                  :title="event.title"
                >
                  {{ event.title }}
                </span>
              </div>
              <small
                v-if="getEventsForDay(day).length > 2"
                style="color: var(--gold-dark); font-size: 0.6rem; font-weight: 600;"
              >
                +{{ getEventsForDay(day).length - 2 }} more
              </small>
            </div>
          </div>
          <div v-else class="calendar-day p-2" style="border-color: transparent; background: transparent;"></div>
        </div>
      </div>
    </div>

    <!-- Upcoming Events List -->
    <div class="animate-fade-in-up animate-stagger-1">
      <div class="church-card">
        <div class="church-card-header d-flex align-items-center">
          <i class="bi bi-list-check me-2"></i>Upcoming Events
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6" v-for="event in upcomingEvents" :key="event.id">
              <div class="volunteer-card h-100">
                <div class="d-flex gap-3">
                  <div class="text-center flex-shrink-0">
                    <div
                      class="rounded-3 d-flex flex-column align-items-center justify-content-center px-3 py-2"
                      style="background: linear-gradient(135deg, var(--gold-light) 0%, var(--cream) 100%);"
                    >
                      <span class="fw-bold" style="color: var(--burgundy); font-size: 1.25rem; font-family: var(--font-heading); line-height: 1;">
                        {{ getDayNumber(event.date) }}
                      </span>
                      <span style="color: var(--burgundy); font-size: 0.65rem; font-weight: 600; text-transform: uppercase;">
                        {{ getMonthAbbr(event.date) }}
                      </span>
                    </div>
                  </div>
                  <div class="flex-grow-1 min-width-0">
                    <h6 class="mb-2" style="color: var(--burgundy);">{{ event.title }}</h6>
                    <p class="mb-1" style="font-size: 0.85rem;">
                      <i class="bi bi-clock me-1" style="color: var(--gold);"></i>{{ event.time }}
                    </p>
                    <p class="mb-1" style="font-size: 0.85rem;">
                      <i class="bi bi-geo-alt me-1" style="color: var(--gold);"></i>{{ event.location }}
                    </p>
                    <p class="mb-0 text-muted" style="font-size: 0.85rem;">{{ event.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const currentDate = ref(new Date());
const currentMonth = ref(currentDate.value.getMonth());
const currentYear = ref(currentDate.value.getFullYear());

const currentMonthName = computed(() => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return months[currentMonth.value];
});

const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay();
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return days;
});

const events = [
  {
    id: 1,
    title: "Sunday Service",
    date: "2024-07-21",
    time: "9:00 AM",
    location: "Main Sanctuary",
    description: "Weekly worship service",
  },
  {
    id: 2,
    title: "Bible Study",
    date: "2024-07-24",
    time: "7:00 PM",
    location: "Fellowship Hall",
    description: "Weekly Bible study group",
  },
  {
    id: 3,
    title: "Youth Night",
    date: "2024-07-26",
    time: "6:30 PM",
    location: "Youth Center",
    description: "Games and worship for youth",
  },
  {
    id: 4,
    title: "Prayer Meeting",
    date: "2024-07-28",
    time: "6:00 AM",
    location: "Prayer Room",
    description: "Early morning prayer session",
  },
];

const upcomingEvents = events;

function getEventsForDay(day) {
  if (!day) return [];
  const dateStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return events.filter((event) => event.date === dateStr);
}

function isToday(day) {
  if (!day) return false;
  const today = new Date();
  return (
    day === today.getDate() &&
    currentMonth.value === today.getMonth() &&
    currentYear.value === today.getFullYear()
  );
}

function getDayNumber(dateStr) {
  const d = new Date(dateStr);
  return d.getDate();
}

function getMonthAbbr(dateStr) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const d = new Date(dateStr);
  return months[d.getMonth()];
}

function previousMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
}
</script>

<style scoped>
.col-1-7 {
  width: calc(100% / 7);
}
</style>
