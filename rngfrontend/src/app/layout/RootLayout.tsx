// src/layouts/RootLayout.tsx
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/widgets/components/header/Header";
import AnimatedBackground from "@/widgets/components/background/AnimatedBackgroun";

export default function RootLayout() {
  const location = useLocation();

  const getBackgroundColor = () => {
    if (location.pathname === "/checker") {
      return "#FF2A7F";
    }
    return "#388E3C";
  };

  return (
    <div className="">
      <Header />
      <main>
        <Outlet />
      </main>
      <AnimatedBackground color={getBackgroundColor()} />
    </div>
  );
}
