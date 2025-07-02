"use client";

import { useState } from "react";
import LoginNew from "./LoginNew";
import Dashboard from "./DashboardNew";
import type { User } from "../../../types";

interface ColaboradorAppProps {
  onExit?: () => void;
}

export default function ColaboradorApp({ onExit }: ColaboradorAppProps) {
  const [user, setUser] = useState<User | null>(null);

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
