import { Navigate, Outlet } from "react-router-dom";
import { getDashboardPath } from "@/utils/authUtils";
import type { UserRoleEnum } from "@/types/type";

interface RoleRouteProps {
  allowedRole: UserRoleEnum;
}

const RoleRoute = ({ allowedRole }: RoleRouteProps) => {
  const roleData = sessionStorage.getItem("kartify_role");

  if (!roleData) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role
  if (roleData !== allowedRole) {
    return <Navigate to={getDashboardPath(roleData as UserRoleEnum)} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
