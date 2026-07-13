import { lazy, useState } from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-muted/20 flex min-h-screen overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full" onClick={(e) => {
          if ((e.target as HTMLElement).closest('a') || (e.target as HTMLElement).closest('button')) {
            // Give a tiny delay for navigation/theme changes to trigger before hiding
            setTimeout(() => setSidebarOpen(false), 150);
          }
        }}>
          <SellerSidebar />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-y-auto">
        {/* Mobile Header */}
        <div className="bg-background/95 sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 backdrop-blur-sm md:hidden">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="text-foreground hover:bg-muted p-2 rounded-md"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-semibold text-primary">Seller Center</span>
        </div>
        <div className="flex-1">
          <Outlet />
        </div>
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
