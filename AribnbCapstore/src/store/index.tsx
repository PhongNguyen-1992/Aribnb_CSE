import { create } from "zustand";
import type { Users } from "../interfaces/auth.interface";

// Safe localStorage parsing function
const getUserFromStorage = (): Users | null => {
  try {
    const userLocal = localStorage.getItem("user");
    if (!userLocal) return null;

    const parsedUser = JSON.parse(userLocal);
    console.log("📦 Loaded user from localStorage:", parsedUser);
    return parsedUser;
  } catch (error) {
    console.error("❌ Error parsing user from localStorage:", error);
    localStorage.removeItem("user"); // Remove corrupted data
    return null;
  }
};

// Type cho User Store
type AuthStore = {
  user: Users | null;
  isAuthenticated: boolean;
  setUser: (user: Users) => void;
  clearUser: () => void;
};

export const userAuthStore = create<AuthStore>((set) => ({
  user: getUserFromStorage(),
  isAuthenticated: !!getUserFromStorage(),

  setUser: (user: Users) => {
    console.log("✅ Setting user in store:", user);

    // Sync với store + localStorage
    set({ user, isAuthenticated: true });
    try {
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("❌ Error saving user to localStorage:", error);
    }
  },

  clearUser: () => {  

    // Reset store + localStorage
    set({ user: null, isAuthenticated: false });
    try {
      localStorage.removeItem("user");
    } catch (error) {
      console.error("❌ Error removing user from localStorage:", error);
    }
  },
}));

// ===== STORE SYNC UTILITY =====
export const syncStoreWithStorage = () => {
  const { setUser, clearUser } = userAuthStore.getState();
  const storageUser = getUserFromStorage();

  if (storageUser) {
    setUser(storageUser);
  } else {
    clearUser();
  }
};

// Listen for storage changes (cross-tab sync)
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "user") {
      console.log("🔄 Storage changed, syncing store...");
      syncStoreWithStorage();
    }
  });
}
