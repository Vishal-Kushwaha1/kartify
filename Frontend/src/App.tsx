import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import Login from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { User } from "./pages/User";

export const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user" element={<User />} />
      </Routes>
      <Footer />
    </>
  );
};
