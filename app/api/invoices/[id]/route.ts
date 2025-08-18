import { NextRequest, NextResponse } from "next/server";
import { invoices } from "../_store";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const invoice = invoices.find((i: any) => i.id === params.id);
  if (!invoice) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(invoice);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const idx = invoices.findIndex((i: any) => i.id === params.id);
  if (idx === -1) return NextResponse.json({ message: "Not found" }, { status: 404 });
  const body = await req.json();
  const existing = invoices[idx];
  const subtotal = body.lineItems
    ? body.lineItems.reduce((s: number, li: any) => s + (li.unitPrice - (li.discount || 0)) * li.quantity, 0)
    : existing.subtotal;
  const taxRate = body.taxRate ?? ((existing.tax / existing.subtotal) * 100 || 0);
  const tax = body.lineItems ? (subtotal * Number(taxRate)) / 100 : existing.tax;
  const discount = existing.discount || 0;
  const totalAmount = body.lineItems ? subtotal + tax - discount : existing.totalAmount;
  const updated = {
    ...existing,
    ...body,
    subtotal,
    tax,
    totalAmount,
    updatedAt: new Date().toISOString(),
  };
  invoices[idx] = updated;
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const idx = invoices.findIndex((i: any) => i.id === params.id);
  if (idx === -1) return NextResponse.json({ message: "Not found" }, { status: 404 });
  invoices.splice(idx, 1);
  return NextResponse.json({ success: true });
}


