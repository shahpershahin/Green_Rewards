// context/AuthContext.js
// Global Authentication Context
// Demonstrates:
// 1. React Context API (createContext, useContext)
// 2. Custom Provider Pattern
// 3. useState, useEffect, and useCallback hooks for session state

"use client";

import { createContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export const AuthContext = createContext({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user session from localStorage on initial mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("green_rewards_user");
      const storedToken = localStorage.getItem("green_rewards_token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Failed to restore session:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login handler
  const login = useCallback(async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("green_rewards_user", JSON.stringify(data.user));
    localStorage.setItem("green_rewards_token", data.token);

    // Redirect based on user role
    if (data.user.role === "ADMIN") {
      router.push("/admin/dashboard");
    } else if (data.user.role === "BUSINESS") {
      router.push("/business/dashboard");
    } else {
      router.push("/citizen/dashboard");
    }

    return data.user;
  }, [router]);

  // Register handler
  const register = useCallback(async (formData) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Registration failed");
    }

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("green_rewards_user", JSON.stringify(data.user));
    localStorage.setItem("green_rewards_token", data.token);

    if (data.user.role === "BUSINESS") {
      router.push("/business/dashboard");
    } else {
      router.push("/citizen/dashboard");
    }

    return data.user;
  }, [router]);

  // Logout handler
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("green_rewards_user");
    localStorage.removeItem("green_rewards_token");
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
