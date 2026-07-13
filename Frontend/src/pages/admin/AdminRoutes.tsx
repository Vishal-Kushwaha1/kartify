import { lazy, useState } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { Menu } from "lucide-react";
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
          <AdminSidebar />
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
          <span className="font-semibold text-primary">Admin Center</span>
        </div>
        <div className="flex-1">
          <Outlet />
        </div>
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
