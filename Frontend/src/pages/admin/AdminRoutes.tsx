import { lazy } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { AdminDashboard } from "@/pages/admin/AdminDashboard.tsx";
import AdminSidebar from "@/pages/admin/AdminSidebar.tsx";

const AdminSeller = lazy(() => import("@/pages/admin/AdminSeller.tsx"));
const AdminSellersPage = lazy(
  () => import("@/pages/admin/AdminSellersPage.tsx"),
);
const AdminUser = lazy(() => import("@/pages/admin/AdminUser.tsx"));
const AdminUsersPage = lazy(() => import("@/pages/admin/AdminUsersPage.tsx"));
const AdminPendingList = lazy(
  () => import("@/pages/admin/AdminPendingList.tsx"),
);
const OrderList = lazy(() => import("@/pages/admin/OrderList.tsx"));
const OrderPage = lazy(() => import("@/pages/admin/OrderPage.tsx"));

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar for desktop/tablet */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path={"/seller"} element={<AdminSellersPage />} />
        <Route path={"/seller/:id"} element={<AdminSeller />} />
        <Route path={"/user"} element={<AdminUsersPage />} />
        <Route path={"/user/:id"} element={<AdminUser />} />
        <Route path={"/pending"} element={<AdminPendingList />} />
        <Route path={"/orders"} element={<OrderList />} />
        <Route path={"/orders/:id"} element={<OrderPage />} />
        <Route path={"*"} element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
