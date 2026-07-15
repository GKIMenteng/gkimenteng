import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);
  const username = ref("Guest");
  const email = ref("");
  const avatar = ref(null);
  const role = ref("guest");
  const loading = ref(true);

  const isAuthenticated = computed(() => !!user.value);

  const isAdmin = computed(() => role.value === "admin");

  const isManager = computed(() => role.value === "manager" || role.value === "admin");

  const initials = computed(() => {
    const name = username.value || "Guest";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  });

  let authUnsubscribe;

  async function fetchOrCreateRole(uid, data) {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.displayName !== data.displayName || userData.email !== data.email || userData.photoURL !== data.photoURL) {
          await setDoc(docRef, {
            displayName: data.displayName,
            email: data.email,
            photoURL: data.photoURL || null,
          }, { merge: true });
        }
        return userData.role || "guest";
      } else {
        await setDoc(docRef, {
          displayName: data.displayName,
          email: data.email,
          photoURL: data.photoURL || null,
          role: "guest",
          createdAt: serverTimestamp(),
        });
        return "guest";
      }
    } catch {
      return "guest";
    }
  }

  function init() {
    return new Promise((resolve) => {
      let resolved = false;
      authUnsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          user.value = firebaseUser;
          username.value = firebaseUser.displayName || "User";
          email.value = firebaseUser.email || "";
          avatar.value = firebaseUser.photoURL;
          role.value = await fetchOrCreateRole(firebaseUser.uid, {
            displayName: firebaseUser.displayName || "User",
            email: firebaseUser.email || "",
            photoURL: firebaseUser.photoURL,
          });
        } else {
          user.value = null;
          username.value = "Guest";
          email.value = "";
          avatar.value = null;
          role.value = "guest";
        }
        loading.value = false;
        if (!resolved) {
          resolved = true;
          resolve();
        }
      });
    });
  }

  function cleanup() {
    if (authUnsubscribe) {
      authUnsubscribe();
      authUnsubscribe = undefined;
    }
  }

  async function signInWithEmail(loginEmail, loginPassword) {
    await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
  }

  async function signUpWithEmail(regEmail, regPassword, displayName) {
    const cred = await createUserWithEmailAndPassword(auth, regEmail, regPassword);
    await updateProfile(cred.user, { displayName });
    await setDoc(doc(db, "users", cred.user.uid), {
      displayName,
      email: regEmail,
      photoURL: null,
      role: "guest",
      createdAt: serverTimestamp(),
    });
    role.value = "guest";
    username.value = displayName;
    email.value = regEmail;
  }

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  async function logout() {
    await signOut(auth);
    user.value = null;
    username.value = "Guest";
    email.value = "";
    avatar.value = null;
    role.value = "guest";
  }

  async function updateRole(uid, newRole) {
    await setDoc(doc(db, "users", uid), { role: newRole }, { merge: true });
    if (uid === user.value?.uid) {
      role.value = newRole;
    }
  }

  function updateProfileData(data) {
    if (data.username) username.value = data.username;
    if (data.email) email.value = data.email;
    if (data.avatar) avatar.value = data.avatar;
  }

  return {
    user,
    username,
    email,
    avatar,
    role,
    loading,
    isAuthenticated,
    isAdmin,
    isManager,
    initials,
    init,
    cleanup,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    logout,
    updateRole,
    updateProfile: updateProfileData,
  };
});
