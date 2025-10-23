import type { Location } from "react-router-dom";
export const getBackgroundColor = (location: Location) => {
  if (location.pathname === "/checker") {
    return "#FF2A7F";
  }
  return "#388E3C";
};
