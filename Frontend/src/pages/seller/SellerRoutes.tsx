import { lazy } from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import { SellerDashboard } from "@/pages/seller/SellerDashboard.tsx";
import { SellerSidebar } from "./SellerSidebar";

const AddProduct = lazy(() => import("@/pages/seller/AddProduct"));
const SingleProduct = lazy(() => import("@/pages/seller/SingleProduct"));
const Products = lazy(() => import("@/pages/seller/Products"));
const EditProduct = lazy(() => import("@/pages/seller/EditProduct"));
const Order = lazy(() => import("@/pages/seller/Order"));
const Orders = lazy(() => import("@/pages/seller/Orders"));
const Store = lazy(() => import("@/pages/seller/Store"));

// Layout wrapper for Seller section
const SellerLayout = () => {
  return (
    <div className="bg-muted/20 flex min-h-screen">
      {/* Sidebar for desktop/tablet */}
      <SellerSidebar />

      {/* Main Content Area */}
      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export const SellerRoutes = () => {
  return (
    <Routes>
      <Route element={<SellerLayout />}>
        <Route index element={<SellerDashboard />} />
        <Route path="add" element={<AddProduct />} />
        <Route path="products" element={<Products />} />
        <Route path="product/:id" element={<SingleProduct />} />
        <Route path="product/:id/edit" element={<EditProduct />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:id" element={<Order />} />
        <Route path="store" element={<Store />} />
        {/* Fallback for undefined seller routes */}
        <Route path="*" element={<SellerDashboard />} />
      </Route>
    </Routes>
  );
};

export default SellerRoutes;
