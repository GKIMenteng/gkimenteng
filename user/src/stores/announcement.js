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
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export const useAnnouncementsStore = defineStore("announcements", () => {
  const announcements = ref([]);
  const loading = ref(false);

  async function fetchAnnouncements() {
    loading.value = true;
    try {
      const q = query(collection(db, "announcements"), orderBy("startPublishDate", "desc"));
      const snapshot = await getDocs(q);
      announcements.value = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch {
      announcements.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function createAnnouncement(data) {
    await addDoc(collection(db, "announcements"), {
      ...data,
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: serverTimestamp(),
    });
  }

  async function updateAnnouncement(id, data) {
    await updateDoc(doc(db, "announcements", id), data);
  }

  async function deleteAnnouncement(id) {
    await deleteDoc(doc(db, "announcements", id));
  }

  async function toggleLike(id, uid, userName) {
    const ref = doc(db, "announcements", id);
    const article = announcements.value.find((a) => a.id === id);
    if (!article) return;
    const liked = article.likedBy?.includes(uid);
    if (liked) {
      await updateDoc(ref, {
        likedBy: arrayRemove(uid),
        likes: Math.max(0, (article.likes || 0) - 1),
      });
    } else {
      await updateDoc(ref, {
        likedBy: arrayUnion(uid),
        likes: (article.likes || 0) + 1,
      });
    }
  }

  async function addComment(id, uid, userName, text) {
    const ref = doc(db, "announcements", id);
    const comment = {
      id: crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2),
      uid,
      userName,
      text,
      createdAt: new Date().toISOString(),
    };
    await updateDoc(ref, {
      comments: arrayUnion(comment),
    });
    return comment;
  }

  async function deleteComment(newsId, commentId, comments) {
    const updated = comments.filter((c) => c.id !== commentId);
    await updateDoc(doc(db, "announcements", newsId), { comments: updated });
  }

  return {
    announcements,
    loading,
    fetchAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    toggleLike,
    addComment,
    deleteComment,
  };
});
