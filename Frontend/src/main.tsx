import { ThemeProvider } from "next-themes";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.tsx";
import { store } from "@/redux/store.js";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider>
        <App />
        <Toaster position={"top-right"} />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>,
);
