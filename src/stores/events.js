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

export const useEventsStore = defineStore("events", () => {
  const events = ref([]);
  const loading = ref(false);

  async function fetchEvents() {
    loading.value = true;
    try {
      const q = query(collection(db, "events"), orderBy("date", "asc"));
      const snapshot = await getDocs(q);
      events.value = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch {
      events.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function createEvent(data) {
    await addDoc(collection(db, "events"), {
      ...data,
      createdAt: serverTimestamp(),
    });
  }

  async function updateEvent(id, data) {
    await updateDoc(doc(db, "events", id), data);
  }

  async function deleteEvent(id) {
    await deleteDoc(doc(db, "events", id));
  }

  return {
    events,
    loading,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
});
