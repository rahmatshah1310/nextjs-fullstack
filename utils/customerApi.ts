// utils/customerApi.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createCustomer, updateCustomer, deleteCustomer, getCustomerById, getCustomers } from "@/servcies/customer.service";

// Create Customer
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createCustomer(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

// Update Customer
export const useUpdateCustomer = (id?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => updateCustomer(id!, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

// Delete Customer
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

// Get All Customers
export const useCustomers = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: () => getCustomers(),
  });
};

// Get Customer by ID
export const useCustomerById = (id: string) => {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => getCustomerById(id),
    enabled: !!id,
  });
};
