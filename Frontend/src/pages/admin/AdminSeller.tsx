import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/utils/Axios.tsx";
import { LoadingPage } from "@/components/LoadingPage.tsx";
import type { Seller } from "@/types/type.ts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminSeller = () => {
  const { id } = useParams<{ id: string }>();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fetchSeller = useCallback(async () => {
    try {
      setLoading(true);
      const result = await api.get(`/admin/seller/${id}`, {
        withCredentials: true,
      });
      setSeller(result.data.data || result.data);
    } catch (error) {
      console.error("Error fetching seller details:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);
  useEffect(() => {
    if (id) {
      fetchSeller();
    }
  }, [id, fetchSeller]);

  const handleToggleBan = async () => {
    if (!seller) return;
    try {
      setIsProcessing(true);
      const action = seller.isActive ? "ban" : "unban";
      await api.put(`/admin/seller/${action}/${seller.id}`);
      setSeller({ ...seller, isActive: !seller.isActive });
      toast.success(
        `Seller successfully ${seller.isActive ? "banned" : "unbanned"}.`,
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update seller status.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerify = async () => {
    if (!seller) return;
    try {
      setIsProcessing(true);
      await api.put(`/admin/seller/${seller.id}`);
      setSeller({ ...seller, isVerified: true });
      toast.success("Seller successfully verified.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to verify seller.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <LoadingPage />;
  if (!seller) return <div className="p-6 text-center">Seller not found</div>;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Seller Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage and view seller information
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={seller.isActive ? "default" : "destructive"}
            className={
              seller.isActive
                ? "bg-green-500 uppercase hover:bg-green-600"
                : "uppercase"
            }
          >
            {seller.isActive ? "Active" : "Inactive"}
          </Badge>
          <Badge
            variant={seller.isVerified ? "default" : "secondary"}
            className={
              seller.isVerified
                ? "bg-blue-500 uppercase hover:bg-blue-600"
                : "bg-primary/15 text-primary uppercase"
            }
          >
            {seller.isVerified ? "Verified" : "Pending"}
          </Badge>
          <div className="ml-2 flex items-center gap-2 border-l pl-4">
            {!seller.isVerified && (
              <Button
                variant="default"
                size="sm"
                onClick={handleVerify}
                disabled={isProcessing}
              >
                Verify
              </Button>
            )}
            <Button
              variant={seller.isActive ? "destructive" : "default"}
              size="sm"
              onClick={handleToggleBan}
              disabled={isProcessing}
            >
              {seller.isActive ? "Ban" : "Unban"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Store Identity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {seller.shopImage ? (
                <div className="aspect-video w-full overflow-hidden rounded-md border">
                  <img
                    src={seller.shopImage}
                    alt="Shop"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="bg-muted/50 flex aspect-video w-full items-center justify-center rounded-md border border-dashed">
                  <span className="text-muted-foreground">No shop image</span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold">{seller.storeName}</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  {seller.storeLocation || "No location provided"}
                </p>
              </div>
              <Separator />
              <div className="space-y-3">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Seller ID
                  </p>
                  <p className="bg-muted mt-1 rounded-md px-2 py-1 font-mono text-xs">
                    {seller.id}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Owner User ID
                  </p>
                  <p className="bg-muted mt-1 rounded-md px-2 py-1 font-mono text-xs">
                    {seller.userId}
                  </p>
                </div>
                <div className="pt-2">
                  <p className="text-muted-foreground text-sm">
                    Registered on{" "}
                    {new Date(seller.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Details about the store and operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-muted-foreground mb-1 text-sm font-medium">
                    Description
                  </h4>
                  <p className="text-sm leading-relaxed">
                    {seller.storeDescription || "No description provided."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verification Documents</CardTitle>
              <CardDescription>
                Government issued identification and tax details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="bg-muted/20 rounded-lg border p-4">
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      PAN Number
                    </p>
                    <p className="font-semibold tracking-wide">
                      {seller.panNumber}
                    </p>
                  </div>
                  <div className="bg-muted/20 rounded-lg border p-4">
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      Aadhar Number
                    </p>
                    <p className="font-semibold tracking-wide">
                      {seller.aadharNumber}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-muted/20 flex h-full flex-col rounded-lg border p-4">
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      GST Number
                    </p>
                    <p className="mb-4 font-semibold tracking-wide">
                      {seller.gstNumber}
                    </p>
                    {seller.gstCertificate ? (
                      <>
                        <a
                          href={seller.gstCertificate}
                          target="_blank"
                          rel="noreferrer"
                          className="focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 mt-auto inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                        >
                          View GST Certificate
                        </a>
                      </>
                    ) : (
                      <p className="text-muted-foreground mt-auto text-sm italic">
                        No certificate uploaded
                      </p>
                    )}
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

export default AdminSeller;
