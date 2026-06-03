import { useAppSelector } from "@/redux/hook";
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
} from "lucide-react"
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const User = () => {
  const user = useAppSelector((state) => state.user.user);
  const loading = useAppSelector((state) => state.user.loading);
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <UserIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">No active session found. Please log in.</p>
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
    <div className="min-h-screen bg-muted/20 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Profile Header Card */}
        <Card className="overflow-hidden border-border/50 shadow-lg bg-background/60 backdrop-blur-xl">
          {/* Banner */}
          <div className="h-32 sm:h-48 w-full bg-linear-to-r from-primary/80 via-primary to-primary/60 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          </div>
          
          <CardContent className="relative px-6 sm:px-10 pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 sm:-mt-20 mb-6">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage src={user.image || "/default.png"} alt={user.name} className="object-cover" />
                <AvatarFallback className="text-4xl font-bold bg-muted text-muted-foreground">
                  {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center sm:text-left space-y-1.5 pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">{user.name}</h1>
                  <Badge className={`px-3 py-1 text-xs uppercase tracking-wider font-semibold text-white ${getRoleColor(user.role)}`}>
                    {user.role}
                  </Badge>
                </div>
                <div className="flex items-center justify-center sm:justify-start text-muted-foreground gap-2 text-sm font-medium">
                  <Mail className="h-4 w-4" />
                  {user.email}
                  {user.emailVerified ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>
              </div>

            <Button onClick={()=> navigate("/add-address")}>Add Address</Button>
            </div>
          </CardContent>
        </Card>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Account Information */}
          <Card className="border-border/50 shadow-md bg-background/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <IdCard className="h-5 w-5 text-primary" />
                Account Information
              </h3>
              
              <div className="space-y-5">
                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">User ID</p>
                    <p className="text-sm font-mono text-foreground break-all">{user.id}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone Number</p>
                    <p className="text-sm font-medium text-foreground">
                      {user.phone ? user.phone : <span className="text-muted-foreground italic">Not provided</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Account Role</p>
                    <p className="text-sm font-medium text-foreground capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Details */}
          <Card className="border-border/50 shadow-md bg-background/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                System Details
              </h3>
              
              <div className="space-y-5">
                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</p>
                      <p className="text-sm font-medium text-foreground">Account Active</p>
                    </div>
                    <Badge variant={user.isActive ? "default" : "destructive"} className="shadow-sm">
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Member Since</p>
                    <p className="text-sm font-medium text-foreground">{formatDate(user.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Updated</p>
                    <p className="text-sm font-medium text-foreground">{formatDate(user.updatedAt)}</p>
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