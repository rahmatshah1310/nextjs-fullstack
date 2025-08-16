import { prisma } from "@/db.server";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({ where: { id: Number(id) } });
  return NextResponse.json(customer, { status: 200 });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const { name, email, status } = body;

  if (status && !["active", "inactive", "blocked"].includes(status)) {
    return NextResponse.json({ success: false, message: "Invalid status value" }, { status: 400 });
  }

  const customer = await prisma.customer.update({
    where: { id: Number(id) },
    data: { name, email, status },
  });

  return NextResponse.json(customer, { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({ where: { id: Number(id) } });

  if (customer?.cloudinaryId) {
    await cloudinary.uploader.destroy(customer.cloudinaryId);
  }

  await prisma.customer.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true }, { status: 200 });
}
