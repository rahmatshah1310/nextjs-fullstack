export type InvoiceStatus = "DRAFT" | "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";

export interface InvoiceItemInput {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number; // per unit discount
}

export interface InvoiceInput {
  customerId: string;
  issueDate: string; // ISO
  dueDate: string; // ISO
  notes?: string;
  taxRate?: number; // percent value e.g. 10 for 10%
  status?: InvoiceStatus;
  lineItems: InvoiceItemInput[];
}

export interface InvoiceItem extends InvoiceItemInput {
  id: string;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName?: string;
  lineItems: InvoiceItem[];
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  notes?: string;
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  createdAt?: string;
  updatedAt?: string;
}

const API_URL = "/api/invoices";

export async function getInvoices(): Promise<Invoice[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getInvoiceById(id: string): Promise<Invoice> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createInvoice(payload: InvoiceInput): Promise<Invoice> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateInvoice(id: string, payload: Partial<InvoiceInput>): Promise<Invoice> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteInvoice(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
  return { success: true };
}


