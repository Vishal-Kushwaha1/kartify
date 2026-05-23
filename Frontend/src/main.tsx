import { StrictMode } from "react";
import { ThemeProvider } from "next-themes";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { store } from "@/redux/store.js";
import { Provider } from "react-redux";

import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <Provider store={store}>
    <ThemeProvider>
      <BrowserRouter>
        <App />
        <Toaster position={"top-right"} />
      </BrowserRouter>
    </ThemeProvider>
  </Provider>,
  // </StrictMode>,
);
