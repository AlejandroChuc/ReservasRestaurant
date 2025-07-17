"use client";

import { useState, useEffect } from "react";
import LoginNew from "./LoginNew";
import Dashboard from "./DashboardNew";
import type { User } from "../../../types";

interface ColaboradorAppProps {
  onExit?: () => void;
}


export default function ColaboradorApp({ onExit }: ColaboradorAppProps) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('colab-user');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('colab-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('colab-user');
    }
  }, [user]);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    if (onExit) {
      onExit();
    }
  };

  const handleBack = () => {
    if (onExit) {
      onExit();
    }
  };

  if (!user) {
    return <LoginNew onLogin={handleLogin} onBack={handleBack} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}
