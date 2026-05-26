import type {Seller} from "@/types/type.ts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

const SellerCard = ({seller}: {seller: Seller}) => {
    return (
        <Card className="hover:shadow-md transition-all overflow-hidden cursor-pointer h-full flex flex-col">
            {seller.shopImage ? (
                <div className="w-full h-48 bg-muted">
                    <img src={seller.shopImage} alt={seller.storeName} className="w-full h-full object-cover"/>
                </div>
            ) : (
                <div className="w-full h-48 bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">No Image</span>
                </div>
            )}
            <CardContent className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold tracking-tight truncate mb-1">{seller.storeName}</h3>
                {seller.storeLocation && (
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <MapPin className="w-3 h-3 mr-1 shrink-0" />
                        <span className="truncate">{seller.storeLocation}</span>
                    </div>
                )}
                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                    <Badge variant={seller.isActive ? "default" : "destructive"} className={seller.isActive ? "bg-green-500 hover:bg-green-600" : ""}>
                        {seller.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant={seller.isVerified ? "default" : "secondary"} className={seller.isVerified ? "bg-blue-500 hover:bg-blue-600" : "bg-primary/15 text-primary hover:bg-primary/30"}>
                        {seller.isVerified ? "Verified" : "Pending"}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
};

export default SellerCard;