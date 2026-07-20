<template>
  <div>
    <div class="page-header text-center mb-5 animate-fade-in-up">
      <h1 class="display-4 mb-3" style="color: var(--burgundy)">
        <i class="bi bi-person-circle me-2"></i>My Profile
      </h1>
    </div>

    <div class="row g-4">
      <div class="col-lg-4">
        <div class="church-card p-4 text-center animate-fade-in-up animate-stagger-1">
          <div class="profile-avatar-large">
            {{ initials }}
          </div>
          <h4 class="mb-1" style="color: var(--burgundy); font-family: var(--font-heading);">
            {{ userStore.username }}
          </h4>
          <p class="text-muted mb-2">{{ userStore.email }}</p>
          <span
            class="d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill mb-3"
            :style="roleBadgeStyle"
          >
            <i :class="roleIcon"></i>
            {{ roleLabel }}
          </span>
          <button
            class="btn btn-church-outline w-100"
            @click="showEditForm = !showEditForm"
            v-if="!showEditForm"
          >
            <i class="bi bi-pencil me-2"></i>Edit Profile
          </button>
          <button
            class="btn btn-church-ghost w-100"
            @click="showEditForm = false"
            v-else
          >
            <i class="bi bi-x-circle me-2"></i>Cancel Editing
          </button>
        </div>

        <div class="church-card p-4 mt-4 animate-fade-in-up animate-stagger-2">
          <h5 class="mb-3 d-flex align-items-center" style="color: var(--burgundy); font-family: var(--font-heading);">
            <i class="bi bi-info-circle me-2" style="color: var(--gold);"></i>Quick Info
          </h5>
          <div class="mb-2 pb-2" style="border-bottom: 1px solid rgba(201, 168, 76, 0.15);">
            <small class="text-muted d-block">Member Since</small>
            <span>{{ formattedMemberSince }}</span>
          </div>
          <div class="mb-2 pb-2" style="border-bottom: 1px solid rgba(201, 168, 76, 0.15);">
            <small class="text-muted d-block">Baptism Date</small>
            <span>{{ userStore.baptismDate || '—' }}</span>
          </div>
          <div>
            <small class="text-muted d-block">Small Group</small>
            <span>{{ userStore.smallGroup || '—' }}</span>
          </div>
        </div>
      </div>

      <div class="col-lg-8">
        <!-- Edit Form -->
        <div class="church-card p-4 p-lg-5 animate-fade-in-up animate-stagger-3" v-if="showEditForm">
          <h4 class="mb-4" style="color: var(--burgundy); font-family: var(--font-heading);">
            <i class="bi bi-pencil-square me-2" style="color: var(--gold);"></i>Edit Profile
          </h4>
          <form @submit.prevent="saveProfile">
            <div class="mb-3">
              <label class="form-label">Username</label>
              <input type="text" class="form-control" v-model="editUsername" />
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" v-model="editEmail" />
            </div>
            <div class="mb-3">
              <label class="form-label">Avatar URL (optional)</label>
              <input
                type="text"
                class="form-control"
                v-model="editAvatar"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <div class="row g-3 mb-4">
              <div class="col-sm-6">
                <label class="form-label">Baptism Date</label>
                <input type="date" class="form-control" v-model="editBaptismDate" />
              </div>
              <div class="col-sm-6">
                <label class="form-label">Small Group</label>
                <input type="text" class="form-control" v-model="editSmallGroup" placeholder="e.g. Tuesday Evening Group" />
              </div>
              <div class="col-12">
                <label class="form-label">Ministry Involved</label>
                <input type="text" class="form-control" v-model="editMinistry" placeholder="e.g. Worship Team, Greeting Ministry" />
              </div>
            </div>
            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-church-primary">
                <i class="bi bi-check-lg me-2"></i>Save Changes
              </button>
              <button type="button" class="btn btn-church-outline" @click="showEditForm = false">
                Cancel
              </button>
            </div>
          </form>
          <div
            v-if="successMessage"
            class="alert d-flex align-items-center gap-2 mt-3 mb-0"
            style="background: rgba(201, 168, 76, 0.12); border: 1px solid rgba(201, 168, 76, 0.3); color: var(--burgundy-dark); border-radius: var(--radius-sm);"
          >
            <i class="bi bi-check-circle-fill" style="color: var(--gold);"></i>
            {{ successMessage }}
          </div>
        </div>

        <!-- Profile Info -->
        <div class="church-card p-4 p-lg-5 animate-fade-in-up animate-stagger-3" v-else>
          <h4 class="mb-4" style="color: var(--burgundy); font-family: var(--font-heading);">
            <i class="bi bi-person-vcard me-2" style="color: var(--gold);"></i>My Information
          </h4>
          <div class="row g-4">
            <div class="col-sm-6">
              <div class="p-3 rounded-3" style="background: var(--cream-light);">
                <small class="text-muted d-block">Small Group</small>
                <span class="fw-medium" style="color: var(--burgundy);">{{ userStore.smallGroup || '—' }}</span>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="p-3 rounded-3" style="background: var(--cream-light);">
                <small class="text-muted d-block">Ministry Involved</small>
                <span class="fw-medium" style="color: var(--burgundy);">{{ userStore.ministry || '—' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Overview -->
        <div class="church-card p-4 p-lg-5 mt-4 animate-fade-in-up animate-stagger-4">
          <h4 class="mb-4" style="color: var(--burgundy); font-family: var(--font-heading);">
            <i class="bi bi-shield-check me-2" style="color: var(--gold);"></i>Account Overview
          </h4>
          <div class="row g-4">
            <div class="col-md-6">
              <div class="p-3 rounded-3" style="background: rgba(201, 168, 76, 0.08); border: 1px solid rgba(201, 168, 76, 0.15);">
                <h6 class="mb-3 d-flex align-items-center" style="color: var(--burgundy);">
                  <i class="bi bi-person-badge me-2" style="color: var(--gold);"></i>Account Type
                </h6>
                <p class="mb-1 d-flex align-items-center gap-2">
                  <i :class="roleIcon" style="color: var(--gold);"></i>
                  <span style="color: var(--burgundy);">{{ roleLabel }}</span>
                </p>
                <p class="mb-0" style="font-size: 0.85rem; color: var(--dark-light);">
                  Member since {{ formattedMemberSince }}
                </p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="p-3 rounded-3" style="background: rgba(201, 168, 76, 0.08); border: 1px solid rgba(201, 168, 76, 0.15);">
                <h6 class="mb-3 d-flex align-items-center" style="color: var(--burgundy);">
                  <i class="bi bi-envelope me-2" style="color: var(--gold);"></i>Contact
                </h6>
                <p class="mb-1" style="color: var(--burgundy);">
                  <i class="bi bi-envelope-at me-1" style="color: var(--gold);"></i>{{ userStore.email || '—' }}
                </p>
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
import { useUserStore } from "../stores/user";

const userStore = useUserStore();
const showEditForm = ref(false);
const editUsername = ref(userStore.username);
const editEmail = ref(userStore.email);
const editAvatar = ref(userStore.avatar || "");
const editBaptismDate = ref(userStore.baptismDate || "");
const editSmallGroup = ref(userStore.smallGroup || "");
const editMinistry = ref(userStore.ministry || "");
const successMessage = ref("");

const initials = computed(() => {
  return userStore.username
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
});

const formattedMemberSince = computed(() => {
  if (!userStore.memberSince) return "—";
  const d = userStore.memberSince instanceof Date ? userStore.memberSince : new Date(userStore.memberSince);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
});

const roleLabel = computed(() => {
  const labels = { admin: "Admin", manager: "Manager", guest: "Guest" };
  return labels[userStore.role] || "Guest";
});

const roleIcon = computed(() => {
  const icons = { admin: "bi bi-shield-lock", manager: "bi bi-person-badge", guest: "bi bi-person" };
  return icons[userStore.role] || "bi bi-person";
});

const roleBadgeStyle = computed(() => {
  const styles = {
    admin: {
      background: "linear-gradient(135deg, var(--burgundy) 0%, var(--burgundy-dark) 100%)",
      color: "var(--gold)",
      border: "2px solid var(--gold)",
      fontSize: "0.85rem",
      fontWeight: 600,
    },
    manager: {
      background: "linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)",
      color: "var(--burgundy-dark)",
      border: "2px solid var(--burgundy)",
      fontSize: "0.85rem",
      fontWeight: 600,
    },
    guest: {
      background: "rgba(201, 168, 76, 0.1)",
      color: "var(--dark-light)",
      border: "2px solid rgba(201, 168, 76, 0.3)",
      fontSize: "0.85rem",
      fontWeight: 600,
    },
  };
  return styles[userStore.role] || styles.guest;
});

async function saveProfile() {
  try {
    await userStore.updateProfile({
      username: editUsername.value,
      email: editEmail.value,
      avatar: editAvatar.value || null,
      baptismDate: editBaptismDate.value,
      smallGroup: editSmallGroup.value,
      ministry: editMinistry.value,
    });
    successMessage.value = "Profile updated successfully!";
    setTimeout(() => {
      successMessage.value = "";
      showEditForm.value = false;
    }, 2000);
  } catch (err) {
    successMessage.value = "Failed to save profile. Please try again.";
    setTimeout(() => { successMessage.value = ""; }, 3000);
  }
}
</script>
