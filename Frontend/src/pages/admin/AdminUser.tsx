import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {api} from "@/utils/Axios.tsx";
import {LoadingPage} from "@/components/LoadingPage.tsx";
import type {User} from "@/types/type.ts";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";

const AdminUser = () => {
    const {id} = useParams<{id: string}>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const result = await api.get(`/admin/user/${id}`,{withCredentials: true});
                setUser(result.data.data || result.data);
            } catch (error) {
                console.error("Error fetching user details:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchUser();
        }
    }, [id]);

    const handleToggleBan = async () => {
        if (!user) return;
        try {
            setIsProcessing(true);
            const action = user.isActive ? "ban" : "unban";
            await api.put(`/admin/user/${action}/${user.id}`);
            setUser({ ...user, isActive: !user.isActive });
            toast.success(`User successfully ${user.isActive ? "banned" : "unbanned"}.`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update user status.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) return <LoadingPage />;
    if (!user) return <div className="p-6 text-center">User not found</div>;

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight mb-6">User Details</h1>
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    <div className="bg-muted/30 p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
                        <Avatar className="h-32 w-32 border-4 border-background shadow-sm">
                            {user.image && <AvatarImage src={user.image} alt={user.name} className="object-cover" />}
                            <AvatarFallback className="text-4xl bg-primary/15 text-primary">
                                {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2 text-center md:text-left mt-2">
                            <h2 className="text-3xl font-bold tracking-tight">{user.name}</h2>
                            <p className="text-muted-foreground text-lg">{user.email}</p>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                                <Badge variant="secondary" className="uppercase text-xs">{user.role}</Badge>
                                <Badge variant={user.isActive ? "default" : "destructive"} className={user.isActive ? "bg-green-500 hover:bg-green-600 uppercase text-xs" : "uppercase text-xs"}>
                                    {user.isActive ? "Active" : "Inactive"}
                                </Badge>
                                <Badge variant={user.emailVerified ? "outline" : "secondary"} className={user.emailVerified ? "text-green-600 border-green-200 bg-green-50 uppercase text-xs" : "text-primary bg-primary/10 uppercase text-xs"}>
                                    {user.emailVerified ? "Email Verified" : "Email Unverified"}
                                </Badge>
                            </div>
                        </div>
                        <div className="shrink-0 mt-4 md:mt-0 flex items-center h-full">
                            <Button 
                                variant={user.isActive ? "destructive" : "default"} 
                                onClick={handleToggleBan}
                                disabled={isProcessing}
                            >
                                {user.isActive ? "Ban User" : "Unban User"}
                            </Button>
                        </div>
                    </div>
                    <Separator />
                    <div className="p-8">
                        <h3 className="text-lg font-semibold mb-6">Additional Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">User ID</p>
                                <p className="font-mono text-sm bg-muted px-2 py-1 rounded-md inline-block">{user.id}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                                <p className="font-medium">{user.phone || "Not provided"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Joined Date</p>
                                <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                                <p className="font-medium">{new Date(user.updatedAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminUser;