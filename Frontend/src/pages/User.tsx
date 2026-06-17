import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  User as UserIcon,
  ShieldCheck,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Briefcase,
  IdCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGetUserQuery } from "@/redux/user/userApi";

export const User = () => {
  const { data: user, isLoading } = useGetUserQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-muted/40 flex min-h-screen items-center justify-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-muted/40 flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="bg-muted mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <UserIcon className="text-muted-foreground h-8 w-8" />
          </div>
          <p className="text-muted-foreground font-medium">
            No active session found. Please log in.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-red-500 hover:bg-red-600";
      case "seller":
        return "bg-blue-500 hover:bg-blue-600";
      default:
        return "bg-emerald-500 hover:bg-emerald-600";
    }
  };

  return (
    <div className="bg-muted/20 min-h-screen px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Profile Header Card */}
        <Card className="border-border/50 bg-background/60 overflow-hidden shadow-lg backdrop-blur-xl">
          {/* Banner */}
          <div className="from-primary/80 via-primary to-primary/60 relative h-32 w-full bg-linear-to-r sm:h-48">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          </div>

          <CardContent className="relative px-6 pb-8 sm:px-10">
            <div className="-mt-16 mb-6 flex flex-col items-center gap-6 sm:-mt-20 sm:flex-row sm:items-end">
              <Avatar className="border-background h-32 w-32 border-4 shadow-xl">
                <AvatarImage
                  src={user.image || "/default.png"}
                  alt={user.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-muted text-muted-foreground text-4xl font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-1.5 pb-2 text-center sm:text-left">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <h1 className="text-foreground text-3xl font-bold tracking-tight">
                    {user.name}
                  </h1>
                  <Badge
                    className={`px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase ${getRoleColor(user.role)}`}
                  >
                    {user.role}
                  </Badge>
                </div>
                <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm font-medium sm:justify-start">
                  <Mail className="h-4 w-4" />
                  {user.email}
                  {user.emailVerified ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <XCircle className="text-destructive h-4 w-4" />
                  )}
                </div>
              </div>

              <Button onClick={() => navigate("/add-address")}>
                Add Address
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Account Information */}
          <Card className="border-border/50 bg-background/50 shadow-md backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold">
                <IdCard className="text-primary h-5 w-5" />
                Account Information
              </h3>

              <div className="space-y-5">
                <div className="hover:bg-muted/50 flex items-start gap-4 rounded-xl p-3 transition-colors">
                  <div className="bg-primary/10 text-primary rounded-lg p-2">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      User ID
                    </p>
                    <p className="text-foreground font-mono text-sm break-all">
                      {user.id}
                    </p>
                  </div>
                </div>

                <div className="hover:bg-muted/50 flex items-start gap-4 rounded-xl p-3 transition-colors">
                  <div className="bg-primary/10 text-primary rounded-lg p-2">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      Phone Number
                    </p>
                    <p className="text-foreground text-sm font-medium">
                      {user.phone ? (
                        user.phone
                      ) : (
                        <span className="text-muted-foreground italic">
                          Not provided
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="hover:bg-muted/50 flex items-start gap-4 rounded-xl p-3 transition-colors">
                  <div className="bg-primary/10 text-primary rounded-lg p-2">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      Account Role
                    </p>
                    <p className="text-foreground text-sm font-medium capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Details */}
          <Card className="border-border/50 bg-background/50 shadow-md backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold">
                <ShieldCheck className="text-primary h-5 w-5" />
                System Details
              </h3>

              <div className="space-y-5">
                <div className="hover:bg-muted/50 flex items-start gap-4 rounded-xl p-3 transition-colors">
                  <div className="bg-primary/10 text-primary rounded-lg p-2">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="flex flex-1 items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                        Status
                      </p>
                      <p className="text-foreground text-sm font-medium">
                        Account Active
                      </p>
                    </div>
                    <Badge
                      variant={user.isActive ? "default" : "destructive"}
                      className="shadow-sm"
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                <div className="hover:bg-muted/50 flex items-start gap-4 rounded-xl p-3 transition-colors">
                  <div className="bg-primary/10 text-primary rounded-lg p-2">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      Member Since
                    </p>
                    <p className="text-foreground text-sm font-medium">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="hover:bg-muted/50 flex items-start gap-4 rounded-xl p-3 transition-colors">
                  <div className="bg-primary/10 text-primary rounded-lg p-2">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      Last Updated
                    </p>
                    <p className="text-foreground text-sm font-medium">
                      {formatDate(user.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default User;
