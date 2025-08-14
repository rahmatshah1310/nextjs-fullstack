import { prisma } from "@/db.server";

//Get Single Product
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: Number(params.id) },
  });
  return new Response(JSON.stringify(product), { status: 200 });
}

//Update a Single Product
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { name, description, price } = await req.json();
  const product = await prisma.product.update({
    where: { id: Number(params.id) },
    data: { name, description, price: parseFloat(price) },
  });
  return new Response(JSON.stringify(product), { status: 200 });
}

//Delete a Single Product
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.product.delete({
    where: { id: Number(params.id) },
  });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
