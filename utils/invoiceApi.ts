import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createInvoice, deleteInvoice, getInvoiceById, getInvoices, updateInvoice, type Invoice, type InvoiceInput } from "@/servcies/invoice.service";

export const useInvoices = () =>
  useQuery({
    queryKey: ["invoices"],
    queryFn: () => getInvoices(),
  });

export const useInvoiceById = (id?: string) =>
  useQuery({
    queryKey: ["invoice", id],
    queryFn: () => getInvoiceById(id as string),
    enabled: !!id,
  });

export const useCreateInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: InvoiceInput) => createInvoice(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

export const useUpdateInvoice = (id?: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<InvoiceInput>) => updateInvoice(id as string, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
      if (id) qc.invalidateQueries({ queryKey: ["invoice", id] });
    },
  });
};

export const useDeleteInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteInvoice(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

export type { Invoice, InvoiceInput };


