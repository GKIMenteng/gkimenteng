<template>
  <div>
    <div class="page-header text-center mb-5 animate-fade-in-up">
      <h1 class="display-4 mb-3" style="color: var(--burgundy)">
        <i class="bi bi-calendar3 me-2"></i>Church Calendar
      </h1>
      <p class="lead fs-5 mb-0" style="color: var(--dark-light);">
        Stay connected with our events and activities
      </p>
    </div>

    <div v-if="eStore.loading" class="text-center py-5">
      <div class="spinner-border" style="color: var(--gold);" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <template v-else>
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

        <div class="row g-1">
          <div class="col-1-7 p-1" v-for="(day, index) in calendarDays" :key="index">
            <div
              class="calendar-day p-1 p-md-2 d-flex flex-column cursor-pointer"
              :class="{ today: isToday(day), 'has-event': day && currentMonthEvents(day).length > 0 }"
              v-if="day"
              @click="openDayModal(day)"
            >
              <div class="day-number mb-1">{{ day }}</div>
              <div class="flex-grow-1 d-flex flex-column gap-1">
                <div v-for="ev in currentMonthEvents(day).slice(0, 2)" :key="ev.id">
                  <span
                    class="badge-church d-inline-block text-truncate cursor-pointer"
                    style="font-size: 0.6rem; padding: 0.15rem 0.4rem; max-width: 100%;"
                    :title="ev.name"
                    @click.stop="openDetailModal(ev)"
                  >
                    {{ ev.name }}
                  </span>
                </div>
                <small
                  v-if="currentMonthEvents(day).length > 2"
                  style="color: var(--gold-dark); font-size: 0.6rem; font-weight: 600;"
                >
                  +{{ currentMonthEvents(day).length - 2 }} more
                </small>
              </div>
            </div>
            <div v-else class="calendar-day p-2" style="border-color: transparent; background: transparent;"></div>
          </div>
        </div>
      </div>

      <div class="modal-overlay" v-if="showDayModal" @click.self="showDayModal = false">
        <div class="church-card modal-card modal-card-md animate-fade-in-up">
          <div class="modal-header-custom">
            <div class="d-flex align-items-center gap-3">
              <div
                class="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                style="width: 44px; height: 44px; background: linear-gradient(135deg, var(--gold-light) 0%, var(--cream) 100%);"
              >
                <i class="bi bi-calendar-day" style="color: var(--burgundy); font-size: 1.25rem;"></i>
              </div>
              <div>
                <h5 class="mb-0" style="color: var(--burgundy); font-family: var(--font-heading);">
                  {{ formatDateDisplay(selectedDateFull) }}
                </h5>
                <p class="mb-0" style="font-size: 0.8rem; color: var(--dark-light);">
                  {{ dayEvents.length }} event{{ dayEvents.length !== 1 ? "s" : "" }}
                </p>
              </div>
            </div>
            <button class="modal-close-btn" @click="showDayModal = false" type="button" aria-label="Close">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div class="p-4">
            <div v-if="dayEvents.length === 0" class="text-center py-4">
              <i class="bi bi-calendar2-plus fs-1" style="color: var(--gold); opacity: 0.3;"></i>
              <p class="mt-2 mb-0" style="color: var(--dark-light);">No events on this day</p>
            </div>

            <div v-else class="d-flex flex-column gap-3">
              <div v-for="ev in dayEvents" :key="ev.id" class="volunteer-card p-3 cursor-pointer" @click="openDetailModal(ev)">
                <h6 class="mb-1" style="color: var(--burgundy);">{{ ev.name }}</h6>
                <p class="mb-1" style="font-size: 0.85rem;">
                  <i class="bi bi-clock me-1" style="color: var(--gold);"></i>{{ formatTime(ev.time) }}
                </p>
                <p v-if="ev.location" class="mb-1" style="font-size: 0.85rem;">
                  <i class="bi bi-geo-alt me-1" style="color: var(--gold);"></i>{{ ev.location }}
                </p>
                <p v-if="ev.pastor" class="mb-1" style="font-size: 0.85rem;">
                  <i class="bi bi-person-badge me-1" style="color: var(--gold);"></i>{{ ev.pastor }}
                </p>
                <template v-if="ev.volunteers">
                  <template v-for="(names, pos) in ev.volunteers" :key="pos">
                    <p v-show="names && names.length" class="mb-1" style="font-size: 0.85rem;">
                      <i :class="posIcon(pos)" class="me-1" style="color: var(--gold);"></i>
                      <strong>{{ pos }}:</strong> {{ names.join(", ") }}
                    </p>
                  </template>
                </template>
                <p v-else-if="ev.volunteerNames && ev.volunteerNames.length" class="mb-1" style="font-size: 0.85rem;">
                  <i class="bi bi-people me-1" style="color: var(--gold);"></i>
                  {{ ev.volunteerNames.join(", ") }}
                </p>
                <p v-if="ev.notes" class="mb-0 text-muted mt-1" style="font-size: 0.8rem; font-style: italic;">
                  <i class="bi bi-chat-quote me-1"></i>{{ ev.notes }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="animate-fade-in-up">
        <div class="church-card">
          <div class="church-card-header d-flex align-items-center justify-content-between">
            <span><i class="bi bi-list-check me-2"></i>Upcoming Events</span>
          </div>
          <div class="card-body">
            <div v-if="sortedUpcoming.length === 0" class="text-center py-4" style="color: var(--dark-light);">
              <i class="bi bi-calendar2-week fs-2" style="color: var(--gold); opacity: 0.4;"></i>
              <p class="mt-2 mb-0">No upcoming events scheduled</p>
            </div>
            <div v-else class="row g-3">
              <div class="col-md-6" v-for="ev in sortedUpcoming" :key="ev.id">
                <div class="volunteer-card h-100 position-relative cursor-pointer" @click="openDetailModal(ev)">
                  <div class="d-flex gap-3">
                    <div class="text-center flex-shrink-0">
                      <div
                        class="rounded-3 d-flex flex-column align-items-center justify-content-center px-3 py-2"
                        style="background: linear-gradient(135deg, var(--gold-light) 0%, var(--cream) 100%);"
                      >
                        <span class="fw-bold" style="color: var(--burgundy); font-size: 1.25rem; font-family: var(--font-heading); line-height: 1;">
                          {{ getDayNumber(ev.date) }}
                        </span>
                        <span style="color: var(--burgundy); font-size: 0.65rem; font-weight: 600; text-transform: uppercase;">
                          {{ getMonthAbbr(ev.date) }}
                        </span>
                      </div>
                    </div>
                    <div class="flex-grow-1 min-width-0">
                      <h6 class="mb-2" style="color: var(--burgundy);">{{ ev.name }}</h6>
                      <p class="mb-1" style="font-size: 0.85rem;">
                        <i class="bi bi-clock me-1" style="color: var(--gold);"></i>{{ formatTime(ev.time) }}
                      </p>
                      <p class="mb-1" style="font-size: 0.85rem;">
                        <i class="bi bi-geo-alt me-1" style="color: var(--gold);"></i>{{ ev.location || "-" }}
                      </p>
                      <p v-if="ev.pastor" class="mb-1" style="font-size: 0.85rem;">
                        <i class="bi bi-person-badge me-1" style="color: var(--gold);"></i>{{ ev.pastor }}
                      </p>
                      <template v-if="ev.volunteers">
                        <template v-for="(names, pos) in ev.volunteers" :key="pos">
                          <p v-show="names && names.length" class="mb-1" style="font-size: 0.85rem;">
                            <i :class="posIcon(pos)" class="me-1" style="color: var(--gold);"></i>
                            <strong>{{ pos }}:</strong> {{ names.join(", ") }}
                          </p>
                        </template>
                      </template>
                      <p v-else-if="ev.volunteerNames && ev.volunteerNames.length" class="mb-1" style="font-size: 0.85rem;">
                        <i class="bi bi-people me-1" style="color: var(--gold);"></i>
                        {{ ev.volunteerNames.join(", ") }}
                      </p>
                      <p v-if="ev.notes" class="mb-0 text-muted" style="font-size: 0.8rem; font-style: italic;">
                        {{ ev.notes }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div class="modal-overlay" v-if="showDetailModal" @click.self="closeDetailModal">
      <div class="church-card modal-card modal-card-md animate-fade-in-up">
        <div class="modal-header-custom">
          <div class="d-flex align-items-center gap-3">
            <div
              class="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
              style="width: 44px; height: 44px; background: linear-gradient(135deg, var(--gold-light) 0%, var(--cream) 100%);"
            >
              <i class="bi bi-calendar-event" style="color: var(--burgundy); font-size: 1.25rem;"></i>
            </div>
            <div>
              <h5 class="mb-0" style="color: var(--burgundy); font-family: var(--font-heading);">
                {{ detailEvent?.name }}
              </h5>
              <p class="mb-0" style="font-size: 0.8rem; color: var(--dark-light);">Event Details</p>
            </div>
          </div>
          <button class="modal-close-btn" @click="closeDetailModal" type="button" aria-label="Close">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="p-4">
          <div class="d-flex flex-column gap-3">
            <div class="d-flex align-items-center gap-3">
              <div class="event-detail-icon">
                <i class="bi bi-calendar3"></i>
              </div>
              <div>
                <p class="mb-0" style="font-size: 0.8rem; color: var(--dark-light);">Date</p>
                <p class="mb-0 fw-medium" style="color: var(--burgundy);">{{ formatDateDisplay(detailEvent?.date) }}</p>
              </div>
            </div>

            <div class="d-flex align-items-center gap-3">
              <div class="event-detail-icon">
                <i class="bi bi-clock"></i>
              </div>
              <div>
                <p class="mb-0" style="font-size: 0.8rem; color: var(--dark-light);">Time</p>
                <p class="mb-0 fw-medium" style="color: var(--burgundy);">{{ formatTime(detailEvent?.time) }}</p>
              </div>
            </div>

            <div v-if="detailEvent?.location" class="d-flex align-items-center gap-3">
              <div class="event-detail-icon">
                <i class="bi bi-geo-alt"></i>
              </div>
              <div>
                <p class="mb-0" style="font-size: 0.8rem; color: var(--dark-light);">Location</p>
                <p class="mb-0 fw-medium" style="color: var(--burgundy);">{{ detailEvent.location }}</p>
              </div>
            </div>

            <div v-if="detailEvent?.pastor" class="d-flex align-items-center gap-3">
              <div class="event-detail-icon">
                <i class="bi bi-person-badge"></i>
              </div>
              <div>
                <p class="mb-0" style="font-size: 0.8rem; color: var(--dark-light);">Pastor</p>
                <p class="mb-0 fw-medium" style="color: var(--burgundy);">{{ detailEvent.pastor }}</p>
              </div>
            </div>

            <template v-if="detailEvent?.volunteers">
              <template v-for="(names, pos) in detailEvent.volunteers" :key="pos">
                <div v-show="names && names.length" class="d-flex align-items-center gap-3">
                  <div class="event-detail-icon">
                    <i :class="posIcon(pos)"></i>
                  </div>
                  <div>
                    <p class="mb-0" style="font-size: 0.8rem; color: var(--dark-light);">{{ pos }}</p>
                    <p class="mb-0 fw-medium" style="color: var(--burgundy);">{{ names.join(", ") }}</p>
                  </div>
                </div>
              </template>
            </template>
            <div v-else-if="detailEvent?.volunteerNames && detailEvent.volunteerNames.length" class="d-flex align-items-center gap-3">
              <div class="event-detail-icon">
                <i class="bi bi-people"></i>
              </div>
              <div>
                <p class="mb-0" style="font-size: 0.8rem; color: var(--dark-light);">Volunteers</p>
                <p class="mb-0 fw-medium" style="color: var(--burgundy);">{{ detailEvent.volunteerNames.join(", ") }}</p>
              </div>
            </div>

            <div v-if="detailEvent?.notes" class="d-flex gap-3 align-items-start">
              <div class="event-detail-icon">
                <i class="bi bi-chat-quote"></i>
              </div>
              <div class="flex-grow-1">
                <p class="mb-0" style="font-size: 0.8rem; color: var(--dark-light);">Notes</p>
                <div class="notes-rich-content" v-html="detailEvent.notes"></div>
              </div>
            </div>
          </div>

          <div class="text-center mt-3">
            <button class="btn btn-church-outline" @click="closeDetailModal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useEventsStore } from "../stores/events";

const eStore = useEventsStore();

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const currentDate = ref(new Date());
const currentMonth = ref(currentDate.value.getMonth());
const currentYear = ref(currentDate.value.getFullYear());
const showDayModal = ref(false);
const selectedDay = ref(null);
const showDetailModal = ref(false);
const detailEvent = ref(null);

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
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
});

const selectedDateFull = computed(() => {
  if (selectedDay.value === null) return "";
  return `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, "0")}-${String(selectedDay.value).padStart(2, "0")}`;
});

const dayEvents = computed(() => {
  if (!selectedDateFull.value) return [];
  return eStore.events.filter((ev) => ev.date === selectedDateFull.value);
});

const sortedUpcoming = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eStore.events
    .filter((ev) => {
      if (!ev.date) return false;
      const d = new Date(ev.date + "T00:00:00");
      return d >= today;
    })
    .slice(0, 20);
});

function currentMonthEvents(day) {
  if (!day) return [];
  const dateStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return eStore.events.filter((ev) => ev.date === dateStr);
}

function isToday(day) {
  if (!day) return false;
  const t = new Date();
  return day === t.getDate() && currentMonth.value === t.getMonth() && currentYear.value === t.getFullYear();
}

function previousMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
  showDayModal.value = false;
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
  showDayModal.value = false;
}

function openDayModal(day) {
  selectedDay.value = day;
  showDayModal.value = true;
}

function openDetailModal(ev) {
  detailEvent.value = ev;
  showDetailModal.value = true;
}

function closeDetailModal() {
  showDetailModal.value = false;
  detailEvent.value = null;
}

function getDayNumber(dateStr) {
  return new Date(dateStr + "T00:00:00").getDate();
}

function getMonthAbbr(dateStr) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[new Date(dateStr + "T00:00:00").getMonth()];
}

function formatTime(t) {
  if (!t) return "-";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 || 12;
  return `${display}:${m} ${ampm}`;
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function posIcon(pos) {
  const icons = {
    Soundman: "bi bi-speaker",
    Multimedia: "bi bi-display",
    Musician: "bi bi-music-note-beamed",
    Streaming: "bi bi-broadcast",
  };
  return icons[pos] || "bi bi-person";
}

onMounted(() => {
  eStore.fetchEvents();
});
</script>

<style scoped>
.col-1-7 {
  width: calc(100% / 7);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(44, 24, 16, 0.5);
  backdrop-filter: blur(6px);
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
  scrollbar-width: thin;
}

.modal-card-md {
  max-width: 540px;
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
  transition: all var(--transition);
  cursor: pointer;
}

.modal-close-btn:hover {
  border-color: var(--burgundy);
  color: var(--burgundy);
  transform: rotate(90deg);
}

.event-detail-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
  background: rgba(201, 168, 76, 0.12);
  color: var(--gold);
  font-size: 0.9rem;
}

.notes-rich-content {
  color: var(--burgundy);
  line-height: 1.6;
  font-size: 0.85rem;
  margin-top: 0.35rem;
}

.notes-rich-content p,
.notes-rich-content ul,
.notes-rich-content ol {
  margin-bottom: 0.5rem;
}

.notes-rich-content ul,
.notes-rich-content ol {
  padding-left: 1.25rem;
}

.cursor-pointer {
  cursor: pointer;
}

@media (max-width: 575.98px) {
  .modal-header-custom {
    padding: 1rem 1.1rem;
  }
}
</style>
