import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import UserContext from "./context/UserContext.jsx";
import App from "./App.jsx";
import PresentationSlide from "./components/PresentationSlide/index.jsx";
import EventsCalendar from "./pages/EventDashboard/index.jsx";
import EventDashboard from "./pages/EventDashboard/index.jsx";

createRoot(document.getElementById("root")).render(
  <UserContext>
    <StrictMode>
      <App />
    </StrictMode>
  </UserContext>
);
