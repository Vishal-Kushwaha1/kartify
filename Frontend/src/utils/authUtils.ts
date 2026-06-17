import type { UserRoleEnum } from "@/types/type";

export const getDashboardPath = (role?: UserRoleEnum | null) => {
  if (!role) return "/login";
  switch (role) {
    case "admin":
      return "/admin";
    case "seller":
      return "/seller";
    case "user":
      return "/products";
    default:
      return "/products";
  }
};
