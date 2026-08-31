<template>
  <div class="auth-page">
    <div class="auth-container animate-fade-in-up">
      <div class="church-card auth-card">
        <div class="card-body p-4 p-lg-5">
          <div class="text-center mb-4">
            <div
              class="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style="width: 64px; height: 64px; background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);"
            >
              <i class="bi bi-cross fs-3" style="color: var(--burgundy-dark);"></i>
            </div>
            <h3 class="mb-1" style="color: var(--burgundy); font-family: var(--font-heading);">
              Grace Church
            </h3>
            <p style="color: var(--dark-light);">Welcome back — sign in to continue</p>
          </div>

          <div
            v-if="errorMessage"
            class="alert d-flex align-items-center gap-2 mb-4 py-2 px-3"
            style="background: rgba(114, 47, 55, 0.08); border: 1px solid rgba(114, 47, 55, 0.2); color: var(--burgundy); border-radius: var(--radius-sm); font-size: 0.9rem;"
          >
            <i class="bi bi-exclamation-circle"></i>
            {{ errorMessage }}
          </div>

          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input
                type="email"
                class="form-control"
                v-model="email"
                placeholder="your@email.com"
                required
                autocomplete="email"
              />
            </div>
            <div class="mb-4">
              <label class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                v-model="password"
                placeholder="Enter your password"
                required
                autocomplete="current-password"
              />
            </div>
            <button
              type="submit"
              class="btn btn-church-primary w-100"
              :disabled="loading"
            >
              <span v-if="loading">
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                Signing in...
              </span>
              <span v-else>
                <i class="bi bi-box-arrow-in-right me-2"></i>Sign In
              </span>
            </button>
          </form>

          <div class="position-relative my-4">
            <hr class="church-divider-solid" />
            <span
              class="position-absolute top-50 start-50 translate-middle px-3"
              style="background: var(--white); color: var(--dark-light); font-size: 0.8rem;"
            >or continue with</span>
          </div>

          <button
            type="button"
            class="btn w-100 mb-4 d-flex align-items-center justify-content-center gap-2"
            style="border: 2px solid rgba(201, 168, 76, 0.3); border-radius: var(--radius-lg); padding: 0.65rem 1.75rem; font-weight: 500; color: var(--dark); background: var(--white); transition: all var(--transition);"
            :disabled="loading"
            @click="handleGoogleLogin"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span v-if="googleLoading">
              <span class="spinner-border spinner-border-sm me-2" role="status"></span>
              Connecting...
            </span>
            <span v-else>Sign in with Google</span>
          </button>

          <p class="text-center mb-0" style="font-size: 0.9rem; color: var(--dark-light);">
            Don't have an account yet?
            <router-link to="/register" class="fw-semibold" style="color: var(--gold-dark);">
              Create one here
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "../stores/user";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const loading = ref(false);
const googleLoading = ref(false);

async function handleLogin() {
  errorMessage.value = "";
  loading.value = true;
  try {
    await userStore.signInWithEmail(email.value, password.value);
    const redirect = route.query.redirect || "/";
    router.push(redirect);
  } catch (err) {
    const code = err.code || "";
    if (code.includes("user-not-found") || code.includes("wrong-password") || code.includes("invalid-credential")) {
      errorMessage.value = "Invalid email or password. Please try again.";
    } else if (code.includes("too-many-requests")) {
      errorMessage.value = "Too many attempts. Please try again later.";
    } else if (code.includes("invalid-email")) {
      errorMessage.value = "Please enter a valid email address.";
    } else {
      errorMessage.value = err.message || "An unexpected error occurred.";
    }
  } finally {
    loading.value = false;
  }
}

async function handleGoogleLogin() {
  errorMessage.value = "";
  googleLoading.value = true;
  try {
    await userStore.signInWithGoogle();
    const redirect = route.query.redirect || "/";
    router.push(redirect);
  } catch (err) {
    if (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request") {
      return;
    }
    if (err.code === "auth/popup-blocked") {
      errorMessage.value = "Popup was blocked by your browser. Please allow popups for this site.";
    } else if (err.code === "auth/unauthorized-domain") {
      errorMessage.value = "Google sign-in is not configured for this domain. Add it in Firebase Console under Authentication > Settings > Authorized domains.";
    } else {
      errorMessage.value = err.message || "Google sign-in failed. Please try again.";
    }
  } finally {
    googleLoading.value = false;
  }
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

.auth-card::before {
  height: 4px;
  background: linear-gradient(90deg, var(--gold), var(--gold-light), var(--gold), var(--gold-light));
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}
</style>
