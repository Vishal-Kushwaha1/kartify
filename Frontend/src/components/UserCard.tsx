import type {User} from "@/types/type.ts";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const UserCard = ({user}: {user: User}) => {
    return (
        <Card className="hover:shadow-md transition-all cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    {user.image && <AvatarImage src={user.image} alt={user.name} className="object-cover" />}
                    <AvatarFallback className="text-xl bg-primary/15 text-primary">
                        {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold leading-none tracking-tight">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex gap-2 mt-2">
                        <Badge variant="secondary" className="bg-primary/15 text-primary hover:bg-primary/15 uppercase text-[10px]">
                            {user.role}
                        </Badge>
                        <Badge variant={user.isActive ? "default" : "destructive"} className={user.isActive ? "bg-green-500 hover:bg-green-600 text-[10px] uppercase" : "text-[10px] uppercase"}>
                            {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default UserCard;