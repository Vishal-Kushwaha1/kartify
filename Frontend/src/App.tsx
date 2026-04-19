import { Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import { Signup } from "@/pages/Signup";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { User } from "@/pages/User";
import { Products } from "@/pages/Products";
import { Cart } from "@/pages/Cart";
import { Wishlist } from "@/pages/Wishlist";
import { Orders } from "@/pages/Orders";
import { Notification } from "@/pages/Notification";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAppDispatch } from "./redux/hook";
import { useEffect } from "react";
import { fetchUser } from "./redux/user/userThunk";
import { PublicOnlyRoutes } from "./components/PublicOnlyRoutes";

export const App = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);
  return (
    <>
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        <Route element={<PublicOnlyRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route path="/products" element={<Products />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/user" element={<User />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/notification" element={<Notification />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
};
