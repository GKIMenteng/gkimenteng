import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/user";
import Home from "../views/Home.vue";
import Announcements from "../views/Announcements.vue";
import News from "../views/News.vue";
import Calendar from "../views/Calendar.vue";
import RegistrationsData from "../views/RegistrationsData.vue";
import Volunteers from "../views/Volunteers.vue";
import Profile from "../views/Profile.vue";
import Login from "../views/Login.vue";
import Unauthorized from "../views/Unauthorized.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0, behavior: "smooth" };
  },
  routes: [
    { path: "/", name: "home", component: Home, meta: { requiresManager: true } },
    { path: "/news", name: "news", component: News, meta: { requiresManager: true } },
    { path: "/announcements", name: "announcements", component: Announcements, meta: { requiresManager: true } },
    { path: "/calendar", name: "calendar", component: Calendar, meta: { requiresManager: true } },
    { path: "/registrations", name: "registrations", component: RegistrationsData, meta: { requiresManager: true } },
    { path: "/volunteers", name: "volunteers", component: Volunteers, meta: { requiresManager: true } },
    { path: "/profile", name: "profile", component: Profile, meta: { requiresAuth: true } },
    { path: "/login", name: "login", component: Login },
    { path: "/unauthorized", name: "unauthorized", component: Unauthorized, meta: { requiresAuth: true } },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  if (userStore.loading) {
    await userStore.init();
  }

  if ((to.meta.requiresAuth || to.meta.requiresManager) && !userStore.isAuthenticated) {
    next({ name: "login", query: { redirect: to.fullPath } });
  } else if (to.meta.requiresManager && !userStore.isManager) {
    next({ name: "unauthorized" });
  } else if (to.name === "login" && userStore.isAuthenticated) {
    if (userStore.isManager) {
      next({ name: "home" });
    } else {
      next({ name: "unauthorized" });
    }
  } else {
    next();
  }
});

export default router;
