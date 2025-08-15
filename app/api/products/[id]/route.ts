import { prisma } from "@/db.server";
import { NextResponse } from "next/server";

// Type for route parameters
interface RouteParams {
  params: {
    id: string;
  };
}

// Get Single Product
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(params.id) },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Update a Single Product
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { name, description, price } = await request.json();
    const product = await prisma.product.update({
      where: { id: Number(params.id) },
      data: { name, description, price: parseFloat(price) },
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Delete a Single Product
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await prisma.product.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
