<template>
  <div>
    <div class="page-header text-center mb-5 animate-fade-in-up">
      <h1 class="display-4 mb-3" style="color: var(--burgundy)">
        <i class="bi bi-people me-2"></i>Our Volunteers
      </h1>
      <p class="lead fs-5 mb-4" style="color: var(--dark-light);">
        Serving with love and dedication
      </p>
      <button
        v-if="userStore.isManager"
        class="btn btn-church-primary"
        @click="openCreateModal"
      >
        <i class="bi bi-person-plus me-2"></i>Add Volunteer
      </button>
    </div>

    <!-- Loading -->
    <div v-if="volStore.loading" class="text-center py-5">
      <div class="spinner-border" style="color: var(--gold);" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error -->
    <div v-if="pageError" class="alert d-flex align-items-center gap-2 mb-4 py-2 px-3" style="background: rgba(114, 47, 55, 0.08); border: 1px solid rgba(114, 47, 55, 0.2); color: var(--burgundy); border-radius: var(--radius-sm); font-size: 0.9rem;">
      <i class="bi bi-exclamation-circle"></i>
      {{ pageError }}
      <button class="btn btn-sm ms-auto p-0 border-0 bg-transparent" style="color: var(--burgundy);" @click="pageError = ''">&times;</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="volStore.volunteers.length === 0" class="text-center py-5 animate-fade-in-up">
      <i class="bi bi-people fs-1" style="color: var(--gold); opacity: 0.5;"></i>
      <p class="mt-3" style="color: var(--dark-light);">No volunteers yet. Add your first volunteer!</p>
    </div>

    <!-- Volunteer Grid -->
    <div v-else class="row g-4 mb-5">
      <div
        v-for="(v, index) in volStore.volunteers"
        :key="v.id"
        class="col-sm-6 col-md-4 col-lg-3 animate-fade-in-up"
        :class="'animate-stagger-' + (index + 1)"
      >
        <div class="volunteer-card text-center h-100 d-flex flex-column align-items-center">
          <div class="position-relative">
            <div
              class="avatar-circle mb-3"
              style="width: 80px; height: 80px; font-size: 2rem;"
            >
              {{ getInitials(v.name) }}
            </div>
            <button
              v-if="userStore.isManager"
              class="btn btn-sm position-absolute rounded-circle p-0 d-flex align-items-center justify-content-center"
              style="width: 28px; height: 28px; top: -4px; right: -8px; background: var(--white); border: 2px solid rgba(201, 168, 76, 0.3); color: var(--dark-light);"
              @click="openDeleteModal(v)"
              title="Delete"
            >
              <i class="bi bi-x" style="font-size: 0.9rem;"></i>
            </button>
          </div>
          <h5 class="mb-1" style="color: var(--burgundy); font-family: var(--font-heading);">
            {{ v.name }}
          </h5>

          <!-- Positions -->
          <div class="d-flex flex-wrap gap-1 mb-2 justify-content-center">
            <span
              v-for="pos in toArray(v.positions || v.position)"
              :key="pos"
              class="badge-church"
            >
              {{ pos }}
            </span>
          </div>

          <!-- Instruments (only if Musician in positions) -->
          <div
            v-if="hasMusician(v)"
            class="d-flex flex-wrap gap-1 mb-2 justify-content-center"
          >
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
          <button
            v-if="userStore.isManager"
            class="btn btn-church-ghost mt-2"
            @click="openEditModal(v)"
          >
            <i class="bi bi-pencil me-1"></i>Edit
          </button>
        </div>
      </div>
    </div>

    <!-- Volunteer Opportunities -->
    <div class="animate-fade-in-up">
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

    <!-- Create / Edit Modal -->
    <div
      class="modal-overlay"
      v-if="showModal"
      @click.self="closeModal"
    >
      <div class="church-card modal-card animate-fade-in-up">
        <!-- Modal header -->
        <div class="modal-header-custom">
          <div class="d-flex align-items-center gap-3">
            <div
              class="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
              style="width: 44px; height: 44px; background: linear-gradient(135deg, var(--gold-light) 0%, var(--cream) 100%);"
            >
              <i
                :class="editing ? 'bi bi-pencil-square' : 'bi bi-person-plus'"
                style="color: var(--burgundy); font-size: 1.25rem;"
              ></i>
            </div>
            <div>
              <h5 class="mb-0" style="color: var(--burgundy); font-family: var(--font-heading);">
                {{ editing ? 'Edit Volunteer' : 'Add Volunteer' }}
              </h5>
              <p class="mb-0" style="font-size: 0.8rem; color: var(--dark-light);">
                {{ editing ? 'Update the volunteer\'s information below' : 'Fill in the details to add a new volunteer' }}
              </p>
            </div>
          </div>
          <button
            class="modal-close-btn"
            @click="closeModal"
            type="button"
            aria-label="Close"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="p-4 p-lg-5">
          <div
            v-if="formError"
            class="alert d-flex align-items-center gap-2 mb-4 py-2 px-3"
            style="background: rgba(114, 47, 55, 0.08); border: 1px solid rgba(114, 47, 55, 0.2); color: var(--burgundy); border-radius: var(--radius-sm); font-size: 0.9rem;"
          >
            <i class="bi bi-exclamation-circle"></i>
            {{ formError }}
          </div>

          <form @submit.prevent="handleSave">
            <!-- Name -->
            <div class="mb-4">
              <label class="form-label d-flex align-items-center gap-2">
                <i class="bi bi-person" style="color: var(--gold);"></i>
                Full Name
              </label>
              <input
                type="text"
                class="form-control"
                v-model="form.name"
                placeholder="e.g. John Doe"
                required
              />
            </div>

            <!-- Positions -->
            <div class="mb-4">
              <label class="form-label d-flex align-items-center gap-2 mb-0">
                <i class="bi bi-briefcase" style="color: var(--gold);"></i>
                Positions
              </label>
              <p class="mb-3" style="font-size: 0.8rem; color: var(--dark-light);">
                Select one or more positions for this volunteer
              </p>
              <div class="row g-2">
                <div
                  v-for="pos in positionOptions"
                  :key="pos"
                  class="col-6 col-md-3"
                >
                  <label
                    class="position-chip d-flex flex-column align-items-center text-center gap-1 px-2 py-3 rounded-3 cursor-pointer w-100"
                    :class="form.positions.includes(pos) ? 'position-chip-checked' : 'position-chip-unchecked'"
                  >
                    <input
                      type="checkbox"
                      :value="pos"
                      v-model="form.positions"
                      class="position-input"
                    />
                    <i :class="positionIcons[pos]" style="font-size: 1.35rem;"></i>
                    <span style="font-size: 0.8rem; font-weight: 500; line-height: 1.2;">{{ pos }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Instruments -->
            <Transition name="slide-fade">
              <div class="mb-4" v-if="form.positions.includes('Musician')" key="instruments">
                <hr class="church-divider-solid" />
                <label class="form-label d-flex align-items-center gap-2 mb-0">
                  <i class="bi bi-music-note-beamed" style="color: var(--gold);"></i>
                  Instruments
                </label>
                <p class="mb-3" style="font-size: 0.8rem; color: var(--dark-light);">
                  Select one or more instruments this musician plays
                </p>
                <div class="row g-2">
                  <div
                    v-for="inst in instrumentOptions"
                    :key="inst"
                    class="col-6 col-sm-4"
                  >
                    <label
                      class="position-chip d-flex flex-column align-items-center text-center gap-1 px-2 py-3 rounded-3 cursor-pointer w-100"
                      :class="form.instruments.includes(inst) ? 'position-chip-checked-gold' : 'position-chip-unchecked'"
                    >
                      <input
                        type="checkbox"
                        :value="inst"
                        v-model="form.instruments"
                        class="position-input"
                      />
                      <i class="bi bi-music-note" style="font-size: 1.25rem;"></i>
                      <span style="font-size: 0.8rem; font-weight: 500;">{{ inst }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </Transition>

            <!-- Actions -->
            <div class="d-flex gap-2 pt-2">
              <button type="submit" class="btn btn-church-primary flex-fill" :disabled="saving">
                <span v-if="saving">
                  <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                  Saving...
                </span>
                <span v-else>
                  <i :class="editing ? 'bi bi-check-lg' : 'bi bi-person-plus'" class="me-2"></i>
                  {{ editing ? 'Save Changes' : 'Add Volunteer' }}
                </span>
              </button>
              <button type="button" class="btn btn-church-outline" @click="closeModal">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      class="modal-overlay"
      v-if="showDeleteModal"
      @click.self="showDeleteModal = false"
    >
      <div class="church-card modal-card modal-card-sm animate-fade-in-up">
        <div class="card-body p-4 text-center">
          <div
            class="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
            style="width: 56px; height: 56px; background: rgba(114, 47, 55, 0.08); color: var(--burgundy); font-size: 1.5rem;"
          >
            <i class="bi bi-exclamation-triangle"></i>
          </div>
          <h5 class="mb-2" style="color: var(--burgundy); font-family: var(--font-heading);">
            Delete Volunteer
          </h5>
          <p class="mb-4" style="color: var(--dark-light);">
            Are you sure you want to remove <strong>{{ deleteTarget?.name }}</strong>?
          </p>
          <div class="d-flex gap-2 justify-content-center">
            <button class="btn btn-church-primary" :disabled="saving" @click="handleDelete">
              <span v-if="saving">
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                Deleting...
              </span>
              <span v-else>
                <i class="bi bi-trash me-2"></i>Delete
              </span>
            </button>
            <button class="btn btn-church-outline" @click="showDeleteModal = false">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useUserStore } from "../stores/user";
import { useVolunteersStore } from "../stores/volunteers";

const userStore = useUserStore();
const volStore = useVolunteersStore();

const showModal = ref(false);
const showDeleteModal = ref(false);
const editing = ref(false);
const editingId = ref(null);
const saving = ref(false);
const deleteTarget = ref(null);
const formError = ref("");
const pageError = ref("");

const positionOptions = ["Soundman", "Multimedia", "Streaming", "Musician"];
const instrumentOptions = ["Piano", "Electone", "Keyboard", "Guitar", "Drum", "Violin"];

const positionIcons = {
  Soundman: "bi bi-speaker",
  Multimedia: "bi bi-display",
  Streaming: "bi bi-broadcast",
  Musician: "bi bi-music-note-beamed",
};

const form = reactive({
  name: "",
  positions: [],
  instruments: [],
});

const emptyForm = () => {
  form.name = "";
  form.positions = [];
  form.instruments = [];
};

function openCreateModal() {
  editing.value = false;
  editingId.value = null;
  emptyForm();
  showModal.value = true;
}

function openEditModal(v) {
  editing.value = true;
  editingId.value = v.id;
  form.name = v.name || "";
  form.positions = toArray(v.positions || v.position);
  form.instruments = toArray(v.instruments || v.instrument);
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

function openDeleteModal(v) {
  deleteTarget.value = v;
  showDeleteModal.value = true;
}

function toArray(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === "string" && val) return [val];
  return [];
}

function hasMusician(v) {
  const positions = toArray(v.positions || v.position);
  return positions.includes("Musician");
}

async function handleSave() {
  saving.value = true;
  formError.value = "";

  if (form.positions.length === 0) {
    formError.value = "Please select at least one position.";
    saving.value = false;
    return;
  }
  if (form.positions.includes("Musician") && form.instruments.length === 0) {
    formError.value = "Please select at least one instrument for Musician.";
    saving.value = false;
    return;
  }

  try {
    const data = {
      name: form.name.trim(),
      positions: form.positions,
    };
    if (form.positions.includes("Musician")) {
      data.instruments = form.instruments;
    }
    if (editing.value) {
      await volStore.updateVolunteer(editingId.value, data);
    } else {
      await volStore.createVolunteer(data);
    }
    await volStore.fetchVolunteers();
    closeModal();
  } catch (err) {
    formError.value = err.message || "Failed to save volunteer. Check console for details.";
  } finally {
    saving.value = false;
  }
}

async function handleDelete() {
  if (!deleteTarget.value) return;
  saving.value = true;
  pageError.value = "";
  try {
    await volStore.deleteVolunteer(deleteTarget.value.id);
    await volStore.fetchVolunteers();
    showDeleteModal.value = false;
    deleteTarget.value = null;
  } catch (err) {
    pageError.value = err.message || "Failed to delete volunteer.";
  } finally {
    saving.value = false;
  }
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
  if (!timestamp) return "—";
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

<style scoped>
/* ======================
   Modal Overlay
   ====================== */

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
  max-width: 540px;
  max-height: 90vh;
  overflow-y: auto;
  border: 2px solid rgba(201, 168, 76, 0.25);
  scrollbar-width: thin;
}

.modal-card-sm {
  max-width: 400px;
}

/* ======================
   Modal Header
   ====================== */

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

/* ======================
   Position / Instrument Chips
   ====================== */

.position-chip {
  border-radius: var(--radius-sm);
  transition: all 0.25s var(--ease-smooth);
  position: relative;
  overflow: hidden;
}

.position-chip .position-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.position-chip-unchecked {
  background: var(--cream-light);
  border: 2px solid rgba(201, 168, 76, 0.15);
  color: var(--dark-light);
}

.position-chip-unchecked:hover {
  border-color: rgba(201, 168, 76, 0.4);
  background: var(--cream);
  transform: translateY(-2px);
  box-shadow: var(--shadow-xs);
}

.position-chip-checked {
  background: linear-gradient(135deg, rgba(201, 168, 76, 0.12) 0%, rgba(201, 168, 76, 0.06) 100%);
  border: 2px solid var(--gold);
  color: var(--burgundy-dark);
  box-shadow: 0 2px 8px rgba(201, 168, 76, 0.15);
}

.position-chip-checked::after {
  content: "✓";
  position: absolute;
  top: 4px;
  right: 6px;
  font-size: 0.6rem;
  font-weight: 700;
  color: var(--gold-dark);
}

.position-chip-checked i {
  color: var(--gold-dark) !important;
}

.position-chip-checked-gold {
  background: linear-gradient(135deg, rgba(201, 168, 76, 0.18) 0%, rgba(201, 168, 76, 0.08) 100%);
  border: 2px solid var(--gold);
  color: var(--burgundy-dark);
  box-shadow: 0 2px 8px rgba(201, 168, 76, 0.15);
}

.position-chip-checked-gold::after {
  content: "✓";
  position: absolute;
  top: 4px;
  right: 6px;
  font-size: 0.6rem;
  font-weight: 700;
  color: var(--gold-dark);
}

.position-chip-checked-gold i {
  color: var(--gold-dark) !important;
}

/* ======================
   Transition
   ====================== */

.slide-fade-enter-active {
  transition: all 0.35s var(--ease-smooth);
}

.slide-fade-leave-active {
  transition: all 0.2s var(--ease-smooth);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ======================
   Utilities
   ====================== */

.cursor-pointer {
  cursor: pointer;
}

@media (max-width: 575.98px) {
  .modal-header-custom {
    padding: 1rem 1.1rem;
  }

  .modal-card {
    max-width: 100%;
    margin: 0;
    border-radius: var(--radius-md);
  }
}
</style>
