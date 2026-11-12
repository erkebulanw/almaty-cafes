import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

setPersistence(auth, browserLocalPersistence).catch(() => {});

export const signup = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);
export const login = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);
export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);
export const subscribeToAuth = (cb) => onAuthStateChanged(auth, cb);

export function getAuthErrorMessage(error) {
  const map = {
    "auth/invalid-credential": "Неверный email или пароль",
    "auth/email-already-in-use": "Этот email уже зарегистрирован",
    "auth/weak-password": "Пароль слишком слабый (минимум 6 символов)",
    "auth/invalid-email": "Некорректный email",
    "auth/popup-closed-by-user": "Окно входа было закрыто",
    "auth/too-many-requests": "Слишком много попыток, попробуй позже",
  };
  return map[error?.code] ?? "Что-то пошло не так, попробуй ещё раз";
}