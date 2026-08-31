<template>
  <div>
    <!-- Concert Events List (when no concertId in route) -->
    <div v-if="!concertId">
      <div class="page-header text-center mb-5 animate-fade-in-up">
        <h1 class="display-4 mb-3" style="color: var(--burgundy)">
          <i class="bi bi-ticket-perforated me-2"></i>Concert Registration
        </h1>
        <p class="lead fs-5 mb-4" style="color: var(--dark-light);">
          Register for upcoming concerts
        </p>
      </div>

      <!-- Loading -->
      <div v-if="eStore.loading" class="text-center py-5">
        <div class="spinner-border" style="color: var(--gold);" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <template v-else>
        <!-- Concert Events List -->
        <div v-if="concertEvents.length === 0" class="church-card text-center py-5 animate-fade-in-up">
          <i class="bi bi-music-note-list fs-1" style="color: var(--gold); opacity: 0.3;"></i>
          <h4 class="mt-3 mb-2" style="color: var(--burgundy);">No Concerts Available</h4>
          <p style="color: var(--dark-light);">There are no upcoming concerts open for registration at this time.</p>
        </div>

        <div v-else class="row g-4">
          <div class="col-md-6 col-lg-4" v-for="event in concertEvents" :key="event.id">
            <div class="church-card h-100 animate-fade-in-up d-flex flex-column">
              <div class="card-body d-flex flex-column">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <span class="badge" style="background: var(--gold-light); color: var(--burgundy); font-size: 0.75rem;">
                    CONCERT
                  </span>
                  <span v-if="event.capacity" class="badge bg-light text-dark" style="font-size: 0.7rem;">
                    Capacity: {{ event.capacity }}
                  </span>
                </div>

                <h5 class="mb-2" style="color: var(--burgundy); font-family: var(--font-heading);">
                  {{ event.name }}
                </h5>

                <div class="d-flex flex-column gap-2 mb-3" style="font-size: 0.85rem; color: var(--dark-light);">
                  <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-calendar3" style="color: var(--gold); width: 16px;"></i>
                    <span>{{ formatDateDisplay(event.date) }}</span>
                  </div>
                  <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-clock" style="color: var(--gold); width: 16px;"></i>
                    <span>{{ formatTime(event.time) }}</span>
                  </div>
                  <div class="d-flex align-items-center gap-2" v-if="event.location">
                    <i class="bi bi-geo-alt" style="color: var(--gold); width: 16px;"></i>
                    <span>{{ event.location }}</span>
                  </div>
                </div>

                <p v-if="event.notes" class="mb-3 text-muted small" style="font-style: italic; flex-grow: 1;">
                  {{ event.notes }}
                </p>

                <div v-if="event.isOpenRegistration" class="mt-auto">
                  <router-link
                    :to="{ name: 'registration-detail', params: { concertId: event.concertId } }"
                    class="btn btn-church-primary w-100"
                  >
                    <i class="bi bi-ticket-perforated me-2"></i>Register Now
                  </router-link>
                </div>
                <div v-else class="mt-auto text-center text-muted small">
                  <i class="bi bi-lock me-1"></i>Registration not open
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Registration Form (when concertId in route) -->
    <div v-else class="animate-fade-in-up">
      <div v-if="eStore.loading" class="text-center py-5">
        <div class="spinner-border" style="color: var(--gold);" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="!concertEvent" class="church-card text-center py-5">
        <i class="bi bi-exclamation-triangle fs-1" style="color: var(--burgundy); opacity: 0.5;"></i>
        <h4 class="mt-3 mb-2" style="color: var(--burgundy);">Concert Not Found</h4>
        <p style="color: var(--dark-light);">The concert you're looking for doesn't exist or registration is closed.</p>
        <router-link to="/registration" class="btn btn-church-outline mt-3">
          <i class="bi bi-arrow-left me-2"></i>Back to Concerts
        </router-link>
      </div>

      <div v-else class="church-card animate-fade-in-up">
        <div class="card-header d-flex justify-content-between align-items-center"
          style="background: linear-gradient(135deg, rgba(245, 240, 232, 0.6) 0%, rgba(232, 220, 200, 0.3) 100%); border-bottom: 2px solid rgba(201, 168, 76, 0.2);">
          <div class="d-flex align-items-center gap-3">
            <div class="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
              style="width: 44px; height: 44px; background: linear-gradient(135deg, var(--gold-light) 0%, var(--cream) 100%);">
              <i class="bi bi-ticket-perforated" style="color: var(--burgundy); font-size: 1.25rem;"></i>
            </div>
            <div>
              <h5 class="mb-0" style="color: var(--burgundy); font-family: var(--font-heading);">
                Concert Registration
              </h5>
              <p class="mb-0" style="font-size: 0.8rem; color: var(--dark-light);">
                {{ concertEvent.name }}
              </p>
            </div>
          </div>
          <router-link to="/registration" class="btn btn-church-ghost btn-sm">
            <i class="bi bi-arrow-left me-1"></i>Back
          </router-link>
        </div>

        <div class="card-body p-4 p-lg-5">
          <div class="row g-4 mb-4">
            <div class="col-md-6">
              <h6 class="mb-3" style="color: var(--burgundy);">Event Details</h6>
              <div class="d-flex flex-column gap-2" style="font-size: 0.9rem; color: var(--dark-light);">
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-calendar3" style="color: var(--gold); width: 18px;"></i>
                  <span>{{ formatDateDisplay(concertEvent.date) }}</span>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-clock" style="color: var(--gold); width: 18px;"></i>
                  <span>{{ formatTime(concertEvent.time) }}</span>
                </div>
                <div class="d-flex align-items-center gap-2" v-if="concertEvent.location">
                  <i class="bi bi-geo-alt" style="color: var(--gold); width: 18px;"></i>
                  <span>{{ concertEvent.location }}</span>
                </div>
                <div class="d-flex align-items-center gap-2" v-if="concertEvent.capacity">
                  <i class="bi bi-people" style="color: var(--gold); width: 18px;"></i>
                  <span>Capacity: {{ concertEvent.capacity }}</span>
                </div>
                <div class="d-flex align-items-center gap-2" v-if="concertEvent.concertId">
                  <i class="bi bi-ticket-perforated" style="color: var(--gold); width: 18px;"></i>
                  <span>Concert ID: {{ concertEvent.concertId }}</span>
                </div>
              </div>
              <p v-if="concertEvent.notes" class="mt-3 text-muted small" style="font-style: italic;">
                {{ concertEvent.notes }}
              </p>
            </div>
            <div class="col-md-6">
              <h6 class="mb-3" style="color: var(--burgundy);">Registration Form</h6>

              <div v-if="registrationError" class="alert d-flex align-items-center gap-2 mb-4 py-2 px-3"
                style="background: rgba(114, 47, 55, 0.08); border: 1px solid rgba(114, 47, 55, 0.2); color: var(--burgundy); border-radius: var(--radius-sm); font-size: 0.9rem;">
                <i class="bi bi-exclamation-circle"></i>
                {{ registrationError }}
              </div>

              <div v-if="registrationSuccess" class="mb-4">
                <div class="alert d-flex align-items-center gap-2 mb-3 py-2 px-3"
                  style="background: rgba(40, 167, 69, 0.08); border: 1px solid rgba(40, 167, 69, 0.2); color: #28a745; border-radius: var(--radius-sm); font-size: 0.9rem;">
                  <i class="bi bi-check-circle-fill"></i>
                  Registration successful! We'll send a confirmation to your email.
                </div>
                
                <div class="church-card p-4 text-center" style="background: var(--white);">
                  <h6 class="mb-3" style="color: var(--burgundy);">Your QR Code Ticket</h6>
                  <p class="text-muted small mb-3">Save this QR code for entry. Format: ConcertID_UID_TIMESTAMP_RANDOM</p>
                  <div class="d-inline-block p-3 bg-white rounded" style="border: 1px solid rgba(201, 168, 76, 0.2);">
                    <QRCode :value="qrCodeData" :size="200" level="M" />
                  </div>
                  <div class="mt-3 font-monospace small" style="color: var(--dark-light); word-break: break-all;">
                    {{ qrCodeData }}
                  </div>
                  <div class="mt-3 d-flex gap-2 justify-content-center">
                    <button class="btn btn-church-primary btn-sm" @click="downloadQrCode">
                      <i class="bi bi-download me-1"></i>Download QR Code
                    </button>
                    <router-link to="/registration" class="btn btn-church-outline btn-sm">
                      <i class="bi bi-arrow-left me-1"></i>Back to Concerts
                    </router-link>
                  </div>
                </div>
              </div>

              <form @submit.prevent="handleRegistration" v-if="!registrationSuccess">
                <div class="mb-3">
                  <label class="form-label d-flex align-items-center gap-2">
                    <i class="bi bi-person" style="color: var(--gold);"></i>Full Name
                  </label>
                  <input type="text" class="form-control" v-model="regForm.fullName" placeholder="Enter your full name" required />
                </div>

                <div class="mb-3">
                  <label class="form-label d-flex align-items-center gap-2">
                    <i class="bi bi-envelope" style="color: var(--gold);"></i>Email Address
                  </label>
                  <input type="email" class="form-control" v-model="regForm.email" placeholder="Enter your email" required />
                </div>

                <div class="mb-3">
                  <label class="form-label d-flex align-items-center gap-2">
                    <i class="bi bi-phone" style="color: var(--gold);"></i>Phone Number
                  </label>
                  <input type="tel" class="form-control" v-model="regForm.phone" placeholder="Enter your phone number" required />
                </div>

                <div class="mb-3">
                  <label class="form-label d-flex align-items-center gap-2">
                    <i class="bi bi-people" style="color: var(--gold);"></i>Total Attendance
                  </label>
                  <div class="input-group">
                    <button type="button" class="btn btn-church-outline" @click="decreaseAttendance" :disabled="regForm.totalAttendance <= 1" style="border-radius: var(--radius-sm) 0 0 var(--radius-sm);">
                      <i class="bi bi-dash"></i>
                    </button>
                    <input type="number" class="form-control text-center" v-model.number="regForm.totalAttendance" min="1" max="3" :readonly="true" style="border-radius: 0;" />
                    <button type="button" class="btn btn-church-outline" @click="increaseAttendance" :disabled="regForm.totalAttendance >= 3" style="border-radius: 0 var(--radius-sm) var(--radius-sm) 0;">
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                  <div class="form-text">Maximum 3 attendees per registration</div>
                </div>

                <div class="d-flex gap-2 pt-2">
                  <button type="submit" class="btn btn-church-primary flex-fill" :disabled="registering">
                    <span v-if="registering">
                      <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                      Registering...
                    </span>
                    <span v-else>
                      <i class="bi bi-check-lg me-2"></i>Confirm Registration
                    </span>
                  </button>
                  <router-link to="/registration" class="btn btn-church-outline" :disabled="registering">
                    Cancel
                  </router-link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEventsStore } from "../stores/events";
import { useUserStore } from "../stores/user";
import QRCode from "qrcode.vue";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const userStore = useUserStore();
const eStore = useEventsStore();
const route = useRoute();
const router = useRouter();

/* ---------- State ---------- */
const registering = ref(false);
const registrationError = ref("");
const registrationSuccess = ref(false);
const qrCodeData = ref("");

const regForm = ref({
  fullName: "",
  email: "",
  phone: "",
  totalAttendance: 1,
});

/* ---------- Computed ---------- */
const concertId = computed(() => route.params.concertId);

const concertEvents = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eStore.events
    .filter((ev) => {
      if (ev.type !== "concert") return false;
      if (!ev.isOpenRegistration) return false;
      if (!ev.date) return false;
      if (!ev.concertId) return false;
      const d = new Date(ev.date + "T00:00:00");
      return d >= today;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));
});

const concertEvent = computed(() => {
  if (!concertId.value) return null;
  return eStore.events.find((ev) => ev.concertId === concertId.value && ev.type === "concert" && ev.isOpenRegistration);
});

/* ---------- Watchers ---------- */
watch(concertId, (newId) => {
  registrationError.value = "";
  registrationSuccess.value = false;
  qrCodeData.value = "";
  regForm.value = {
    fullName: "",
    email: "",
    phone: "",
    totalAttendance: 1,
  };
}, { immediate: true });

/* ---------- Helpers ---------- */
function formatDateDisplay(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function formatTime(t) {
  if (!t) return "—";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 || 12;
  return `${display}:${m} ${ampm}`;
}

function increaseAttendance() {
  if (regForm.value.totalAttendance < 3) {
    regForm.value.totalAttendance++;
  }
}

function decreaseAttendance() {
  if (regForm.value.totalAttendance > 1) {
    regForm.value.totalAttendance--;
  }
}

function generateRandomString(length = 4) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateQrCodeData() {
  const concert = concertEvent.value;
  const user = userStore.user;
  const timestamp = Date.now();
  const random = generateRandomString(4);
  const uid = user?.uid || "GUEST";
  const cId = concert?.concertId || "UNKNOWN";
  return `${cId}_${uid}_${timestamp}_${random}`;
}

function downloadQrCode() {
  const canvas = document.querySelector("canvas");
  if (canvas) {
    const link = document.createElement("a");
    link.download = `ticket-${qrCodeData.value}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }
}

async function handleRegistration() {
  registering.value = true;
  registrationError.value = "";

  // Basic validation
  if (!regForm.value.fullName.trim()) {
    registrationError.value = "Full name is required.";
    registering.value = false;
    return;
  }
  if (!regForm.value.email.trim() || !regForm.value.email.includes("@")) {
    registrationError.value = "Valid email is required.";
    registering.value = false;
    return;
  }
  if (!regForm.value.phone.trim()) {
    registrationError.value = "Phone number is required.";
    registering.value = false;
    return;
  }
  if (regForm.value.totalAttendance < 1 || regForm.value.totalAttendance > 3) {
    registrationError.value = "Total attendance must be between 1 and 3.";
    registering.value = false;
    return;
  }

  try {
    // Generate QR code data
    const qrData = generateQrCodeData();
    qrCodeData.value = qrData;

    // Save registration to Firestore
    const concert = concertEvent.value;
    const user = userStore.user;
    
    await addDoc(collection(db, "registrations"), {
      concertId: concert?.concertId || "",
      concertName: concert?.name || "",
      concertDate: concert?.date || "",
      concertTime: concert?.time || "",
      concertLocation: concert?.location || "",
      fullName: regForm.value.fullName.trim(),
      email: regForm.value.email.trim(),
      phone: regForm.value.phone.trim(),
      totalAttendance: regForm.value.totalAttendance,
      qrCodeData: qrData,
      userId: user?.uid || null,
      userEmail: user?.email || null,
      createdAt: serverTimestamp(),
    });

    registrationSuccess.value = true;
    
    // Optionally redirect back to list after a delay
    setTimeout(() => {
      router.push("/registration");
    }, 5000);
  } catch (err) {
    registrationError.value = err.message || "Registration failed. Please try again.";
  } finally {
    registering.value = false;
  }
}

onMounted(() => {
  eStore.fetchEvents();
});
</script>

<style scoped>
.input-group button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.card-header {
  border-radius: calc(var(--radius-md) - 1px) calc(var(--radius-md) - 1px) 0 0 !important;
}
</style>