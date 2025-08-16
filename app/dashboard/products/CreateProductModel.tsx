"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/common/Model";
import Input from "@/components/ui/Input";
import { ProductFormValues, productSchema } from "@/validation/productSchema";
import { toast } from "react-toastify";
import { useCreateProduct } from "@/utils/productApi";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: ProductFormValues;
}

export default function CreateProductModal({ open, onClose, initialData }: ProductModalProps) {
  const { register, handleSubmit, formState, reset } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || { name: "", description: "", price: "" },
  });

  const createProductMutation = useCreateProduct();

  const onSubmit = async (data: ProductFormValues) => {
    try {
      await createProductMutation.mutateAsync({
        ...data,
        price: parseFloat(data.price),
      });
      toast.success("Product created successfully!");
      reset();
      onClose();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <Modal title="Create Product" open={open} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Name" {...register("name")} error={formState.errors.name?.message} />

        <div>
          <label htmlFor="">Description</label>
          <Textarea {...register("description")} />
          {formState.errors.description && <p className="text-red-500 text-sm">{formState.errors.description.message}</p>}
        </div>

        <Input label="Price" {...register("price")} error={formState.errors.price?.message} />

        <Button type="submit" className="w-full" disabled={createProductMutation.isPending}>
          {initialData ? "Update" : createProductMutation.isPending ? "Creating..." : "Create"}
        </Button>
      </form>
    </Modal>
  );
}
