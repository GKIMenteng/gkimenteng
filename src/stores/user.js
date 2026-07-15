import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUserStore = defineStore("user", () => {
  const username = ref("John Doe");
  const email = ref("john.doe@example.com");
  const avatar = ref(null);

  const initials = computed(() => {
    return username.value
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  });

  function updateProfile(data) {
    if (data.username) username.value = data.username;
    if (data.email) email.value = data.email;
    if (data.avatar) avatar.value = data.avatar;
  }

  return {
    username,
    email,
    avatar,
    initials,
    updateProfile,
  };
});
