import { Outlet } from "react-router-dom";
import Header from "@/widgets/components/header/Header";
import AnimatedBackground from "@/widgets/components/background/AnimatedBackgroun";
export default function RootLayout() {
  return (
    <div className="app relative min-h-screen">
      <AnimatedBackground />
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
