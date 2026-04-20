import { authClient } from "@/lib/authClient";
import { useAppDispatch } from "@/redux/hook";
import { clearUser } from "@/redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    dispatch(clearUser());
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("logout successfully");
          navigate("/login");
        },
      },
    });
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="text-2xl font-bold text-blue-600">Kartify</div>

      {/* Links */}
      <ul className="flex gap-6 text-gray-700 font-medium">
        <li>
          <Link className="hover:text-blue-600 transition" to="/">
            Home
          </Link>
        </li>
        <li>
          <Link className="hover:text-blue-600 transition" to="/products">
            Products
          </Link>
        </li>
        <li>
          <Link className="hover:text-blue-600 transition" to="/wishlist">
            wishlist
          </Link>
        </li>
        <li>
          <Link className="hover:text-blue-600 transition" to="/notification">
            notification
          </Link>
        </li>
        <li>
          <Link className="hover:text-blue-600 transition" to="/cart">
            cart
          </Link>
        </li>
        <li>
          <Link className="hover:text-blue-600 transition" to="/login">
            Login
          </Link>
        </li>
        <li>
          <Link className="hover:text-blue-600 transition" to="/signup">
            Signup
          </Link>
        </li>
        <li>
          <Link className="hover:text-blue-600 transition" to="/user">
            User
          </Link>
        </li>
        <li>
          <button
            className="hover:text-blue-600 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};
