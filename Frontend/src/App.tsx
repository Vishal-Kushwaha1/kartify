import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import { Dashboard } from "./pages/Dashboard"
import Login from "./pages/Login"
import { Signup } from "./pages/Signup"
import { RequireAuth } from "./components/RequireAuth"

export const App = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
    </>
  )
}