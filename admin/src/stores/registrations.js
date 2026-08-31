import { defineStore } from "pinia";
import { ref } from "vue";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

export const useRegistrationsStore = defineStore("registrations", () => {
  const registrations = ref([]);
  const loading = ref(false);

  async function fetchRegistrations() {
    loading.value = true;
    try {
      const q = query(collection(db, "registrations"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      registrations.value = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch {
      registrations.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchRegistrationsByConcert(concertId) {
    loading.value = true;
    try {
      const q = query(
        collection(db, "registrations"),
        where("concertId", "==", concertId),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch {
      return [];
    } finally {
      loading.value = false;
    }
  }

  async function updateRegistration(id, data) {
    await updateDoc(doc(db, "registrations", id), data);
  }

  async function deleteRegistration(id) {
    await deleteDoc(doc(db, "registrations", id));
  }

  return {
    registrations,
    loading,
    fetchRegistrations,
    fetchRegistrationsByConcert,
    updateRegistration,
    deleteRegistration,
  };
});