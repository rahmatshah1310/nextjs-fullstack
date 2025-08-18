export type InvoiceStatus = "DRAFT" | "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";

export type LineItem = {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
};

export type InvoiceRecord = {
  id: string;
  invoiceNumber: string;
  customerId: string;
  lineItems: LineItem[];
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  notes?: string;
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  createdAt: string;
  updatedAt: string;
};

export const invoices: InvoiceRecord[] = [];


