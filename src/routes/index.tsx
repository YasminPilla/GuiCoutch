/* eslint-disable prettier/prettier */
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
import { SharedAppProvider, useAppContext } from "@/components/site/SharedAppState";

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

const SESSION_KEY = "gc_session_user";

function loadStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function persistUser(user: User | null) {
  try {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* localStorage indisponível (modo privado etc.) — segue sem persistir */
  }
}

// Invalida a sessão restaurada do localStorage caso o usuário tenha sido
// removido ou desativado no Firestore enquanto o app estava fechado.
function SessionGuard({ currentUser, onInvalid }: { currentUser: User | null; onInvalid: () => void }) {
  const { users } = useAppContext();

  useEffect(() => {
    if (!currentUser || users.length === 0) return;
    const stillValid = users.some(u => u.id === currentUser.id && u.status !== "inactive");
    if (!stillValid) onInvalid();
  }, [users, currentUser, onInvalid]);

  return null;
}

function Index() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadStoredUser());
  const [showLoginPage, setShowLoginPage] = useState(false);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setShowLoginPage(false);
    persistUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowLoginPage(false);
    persistUser(null);
  };

  const handleAccessLogin = () => setShowLoginPage(true);
  const handleBackToHome  = () => setShowLoginPage(false);

  return (
    <>
      {(showLoginPage || currentUser) && (
        <SharedAppProvider>
          <SessionGuard currentUser={currentUser} onInvalid={handleLogout} />

          {showLoginPage && (
            <LoginPage onLogin={handleLogin} onBackToHome={handleBackToHome} />
          )}

          {!showLoginPage && currentUser?.role === "admin" && (
            <AdminDashboard user={currentUser} onLogout={handleLogout} />
          )}

          {!showLoginPage && currentUser?.role === "student" && (
            <StudentDashboard user={currentUser} onLogout={handleLogout} />
          )}
        </SharedAppProvider>
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
    </>
  );
}