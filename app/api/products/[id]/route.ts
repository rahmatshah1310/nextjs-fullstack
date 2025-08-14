import { prisma } from "@/db.server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/products/[id]
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  return NextResponse.json(product);
}

// PUT /api/products/[id]
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const { name, description, price } = await req.json();

  const updated = await prisma.product.update({
    where: { id: Number(id) },
    data: { name, description, price: parseFloat(price) },
  });

  return NextResponse.json(updated);
}

// DELETE /api/products/[id]
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  await prisma.product.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ success: true });
}
