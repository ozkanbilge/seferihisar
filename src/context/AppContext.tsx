"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { listings } from "@/data/listings";

export interface Appointment {
  id: string;
  userPhone: string;
  listingSlug: string;
  listingTitle: string;
  listingPrice: number;
  date: string;
  time: string;
  status: "pending" | "approved" | "cancelled";
  createdAt: string;
}

interface AppContextType {
  userPhone: string | null;
  login: (phone: string) => void;
  logout: () => void;
  favorites: string[]; // listing slugs
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
  appointments: Appointment[];
  createAppointment: (listingSlug: string, date: string, time: string) => Appointment | null;
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void;
  adminLoggedIn: boolean;
  adminLogin: (email: string, pass: string) => boolean;
  adminLogout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [adminLoggedIn, setAdminLoggedIn] = useState<boolean>(false);

  // Initialize state from localStorage once mounted
  useEffect(() => {
    const storedPhone = localStorage.getItem("se_user_phone");
    if (storedPhone) setUserPhone(storedPhone);

    const storedFavs = localStorage.getItem("se_favorites");
    if (storedFavs) {
      try {
        setFavorites(JSON.parse(storedFavs));
      } catch {
        setFavorites([]);
      }
    }

    const storedApps = localStorage.getItem("se_appointments");
    if (storedApps) {
      try {
        setAppointments(JSON.parse(storedApps));
      } catch {
        setAppointments([]);
      }
    } else {
      // Seed some demo appointments for first load so admin panel looks lively
      const demoApps: Appointment[] = [
        {
          id: "APP-1001",
          userPhone: "+90 532 123 45 67",
          listingSlug: "sigacik-deniz-manzarali-lux-villa",
          listingTitle: "Sığacık Marina'ya Yürüme Mesafesinde Deniz Manzaralı Lüks Villa",
          listingPrice: 18500000,
          date: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
          time: "14:00",
          status: "pending",
          createdAt: new Date().toISOString(),
        },
        {
          id: "APP-1002",
          userPhone: "+90 544 987 65 43",
          listingSlug: "ulamis-imarli-yatirimlik-arsa",
          listingTitle: "Ulamış'ta Yola Cepheli İmarlı Yatırımlık Arsa",
          listingPrice: 2950000,
          date: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
          time: "11:30",
          status: "approved",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        }
      ];
      setAppointments(demoApps);
      localStorage.setItem("se_appointments", JSON.stringify(demoApps));
    }

    const storedAdmin = localStorage.getItem("se_admin_logged");
    if (storedAdmin === "true") setAdminLoggedIn(true);
  }, []);

  const login = (phone: string) => {
    const cleanPhone = phone.trim();
    setUserPhone(cleanPhone);
    localStorage.setItem("se_user_phone", cleanPhone);
  };

  const logout = () => {
    setUserPhone(null);
    localStorage.removeItem("se_user_phone");
  };

  const toggleFavorite = (slug: string) => {
    const updated = favorites.includes(slug)
      ? favorites.filter((s) => s !== slug)
      : [...favorites, slug];
    setFavorites(updated);
    localStorage.setItem("se_favorites", JSON.stringify(updated));
  };

  const isFavorite = (slug: string) => {
    return favorites.includes(slug);
  };

  const createAppointment = (listingSlug: string, date: string, time: string) => {
    if (!userPhone) return null;
    const listing = listings.find((l) => l.slug === listingSlug);
    if (!listing) return null;

    const newApp: Appointment = {
      id: `APP-${Math.floor(1000 + Math.random() * 9000)}`,
      userPhone,
      listingSlug,
      listingTitle: listing.title,
      listingPrice: listing.price,
      date,
      time,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const updated = [newApp, ...appointments];
    setAppointments(updated);
    localStorage.setItem("se_appointments", JSON.stringify(updated));
    return newApp;
  };

  const updateAppointmentStatus = (id: string, status: Appointment["status"]) => {
    const updated = appointments.map((app) =>
      app.id === id ? { ...app, status } : app
    );
    setAppointments(updated);
    localStorage.setItem("se_appointments", JSON.stringify(updated));
  };

  const adminLogin = (email: string, pass: string): boolean => {
    const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "").toLowerCase();
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "";
    if (adminEmail && adminPass && email.trim().toLowerCase() === adminEmail && pass === adminPass) {
      setAdminLoggedIn(true);
      localStorage.setItem("se_admin_logged", "true");
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setAdminLoggedIn(false);
    localStorage.removeItem("se_admin_logged");
  };

  return (
    <AppContext.Provider
      value={{
        userPhone,
        login,
        logout,
        favorites,
        toggleFavorite,
        isFavorite,
        appointments,
        createAppointment,
        updateAppointmentStatus,
        adminLoggedIn,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
