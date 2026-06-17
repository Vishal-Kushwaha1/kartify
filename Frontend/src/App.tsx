import { lazy, Suspense } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import RoleRoute from "./components/RoleRoute";
import { useGetUserQuery } from "./redux/user/userApi";
import RootRedirect from "./components/RootRedirect";

// Unprotected
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Products = lazy(() => import("@/pages/Products"));
const ProductDetailPage = lazy(() => import("@/pages/ProductDetailPage"));

// Auth
const Login = lazy(() => import("@/pages/Login"));
const Signup = lazy(() => import("@/pages/Signup"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));

// User protected
const User = lazy(() => import("@/pages/User"));
const Cart = lazy(() => import("@/pages/Cart"));
const Wishlist = lazy(() => import("@/pages/Wishlist"));
const Orders = lazy(() => import("@/pages/Orders"));
const OrderDetail = lazy(() => import("@/pages/OrderDetail"));
const AddAddressPage = lazy(() => import("@/pages/AddAddressPage"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const OrderSuccess = lazy(() => import("@/pages/OrderSuccess"));
const ApplyForSeller = lazy(() => import("@/pages/ApplyForSeller"));

// Seller protected
const SellerRoutes = lazy(() => import("@/pages/seller/SellerRoutes"));
const AdminRoutes = lazy(() => import("@/pages/admin/AdminRoutes"));

// Main Layout for routes that need Navbar & Footer
const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export const App = () => {
  const { data: user } = useGetUserQuery();

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent" />
        </div>
      }
    >
      <Routes>
        {/* Routes WITH Navbar and Footer */}
        <Route element={<MainLayout />}>
          {/* Unprotected */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />

          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/" replace /> : <Signup />}
          />
          <Route
            path="/forgot-password"
            element={user ? <Navigate to="/" replace /> : <ForgotPassword />}
          />

          {/* User routes */}
          <Route element={<RoleRoute allowedRole="user" />}>
            <Route path="/user" element={<User />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:orderId" element={<OrderDetail />} />
            <Route path="/add-address" element={<AddAddressPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/apply" element={<ApplyForSeller />} />
          </Route>
        </Route>

        {/* Routes WITHOUT Navbar and Footer (Dashboards) */}

        {/* Seller routes */}
        <Route element={<RoleRoute allowedRole="seller" />}>
          <Route path="/seller/*" element={<SellerRoutes />} />
        </Route>

        {/* Admin routes */}
        <Route element={<RoleRoute allowedRole="admin" />}>
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Route>

        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </Suspense>
  );
};
