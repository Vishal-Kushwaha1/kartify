import { useAppSelector } from "@/redux/hook";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const user = useAppSelector((state) => state.user.user);
  if (!user) {
    return <Navigate to={"/login"} replace />;
  }
  return <Outlet />;
};
