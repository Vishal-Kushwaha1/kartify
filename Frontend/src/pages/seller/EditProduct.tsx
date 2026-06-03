import { LoadingPage } from "@/components/LoadingPage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { type NewProductProps, type NewProductInputProps, newProductSchema } from "@/types/schema";
import type { Product } from "@/types/type";
import { api } from "@/utils/Axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [product, setProduct] = useState<Product | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: {  dirtyFields, errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<NewProductInputProps, any, NewProductProps>({
    resolver: zodResolver(newProductSchema),
  });

  //fetch current product data
  useEffect(() => {
    if (!id) {
      navigate("/seller/products");
      return;
    }
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const result = await api.get(`/products/seller/${id}`);

        const data = result?.data?.data;
        if (!data) {
          toast.error("No product found");
          return;
        }
        setProduct(data);
        reset({
          name: data.name,
          description: data.description || "",
          price: data.price,
          stock: data.stock,
          category: data.category || [],
        });
        setCategories(data.category || []);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Something went wrong";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate, reset]);

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

  const onSubmit = async (data: NewProductProps) => {
    try {
      setSubmitting(true);
      const formData = new FormData();

      if (dirtyFields.name) formData.append("name", data.name);
      if (dirtyFields.description)
        formData.append("description", data.description || "");
      if (dirtyFields.price) formData.append("price", String(data.price));
      if (dirtyFields.stock) formData.append("stock", String(data.stock));
      if (dirtyFields.category) {
        categories.forEach((cat) => formData.append("category", cat));
      }
      if (dirtyFields.image && data.image) {
        (data.image as File[]).forEach((file) => {
          formData.append("image", file);
        });
      }

      if ([...formData.keys()].length === 0) {
        toast.info("No changes to save");
      }

      await api.patch(`/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Product updated successfully");
      navigate(`/seller/product/${id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }
  if (!product) return null;
  return (
    <div className="min-h-screen bg-muted/40 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Button
          variant="outline"
          onClick={() => navigate(`/seller/products/${id}`)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <Card className="p-6">
          <h1 className="mb-6 text-lg font-medium">Edit Product</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div className="grid gap-2">
              <label className="text-xs text-muted-foreground">Name</label>
              <Input {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <label className="text-xs text-muted-foreground">
                Description
              </label>
              <Input {...register("description")} />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-xs text-muted-foreground">
                  Price (₹)
                </label>
                <Input type="number" step="0.01" {...register("price")} />
                {errors.price && (
                  <p className="text-sm text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <label className="text-xs text-muted-foreground">Stock</label>
                <Input type="number" {...register("stock")} />
                {errors.stock && (
                  <p className="text-sm text-destructive">
                    {errors.stock.message}
                  </p>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="grid gap-2">
              <label className="text-xs text-muted-foreground">Category</label>
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
              <Input
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                onKeyDown={handleCategoryKeyDown}
                placeholder={
                  categories.length >= 5
                    ? "Max 5 categories reached"
                    : "Type & press Enter to add"
                }
                disabled={categories.length >= 5}
              />
            </div>

            {/* Image */}
            <div className="grid gap-2">
              <label className="text-xs text-muted-foreground">
                Product Images (existing images replace hongi)
              </label>
              {/* Existing images preview */}
              {product.image?.length && product.image?.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {product.image.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={"product_image"}
                      className="h-16 w-16 rounded-md object-cover border"
                    />
                  ))}
                </div>
              )}
              <Input
                type="file"
                multiple
                accept="image/*"
                {...register("image")}
                className="file:text-sm"
              />
              {errors.image && (
                <p className="text-sm text-destructive">
                  {String(errors.image.message)}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white hover:bg-primary/90"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EditProduct