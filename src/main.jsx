import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import UserContext from "./context/UserContext.jsx";
import App from "./App.jsx";
import Settings from "./pages/Settings/index.jsx";



createRoot(document.getElementById("root")).render(
  <UserContext>
    <StrictMode>
      <App />
    </StrictMode>
  </UserContext>
);
