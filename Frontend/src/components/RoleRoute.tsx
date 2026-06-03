import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/redux/hook";
import { getDashboardPath } from "@/utils/authUtils";
import type { UserRoleEnum } from "@/types/type";

interface RoleRouteProps {
  allowedRole: UserRoleEnum;
}

const RoleRoute = ({ allowedRole }: RoleRouteProps) => {
  const { user, loading } = useAppSelector((state) => state.user);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role
  if (user && user.role !== allowedRole) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <Outlet />;
};

export default RoleRoute