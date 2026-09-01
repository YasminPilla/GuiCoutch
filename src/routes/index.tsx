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

// Ribbon fixo lembrando o admin que ele está em modo preview e dando um jeito
// óbvio de voltar, sem depender de entender que o "Sair" do aluno também volta.
function ViewAsAdminBanner({ studentName, onExit }: { studentName: string; onExit: () => void }) {
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 9999,
      background: "#00C96B", color: "#000",
      padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "center",
      gap: 12, fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
      flexWrap: "wrap",
    }}>
      <span>Modo admin: visualizando como {studentName}</span>
      <button onClick={onExit} style={{
        background: "#000", color: "#fff", border: "none", borderRadius: 8,
        padding: "4px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer",
      }}>
        Voltar ao Admin
      </button>
    </div>
  );
}

function Index() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadStoredUser());
  const [showLoginPage, setShowLoginPage] = useState(false);
  // Preview "ver como aluno": só usado por um admin logado, não altera a sessão real.
  const [viewAsStudent, setViewAsStudent] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setShowLoginPage(false);
    persistUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowLoginPage(false);
    setViewAsStudent(null);
    persistUser(null);
  };

  const handleViewAsStudent = (student: User) => setViewAsStudent(student);
  const handleExitViewAsStudent = () => setViewAsStudent(null);

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

          {!showLoginPage && currentUser?.role === "admin" && !viewAsStudent && (
            <AdminDashboard user={currentUser} onLogout={handleLogout} onViewAsStudent={handleViewAsStudent} />
          )}

          {!showLoginPage && currentUser?.role === "admin" && viewAsStudent && (
            <>
              <ViewAsAdminBanner studentName={viewAsStudent.name} onExit={handleExitViewAsStudent} />
              <StudentDashboard user={viewAsStudent} onLogout={handleExitViewAsStudent} />
            </>
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