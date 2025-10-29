import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900">
      {/* Background grid */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,107,0,0.05) 2px, transparent 2px),
              linear-gradient(90deg, rgba(255,107,0,0.05) 2px, transparent 2px),
              linear-gradient(rgba(255,107,0,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,107,0,0.02) 1px, transparent 1px)
            `,
            backgroundSize: "100px 100px, 100px 100px, 20px 20px, 20px 20px",
            backgroundPosition: "-2px -2px, -2px -2px, -1px -1px, -1px -1px",
            animation: "gridScroll 20s linear infinite",
          }}
        />
      </div>

      {/* Accents */}
      <div className="fixed top-10 right-10 w-64 h-64 border-4 border-orange-500/20 rounded-full animate-ping" style={{ animationDuration: "4s" }} />
      <div className="fixed bottom-20 left-10 w-48 h-48 border-4 border-red-500/20 animate-pulse" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />

      {/* Command Center */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 space-y-8 relative">
          <div className="inline-block relative animate-float">
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-red-700 rounded-full opacity-20 blur-2xl animate-pulse" />
              <div className="relative w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 rounded-full border-4 border-orange-500 flex items-center justify-center shadow-2xl">
                <Shield className="w-16 h