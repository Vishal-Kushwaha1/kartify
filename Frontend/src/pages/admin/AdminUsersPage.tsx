import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {api} from "@/utils/Axios.tsx";
import {LoadingPage} from "@/components/LoadingPage.tsx";
import type {User} from "@/types/type.ts";
import UserCard from "@/components/UserCard.tsx";

const AdminUsersPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[] >([])
    const [loading , setLoading ] = useState<boolean>(true)

    useEffect(() => {
        const pendingSellers = async () => {
            setLoading(true)
            const result = await api.get("/admin/user", {withCredentials: true});
            setUsers(result.data.data)
            setLoading(false)
        }
        pendingSellers()
    }, []);

    if (loading) return <LoadingPage />;
    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">All Users</h1>
                <p className="text-muted-foreground mt-1">Manage and view all registered users on the platform.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {users.length > 0 ? (
                    users.map((user) => (
                        <div key={user.id} className="cursor-pointer" onClick={() => navigate(`/admin/user/${user.id}`)}>
                            <UserCard user={user} />
                        </div>
                    ))
                ) : (
                    <p className="text-muted-foreground">No users found.</p>
                )}
            </div>
        </div>
    );
};

export default AdminUsersPage;