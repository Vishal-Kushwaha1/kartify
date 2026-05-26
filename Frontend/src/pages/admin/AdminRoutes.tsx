import {Outlet, Route, Routes} from "react-router-dom";
import {AdminDashboard} from "@/pages/admin/AdminDashboard.tsx";
import AdminSidebar from "@/pages/admin/AdminSidebar.tsx";
import AdminSellersPage from "@/pages/admin/AdminSellersPage.tsx";
import AdminUser from "@/pages/admin/AdminUser.tsx";
import AdminSeller from "@/pages/admin/AdminSeller.tsx";
import AdminUsersPage from "@/pages/admin/AdminUsersPage.tsx";
import AdminPendingList from "@/pages/admin/AdminPendingList.tsx";
import OrderList from "./OrderList.tsx";
import OrderPage from "@/pages/admin/OrderPage.tsx";


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

const AdminRoutes = ()=>{
    return (
            <Routes>
                <Route element={<AdminLayout/>} >
                    <Route index element={<AdminDashboard/>}/>
                    <Route path={"/seller"} element={<AdminSellersPage/>}/>
                    <Route path={"/seller/:id"} element={<AdminSeller/>}/>
                    <Route path={"/user"} element={<AdminUsersPage/>}/>
                    <Route path={"/user/:id"} element={<AdminUser/>}/>
                    <Route path={"/pending"} element={<AdminPendingList/>}/>
                    <Route path={"/orders"} element={<OrderList/>}/>
                    <Route path={"/orders/:id"} element={<OrderPage/>} />
                    <Route path={"*"} element={<AdminDashboard/>} />
                </Route>
            </Routes>
    )
}

export default AdminRoutes