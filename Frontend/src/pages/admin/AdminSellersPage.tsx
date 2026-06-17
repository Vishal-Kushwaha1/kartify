import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Seller } from "@/types/type.ts";
import { api } from "@/utils/Axios.tsx";
import { LoadingPage } from "@/components/LoadingPage.tsx";
import SellerCard from "@/components/sellerCard.tsx";

const AdminSellersPage = () => {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const pendingSellers = async () => {
      setLoading(true);
      const result = await api.get("/admin/seller", { withCredentials: true });
      setSellers(result.data.data);
      setLoading(false);
    };
    pendingSellers();
  }, []);

  if (loading) return <LoadingPage />;
  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-primary text-3xl font-bold tracking-tight">
          All Sellers
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage and view all registered sellers on the platform.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sellers.length > 0 ? (
          sellers.map((seller) => (
            <div
              key={seller.id}
              className="cursor-pointer"
              onClick={() => navigate(`/admin/seller/${seller.id}`)}
            >
              <SellerCard seller={seller} />
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">No sellers found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminSellersPage;
