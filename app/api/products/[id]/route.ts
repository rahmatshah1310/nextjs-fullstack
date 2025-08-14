import { prisma } from "@/db.server";

// Get Single Product
export async function GET(req: Request, context: { params: { id: string } }) {
  const { id } = context.params;

  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  return new Response(JSON.stringify(product), { status: 200 });
}

// Update a Single Product
export async function PUT(req: Request, context: { params: { id: string } }) {
  const { id } = context.params;
  const { name, description, price } = await req.json();

  const product = await prisma.product.update({
    where: { id: Number(id) },
    data: { name, description, price: parseFloat(price) },
  });

  return new Response(JSON.stringify(product), { status: 200 });
}

// Delete a Single Product
export async function DELETE(req: Request, context: { params: { id: string } }) {
  const { id } = context.params;

  await prisma.product.delete({
    where: { id: Number(id) },
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
