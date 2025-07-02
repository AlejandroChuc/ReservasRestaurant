import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface LoginProps {
  onLogin: (user: { username: string; name: string }) => void;
  onBack: () => void;
}

export default function Login({ onLogin, onBack }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación simple - en una aplicación real usarías una API
    if (username === "admin" && password === "123456") {
      onLogin({ username: "admin", name: "Administrador" });
    } else if (username === "colaborador1" && password === "password") {
      onLogin({ username: "colaborador1", name: "María González" });
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-slate-700/80"></div>

      {/* Logo RCD Hotels en la esquina derecha */}
      <div className="absolute top-8 right-8 z-10">
        <div className="text-white">
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="flex space-x-4">
                <span className="text-xl font-light">EDEN ROC</span>
                <span className="text-xl font-light italic">NOBU HOTEL</span>
                <span className="text-xl font-light">UNICO</span>
              </div>
            </div>
            <div className="border border-white p-3">
              <span className="text-2xl font-light tracking-wider">RCD</span>
              <div className="text-xs tracking-widest">HOTELS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario de login */}
      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <h1 className="text-2xl font-light text-slate-700">AdminRCD -</h1>
            <p className="text-sm text-slate-500">
              Sistema de Gestión de Reservas
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Enter your User name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 border-slate-300 focus:border-slate-500 bg-white"
                  required
                />
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 border-slate-300 focus:border-slate-500 bg-white"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-slate-600 border-slate-300 rounded focus:ring-slate-500"
                />
                <Label htmlFor="remember" className="text-slate-600 text-sm">
                  Remember Me
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-slate-600 hover:bg-slate-700 text-white font-medium"
              >
                Login
              </Button>

              <div className="text-center">
                <a
                  href="#"
                  className="text-slate-400 text-sm hover:text-slate-600 underline"
                >
                  Restaurar mi contraseña
                </a>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-200">
              <p className="text-slate-600 text-sm font-medium">
                Credenciales de prueba:
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-slate-500 text-xs">
                  <span className="font-medium">Admin:</span> admin / 123456
                </p>
                <p className="text-slate-500 text-xs">
                  <span className="font-medium">Colaborador:</span> colaborador1
                  / password
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botón para volver al home */}
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white hover:bg-white/10"
          >
            ← Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}
