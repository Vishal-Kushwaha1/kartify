import {lazy, Suspense, useEffect} from "react";
import {Routes, Route, Outlet, Navigate} from "react-router-dom";
import {useAppSelector, useAppDispatch} from "./redux/hook";
import {fetchUser} from "./redux/user/userThunk";
import {fetchCartItem} from "@/redux/cart/cartThunk.ts";
import {Navbar} from "@/components/Navbar";
import {Footer} from "@/components/Footer";
import RoleRoute from "./components/RoleRoute";

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
const AdminRoutes = lazy(()=> import("@/pages/admin/AdminRoutes"))



// Main Layout for routes that need Navbar & Footer
const MainLayout = () => {
    const dispatch = useAppDispatch();
    const {user} = useAppSelector((state)=> state.user)
    useEffect(() => {
        if(user){
            dispatch(fetchCartItem());
        }
    }, [dispatch, user]);
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar/>
            <main className="flex-1">
                <Outlet/>
            </main>
            <Footer/>
        </div>
    );
};

// Redirect root to corresponding dashboards if logged in
const RootRedirect = () => {
    const {user, loading} = useAppSelector((state) => state.user);
    if (loading) return (
        <div className="flex h-screen items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"/>
        </div>
    );
    if (user) {
        localStorage.setItem("kartify_role", user.role);
        if (user.role === "admin") return <Navigate to="/admin" replace/>;
        if (user.role === "seller") return <Navigate to="/seller" replace/>;
        if (user.role === "user") return <Navigate to="/products" replace/>;
    }
    return <Dashboard/>;
};

export const App = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);

    const {user} = useAppSelector((state) => state.user);

    return (
        <Suspense
            fallback={
                <div className="flex h-screen items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent"/>
                </div>
            }
        >
            <Routes>
                {/* Routes WITH Navbar and Footer */}
                <Route element={<MainLayout/>}>
                    {/* Unprotected */}
                    <Route path="/" element={<RootRedirect/>}/>
                    <Route path="/products" element={<Products/>}/>
                    <Route path="/products/:id" element={<ProductDetailPage/>}/>

                    <Route path="/login" element={user ? <Navigate to="/" replace/> : <Login/>}/>
                    <Route path="/signup" element={user ? <Navigate to="/" replace/> : <Signup/>}/>
                    <Route path="/forgot-password"
                           element={user ? <Navigate to="/" replace/> : <ForgotPassword/>}/>

                    {/* User routes */}
                    <Route element={<RoleRoute allowedRole="user"/>}>
                        <Route path="/user" element={<User/>}/>
                        <Route path="/cart" element={<Cart/>}/>
                        <Route path="/wishlist" element={<Wishlist/>}/>
                        <Route path="/orders" element={<Orders/>}/>
                        <Route path="/orders/:orderId" element={<OrderDetail/>}/>
                        <Route path="/add-address" element={<AddAddressPage/>}/>
                        <Route path="/checkout" element={<Checkout/>}/>
                        <Route path="/order-success" element={<OrderSuccess/>}/>
                        <Route path="/apply" element={<ApplyForSeller/>}/>
                    </Route>
                </Route>

                {/* Routes WITHOUT Navbar and Footer (Dashboards) */}

                {/* Seller routes */}
                <Route element={<RoleRoute allowedRole="seller"/>}>
                    <Route path="/seller/*" element={<SellerRoutes/>}/>
                </Route>

                {/* Admin routes */}
                <Route element={<RoleRoute allowedRole="admin"/>}>
                    <Route path="/admin/*" element={<AdminRoutes/>}/>
                </Route>

                <Route path="*" element={<h2>Page Not Found</h2>}/>
            </Routes>
        </Suspense>
    );
};
