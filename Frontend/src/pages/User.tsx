import { LoadingPage } from "@/components/LoadingPage";
import { authClient } from "@/lib/authClient";

export const User = () => {
  const { data: session, isPending, error } = authClient.useSession();

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Something went wrong!
      </div>
    );
  }

  if (isPending) {
    return <LoadingPage />;
  }

  if (!session) {
    return (
      <div className="p-4 text-gray-500">
        No user logged in
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-xl space-y-4">
      
      <h1 className="text-2xl font-bold text-blue-600">
        User Profile
      </h1>

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