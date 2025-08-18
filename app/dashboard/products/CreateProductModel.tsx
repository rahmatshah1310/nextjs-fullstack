"use client";

import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/common/Model";
import Input from "@/components/ui/Input";
import { ProductFormValues, productSchema } from "@/validation/productSchema";
import { toast } from "react-toastify";
import { useCreateProduct } from "@/utils/productApi";
import { Switch } from "@/components/ui/switch";
import MultiSelect from "@/components/common/MultiSelect";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: ProductFormValues;
}

export default function CreateProductModal({ open, onClose, initialData }: ProductModalProps) {
  const { register, handleSubmit, formState, reset, setValue, watch } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as unknown as Resolver<ProductFormValues>,
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
    },
  });

  const createProductMutation = useCreateProduct();
  const isActive = watch("isActive");

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const formData = new FormData();

      // Primitives
      formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);
      formData.append("price", String(data.price));
      if (typeof data.quantity !== "undefined" && data.quantity !== null) formData.append("quantity", String(data.quantity));
      if (data.category) formData.append("category", data.category);
      if (typeof data.discount !== "undefined" && data.discount !== null) formData.append("discount", String(data.discount));
      formData.append("isActive", String(data.isActive));

      // Arrays (server expects repeated keys without [] suffix)
      data.colors.forEach((color) => formData.append("colors", color));
      data.sizes.forEach((size) => formData.append("sizes", size));

      // File (server expects key: "image")
      const fileList = data.imageUrl as unknown as FileList | undefined;
      const file = fileList?.[0];
      if (file) formData.append("image", file);

      await createProductMutation.mutateAsync(formData);
      toast.success("Product created successfully!");
      reset();
      onClose();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <Modal title="Create Product" open={open} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Name" {...register("name")} error={formState.errors.name?.message} />
        <Input label="Price" type="number" step="0.01" {...register("price")} error={formState.errors.price?.message} />
        <Input label="Quantity" {...register("quantity")} error={formState.errors.quantity?.message} />
        <Input label="Discount (%)" type="number" step="0.01" {...register("discount")} error={formState.errors.discount?.message} />
        <Input label="Category" {...register("category")} error={formState.errors.category?.message} />
        <Input label="Product Image" type="file" accept="image/*" {...register("imageUrl")} error={formState.errors.imageUrl?.message as string} />

        {/* Description */}
        <div className="w-full sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea {...register("description")} />
          {formState.errors.description && <p className="text-red-500 text-sm">{formState.errors.description.message}</p>}
        </div>

        <div>
          <MultiSelect
            label="Sizes"
            name="sizes"
            value={watch("sizes") || []}
            options={["S", "M", "L", "XL"]}
            onChange={(_, value) => setValue("sizes", value as ProductFormValues["sizes"], { shouldValidate: true })}
            className="w-ful"
          />
          {formState.errors.sizes && <p className="text-red-500 text-sm">{formState.errors.sizes.message as string}</p>}
        </div>

        {/* Colors */}
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
        {/* isActive (Switch) */}
        <div className="flex items-center space-x-2">
          <Switch checked={isActive} onCheckedChange={(checked) => setValue("isActive", checked)} />
          <label>Status: {isActive ? "Active" : "Inactive"}</label>
        </div>

        <Button type="submit" className="w-full" disabled={createProductMutation.isPending}>
          {initialData ? "Update" : createProductMutation.isPending ? "Creating..." : "Create"}
        </Button>
      </form>
    </Modal>
  );
}
