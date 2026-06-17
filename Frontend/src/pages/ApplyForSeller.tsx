import { type SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { sellerSchema, type SellerProps } from "@/types/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { api } from "@/utils/Axios";
import { useNavigate } from "react-router-dom";

export const ApplyForSeller = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SellerProps>({
    resolver: zodResolver(sellerSchema),
    mode: "onChange",
  });

  const submitSellerForm: SubmitHandler<SellerProps> = async (data) => {
    try {
      setLoading(true);
      if (!data.gstCertificate?.[0] || !data.shopImage?.[0]) {
        return toast.error("Please upload required files");
      }
      const formData = new FormData();
      formData.append("storeName", data.storeName);
      formData.append("storeDescription", data.storeDescription ?? "");
      formData.append("storeLocation", data.storeLocation ?? "");
      formData.append("panNumber", data.panNumber);
      formData.append("aadharNumber", data.aadharNumber);
      formData.append("gstNumber", data.gstNumber);
      formData.append("gstCertificate", data.gstCertificate[0]);
      formData.append("shopImage", data.shopImage[0]);

      const result = await api.post("/user/applyForSeller", formData, {
        withCredentials: true,
      });
      if (result.status !== 200) {
        return toast.error("Something went wrong");
      }
      reset();
      toast.success("applied for seller. wait for response on your email");
      navigate("/products");
    } catch (error: unknown) {
      return toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-muted/40 min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-xl">
          <Card className="bg-background rounded-xl border p-6">
            <CardHeader className="mb-6 p-0">
              <div className="mb-2 flex items-center gap-2">
                <Store className="text-muted-foreground h-5 w-5" />
                <Badge variant="outline" className="text-xs">
                  Seller Onboarding
                </Badge>
              </div>
              <CardTitle className="text-2xl font-medium tracking-tight">
                Apply as a Seller
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                Fill in your business details to start selling
              </p>
            </CardHeader>

            <CardContent className="p-0">
              <form
                onSubmit={handleSubmit(submitSellerForm)}
                className="flex flex-col gap-5"
              >
                <div className="space-y-2">
                  <label className="text-muted-foreground text-xs">
                    Store Name
                  </label>
                  <Input
                    placeholder="Enter store name"
                    {...register("storeName")}
                  />
                  {errors.storeName && (
                    <p className="text-destructive text-sm">
                      {errors.storeName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-muted-foreground text-xs">
                    Store Description
                  </label>
                  <Input
                    placeholder="Enter store description"
                    {...register("storeDescription")}
                  />
                  {errors.storeDescription && (
                    <p className="text-destructive text-sm">
                      {errors.storeDescription.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-muted-foreground text-xs">
                    Store Location
                  </label>
                  <Input
                    placeholder="Enter store location"
                    {...register("storeLocation")}
                  />
                  {errors.storeLocation && (
                    <p className="text-destructive text-sm">
                      {errors.storeLocation.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-muted-foreground text-xs">
                    PAN Number
                  </label>
                  <Input
                    placeholder="Enter PAN number"
                    {...register("panNumber")}
                  />
                  {errors.panNumber && (
                    <p className="text-destructive text-sm">
                      {errors.panNumber.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-muted-foreground text-xs">
                    Aadhar Number
                  </label>
                  <Input
                    placeholder="Enter Aadhar number"
                    {...register("aadharNumber")}
                  />
                  {errors.aadharNumber && (
                    <p className="text-destructive text-sm">
                      {errors.aadharNumber.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-muted-foreground text-xs">
                    GST Number
                  </label>
                  <Input
                    placeholder="Enter GST number"
                    {...register("gstNumber")}
                  />
                  {errors.gstNumber && (
                    <p className="text-destructive text-sm">
                      {errors.gstNumber.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-muted-foreground text-xs">
                    GST Certificate
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      {...register("gstCertificate")}
                      className="file:text-sm"
                    />

                    <Upload className="text-muted-foreground h-4 w-4" />
                  </div>
                  {errors.gstCertificate && (
                    <p className="text-destructive text-sm">
                      {String(errors.gstCertificate.message)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-muted-foreground text-xs">
                    Shop Image
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      {...register("shopImage")}
                      className="file:text-sm"
                    />
                    <Upload className="text-muted-foreground h-4 w-4" />
                  </div>
                  {errors.shopImage && (
                    <p className="text-destructive text-sm">
                      {String(errors.shopImage.message)}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90 mt-4 text-white"
                >
                  Apply
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplyForSeller;
