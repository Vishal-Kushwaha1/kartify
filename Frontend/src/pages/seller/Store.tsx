import { useCallback, useEffect, useState } from "react";
import { api } from "@/utils/Axios";
import { LoadingPage } from "@/components/LoadingPage";
import type { Seller } from "@/types/type";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  MapPin,
  Package,
  CalendarDays,
  Store as StoreIcon,
} from "lucide-react";

const Store = () => {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSeller = useCallback(async () => {
      try {
        setLoading(true);

        const response = await api.get("/user/store", {
          withCredentials: true,
        });

        setSeller(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching seller:", error);
      } finally {
        setLoading(false);
      }
    },[])

  useEffect(() => {
    fetchSeller();
  }, [fetchSeller]);

  if (loading) return <LoadingPage />;

  if (!seller) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        Seller not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        {/* Banner */}
        <div className="relative mb-24">
          <div className="h-87.5 overflow-hidden rounded-3xl border bg-card shadow-lg">
            {seller.shopImage ? (
              <img
                src={seller.shopImage}
                alt={seller.storeName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-r from-primary/20 to-primary/5">
                <Package className="h-20 w-20 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Store Info */}
          <Card className="absolute -bottom-16 left-1/2 w-[95%] -translate-x-1/2 shadow-xl">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <StoreIcon className="h-8 w-8 text-primary" />

                    <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                      {seller.storeName}
                    </h1>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {seller.storeLocation || "Location not provided"}
                    </span>
                  </div>

                  <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                    {seller.storeDescription ||
                      "No store description available."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Badge
                    className={
                      seller.isActive
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }
                  >
                    {seller.isActive ? "Active" : "Inactive"}
                  </Badge>

                  <Badge
                    variant={seller.isVerified ? "default" : "secondary"}
                  >
                    {seller.isVerified
                      ? "Verified"
                      : "Verification Pending"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Details</CardTitle>
                <CardDescription>
                  General information about your store
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Store ID
                  </p>

                  <div className="mt-2 rounded-md bg-muted p-3 font-mono text-sm">
                    {seller.id}
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Owner ID
                  </p>

                  <div className="mt-2 rounded-md bg-muted p-3 font-mono text-sm">
                    {seller.userId}
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Member Since
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <CalendarDays className="h-4 w-4" />

                    {new Date(seller.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Section */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Business Verification</CardTitle>

                <CardDescription>
                  Government identification and tax details
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {/* PAN */}
                  <Card className="border-orange-500/20 bg-orange-500/5">
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                          P
                        </div>

                        <span className="text-xs font-medium uppercase text-muted-foreground">
                          PAN Number
                        </span>
                      </div>

                      <p className="font-mono text-lg font-bold break-all">
                        {seller.panNumber}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Aadhaar */}
                  <Card className="border-green-500/20 bg-green-500/5">
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">
                          A
                        </div>

                        <span className="text-xs font-medium uppercase text-muted-foreground">
                          Aadhaar Number
                        </span>
                      </div>

                      <p className="font-mono text-lg font-bold break-all">
                        {seller.aadharNumber}
                      </p>
                    </CardContent>
                  </Card>

                  {/* GST */}
                  <Card className="border-blue-500/20 bg-blue-500/5">
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                          G
                        </div>

                        <span className="text-xs font-medium uppercase text-muted-foreground">
                          GST Number
                        </span>
                      </div>

                      <p className="mb-4 font-mono text-lg font-bold break-all">
                        {seller.gstNumber}
                      </p>

                      {seller.gstCertificate ? (
                        <a
                          href={seller.gstCertificate}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                        >
                          View Certificate
                        </a>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No certificate uploaded
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;