import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Seller } from "@/types/type.ts";
import { api } from "@/utils/Axios.tsx";
import { LoadingPage } from "@/components/LoadingPage.tsx";
import SellerCard from "@/components/sellerCard.tsx";

const AdminPendingList = () => {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPendingSellers = async () => {
      try {
        setLoading(true);
        // Depending on backend, this might be /admin/seller/pending or filtered from /admin/seller
        const result = await api.get("/admin/pending");
        setSellers(result.data.data || result.data);
      } catch (error) {
        console.error("Error fetching pending sellers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingSellers();
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-primary text-3xl font-bold tracking-tight">
          Pending Seller Approvals
        </h1>
        <p className="text-muted-foreground mt-1">
          Review and approve new seller registration requests.
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
          <div className="bg-muted/30 col-span-full rounded-lg border border-dashed py-12 text-center">
            <p className="text-muted-foreground text-lg">
              No pending seller approvals.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPendingList;
