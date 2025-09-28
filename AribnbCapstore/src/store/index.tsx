import { create } from "zustand";
import type { User } from "../interfaces/auth.interface";

// Safe localStorage parsing function
const getUserFromStorage = (): User | null => {
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
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const userAuthStore = create<AuthStore>((set) => ({
  user: getUserFromStorage(),
  isAuthenticated: !!getUserFromStorage(),

  setUser: (user: User) => {
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
    console.log("🚪 Clearing user from store");

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

// ===== DEBUG HELPER =====
export const debugStoreState = () => {
  const state = userAuthStore.getState();
  console.log("🔍 STORE DEBUG:");
  console.log("- Current user:", state.user);
  console.log("- Is authenticated:", state.isAuthenticated);
  console.log("- User ID:", state.user?.id);
  console.log("- User name:", state.user?.name);
  console.log("- User email:", state.user?.email);

  const localStorageUser = localStorage.getItem("user");
  console.log(
    "💾 localStorage user:",
    localStorageUser ? JSON.parse(localStorageUser) : null
  );
};
