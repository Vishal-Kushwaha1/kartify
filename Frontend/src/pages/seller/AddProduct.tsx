import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { newProductSchema, type NewProductProps, type NewProductInputProps } from "@/types/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { api } from "@/utils/Axios";
import { useNavigate } from "react-router-dom";

export const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState("");
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<NewProductInputProps, any, NewProductProps>({ // <NewProductInputProps,any, NewProductProps>
    resolver: zodResolver(newProductSchema),
  });

  const handleCategoryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = categoryInput.trim().replace(/,$/, ""); // by AI
      if (!val) return;
      if (categories.includes(val)) return;
      const updated = [...categories, val];
      setCategories(updated);
      setValue("category", updated);
      setCategoryInput("");
    }
  };

  const removeCategory = (index: number) => {
    const updated = categories.filter((_, i) => i !== index);
    setCategories(updated);
    setValue("category", updated);
  };

  const createProduct = async (data: NewProductProps) => {
    try {
      setLoading(true);
      if (!data.image || data.image.length === 0) {
        toast.error("Please upload product image");
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("price", String(data.price));
      formData.append("stock", String(data.stock));
      if (data.category && data.category.length > 0) {
        data.category.forEach((cat: string) => {
          formData.append("category", cat);
        });
      }
      if (data.image && data.image.length > 0) {
        data.image.forEach((file: File) => {
          formData.append("image", file);
        });
      }
      const result = await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setCategories([]);
      setCategoryInput("");
      toast.success("Product added successfully");
      reset();
      navigate(`/seller/product/${result.data.data.id}`);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-muted/40 min-h-screen px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <Card className="rounded-xl border bg-background">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-medium tracking-tight">
                Add Product
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                New
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(createProduct)} className="grid gap-5">
              {/* Product Name */}
              <div className="grid gap-2">
                <label className="text-xs text-muted-foreground">
                  Product Name
                </label>
                <Input {...register("name")} placeholder="Enter product name" />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {typeof errors.name.message === "string" ? errors.name.message : "Invalid name"}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <label className="text-xs text-muted-foreground">
                  Description
                </label>
                <Textarea
                  {...register("description")}
                  placeholder="Enter product description"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {typeof errors.description.message === "string" ? errors.description.message : "Invalid description"}
                  </p>
                )}
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-xs text-muted-foreground">
                    Price (₹)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("price")}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive">
                      {typeof errors.price.message === "string" ? errors.price.message : "Invalid price"}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label className="text-xs text-muted-foreground">Stock</label>
                  <Input
                    type="number"
                    step="1"
                    min="0"
                    {...register("stock")}
                    placeholder="Available units"
                  />
                  {errors.stock && (
                    <p className="text-sm text-destructive">
                      {typeof errors.stock.message === "string" ? errors.stock.message : "Invalid stock"}
                    </p>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="grid gap-2">
                <label className="text-xs text-muted-foreground">
                  Category
                </label>
                <Input
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  onKeyDown={handleCategoryKeyDown}
                  placeholder="Type & press Enter to add"
                />
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {categories.map((cat, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-1 bg-muted text-xs px-2 py-1 rounded-md"
                      >
                        {cat}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => removeCategory(index)}
                        />
                      </span>
                    ))}
                  </div>
                )}
                {errors.category && (
                  <p className="text-sm text-destructive">
                    {String(errors.category.message)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">
                  Product Image
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    {...register("image")}
                    className="file:text-sm"
                  />
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
                {(watch("image")?.length ??0) > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {watch("image")?.length} / 5 images selected
                  </p>
                )}
                {errors.image && (
                  <p className="text-sm text-destructive">
                    {String(errors.image.message)}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                >
                  {loading ? "Adding..." : "Add Product"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
