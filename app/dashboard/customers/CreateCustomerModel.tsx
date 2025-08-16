"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/common/Model";
import Input from "@/components/ui/Input";
import { CustomerFormValues, customerSchema } from "@/validation/customreSchema";
import { toast } from "react-toastify";
import { useCreateCustomer } from "@/utils/customerApi";

interface CustomerModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: CustomerFormValues;
}

export default function CreateCustomerModal({ open, onClose, initialData }: CustomerModalProps) {
  const { register, handleSubmit, formState, reset } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      phone: "",
      address: "",
      status: "active",
    },
  });

  const createCustomerMutation = useCreateCustomer();

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      const formData = new FormData();

      // Append primitives
      formData.append("name", data.name);
      formData.append("email", data.email);
      if (data.phone) formData.append("phone", data.phone);
      if (data.address) formData.append("address", data.address);
      formData.append("status", data.status);

      // Append file (from FileList)
      const fileList = data.profileImage as unknown as FileList | undefined;
      const file = fileList?.[0];
      if (file) formData.append("profileImage", file);

      await createCustomerMutation.mutateAsync(formData);
      toast.success("Customer created successfully!");
      reset();
      onClose();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <Modal title="Create Customer" open={open} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Name" {...register("name")} error={formState.errors.name?.message} />

        <Input label="Email" type="email" {...register("email")} error={formState.errors.email?.message} />

        <Input label="Phone" {...register("phone")} error={formState.errors.phone?.message} />

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <Textarea {...register("address")} />
          {formState.errors.address && <p className="text-red-500 text-sm">{formState.errors.address.message}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select {...register("status")} className="w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
          </select>
          {formState.errors.status && <p className="text-red-500 text-sm">{formState.errors.status.message}</p>}
        </div>

        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium mb-1">Profile Image</label>
          <input type="file" accept="image/*" {...register("profileImage")} />
          {formState.errors.profileImage?.message && <p className="text-red-500 text-sm">{String(formState.errors.profileImage.message)}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={createCustomerMutation.isPending}>
          {initialData ? "Update" : createCustomerMutation.isPending ? "Creating..." : "Create"}
        </Button>
      </form>
    </Modal>
  );
}
