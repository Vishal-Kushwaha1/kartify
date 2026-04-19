import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchUser } from "@/redux/user/userThunk";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { LoadingPage } from "./LoadingPage";

export const ProtectedRoute = () => {
  
  const user = useAppSelector((state) => state.user.user);
  const loading = useAppSelector((state) => state.user.loading);
  if (loading) {
    return <LoadingPage />;
  }
  if (!user) {
    return <Navigate to={"/login"} replace />;
  }
  return <Outlet />;
};
