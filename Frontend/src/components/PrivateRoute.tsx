import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGetUserQuery } from "@/redux/user/userApi";

export const PrivateRoute = () => {
  const { data: user, isLoading: loading } = useGetUserQuery();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent" />
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
