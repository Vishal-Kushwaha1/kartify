import type { User } from "@/types/type.ts";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const UserCard = ({ user }: { user: User }) => {
  return (
    <Card className="cursor-pointer transition-all hover:shadow-md">
      <CardContent className="flex items-center gap-4 p-6">
        <Avatar className="h-16 w-16">
          {user.image && (
            <AvatarImage
              src={user.image}
              alt={user.name}
              className="object-cover"
            />
          )}
          <AvatarFallback className="bg-primary/15 text-primary text-xl">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg leading-none font-semibold tracking-tight">
            {user.name}
          </h3>
          <p className="text-muted-foreground text-sm">{user.email}</p>
          <div className="mt-2 flex gap-2">
            <Badge
              variant="secondary"
              className="bg-primary/15 text-primary hover:bg-primary/15 text-[10px] uppercase"
            >
              {user.role}
            </Badge>
            <Badge
              variant={user.isActive ? "default" : "destructive"}
              className={
                user.isActive
                  ? "bg-green-500 text-[10px] uppercase hover:bg-green-600"
                  : "text-[10px] uppercase"
              }
            >
              {user.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
