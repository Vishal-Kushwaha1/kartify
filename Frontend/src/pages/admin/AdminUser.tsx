import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/utils/Axios.tsx";
import { LoadingPage } from "@/components/LoadingPage.tsx";
import type { User } from "@/types/type.ts";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const AdminUser = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const result = await api.get(`/admin/user/${id}`, {
          withCredentials: true,
        });
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
      toast.success(
        `User successfully ${user.isActive ? "banned" : "unbanned"}.`,
      );
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
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">User Details</h1>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-muted/30 flex flex-col items-center gap-8 p-8 md:flex-row md:items-start">
            <Avatar className="border-background h-32 w-32 border-4 shadow-sm">
              {user.image && (
                <AvatarImage
                  src={user.image}
                  alt={user.name}
                  className="object-cover"
                />
              )}
              <AvatarFallback className="bg-primary/15 text-primary text-4xl">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="mt-2 flex-1 space-y-2 text-center md:text-left">
              <h2 className="text-3xl font-bold tracking-tight">{user.name}</h2>
              <p className="text-muted-foreground text-lg">{user.email}</p>
              <div className="flex flex-wrap justify-center gap-2 pt-2 md:justify-start">
                <Badge variant="secondary" className="text-xs uppercase">
                  {user.role}
                </Badge>
                <Badge
                  variant={user.isActive ? "default" : "destructive"}
                  className={
                    user.isActive
                      ? "bg-green-500 text-xs uppercase hover:bg-green-600"
                      : "text-xs uppercase"
                  }
                >
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
                <Badge
                  variant={user.emailVerified ? "outline" : "secondary"}
                  className={
                    user.emailVerified
                      ? "border-green-200 bg-green-50 text-xs text-green-600 uppercase"
                      : "text-primary bg-primary/10 text-xs uppercase"
                  }
                >
                  {user.emailVerified ? "Email Verified" : "Email Unverified"}
                </Badge>
              </div>
            </div>
            <div className="mt-4 flex h-full shrink-0 items-center md:mt-0">
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
            <h3 className="mb-6 text-lg font-semibold">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">
                  User ID
                </p>
                <p className="bg-muted inline-block rounded-md px-2 py-1 font-mono text-sm">
                  {user.id}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">
                  Phone Number
                </p>
                <p className="font-medium">{user.phone || "Not provided"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">
                  Joined Date
                </p>
                <p className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">
                  Last Updated
                </p>
                <p className="font-medium">
                  {new Date(user.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUser;
