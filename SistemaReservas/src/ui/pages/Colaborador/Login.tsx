"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";

interface LoginProps {
  onLogin: (user: { username: string; name: string }) => void;
  onBack?: () => void;
}

export default function Login({ onLogin, onBack }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulación de autenticación
    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        onLogin({ username: "admin", name: "Administrador" });
      } else if (username === "colaborador" && password === "colab123") {
        onLogin({ username: "colaborador", name: "Colaborador RCD" });
      } else {
        setError("Usuario o contraseña incorrectos");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-4"
      style={{ backgroundColor: "#3A4A5C" }}
    >
      {/* Logo */}
      <div className="mb-8">
        <div className="border-4 border-white p-6 rounded-md">
          <span className="text-white text-4xl font-light tracking-widest block text-center">
            RCD
          </span>
          <span className="text-white text-lg font-light block text-center mt-2 tracking-widest">
            HOTELS
          </span>
        </div>
      </div>

      {/* Login Card */}
      <Card
        className="w-full max-w-md border-0"
        style={{ backgroundColor: "#4A5A6C" }}
      >
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-white">
            Login Colaborador
          </CardTitle>
          <p className="text-gray-300 text-sm">
            Ingresa tus credenciales para acceder al dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">
                Usuario
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-6"
              style={{ backgroundColor: "#FF8C00" }}
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300 text-xs">
              Demo: usuario: <span className="text-yellow-400">admin</span> /
              contraseña: <span className="text-yellow-400">admin123</span>
            </p>
            <p className="text-gray-300 text-xs">
              o usuario: <span className="text-yellow-400">colaborador</span> /
              contraseña: <span className="text-yellow-400">colab123</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="mt-8 text-center text-gray-400 text-xs">
        <p>RCD Hotels - Sistema de Reservas</p>
        <p>© 2025 Corporación Inmobiliaria KTRC, S.A. de C.V.</p>
      </footer>
    </div>
  );
}
