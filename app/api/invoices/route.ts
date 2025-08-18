import { NextRequest, NextResponse } from "next/server";
import { invoices, type InvoiceRecord } from "./_store";

export async function GET() {
  return NextResponse.json(invoices);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const id = crypto.randomUUID();
  const invoiceNumber = `INV-${String(invoices.length + 1).padStart(4, "0")}`;
  const subtotal = body.lineItems?.reduce((s: number, li: any) => s + (li.unitPrice - (li.discount || 0)) * li.quantity, 0) || 0;
  const taxRate = Number(body.taxRate || 0);
  const tax = (subtotal * taxRate) / 100;
  const discount = 0;
  const totalAmount = subtotal + tax - discount;
  const now = new Date().toISOString();
  const invoice: InvoiceRecord = {
    id,
    invoiceNumber,
    customerId: body.customerId,
    lineItems: body.lineItems?.map((li: any) => ({ ...li, id: crypto.randomUUID(), total: (li.unitPrice - (li.discount || 0)) * li.quantity })) || [],
    status: body.status || "DRAFT",
    issueDate: body.issueDate || now,
    dueDate: body.dueDate,
    notes: body.notes,
    subtotal,
    tax,
    discount,
    totalAmount,
    paidAmount: 0,
    createdAt: now,
    updatedAt: now,
  };
  invoices.unshift(invoice);
  return NextResponse.json(invoice);
}


