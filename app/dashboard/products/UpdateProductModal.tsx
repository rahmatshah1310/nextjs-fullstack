"use client";

import { useProductById, useUpdateProduct } from "@/utils/productApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormValues } from "@/validation/productSchema";
import { Modal } from "@/components/common/Model";
import Input from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useEffect, useRef } from "react";
import { Switch } from "@/components/ui/switch";
import MultiSelect from "@/components/common/MultiSelect";

interface UpdateProductModalProps {
  open: boolean;
  onClose: () => void;
  productId: string;
}

export default function UpdateProductModal({ open, onClose, productId }: UpdateProductModalProps) {
  const { data: product } = useProductById(productId);
  const updateProductMutation = useUpdateProduct(productId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, formState, setValue, watch } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      quantity: undefined,
      category: "",
      discount: undefined,
      isActive: true,
      sizes: [],
      colors: [],
      imageUrl: undefined,
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        ...product,
        price: typeof product.price === "number" ? product.price.toString() : product.price,
        discount: product.discount ? product.discount.toString() : undefined,
      });
    }
  }, [product, reset]);

  const isActive = watch("isActive");

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const formData = new FormData();

      // Append all form data
      formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);
      formData.append("price", String(data.price));
      if (data.quantity) formData.append("quantity", String(data.quantity));
      if (data.category) formData.append("category", data.category);
      if (data.discount) formData.append("discount", String(data.discount));
      formData.append("isActive", String(data.isActive));

      // Append arrays
      data.sizes.forEach((size) => formData.append("sizes", size));
      data.colors.forEach((color) => formData.append("colors", color));

      // Handle file upload
      if (fileInputRef.current?.files?.[0]) {
        formData.append("image", fileInputRef.current.files[0]);
      }

      await updateProductMutation.mutateAsync(formData);
      toast.success("Product updated successfully!");
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "An unexpected error occurred");
    }
  };

  if (!product) return null;

  return (
    <Modal title="Update Product" open={open} onClose={onClose} className="sm:max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Name" {...register("name")} error={formState.errors.name?.message} />
        <Input label="Price" type="number" step="0.01" {...register("price")} error={formState.errors.price?.message} />
        <Input label="Quantity" type="number" {...register("quantity")} error={formState.errors.quantity?.message} />
        <Input label="Discount (%)" type="number" step="0.01" {...register("discount")} error={formState.errors.discount?.message} />
        <Input label="Category" {...register("category")} error={formState.errors.category?.message} />

        {/* File Input with ref */}
        <div>
          <Input
            label="Product Image"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setValue("imageUrl", e.target.files[0], { shouldValidate: true });
              }
            }}
          />
          {formState.errors.imageUrl && <p className="text-red-500 text-sm">{formState.errors.imageUrl.message as string}</p>}
        </div>

        {/* Description */}
        <div className="w-full sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea {...register("description")} />
          {formState.errors.description && <p className="text-red-500 text-sm">{formState.errors.description.message}</p>}
        </div>

        {/* Sizes and Colors selectors remain the same */}
        <div>
          <MultiSelect
            label="Sizes"
            name="sizes"
            value={watch("sizes") || []}
            options={["S", "M", "L", "XL"]}
            onChange={(_, value) => setValue("sizes", value as ProductFormValues["sizes"], { shouldValidate: true })}
            className="w-full"
          />
          {formState.errors.sizes && <p className="text-red-500 text-sm">{formState.errors.sizes.message as string}</p>}
        </div>

        <div>
          <MultiSelect
            label="Colors"
            name="colors"
            value={watch("colors") || []}
            options={["red", "black", "white"]}
            onChange={(_, value) => setValue("colors", value as ProductFormValues["colors"], { shouldValidate: true })}
            className="w-full"
          />
          {formState.errors.colors && <p className="text-red-500 text-sm">{formState.errors.colors.message as string}</p>}
        </div>

        <div className="flex items-center space-x-2">
          <Switch checked={isActive} onCheckedChange={(checked) => setValue("isActive", checked)} />
          <label>Status: {isActive ? "Active" : "Inactive"}</label>
        </div>

        <Button type="submit" className="w-full" disabled={updateProductMutation.isPending}>
          {updateProductMutation.isPending ? "Updating..." : "Update"}
        </Button>
      </form>
    </Modal>
  );
}
