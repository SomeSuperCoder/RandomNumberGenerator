import { createBrowserRouter } from "react-router-dom";
import GeneratePage from "../../pages/GeneratePage";
import CheckerRandom from "../../pages/CheckerRandomPage";
import Lottery from "../../pages/LotteryPage";
import MainPage from "../../pages/MainPage";
import BlockedRoute from "./BlockedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "checker",
    element: <CheckerRandom />,
  },
  {
    path: "lottery",
    element: <Lottery />,
  },
  {
    path: "generate",
    element: <GeneratePage />,
  },
  {
    path: "*",
    element: <BlockedRoute />,
  },
]);
