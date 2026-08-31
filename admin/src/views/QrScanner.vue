<template>
  <div>
    <div class="page-header text-center mb-5 animate-fade-in-up">
      <h1 class="display-4 mb-3" style="color: var(--burgundy)">
        <i class="bi bi-qr-code-scan me-2"></i>Scan QR Code
      </h1>
      <p class="lead fs-5 mb-4" style="color: var(--dark-light);">
        Scan attendee QR codes to check in concert attendees
      </p>
    </div>

    <!-- Concert Selector -->
    <div class="church-card mb-4 animate-fade-in-up">
      <div class="card-body">
        <div class="row g-3 align-items-end">
          <div class="col-md-6">
            <label class="form-label d-flex align-items-center gap-2">
              <i class="bi bi-ticket-perforated" style="color: var(--gold);"></i>Select Concert
            </label>
            <select class="form-select" v-model="selectedConcertId" @change="onConcertChange">
              <option value="">Select a concert...</option>
              <option v-for="event in concertEvents" :key="event.id" :value="event.concertId">
                {{ event.name }} ({{ event.concertId }}) - {{ formatDate(event.date) }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label d-flex align-items-center gap-2">
              <i class="bi bi-people" style="color: var(--gold);"></i>Expected Attendees
            </label>
            <input type="text" class="form-control" :value="expectedCount" readonly style="background: var(--cream-light);" />
          </div>
          <div class="col-md-3">
            <label class="form-label d-flex align-items-center gap-2">
              <i class="bi bi-check-circle" style="color: var(--gold);"></i>Checked In
            </label>
            <input type="text" class="form-control" :value="checkedInCount" readonly style="background: var(--cream-light);" />
          </div>
        </div>
      </div>
    </div>

    <template v-if="selectedConcertId">
      <!-- Scanner Area -->
      <div class="church-card mb-4 animate-fade-in-up">
        <div class="card-body text-center">
          <div v-if="!scanning" class="py-5">
            <div class="d-inline-block position-relative mb-4">
              <div class="rounded-3 d-flex align-items-center justify-content-center"
                style="width: 200px; height: 200px; background: linear-gradient(135deg, var(--gold-light) 0%, var(--cream) 100%); border: 3px dashed var(--gold);">
                <i class="bi bi-qr-code" style="color: var(--burgundy); font-size: 4rem;"></i>
              </div>
              <div class="position-absolute top-0 start-0 w-100 h-100" style="border: 2px solid var(--gold); border-radius: var(--radius-md);">
                <div class="position-absolute" style="top: -2px; left: -2px; width: 20px; height: 20px; border-top: 4px solid var(--gold); border-left: 4px solid var(--gold); border-radius: var(--radius-sm) 0 0 0;"></div>
                <div class="position-absolute" style="top: -2px; right: -2px; width: 20px; height: 20px; border-top: 4px solid var(--gold); border-right: 4px solid var(--gold); border-radius: 0 var(--radius-sm) 0 0;"></div>
                <div class="position-absolute" style="bottom: -2px; left: -2px; width: 20px; height: 20px; border-bottom: 4px solid var(--gold); border-left: 4px solid var(--gold); border-radius: 0 0 0 var(--radius-sm);"></div>
                <div class="position-absolute" style="bottom: -2px; right: -2px; width: 20px; height: 20px; border-bottom: 4px solid var(--gold); border-right: 4px solid var(--gold); border-radius: 0 0 var(--radius-sm) 0;"></div>
              </div>
            </div>
            <h5 style="color: var(--burgundy);">Ready to Scan</h5>
            <p class="text-muted mb-4">Click "Start Scanner" to begin checking in attendees</p>
            <div class="d-flex gap-2 justify-content-center">
              <button class="btn btn-church-primary btn-lg px-5" @click="startScanner" :disabled="scanning || !hasCameraPermission">
                <i class="bi bi-camera-video me-2"></i>Start Scanner
              </button>
              <button class="btn btn-church-outline btn-lg" @click="requestCameraPermission" v-if="!hasCameraPermission">
                <i class="bi bi-camera-video-off me-2"></i>Enable Camera
              </button>
            </div>
            <p v-if="cameraError" class="text-danger small mt-2">{{ cameraError }}</p>
          </div>

          <div v-else class="py-3">
            <div id="qr-reader" class="d-inline-block"></div>
            <div class="mt-3">
              <button class="btn btn-church-outline" @click="stopScanner">
                <i class="bi bi-stop-circle me-2"></i>Stop Scanner
              </button>
            </div>
            <p class="text-muted small mt-2">Point camera at attendee's QR code</p>
          </div>
        </div>
      </div>

      <!-- Manual Entry Fallback -->
      <div class="church-card mb-4 animate-fade-in-up">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h6 class="mb-0" style="color: var(--burgundy);">Manual Entry</h6>
          <button class="btn btn-church-ghost btn-sm" @click="showManualEntry = !showManualEntry">
            <i :class="showManualEntry ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
          </button>
        </div>
        <div class="card-body" v-show="showManualEntry">
          <div class="row g-3">
            <div class="col-md-8">
              <label class="form-label">QR Code Data</label>
              <input type="text" class="form-control" v-model="manualQrData" placeholder="Paste or type QR code data (e.g., CHR2024-001_UID_TIMESTAMP_RANDOM)" />
            </div>
            <div class="col-md-4 d-flex align-items-end">
              <button class="btn btn-church-primary w-100" @click="processManualEntry" :disabled="!manualQrData.trim() || processingManual">
                <i class="bi bi-search me-2"></i>{{ processingManual ? 'Processing...' : 'Check In' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Scan Result Modal -->
      <div class="modal-overlay" v-if="showResultModal" @click.self="closeResultModal">
        <div class="church-card modal-card animate-fade-in-up" :class="scanResult.type === 'success' ? 'border-success' : 'border-danger'">
          <div class="modal-header-custom" :style="scanResult.type === 'success' ? 'background: rgba(40, 167, 69, 0.1); border-bottom-color: rgba(40, 167, 69, 0.2);' : 'background: rgba(114, 47, 55, 0.1); border-bottom-color: rgba(114, 47, 55, 0.2);'">
            <div class="d-flex align-items-center gap-3">
              <div class="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                :style="scanResult.type === 'success' ? 'background: rgba(40, 167, 69, 0.15);' : 'background: rgba(114, 47, 55, 0.15);'">
                <i :class="scanResult.type === 'success' ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'"
                  :style="scanResult.type === 'success' ? 'color: #28a745; font-size: 1.5rem;' : 'color: var(--burgundy); font-size: 1.5rem;'"></i>
              </div>
              <div>
                <h5 class="mb-0" :style="scanResult.type === 'success' ? 'color: #28a745;' : 'color: var(--burgundy);'">
                  {{ scanResult.type === 'success' ? 'Check-In Successful' : 'Check-In Failed' }}
                </h5>
                <p class="mb-0" style="font-size: 0.8rem; color: var(--dark-light);">
                  {{ scanResult.message }}
                </p>
              </div>
            </div>
            <button class="modal-close-btn" @click="closeResultModal" type="button" aria-label="Close">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="p-4" v-if="scanResult.registration">
            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label text-muted small">Name</label>
                <p class="fw-medium mb-0">{{ scanResult.registration.fullName }}</p>
              </div>
              <div class="col-md-6">
                <label class="form-label text-muted small">Email</label>
                <p class="fw-medium mb-0">{{ scanResult.registration.email }}</p>
              </div>
              <div class="col-md-6">
                <label class="form-label text-muted small">Phone</label>
                <p class="fw-medium mb-0">{{ scanResult.registration.phone }}</p>
              </div>
              <div class="col-md-6">
                <label class="form-label text-muted small">Attendees</label>
                <p class="fw-medium mb-0">{{ scanResult.registration.totalAttendance }}</p>
              </div>
              <div class="col-md-6">
                <label class="form-label text-muted small">Concert</label>
                <p class="fw-medium mb-0">{{ scanResult.registration.concertName }}</p>
              </div>
              <div class="col-md-6">
                <label class="form-label text-muted small">Status</label>
                <span :class="scanResult.registration.checkedIn ? 'badge bg-success' : 'badge bg-warning'">
                  {{ scanResult.registration.checkedIn ? 'Already Checked In' : 'Checked In Now' }}
                </span>
              </div>
            </div>
            <div class="text-center">
              <button class="btn btn-church-primary" @click="closeResultModal">
                <i class="bi bi-check-lg me-2"></i>Continue Scanning
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Scans -->
      <div class="church-card animate-fade-in-up">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h6 class="mb-0" style="color: var(--burgundy);">Recent Scans</h6>
          <button class="btn btn-church-ghost btn-sm" @click="clearHistory">
            <i class="bi bi-trash me-1"></i>Clear
          </button>
        </div>
        <div class="card-body p-0">
          <div v-if="scanHistory.length === 0" class="text-center py-4">
            <i class="bi bi-clock-history fs-1" style="color: var(--gold); opacity: 0.3;"></i>
            <p class="mt-2 mb-0 text-muted">No scans yet</p>
          </div>
          <div v-else class="table-responsive">
            <table class="table table-hover mb-0">
              <thead>
                <tr style="background: linear-gradient(135deg, rgba(245, 240, 232, 0.6) 0%, rgba(232, 220, 200, 0.3) 100%);">
                  <th class="ps-3">Time</th>
                  <th>Name</th>
                  <th>Concert</th>
                  <th>Attendees</th>
                  <th>Status</th>
                  <th class="pe-3">Method</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="scan in scanHistory" :key="scan.id">
                  <td class="ps-3 small">{{ scan.timestamp }}</td>
                  <td>{{ scan.registration.fullName }}</td>
                  <td class="small">{{ scan.registration.concertName }}</td>
                  <td class="text-center">
                    <span class="badge bg-light text-dark">{{ scan.registration.totalAttendance }}</span>
                  </td>
                  <td>
                    <span :class="scan.success ? 'badge bg-success' : 'badge bg-danger'">
                      <i :class="scan.success ? 'bi bi-check-circle me-1' : 'bi bi-x-circle me-1'"></i>
                      {{ scan.success ? 'Success' : 'Failed' }}
                    </span>
                  </td>
                  <td class="pe-3 small">
                    <span class="badge" :style="scan.method === 'camera' ? 'background: var(--gold-light); color: var(--burgundy);' : 'background: var(--cream-light); color: var(--dark-light);'">
                      {{ scan.method === 'camera' ? 'Camera' : 'Manual' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="church-card text-center py-5 animate-fade-in-up">
      <i class="bi bi-arrow-up-circle fs-1" style="color: var(--gold); opacity: 0.5;"></i>
      <h4 class="mt-3 mb-2" style="color: var(--burgundy);">Select a Concert</h4>
      <p style="color: var(--dark-light);">Choose a concert from the dropdown above to start scanning attendee QR codes.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { useRegistrationsStore } from "../stores/registrations";
import { useEventsStore } from "../stores/events";
import { useUserStore } from "../stores/user";
import { Html5Qrcode } from "html5-qrcode";

const userStore = useUserStore();
const regStore = useRegistrationsStore();
const eStore = useEventsStore();

/* ---------- State ---------- */
const selectedConcertId = ref("");
const scanning = ref(false);
const hasCameraPermission = ref(false);
const cameraError = ref("");
const showManualEntry = ref(false);
const manualQrData = ref("");
const processingManual = ref(false);
const showResultModal = ref(false);
const scanResult = ref({ type: "", message: "", registration: null });
const scanHistory = ref([]);
let html5Qrcode = null;

/* ---------- Computed ---------- */
const concertEvents = computed(() => {
  return eStore.events
    .filter((ev) => ev.type === "concert" && ev.concertId && ev.isOpenRegistration)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
});

const concertRegistrations = computed(() => {
  if (!selectedConcertId.value) return [];
  return regStore.registrations.filter((r) => r.concertId === selectedConcertId.value);
});

const expectedCount = computed(() => {
  return concertRegistrations.value.reduce((sum, r) => sum + (r.totalAttendance || 0), 0);
});

const checkedInCount = computed(() => {
  return concertRegistrations.value.filter((r) => r.checkedIn).reduce((sum, r) => sum + (r.totalAttendance || 0), 0);
});

/* ---------- Helpers ---------- */
function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

async function requestCameraPermission() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    stream.getTracks().forEach(track => track.stop());
    hasCameraPermission.value = true;
    cameraError.value = "";
  } catch (err) {
    cameraError.value = "Camera access denied. Please allow camera permission in browser settings.";
    hasCameraPermission.value = false;
  }
}

async function startScanner() {
  if (!hasCameraPermission.value) {
    await requestCameraPermission();
    if (!hasCameraPermission.value) return;
  }

  // Set scanning to true first so the element renders
  scanning.value = true;
  
  // Wait for element to be rendered in DOM
  await nextTick();
  
  let retries = 0;
  const maxRetries = 20;
  while (!document.getElementById("qr-reader") && retries < maxRetries) {
    await new Promise(resolve => setTimeout(resolve, 50));
    retries++;
  }
  
  if (!document.getElementById("qr-reader")) {
    cameraError.value = "Scanner element not found. Please try again.";
    scanning.value = false;
    return;
  }
  
  html5Qrcode = new Html5Qrcode("qr-reader");
  
  try {
    await html5Qrcode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      onScanSuccess,
      onScanError
    );
    cameraError.value = "";
  } catch (err) {
    cameraError.value = "Failed to start scanner: " + err.message;
    scanning.value = false;
  }
}

function onScanSuccess(decodedText, decodedResult) {
  if (processingManual.value) return;
  processQrCode(decodedText, "camera");
}

function onScanError(err) {
  // Ignore scan errors (no QR code found)
}

async function stopScanner() {
  if (html5Qrcode && scanning.value) {
    try {
      await html5Qrcode.stop();
    } catch (err) {
      console.warn("Error stopping scanner:", err);
    }
    scanning.value = false;
    html5Qrcode = null;
  }
}

async function processQrCode(qrData, method) {
  // Validate QR code format: ConcertID_UID_TIMESTAMP_RANDOM
  const parts = qrData.split("_");
  if (parts.length < 4) {
    showResult("error", "Invalid QR code format. Expected: ConcertID_UID_TIMESTAMP_RANDOM", null);
    return;
  }

  // Concert ID can contain underscores, so it's everything except the last 3 parts (UID, TIMESTAMP, RANDOM)
  const concertId = parts.slice(0, -3).join("_");
  
  // Verify it matches selected concert
  if (concertId !== selectedConcertId.value) {
    showResult("error", `QR code is for concert "${concertId}", but you're scanning for "${selectedConcertId.value}"`, null);
    return;
  }

  // Find registration
  const registration = regStore.registrations.find(r => r.qrCodeData === qrData);
  
  if (!registration) {
    showResult("error", "Registration not found for this QR code", null);
    return;
  }

  // Verify it's for the selected concert
  if (registration.concertId !== selectedConcertId.value) {
    showResult("error", "This QR code doesn't match the selected concert", null);
    return;
  }

  const wasCheckedIn = registration.checkedIn;
  
  // Always update check-in time on every scan
  try {
    await regStore.updateRegistration(registration.id, { 
      checkedIn: true, 
      checkedInAt: new Date().toISOString() 
    });
    // Update local store
    const idx = regStore.registrations.findIndex(r => r.id === registration.id);
    if (idx !== -1) {
      regStore.registrations[idx].checkedIn = true;
      regStore.registrations[idx].checkedInAt = new Date().toISOString();
      // Update the registration object for the modal
      registration.checkedIn = true;
      registration.checkedInAt = new Date().toISOString();
    }
  } catch (err) {
    showResult("error", "Failed to update check-in status: " + err.message, registration);
    return;
  }

  showResult("success", wasCheckedIn ? "Re-checked in (time updated)" : "Checked in successfully", registration);
  
  // Add to history
  scanHistory.value.unshift({
    id: Date.now(),
    timestamp: formatTime(),
    registration,
    success: true,
    method
  });
  
  // Keep only last 50
  if (scanHistory.value.length > 50) scanHistory.value.pop();
}

async function processManualEntry() {
  if (!manualQrData.value.trim() || processingManual.value) return;
  
  processingManual.value = true;
  const qrData = manualQrData.value.trim();
  manualQrData.value = "";
  
  await processQrCode(qrData, "manual");
  processingManual.value = false;
}

function showResult(type, message, registration) {
  scanResult.value = { type, message, registration };
  showResultModal.value = true;
}

function closeResultModal() {
  showResultModal.value = false;
  scanResult.value = { type: "", message: "", registration: null };
}

function onConcertChange() {
  stopScanner();
  scanHistory.value = [];
  manualQrData.value = "";
}

function clearHistory() {
  scanHistory.value = [];
}

/* ---------- Lifecycle ---------- */
onMounted(async () => {
  regStore.fetchRegistrations();
  eStore.fetchEvents();
  await requestCameraPermission();
});

onUnmounted(() => {
  stopScanner();
});
</script>

<style scoped>
/* Modal styles */
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
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  border: 2px solid rgba(201, 168, 76, 0.25);
  scrollbar-width: thin;
}

.modal-card.border-success {
  border-color: #28a745;
}

.modal-card.border-danger {
  border-color: var(--burgundy);
}

.modal-header-custom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
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

/* Scanner styling */
#qr-reader {
  width: 100%;
  max-width: 400px;
}

#qr-reader > div {
  width: 100% !important;
}

#qr-reader video {
  width: 100% !important;
  border-radius: var(--radius-md);
  border: 2px solid var(--gold);
}

@media (max-width: 575.98px) {
  .modal-header-custom {
    padding: 1rem 1.1rem;
  }
  
  #qr-reader {
    max-width: 100%;
  }
}
</style>