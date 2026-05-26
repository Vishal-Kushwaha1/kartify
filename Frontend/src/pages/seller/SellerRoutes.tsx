import { Route, Routes, Outlet } from "react-router-dom";
import { AddProduct } from "./AddProduct";
import { SingleProduct } from "./SingleProduct";
import { Products } from "./Products";
import { EditProduct } from "./EditProduct";
import { SellerDashboard } from "@/pages/seller/SellerDashboard.tsx";
import { SellerSidebar } from "./SellerSidebar";
import Order from "@/pages/seller/Order.tsx";
import Orders from "@/pages/seller/Orders.tsx";

// Layout wrapper for Seller section
const SellerLayout = () => {
  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar for desktop/tablet */}
      <SellerSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
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
        {/* Fallback for undefined seller routes */}
        <Route path="*" element={<SellerDashboard />} />
      </Route>
    </Routes>
  );
};

export default SellerRoutes;
