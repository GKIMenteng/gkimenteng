import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/user";
import Home from "../views/Home.vue";
import Announcements from "../views/Announcements.vue";
import News from "../views/News.vue";
import Calendar from "../views/Calendar.vue";
import Volunteers from "../views/Volunteers.vue";
import About from "../views/About.vue";
import Profile from "../views/Profile.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0, behavior: "smooth" };
  },
  routes: [
    { path: "/", name: "home", component: Home },
    { path: "/news", name: "news", component: News },
    { path: "/announcements", name: "announcements", component: Announcements },
    { path: "/calendar", name: "calendar", component: Calendar },
    { path: "/volunteers", name: "volunteers", component: Volunteers },
    { path: "/about", name: "about", component: About },
    { path: "/profile", name: "profile", component: Profile, meta: { requiresAuth: true } },
    { path: "/login", name: "login", component: Login },
    { path: "/register", name: "register", component: Register },
  ],
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (userStore.loading) {
    next();
    return;
  }

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next({ name: "login", query: { redirect: to.fullPath } });
  } else if ((to.name === "login" || to.name === "register") && userStore.isAuthenticated) {
    next({ name: "home" });
  } else {
    next();
  }
});

export default router;
