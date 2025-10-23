// src/layouts/RootLayout.tsx
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/widgets/components/header/Header";
import AnimatedBackground from "@/widgets/components/animations/background/AnimatedBackgroun";
import { getBackgroundColor } from "@/shared/utils/getBG";

export default function RootLayout() {
  const location = useLocation();
  getBackgroundColor(location);

  return (
    <div className="">
      <Header />
      <main>
        <Outlet />
      </main>
      <AnimatedBackground color={getBackgroundColor(location)} />
    </div>
  );
}
