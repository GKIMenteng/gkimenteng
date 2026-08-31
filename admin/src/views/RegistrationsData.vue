<template>
  <div>
    <div class="page-header text-center mb-5 animate-fade-in-up">
      <h1 class="display-4 mb-3" style="color: var(--burgundy)">
        <i class="bi bi-ticket-perforated me-2"></i>Concert Registrations
      </h1>
      <p class="lead fs-5 mb-4" style="color: var(--dark-light);">
        Manage concert registration data
      </p>
    </div>

    <!-- Loading -->
    <div v-if="regStore.loading" class="text-center py-5">
      <div class="spinner-border" style="color: var(--gold);" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <template v-else>
      <!-- Filter by Concert -->
      <div class="church-card mb-4 animate-fade-in-up">
        <div class="card-body">
          <div class="row g-3 align-items-end">
            <div class="col-md-6">
              <label class="form-label d-flex align-items-center gap-2">
                <i class="bi bi-filter" style="color: var(--gold);"></i>Filter by Concert
              </label>
              <select class="form-select" v-model="selectedConcertId" @change="filterRegistrations">
                <option value="">All Concerts</option>
                <option v-for="event in concertEvents" :key="event.id" :value="event.concertId">
                  {{ event.name }} ({{ event.concertId }})
                </option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label d-flex align-items-center gap-2">
                <i class="bi bi-calendar" style="color: var(--gold);"></i>Date Range
              </label>
              <select class="form-select" v-model="dateRange" @change="filterRegistrations">
                <option value="">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div class="col-md-3">
              <button class="btn btn-church-outline w-100" @click="exportAllToPdf" :disabled="filteredRegistrations.length === 0">
                <i class="bi bi-file-pdf me-2"></i>Export All to PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row g-3 mb-4">
        <div class="col-md-3">
          <div class="church-card text-center p-3 animate-fade-in-up">
            <div class="fs-2 fw-bold" style="color: var(--gold);">{{ filteredRegistrations.length }}</div>
            <div class="text-muted small">Total Registrations</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="church-card text-center p-3 animate-fade-in-up">
            <div class="fs-2 fw-bold" style="color: var(--burgundy);">{{ totalAttendees }}</div>
            <div class="text-muted small">Total Attendees</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="church-card text-center p-3 animate-fade-in-up">
            <div class="fs-2 fw-bold" style="color: var(--gold-dark);">{{ uniqueEmails }}</div>
            <div class="text-muted small">Unique Registrants</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="church-card text-center p-3 animate-fade-in-up">
            <div class="fs-2 fw-bold" style="color: var(--dark-light);">{{ uniqueConcerts }}</div>
            <div class="text-muted small">Concerts</div>
          </div>
        </div>
      </div>

      <!-- Registrations Table -->
      <div class="church-card animate-fade-in-up">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead>
                <tr style="background: linear-gradient(135deg, rgba(245, 240, 232, 0.6) 0%, rgba(232, 220, 200, 0.3) 100%);">
                  <th class="ps-3">#</th>
                  <th>Concert</th>
                  <th>Registrant</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Attendees</th>
                  <th>Registered</th>
                  <th>User</th>
                  <th class="pe-3 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredRegistrations.length === 0">
                  <td colspan="9" class="text-center py-5">
                    <i class="bi bi-inbox fs-1" style="color: var(--gold); opacity: 0.3;"></i>
                    <p class="mt-2 mb-0" style="color: var(--dark-light);">No registrations found</p>
                  </td>
                </tr>
                <tr v-for="(reg, index) in filteredRegistrations" :key="reg.id">
                  <td class="ps-3">{{ index + 1 }}</td>
                  <td>
                    <div class="fw-medium" style="color: var(--burgundy);">{{ reg.concertName }}</div>
                    <small class="text-muted">{{ reg.concertId }}</small>
                  </td>
                  <td>{{ reg.fullName }}</td>
                  <td>{{ reg.email }}</td>
                  <td>{{ reg.phone }}</td>
                  <td>
                    <span class="badge bg-light text-dark">{{ reg.totalAttendance }}</span>
                  </td>
                  <td class="small">{{ formatDateTime(reg.createdAt) }}</td>
                  <td>
                    <span v-if="reg.userId" class="badge" style="background: var(--gold-light); color: var(--burgundy);">
                      <i class="bi bi-person-check me-1"></i>Logged In
                    </span>
                    <span v-else class="badge bg-light text-dark">
                      <i class="bi bi-person me-1"></i>Guest
                    </span>
                  </td>
                  <td class="pe-3">
                    <div class="d-flex gap-1 justify-content-end">
                      <button class="btn btn-church-ghost btn-sm py-1" @click="viewQrCode(reg)" title="View QR Code">
                        <i class="bi bi-qr-code"></i>
                      </button>
                      <button class="btn btn-church-ghost btn-sm py-1" @click="downloadSinglePdf(reg)" title="Download PDF">
                        <i class="bi bi-file-pdf"></i>
                      </button>
                      <button class="btn btn-church-ghost btn-sm py-1" @click="resendEmail(reg)" title="Resend Email" :disabled="resending === reg.id">
                        <i class="bi bi-send" v-if="resending !== reg.id"></i>
                        <span class="spinner-border spinner-border-sm" v-else role="status"></span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>
  </div>

  <!-- QR Code Modal -->
  <div class="modal-overlay" v-if="showQrModal" @click.self="closeQrModal">
    <div class="church-card modal-card animate-fade-in-up">
      <div class="modal-header-custom">
        <div class="d-flex align-items-center gap-3">
          <div class="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
            style="width: 44px; height: 44px; background: linear-gradient(135deg, var(--gold-light) 0%, var(--cream) 100%);">
            <i class="bi bi-qr-code" style="color: var(--burgundy); font-size: 1.25rem;"></i>
          </div>
          <div>
            <h5 class="mb-0" style="color: var(--burgundy); font-family: var(--font-heading);">QR Code Ticket</h5>
            <p class="mb-0" style="font-size: 0.8rem; color: var(--dark-light);">{{ selectedRegistration?.fullName }} - {{ selectedRegistration?.concertName }}</p>
          </div>
        </div>
        <button class="modal-close-btn" @click="closeQrModal" type="button" aria-label="Close">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <div class="p-4 text-center">
        <div class="d-inline-block p-3 bg-white rounded mb-3" style="border: 1px solid rgba(201, 168, 76, 0.2);">
          <QRCode :value="selectedRegistration?.qrCodeData" :size="200" level="M" />
        </div>
        <div class="font-monospace small mb-3" style="color: var(--dark-light); word-break: break-all;">
          {{ selectedRegistration?.qrCodeData }}
        </div>
        <div class="d-flex gap-2 justify-content-center">
          <button class="btn btn-church-primary btn-sm" @click="downloadQrImage">
            <i class="bi bi-download me-1"></i>Download PNG
          </button>
          <button class="btn btn-church-outline btn-sm" @click="closeQrModal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRegistrationsStore } from "../stores/registrations";
import { useEventsStore } from "../stores/events";
import { useUserStore } from "../stores/user";
import QRCode from "qrcode.vue";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const userStore = useUserStore();
const regStore = useRegistrationsStore();
const eStore = useEventsStore();

/* ---------- State ---------- */
const selectedConcertId = ref("");
const dateRange = ref("");
const showQrModal = ref(false);
const selectedRegistration = ref(null);
const resending = ref(null);

/* ---------- Computed ---------- */
const concertEvents = computed(() => {
  return eStore.events
    .filter((ev) => ev.type === "concert" && ev.concertId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
});

const filteredRegistrations = computed(() => {
  let result = regStore.registrations;

  if (selectedConcertId.value) {
    result = result.filter((r) => r.concertId === selectedConcertId.value);
  }

  if (dateRange.value) {
    const now = new Date();
    let startDate;
    switch (dateRange.value) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }
    if (startDate) {
      result = result.filter((r) => {
        const created = r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt);
        return created >= startDate;
      });
    }
  }

  return result;
});

const totalAttendees = computed(() => {
  return filteredRegistrations.value.reduce((sum, r) => sum + (r.totalAttendance || 0), 0);
});

const uniqueEmails = computed(() => {
  return new Set(filteredRegistrations.value.map((r) => r.email)).size;
});

const uniqueConcerts = computed(() => {
  return new Set(filteredRegistrations.value.map((r) => r.concertId)).size;
});

/* ---------- Helpers ---------- */
function formatDateTime(timestamp) {
  if (!timestamp) return "—";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
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

function filterRegistrations() {
  // Computed handles filtering
}

function viewQrCode(reg) {
  selectedRegistration.value = reg;
  showQrModal.value = true;
}

function closeQrModal() {
  showQrModal.value = false;
  selectedRegistration.value = null;
}

async function downloadQrImage() {
  if (!selectedRegistration.value) return;
  
  await nextTick();
  const canvas = document.querySelector("#qr-modal canvas");
  if (canvas) {
    const link = document.createElement("a");
    link.download = `qr-${selectedRegistration.value.qrCodeData}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }
}

async function downloadSinglePdf(reg) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(114, 47, 55); // burgundy
  doc.text("Concert Registration Ticket", 105, 20, { align: "center" });
  
  // Concert info
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Concert: ${reg.concertName}`, 14, 35);
  doc.text(`Date: ${formatDate(reg.concertDate)}`, 14, 49);
  doc.text(`Time: ${formatTime(reg.concertTime)}`, 14, 56);
  if (reg.concertLocation) {
    doc.text(`Location: ${reg.concertLocation}`, 14, 63);
  }
  
  // Registrant info
  let y = reg.concertLocation ? 75 : 70;
  doc.setFontSize(14);
  doc.setTextColor(114, 47, 55);
  doc.text("Registrant Information", 14, y);
  
  y += 8;
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Name: ${reg.fullName}`, 14, y);
  doc.text(`Email: ${reg.email}`, 14, y + 7);
  doc.text(`Phone: ${reg.phone}`, 14, y + 14);
  doc.text(`Total Attendees: ${reg.totalAttendance}`, 14, y + 21);
  doc.text(`Registration Date: ${formatDateTime(reg.createdAt)}`, 14, y + 28);
  if (reg.userId) {
    doc.text(`User ID: ${reg.userId}`, 14, y + 35);
  }
  
  // QR Code
  y += reg.userId ? 50 : 43;
  doc.setFontSize(12);
  doc.setTextColor(114, 47, 55);
  doc.text("QR Code", 105, y, { align: "center" });
  
  // Generate QR code as data URL
  const QRCodeLib = await import("qrcode");
  const qrDataUrl = await QRCodeLib.toDataURL(reg.qrCodeData, { width: 150, margin: 2 });
  
  y += 8;
  doc.addImage(qrDataUrl, "PNG", 80, y, 50, 50);
  
  // QR Data text
  y += 55;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  
  // Footer
  doc.setFontSize(8);
  doc.text("GKI Menteng - Keep this ticket for entry", 105, 285, { align: "center" });
  
  doc.save(`registration-${reg.concertId}-${reg.fullName.replace(/\s+/g, "-")}.pdf`);
}

async function exportAllToPdf() {
  if (filteredRegistrations.value.length === 0) return;
  
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.setTextColor(114, 47, 55);
  doc.text("All Concert Registrations Report", 105, 15, { align: "center" });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const filterText = selectedConcertId.value 
    ? `Filtered by: ${concertEvents.value.find(e => e.concertId === selectedConcertId.value)?.name || selectedConcertId.value}`
    : "All Concerts";
  doc.text(filterText, 105, 22, { align: "center" });
  doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 28, { align: "center" });
  doc.text(`Total Registrations: ${filteredRegistrations.value.length} | Total Attendees: ${totalAttendees.value}`, 105, 34, { align: "center" });
  
  // Table
  const tableData = filteredRegistrations.value.map((reg, index) => [
    index + 1,
    reg.concertName,
    reg.concertId,
    reg.fullName,
    reg.email,
    reg.phone,
    reg.totalAttendance,
    formatDateTime(reg.createdAt),
    reg.userId ? "Logged In" : "Guest"
  ]);
  
  doc.autoTable({
    startY: 40,
    head: [["#", "Concert", "Concert ID", "Name", "Email", "Phone", "Attendees", "Registered", "User Type"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [114, 47, 55] },
    styles: { fontSize: 7, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 30 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 35 },
      5: { cellWidth: 25 },
      6: { cellWidth: 15, halign: "center" },
      7: { cellWidth: 25 },
      8: { cellWidth: 18, halign: "center" }
    }
  });
  
  doc.save(`registrations-report-${new Date().toISOString().split("T")[0]}.pdf`);
}

async function resendEmail(reg) {
  resending.value = reg.id;
  try {
    // In a real app, you'd call a Firebase Function or email service here
    // For now, simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(`Email resent to ${reg.email} for ${reg.fullName}`);
  } catch (err) {
    alert("Failed to resend email: " + err.message);
  } finally {
    resending.value = null;
  }
}

onMounted(() => {
  regStore.fetchRegistrations();
  eStore.fetchEvents();
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
  max-width: 450px;
  max-height: 90vh;
  overflow-y: auto;
  border: 2px solid rgba(201, 168, 76, 0.25);
  scrollbar-width: thin;
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

@media (max-width: 575.98px) {
  .modal-header-custom {
    padding: 1rem 1.1rem;
  }
}
</style>