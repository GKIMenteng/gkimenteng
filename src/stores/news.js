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

export const useNewsStore = defineStore("news", () => {
  const articles = ref([]);
  const loading = ref(false);

  async function fetchNews() {
    loading.value = true;
    try {
      const q = query(collection(db, "news"), orderBy("startPublishDate", "desc"));
      const snapshot = await getDocs(q);
      articles.value = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch {
      articles.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function createNews(data) {
    await addDoc(collection(db, "news"), {
      ...data,
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: serverTimestamp(),
    });
  }

  async function updateNews(id, data) {
    await updateDoc(doc(db, "news", id), data);
  }

  async function deleteNews(id) {
    await deleteDoc(doc(db, "news", id));
  }

  async function toggleLike(id, uid, userName) {
    const ref = doc(db, "news", id);
    const article = articles.value.find((a) => a.id === id);
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
    const ref = doc(db, "news", id);
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
    await updateDoc(doc(db, "news", newsId), { comments: updated });
  }

  return {
    articles,
    loading,
    fetchNews,
    createNews,
    updateNews,
    deleteNews,
    toggleLike,
    addComment,
    deleteComment,
  };
});
