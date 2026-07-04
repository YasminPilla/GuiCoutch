/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Quiz } from "@/components/site/Quiz";
import { Plans } from "@/components/site/Plans";
import { MicroProducts } from "@/components/site/MicroProducts";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Results } from "@/components/site/Results";
import { CTA } from "@/components/site/CTA";
import { LandingCarousel } from "@/components/site/LandingCarousel";
import { Footer } from "@/components/site/Footer";
import { StudentDashboard } from "@/components/site/Studentarea";
import { AdminDashboard } from "@/components/site/admin_dashboard";
import { LoginPage } from "@/components/site/LoginPage";
import { About } from "@/components/site/About";
import { SectionDivider } from "@/components/site/SectionDivider";
import { SharedAppProvider } from "@/components/site/SharedAppState";

export const Route = createFileRoute("/")({
  component: Index,
});

interface User {
  id: number;
  email: string;
  password: string;
  role: "admin" | "student";
  name: string;
  avatar?: string;
  status?: string;
  createdAt: string;
}

function Index() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLoginPage, setShowLoginPage] = useState(false);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setShowLoginPage(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowLoginPage(false);
  };

  const handleAccessLogin = () => setShowLoginPage(true);
  const handleBackToHome  = () => setShowLoginPage(false);

  return (
    <SharedAppProvider>
      {showLoginPage && (
        <LoginPage onLogin={handleLogin} onBackToHome={handleBackToHome} />
      )}

      {!showLoginPage && currentUser?.role === "admin" && (
        <AdminDashboard user={currentUser} onLogout={handleLogout} />
      )}

      {!showLoginPage && currentUser?.role === "student" && (
        <StudentDashboard user={currentUser} onLogout={handleLogout} />
      )}

      {!showLoginPage && !currentUser && (
        <main className="relative bg-background text-foreground overflow-x-hidden">
          <Nav
            onAccessLogin={handleAccessLogin}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
          <Hero />
          <LandingCarousel />
          <SectionDivider />
          <Quiz />
          <SectionDivider />
          <Plans />
          <SectionDivider />
          <MicroProducts />
          <SectionDivider />
          <HowItWorks />
          <SectionDivider />
          <Results />
          <SectionDivider />
          <About />
          <SectionDivider />
          <CTA onAccessLogin={handleAccessLogin} />
          <Footer />
        </main>
      )}
    </SharedAppProvider>
  );
}