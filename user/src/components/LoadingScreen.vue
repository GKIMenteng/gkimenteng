<template>
  <Transition name="loading-fade">
    <div v-if="visible" class="loading-screen">
      <div class="loading-content">
        <div class="loading-logo-wrapper">
          <img src="/logo_gkimenteng.png" alt="GKI Menteng" class="loading-logo" />
          <div class="loading-cross">
            <svg viewBox="0 0 40 40" class="cross-svg" aria-hidden="true">
              <line
                x1="20"
                y1="4"
                x2="20"
                y2="36"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
              />
              <line
                x1="8"
                y1="20"
                x2="32"
                y2="20"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </div>

        <h1 class="loading-title">GKI Menteng</h1>
        <p class="loading-subtitle">Jakarta</p>

        <div class="loading-bar-container">
          <div class="loading-bar"></div>
        </div>

        <template v-if="message">
          <p class="loading-message">{{ message }}</p>
        </template>
        <template v-else>
          <p class="loading-verse">"For I know the plans I have for you"</p>
          <p class="loading-verse-ref">— Jeremiah 29:11</p>
        </template>

        <div class="loading-dots">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: true,
  },
  message: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #2e1217 0%, #4a1d23 40%, #722f37 100%);
  font-family: "Playfair Display", Georgia, "Times New Roman", serif;
}

.loading-content {
  text-align: center;
  padding: 2rem;
  max-width: 420px;
  width: 100%;
}

.loading-logo-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 1.5rem;
}

.loading-logo {
  width: 100px;
  height: auto;
  border-radius: 50%;
  box-shadow:
    0 0 40px rgba(201, 168, 76, 0.3),
    0 0 80px rgba(201, 168, 76, 0.1);
  animation: logoPulse 2.5s ease-in-out infinite;
  display: block;
}

.loading-cross {
  position: absolute;
  bottom: -6px;
  right: -6px;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #c9a84c, #e0c97f);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2e1217;
  box-shadow: 0 2px 12px rgba(201, 168, 76, 0.5);
  animation: crossGlow 2s ease-in-out infinite;
}

.cross-svg {
  width: 18px;
  height: 18px;
}

.loading-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #c9a84c;
  margin: 0;
  letter-spacing: 2px;
  animation: fadeInUp 0.8s ease-out both;
}

.loading-subtitle {
  font-size: 0.85rem;
  color: rgba(201, 168, 76, 0.6);
  margin: 0.15rem 0 1.5rem;
  letter-spacing: 4px;
  text-transform: uppercase;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  font-weight: 400;
  animation: fadeInUp 0.8s 0.15s ease-out both;
}

.loading-bar-container {
  width: 200px;
  height: 2px;
  background: rgba(201, 168, 76, 0.15);
  border-radius: 2px;
  margin: 0 auto 1.25rem;
  overflow: hidden;
  animation: fadeInUp 0.8s 0.3s ease-out both;
}

.loading-bar {
  width: 40%;
  height: 100%;
  background: linear-gradient(90deg, #c9a84c, #e0c97f, #c9a84c);
  border-radius: 2px;
  animation: loadingSlide 1.4s ease-in-out infinite;
}

.loading-message,
.loading-verse {
  font-size: 0.9rem;
  font-style: italic;
  color: rgba(245, 240, 232, 0.6);
  margin: 0 0 0.15rem;
  animation: fadeInUp 0.8s 0.45s ease-out both;
  font-family: "Playfair Display", Georgia, "Times New Roman", serif;
}

.loading-verse-ref {
  font-size: 0.75rem;
  color: rgba(201, 168, 76, 0.5);
  font-style: normal;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  margin: 0;
  animation: fadeInUp 0.8s 0.55s ease-out both;
}

.loading-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 1.5rem;
  animation: fadeInUp 0.8s 0.65s ease-out both;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #c9a84c;
  animation: dotBounce 1.4s ease-in-out infinite;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes logoPulse {
  0%,
  100% {
    box-shadow:
      0 0 40px rgba(201, 168, 76, 0.3),
      0 0 80px rgba(201, 168, 76, 0.1);
  }
  50% {
    box-shadow:
      0 0 60px rgba(201, 168, 76, 0.45),
      0 0 100px rgba(201, 168, 76, 0.15);
  }
}

@keyframes crossGlow {
  0%,
  100% {
    box-shadow: 0 2px 12px rgba(201, 168, 76, 0.5);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 2px 20px rgba(201, 168, 76, 0.7);
    transform: scale(1.08);
  }
}

@keyframes loadingSlide {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(350%);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes dotBounce {
  0%,
  80%,
  100% {
    transform: scale(0.6);
    opacity: 0.3;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.loading-fade-enter-active,
.loading-fade-leave-active {
  transition:
    opacity 0.5s ease,
    backdrop-filter 0.5s ease;
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}

@media (max-width: 576px) {
  .loading-logo {
    width: 80px;
  }

  .loading-cross {
    width: 26px;
    height: 26px;
  }

  .cross-svg {
    width: 14px;
    height: 14px;
  }

  .loading-title {
    font-size: 1.4rem;
  }

  .loading-subtitle {
    font-size: 0.75rem;
    letter-spacing: 3px;
  }

  .loading-bar-container {
    width: 160px;
  }

  .loading-verse {
    font-size: 0.8rem;
  }
}
</style>
