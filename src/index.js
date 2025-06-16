import React from "react";
import ReactDOM from "react-dom/client";

// Import all necessary CSS files
import "./index.css";
import "./styles/globals.css";
import "./styles/utilities.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
