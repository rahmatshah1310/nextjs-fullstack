import { useProductById, useUpdateProduct } from "@/utils/productApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormValues } from "@/validation/productSchema";
import { Modal } from "@/components/common/Model";
import Input from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useEffect } from "react";

interface UpdateProductModalProps {
  open: boolean;
  onClose: () => void;
  productId: number;
}

export default function UpdateProductModal({ open, onClose, productId }: UpdateProductModalProps) {
  const { data: product } = useProductById(productId);
  const updateProductMutation = useUpdateProduct();

  const { register, handleSubmit, reset, formState } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? { name: product.name, description: product.description || "", price: product.price.toString() } : undefined,
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
      });
    }
  }, [product, reset]);

  const onSubmit = async (data: ProductFormValues) => {
    try {
      await updateProductMutation.mutateAsync({ id: productId, data: { ...data, price: parseFloat(data.price) } });
      toast.success("Product updated successfully!");
      reset();
      onClose();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  if (!product) return null; // Wait for product to load

  return (
    <Modal title="Update Product" open={open} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Name" {...register("name")} error={formState.errors.name?.message} />
        <div>
          <label htmlFor="">Description</label>
          <Textarea {...register("description")} />
        </div>
        <Input label="Price" {...register("price")} error={formState.errors.price?.message} />
        <Button type="submit" className="w-full" disabled={updateProductMutation.isPending}>
          {updateProductMutation.isPending ? "Updating..." : "Update"}
        </Button>
      </form>
    </Modal>
  );
}
