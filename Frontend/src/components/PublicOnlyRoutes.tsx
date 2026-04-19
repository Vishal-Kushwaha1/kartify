import { useAppSelector } from "@/redux/hook";
import { LoadingPage } from "./LoadingPage";
import { Navigate, Outlet } from "react-router-dom";

export const PublicOnlyRoutes = () => {
  const loading = useAppSelector((state) => state.user.loading);
  const user = useAppSelector((state) => state.user.user);
  if (loading) {
    return <LoadingPage />;
  }

  if (user) {
    return <Navigate to={"/"} replace />;
  }

  return <Outlet />;
};
