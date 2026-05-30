/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Benefits } from "@/components/site/Benefits";
import { Quiz } from "@/components/site/Quiz";
import { Calculator } from "@/components/site/Calculator";
import { Results } from "@/components/site/Results";
import { Method } from "@/components/site/Method";
import { Dashboard } from "@/components/site/Dashboard";
import { WeeklyReport } from "@/components/site/WeeklyReport";
import { CTA } from "@/components/site/CTA";
import { Footer } from "@/components/site/Footer";
import { Studentarea } from "@/components/site/Studentarea";
// Importamos com a primeira letra maiúscula para o React reconhecer como componente
import { admin_dashboard as AdminDashboard } from "@/components/site/admin_dashboard";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  // Estados para controlar qual área mostrar
  const [showStudentArea, setShowStudentArea] = useState(false);
  const [showAdminArea, setShowAdminDashboard] = useState(false);

  // Funções de navegação
  const handleAccessStudentArea = () => {
    setShowStudentArea(true);
    setShowAdminDashboard(false);
  };

  const handleAccessAdminArea = () => {
    setShowAdminDashboard(true);
    setShowStudentArea(false);
  };

  const handleBackToHome = () => {
    setShowStudentArea(false);
    setShowAdminDashboard(false);
  };

  // Renderização Condicional
  if (showStudentArea) {
    return (
      <div className="relative bg-background text-foreground overflow-x-hidden">
        <Studentarea onBackToHome={handleBackToHome} />
      </div>
    );
  }

  if (showAdminArea) {
    return (
      <div className="relative bg-background text-foreground overflow-x-hidden">
        {/* Aqui usamos o componente com letra maiúscula */}
        <AdminDashboard onBackToHome={handleBackToHome} />
      </div>
    );
  }

  // Landing Page
  return (
    <main className="relative bg-background text-foreground overflow-x-hidden">
      <Nav 
        onAccessStudentArea={handleAccessStudentArea} 
        onAccessadmin_dashboard={handleAccessAdminArea} 
      />
      <Hero 
        onAccessStudentArea={handleAccessStudentArea} 
        onAccessadmin_dashboard={handleAccessAdminArea} 
      />
      <Benefits />
      <Method />
      <Quiz />
      <Calculator />
      <Results />
      <Dashboard />
      <WeeklyReport />
      <CTA 
        onAccessStudentArea={handleAccessStudentArea} 
        onAccessadmin_dashboard={handleAccessAdminArea} 
      />
      <Footer />
    </main>
  );
}