import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db.server";

// Get Single Product
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });
  return NextResponse.json(product, { status: 200 });
}

// Update a Single Product
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { name, description, price } = await request.json();
  const product = await prisma.product.update({
    where: { id: Number(id) },
    data: { name, description, price: parseFloat(price) },
  });
  return NextResponse.json(product, { status: 200 });
}

// Delete a Single Product
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.product.delete({
    where: { id: Number(id) },
  });
  return NextResponse.json({ success: true }, { status: 200 });
}
