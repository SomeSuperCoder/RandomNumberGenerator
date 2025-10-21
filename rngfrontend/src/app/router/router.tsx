import { createBrowserRouter } from "react-router-dom";
import GeneratePage from "../../pages/GeneratePage";
import CheckerRandom from "../../pages/CheckerRandom";
import Lottery from "../../pages/Lottery";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <GeneratePage />,
  },
  {
    path: "checker",
    element: <CheckerRandom />,
  },
  {
    path: "lottery",
    element: <Lottery />,
  },
]);
