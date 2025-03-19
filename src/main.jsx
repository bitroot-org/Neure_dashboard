import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import UserContext from "./context/UserContext.jsx";
import CompanyContext from "./context/CompanyContext.jsx";
import './index.css'
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserContext>
      <CompanyContext>
        <App />
      </CompanyContext>
    </UserContext>
  </StrictMode>
);