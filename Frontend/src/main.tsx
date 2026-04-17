import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { store } from "@/redux/store.js";
import { Provider } from "react-redux";

import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster position={"bottom-right"} />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
