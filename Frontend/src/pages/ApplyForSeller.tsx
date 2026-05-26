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

export const ApplyForSeller = () => {
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

  const submitSellerForm: SubmitHandler<SellerProps> = async (
    data,
  ) => {
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

      const result = await api.post("/user/applyForSeller", formData);
      if (result.status !== 200) {
        return toast.error("Something went wrong");
      }
      reset()
      toast.success("applied for seller. wait for response on your email");
    } catch (error: unknown) {
      return toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-muted/40 min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-xl mx-auto">
          <Card className="rounded-xl border bg-background p-6">
            <CardHeader className="p-0 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Store className="h-5 w-5 text-muted-foreground" />
                <Badge variant="outline" className="text-xs">
                  Seller Onboarding
                </Badge>
              </div>
              <CardTitle className="text-2xl font-medium tracking-tight">
                Apply as a Seller
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Fill in your business details to start selling
              </p>
            </CardHeader>

            <CardContent className="p-0">
              <form
                onSubmit={handleSubmit(submitSellerForm)}
                className="flex flex-col gap-5"
              >
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">
                    Store Name
                  </label>
                  <Input
                    placeholder="Enter store name"
                    {...register("storeName")}
                  />
                  {errors.storeName && (
                    <p className="text-sm text-destructive">
                      {errors.storeName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">
                    Store Description
                  </label>
                  <Input
                    placeholder="Enter store description"
                    {...register("storeDescription")}
                  />
                  {errors.storeDescription && (
                    <p className="text-sm text-destructive">
                      {errors.storeDescription.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">
                    Store Location
                  </label>
                  <Input
                    placeholder="Enter store location"
                    {...register("storeLocation")}
                  />
                  {errors.storeLocation && (
                    <p className="text-sm text-destructive">
                      {errors.storeLocation.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">
                    PAN Number
                  </label>
                  <Input
                    placeholder="Enter PAN number"
                    {...register("panNumber")}
                  />
                  {errors.panNumber && (
                    <p className="text-sm text-destructive">
                      {errors.panNumber.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">
                    Aadhar Number
                  </label>
                  <Input
                    placeholder="Enter Aadhar number"
                    {...register("aadharNumber")}
                  />
                  {errors.aadharNumber && (
                    <p className="text-sm text-destructive">
                      {errors.aadharNumber.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">
                    GST Number
                  </label>
                  <Input
                    placeholder="Enter GST number"
                    {...register("gstNumber")}
                  />
                  {errors.gstNumber && (
                    <p className="text-sm text-destructive">
                      {errors.gstNumber.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">
                    GST Certificate
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      {...register("gstCertificate")}
                      className="file:text-sm"
                    />

                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                  {errors.gstCertificate && (
                    <p className="text-sm text-destructive">
                      {String(errors.gstCertificate.message)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">
                    Shop Image
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      {...register("shopImage")}
                      className="file:text-sm"
                    />
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                  {errors.shopImage && (
                    <p className="text-sm text-destructive">
                      {String(errors.shopImage.message)}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="mt-4 bg-primary hover:bg-primary/90 text-white"
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
