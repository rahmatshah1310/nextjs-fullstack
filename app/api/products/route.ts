import { prisma } from "@/db.server";

//Get All Products
export async function GET() {
  const products = await prisma.product.findMany();
  return new Response(JSON.stringify(products), { status: 200 });
}

//Create Product
export async function POST(req: Request) {
  try {
    const { name, description, price } = await req.json();

    const product = await prisma.product.create({
      data: { name, description, price: parseFloat(price) },
    });

    return new Response(JSON.stringify({ success: true, product }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: (err as Error).message }), { status: 500 });
  }
}
