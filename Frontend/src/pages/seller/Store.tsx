import { useEffect, useState } from "react";
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
import { Package, MapPin } from "lucide-react";

const Store = () => {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        setLoading(true);
        const result = await api.get(`/user/store`, { withCredentials: true });
        setSeller(result.data.data || result.data);
      } catch (error) {
        console.error("Error fetching seller details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSeller();
  }, []);

  if (loading) return <LoadingPage />;
  if (!seller) return <div className="p-6 text-center">Seller not found</div>;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Store Banner */}
        <div className="relative mb-8">
          <div className="relative h-96 rounded-xl overflow-hidden shadow-lg bg-linear-to-r from-blue-600 to-purple-600">
            {seller.shopImage ? (
              <img
                src={seller.shopImage}
                alt="Shop Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-linear-to-r from-blue-500 to-purple-500">
                <Package className="w-20 h-20 text-white opacity-50" />
              </div>
            )}
          </div>

          {/* Store Info Card - Overlapping Banner */}
          <div className="relative -mt-16 mx-4 md:mx-0">
            <Card className="bg-white shadow-xl border-0">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                          {seller.storeName}
                        </h1>
                        <div className="flex items-center gap-2 text-gray-600 mb-4">
                          <MapPin className="w-4 h-4" />
                          <span>
                            {seller.storeLocation || "Location not provided"}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed max-w-2xl">
                          {seller.storeDescription ||
                            "No description provided."}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 md:justify-end">
                    <Badge
                      variant={seller.isActive ? "default" : "destructive"}
                      className={`text-sm font-semibold px-4 py-2 ${
                        seller.isActive
                          ? "bg-emerald-500 hover:bg-emerald-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {seller.isActive ? "✓ Active" : "Inactive"}
                    </Badge>
                    <Badge
                      variant={seller.isVerified ? "default" : "secondary"}
                      className={`text-sm font-semibold px-4 py-2 ${
                        seller.isVerified
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-amber-500 hover:bg-amber-600"
                      }`}
                    >
                      {seller.isVerified ? "✓ Verified" : "Pending"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Business Info */}
          <div className="space-y-6">
            <Card className="shadow-md">
              <CardHeader className="bg-linear-to-r from-blue-50 to-blue-100 border-b">
                <CardTitle className="text-lg text-gray-900">
                  Store Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Store ID
                  </p>
                  <p className="font-mono text-sm bg-gray-100 px-3 py-2 rounded-md mt-2 text-gray-700">
                    {seller.id}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Owner ID
                  </p>
                  <p className="font-mono text-sm bg-gray-100 px-3 py-2 rounded-md mt-2 text-gray-700">
                    {seller.userId}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Member Since
                  </p>
                  <p className="text-sm text-gray-700 mt-2 font-medium">
                    {new Date(seller.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Verification Documents */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-md">
              <CardHeader className="bg-linear-to-r from-purple-50 to-purple-100 border-b">
                <CardTitle className="text-lg text-gray-900">
                  Business Verification
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-1">
                  Government issued identification and tax documents
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* PAN Card */}
                  <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-linear-to-br from-orange-50 to-orange-100/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">
                        P
                      </div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">
                        PAN Number
                      </p>
                    </div>
                    <p className="font-mono font-bold text-gray-900 text-lg tracking-widest">
                      {seller.panNumber}
                    </p>
                  </div>

                  {/* Aadhar Card */}
                  <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-linear-to-br from-green-50 to-green-100/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                        A
                      </div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">
                        Aadhar Number
                      </p>
                    </div>
                    <p className="font-mono font-bold text-gray-900 text-lg tracking-widest">
                      {seller.aadharNumber}
                    </p>
                  </div>

                  {/* GST Card */}
                  <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-linear-to-br from-blue-50 to-blue-100/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                        G
                      </div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">
                        GST Number
                      </p>
                    </div>
                    <p className="font-mono font-bold text-gray-900 text-lg tracking-widest mb-3">
                      {seller.gstNumber}
                    </p>
                    {seller.gstCertificate ? (
                      <a
                        href={seller.gstCertificate}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md transition-colors"
                      >
                        View Certificate
                      </a>
                    ) : (
                      <p className="text-xs text-gray-500 italic">
                        No certificate uploaded
                      </p>
                    )}
                  </div>
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
