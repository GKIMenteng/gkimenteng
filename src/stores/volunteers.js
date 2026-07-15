import { defineStore } from "pinia";
import { ref } from "vue";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export const useVolunteersStore = defineStore("volunteers", () => {
  const volunteers = ref([]);
  const loading = ref(false);

  async function fetchVolunteers() {
    loading.value = true;
    try {
      const q = query(collection(db, "volunteers"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      volunteers.value = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch {
      volunteers.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function createVolunteer(data) {
    const docRef = await addDoc(collection(db, "volunteers"), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }

  async function updateVolunteer(id, data) {
    await updateDoc(doc(db, "volunteers", id), data);
  }

  async function deleteVolunteer(id) {
    await deleteDoc(doc(db, "volunteers", id));
  }

  return {
    volunteers,
    loading,
    fetchVolunteers,
    createVolunteer,
    updateVolunteer,
    deleteVolunteer,
  };
});
