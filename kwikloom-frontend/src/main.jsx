import React from "react";
import ReactDOM from "react-dom/client";

// Import the AppWrapper from App.jsx
import AppWrapper from "./App.jsx";

// Import TailwindCSS styles (ensure index.css contains Tailwind directives)
import "./index.css";

// Mount the app to the root div in index.html
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
