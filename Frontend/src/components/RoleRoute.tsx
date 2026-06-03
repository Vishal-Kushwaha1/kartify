import { Navigate, Outlet } from "react-router-dom";
import { getDashboardPath } from "@/utils/authUtils";
import type { UserRoleEnum } from "@/types/type";

interface RoleRouteProps {
  allowedRole: UserRoleEnum;
}

const RoleRoute = ({ allowedRole }: RoleRouteProps) => {
  const roleData = localStorage.getItem("kartify_role");
  
  // Parse the role - it might be JSON stringified or plain string
  let role = roleData;
  try {
    role = JSON.parse(roleData || "");
  } catch {
    role = roleData;
  }

  // Not logged in
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role
  if (role && role !== allowedRole) {
    return <Navigate to={getDashboardPath(role as UserRoleEnum)} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
