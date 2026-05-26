import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/redux/hook";
import { getDashboardPath } from "@/utils/authUtils";

export const PublicRoute = () => {
  const { user, loading } = useAppSelector((state) => state.user);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent" />
      </div>
    );
  }

  // If user is logged in, redirect them to their dashboard
  if (user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <Outlet />;
};
