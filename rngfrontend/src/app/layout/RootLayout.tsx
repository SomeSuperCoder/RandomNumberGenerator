import { Outlet } from "react-router-dom";
import Header from "@/shared/components/header/Header";
export default function RootLayout() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
