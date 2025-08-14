import { prisma } from "@/db.server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });
  return new Response(JSON.stringify(product), { status: 200 });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { name, description, price } = await req.json();
  const product = await prisma.product.update({
    where: { id: Number(id) },
    data: { name, description, price: parseFloat(price) },
  });
  return new Response(JSON.stringify(product), { status: 200 });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  await prisma.product.delete({
    where: { id: Number(id) },
  });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
