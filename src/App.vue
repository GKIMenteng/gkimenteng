<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-church sticky-top" ref="navbar">
      <div class="container">
        <router-link class="navbar-brand d-flex align-items-center" to="/">
          <img
            src="/logo_gkimenteng.png"
            style="height: 2rem; width: auto; border-radius: 50%"
            alt="GKI Menteng Logo"
            class="logo me-2"
          />
          <span>GKI Menteng</span>
        </router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">
                <i class="bi bi-house-fill me-1 d-lg-none"></i>Home
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/news">
                <i class="bi bi-newspaper me-1 d-lg-none"></i>News
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/calendar">
                <i class="bi bi-calendar3 me-1 d-lg-none"></i>Calendar
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/volunteers">
                <i class="bi bi-people me-1 d-lg-none"></i>Volunteers
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/about">
                <i class="bi bi-info-circle me-1 d-lg-none"></i>About
              </router-link>
            </li>
          </ul>
          <ul class="navbar-nav align-items-lg-center">
            <template v-if="userStore.isAuthenticated">
              <li class="nav-item">
                <router-link
                  class="nav-link nav-profile-link d-flex align-items-center"
                  to="/profile"
                >
                  <div class="avatar-circle avatar-circle-sm me-2">
                    {{ userInitials }}
                  </div>
                  <span class="d-none d-lg-inline">Profile</span>
                </router-link>
              </li>
              <li class="nav-item">
                <button
                  class="nav-link btn btn-link border-0 text-decoration-none w-100 text-start"
                  @click="handleLogout"
                >
                  <i class="bi bi-box-arrow-right me-1"></i>
                  <span>Logout</span>
                </button>
              </li>
            </template>
            <template v-else>
              <li class="nav-item">
                <router-link class="nav-link" to="/login">
                  <i class="bi bi-box-arrow-in-right me-1"></i>Login
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/register">
                  <i class="bi bi-person-plus me-1"></i>Register
                </router-link>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container my-4 my-lg-5">
      <router-view v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </main>

    <footer class="church-footer">
      <div class="container py-5">
        <div class="row g-4">
          <div class="col-md-4">
            <h5
              class="d-flex align-items-center mb-3"
              style="color: var(--gold); font-family: var(--font-heading)"
            >
              <i class="bi bi-cross me-2"></i>Grace Church
            </h5>
            <p class="mb-0" style="color: rgba(245, 240, 232, 0.7); font-size: 0.9rem">
              A community of faith, hope, and love. Join us as we grow together in Christ.
            </p>
          </div>
          <div class="col-md-4">
            <h6 class="mb-3" style="color: var(--gold); font-family: var(--font-heading)">
              Connect
            </h6>
            <ul class="list-unstyled mb-0" style="font-size: 0.9rem">
              <li class="mb-2">
                <i class="bi bi-geo-alt me-2" style="color: var(--gold)"></i>
                <a href="#">123 Faith Avenue, Grace City</a>
              </li>
              <li class="mb-2">
                <i class="bi bi-telephone me-2" style="color: var(--gold)"></i>
                <a href="tel:+15551234567">(555) 123-4567</a>
              </li>
              <li class="mb-2">
                <i class="bi bi-envelope me-2" style="color: var(--gold)"></i>
                <a href="mailto:info@gracechurch.org">info@gracechurch.org</a>
              </li>
            </ul>
          </div>
          <div class="col-md-4">
            <h6 class="mb-3" style="color: var(--gold); font-family: var(--font-heading)">
              Follow Us
            </h6>
            <div class="d-flex gap-2">
              <a href="#" class="social-icon" aria-label="Facebook">
                <i class="bi bi-facebook"></i>
              </a>
              <a href="#" class="social-icon" aria-label="Instagram">
                <i class="bi bi-instagram"></i>
              </a>
              <a href="#" class="social-icon" aria-label="YouTube">
                <i class="bi bi-youtube"></i>
              </a>
              <a href="#" class="social-icon" aria-label="Twitter">
                <i class="bi bi-twitter-x"></i>
              </a>
            </div>
            <p class="mt-3 mb-0" style="color: rgba(245, 240, 232, 0.6); font-size: 0.85rem">
              Service Times: Sun 9AM &amp; 11AM
            </p>
          </div>
        </div>
      </div>
      <div class="text-center py-3" style="border-top: 1px solid rgba(201, 168, 76, 0.2)">
        <p class="mb-0" style="color: rgba(245, 240, 232, 0.6); font-size: 0.85rem">
          &copy; {{ new Date().getFullYear() }} Grace Church. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "./stores/user";

const router = useRouter();
const userStore = useUserStore();
const navbar = ref(null);

const userInitials = computed(() => {
  const username = userStore.username || "Guest";
  return username
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
});

async function handleLogout() {
  try {
    await userStore.logout();
    router.push("/");
  } catch {
    // Silently fail — auth state may already be cleared
  }
}

function handleScroll() {
  if (!navbar.value) return;
  if (window.scrollY > 20) {
    navbar.value.classList.add("scrolled");
  } else {
    navbar.value.classList.remove("scrolled");
  }
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
