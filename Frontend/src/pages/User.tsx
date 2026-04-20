import { useAppSelector } from "@/redux/hook"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, User as UserIcon, ShieldCheck } from "lucide-react"

export const User = () => {
  const user = useAppSelector((state) => state.user.user)
  const loading = useAppSelector((state) => state.user.loading)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <div className="h-12 w-12 rounded-full border-4 border-orange-600 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <p className="text-sm text-muted-foreground">Not logged in</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-xl border bg-background">
        <CardContent className="p-6 space-y-6">

          {/* Profile header */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image || "/default.png"} />
              <AvatarFallback>
                {user.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-lg font-medium">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Info section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
              <UserIcon size={16} className="text-orange-600" />
              <div>
                <p className="text-xs text-muted-foreground">User ID</p>
                <p className="text-sm font-mono break-all">{user.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
              <Mail size={16} className="text-orange-600" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm">{user.email}</p>
              </div>
            </div>

          </div>

          {/* Status */}
          <div className="flex items-center justify-between border-t pt-4">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <ShieldCheck size={16} className="text-orange-600" />
              Account Status
            </span>

            <Badge className="bg-orange-600 hover:bg-orange-700">
              Active
            </Badge>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}