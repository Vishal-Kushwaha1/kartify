import { useGetUserQuery } from "@/redux/user/userApi";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const { data: user } = useGetUserQuery();
  if (!user) {
    return <Navigate to={"/login"} replace />;
  }
  return <Outlet />;
};
