import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db, firebaseEnabled } from "./firebase";
const localKey = "sephiq_reports";
export async function saveReport(report, user) {
  if (firebaseEnabled && user) {
    const ref = await addDoc(collection(db, "users", user.uid, "reports"), {
      ...report,
      createdAt: serverTimestamp(),
    });
    return { id: ref.id, mode: "cloud" };
  }
  const existing = JSON.parse(localStorage.getItem(localKey) || "[]");
  const saved = {
    ...report,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(localKey, JSON.stringify([saved, ...existing]));
  return { id: saved.id, mode: "local" };
}
export async function getReports(user) {
  if (firebaseEnabled && user) {
    const snap = await getDocs(
      query(
        collection(db, "users", user.uid, "reports"),
        orderBy("createdAt", "desc"),
      ),
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  return JSON.parse(localStorage.getItem(localKey) || "[]");
}
export async function removeReport(id, user) {
  if (firebaseEnabled && user) {
    await deleteDoc(doc(db, "users", user.uid, "reports", id));
    return;
  }
  const existing = JSON.parse(localStorage.getItem(localKey) || "[]");
  localStorage.setItem(
    localKey,
    JSON.stringify(existing.filter((r) => r.id !== id)),
  );
}
