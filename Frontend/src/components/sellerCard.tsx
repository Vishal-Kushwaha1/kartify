import type { Seller } from "@/types/type.ts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

const SellerCard = ({ seller }: { seller: Seller }) => {
  return (
    <Card className="flex h-full cursor-pointer flex-col overflow-hidden transition-all hover:shadow-md">
      {seller.shopImage ? (
        <div className="bg-muted h-48 w-full">
          <img
            src={seller.shopImage}
            alt={seller.storeName}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="bg-muted flex h-48 w-full items-center justify-center">
          <span className="text-muted-foreground">No Image</span>
        </div>
      )}
      <CardContent className="flex flex-1 flex-col p-5">
        <h3 className="mb-1 truncate text-xl font-bold tracking-tight">
          {seller.storeName}
        </h3>
        {seller.storeLocation && (
          <div className="text-muted-foreground mb-4 flex items-center text-sm">
            <MapPin className="mr-1 h-3 w-3 shrink-0" />
            <span className="truncate">{seller.storeLocation}</span>
          </div>
        )}
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Badge
            variant={seller.isActive ? "default" : "destructive"}
            className={seller.isActive ? "bg-green-500 hover:bg-green-600" : ""}
          >
            {seller.isActive ? "Active" : "Inactive"}
          </Badge>
          <Badge
            variant={seller.isVerified ? "default" : "secondary"}
            className={
              seller.isVerified
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-primary/15 text-primary hover:bg-primary/30"
            }
          >
            {seller.isVerified ? "Verified" : "Pending"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default SellerCard;
