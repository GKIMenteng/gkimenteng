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
          <p class="text-muted mb-3">{{ userStore.email }}</p>
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
            <span>January 2020</span>
          </div>
          <div class="mb-2 pb-2" style="border-bottom: 1px solid rgba(201, 168, 76, 0.15);">
            <small class="text-muted d-block">Baptism Date</small>
            <span>March 15, 2015</span>
          </div>
          <div>
            <small class="text-muted d-block">Small Group</small>
            <span>Tuesday Evening Group</span>
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
            <div class="mb-4">
              <label class="form-label">Avatar URL (optional)</label>
              <input
                type="text"
                class="form-control"
                v-model="editAvatar"
                placeholder="https://example.com/avatar.jpg"
              />
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
                <span class="fw-medium" style="color: var(--burgundy);">Tuesday Evening Group</span>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="p-3 rounded-3" style="background: var(--cream-light);">
                <small class="text-muted d-block">Ministry Involved</small>
                <span class="fw-medium" style="color: var(--burgundy);">Worship Team, Greeting Ministry</span>
              </div>
            </div>
          </div>
        </div>

        <!-- My Activity -->
        <div class="church-card p-4 p-lg-5 mt-4 animate-fade-in-up animate-stagger-4">
          <h4 class="mb-4" style="color: var(--burgundy); font-family: var(--font-heading);">
            <i class="bi bi-activity me-2" style="color: var(--gold);"></i>My Activity
          </h4>
          <div class="row g-4">
            <div class="col-md-6">
              <div class="p-3 rounded-3" style="background: rgba(201, 168, 76, 0.08); border: 1px solid rgba(201, 168, 76, 0.15);">
                <h6 class="mb-3 d-flex align-items-center" style="color: var(--burgundy);">
                  <i class="bi bi-calendar-check me-2" style="color: var(--gold);"></i>Upcoming Events
                </h6>
                <ul class="list-unstyled mb-0" style="font-size: 0.9rem;">
                  <li class="mb-2 d-flex align-items-center">
                    <span class="event-dot me-2"></span>
                    Sunday Service - July 21, 2024
                  </li>
                  <li class="mb-2 d-flex align-items-center">
                    <span class="event-dot me-2"></span>
                    Bible Study - July 24, 2024
                  </li>
                  <li class="d-flex align-items-center">
                    <span class="event-dot me-2"></span>
                    Volunteer Training - July 27, 2024
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-md-6">
              <div class="p-3 rounded-3" style="background: rgba(201, 168, 76, 0.08); border: 1px solid rgba(201, 168, 76, 0.15);">
                <h6 class="mb-3 d-flex align-items-center" style="color: var(--burgundy);">
                  <i class="bi bi-gift me-2" style="color: var(--gold);"></i>Recent Donations
                </h6>
                <ul class="list-unstyled mb-0" style="font-size: 0.9rem;">
                  <li class="mb-2 d-flex align-items-center">
                    <span class="event-dot me-2"></span>
                    Tithes - July 14, 2024
                  </li>
                  <li class="d-flex align-items-center">
                    <span class="event-dot me-2"></span>
                    Building Fund - July 7, 2024
                  </li>
                </ul>
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
const successMessage = ref("");

const initials = computed(() => {
  return userStore.username
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
});

function saveProfile() {
  userStore.updateProfile({
    username: editUsername.value,
    email: editEmail.value,
    avatar: editAvatar.value || null,
  });
  successMessage.value = "Profile updated successfully!";
  setTimeout(() => {
    successMessage.value = "";
    showEditForm.value = false;
  }, 2000);
}
</script>
