import Dashboard from "@/pages/Dashboard";
import { useGetUserQuery } from "@/redux/user/userApi";
import { Navigate } from "react-router-dom";

const RootRedirect = () => {
  const { data: user, isLoading } = useGetUserQuery();
  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  if (user) {
    sessionStorage.setItem("kartify_role", user.role);
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "seller") return <Navigate to="/seller" replace />;
    if (user.role === "user") return <Navigate to="/products" replace />;
  }
  return <Dashboard />;
};

export default RootRedirect;
