<template>
  <div class="auth-page">
    <div class="auth-container animate-fade-in-up">
      <div class="church-card auth-card">
        <div class="card-body p-4 p-lg-5 text-center">
          <div
            class="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
            style="width: 64px; height: 64px; background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);"
          >
            <i class="bi bi-shield-lock fs-3" style="color: var(--burgundy-dark);"></i>
          </div>
          <h3 class="mb-2" style="color: var(--burgundy); font-family: var(--font-heading);">
            Restricted Dashboard
          </h3>
          <p class="mb-4" style="color: var(--dark-light);">
            This area is available only to admin and manager accounts.
          </p>
          <button class="btn btn-church-primary w-100" @click="handleLogout">
            <i class="bi bi-box-arrow-right me-2"></i>Sign in with another account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";

const router = useRouter();
const userStore = useUserStore();

async function handleLogout() {
  await userStore.logout();
  router.push("/login");
}
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.auth-container {
  width: 100%;
  max-width: 440px;
}

.auth-card {
  border: 2px solid rgba(201, 168, 76, 0.25);
}
</style>
