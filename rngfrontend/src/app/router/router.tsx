import { createBrowserRouter } from "react-router-dom";
import GeneratePage from "../../pages/GeneratePage";
import CheckerRandom from "../../pages/CheckerRandomPage";
import RootLayout from "../layout/RootLayout";
import MainPage from "../../pages/MainPage";
import BlockedRoute from "./BlockedRoute";
import LotteryPage from "../../pages/LotteryPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "generate", element: <GeneratePage /> },
      { path: "checker", element: <CheckerRandom /> },
      { path: "lottery", element: <LotteryPage /> },
      { path: "*", element: <BlockedRoute /> },
    ],
  },
]);
