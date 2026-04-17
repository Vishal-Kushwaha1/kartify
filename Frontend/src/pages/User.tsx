import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchUser } from "@/redux/user/userThunk";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const User = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.user.user);
  const loading = useAppSelector((state) => state.user.loading);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return <div>"Not logged in"</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-xl space-y-4">
      <h1 className="text-2xl font-bold text-blue-600">User Profile</h1>

      <div>
        <p className="text-gray-500 text-sm">Name</p>
        <h2 className="text-lg font-semibold">{user.name}</h2>
      </div>

      <div>
        <p className="text-gray-500 text-sm">Email</p>
        <h2 className="text-lg font-semibold">{user.email}</h2>
      </div>

      <div>
        <p className="text-gray-500 text-sm">ID</p>
        <h2 className="text-sm font-mono">{user.id}</h2>
      </div>

      <div>
        <p className="text-gray-500 text-sm">Image</p>
        <img
          src={user.image || "/default.png"}
          alt="user"
          className="w-16 h-16 rounded-full mt-2"
        />
      </div>
    </div>
  );
};
