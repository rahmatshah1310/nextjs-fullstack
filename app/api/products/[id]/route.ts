import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db.server";
import cloudinary from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";

// -----------------
// GET Single Product
// -----------------
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } } // updated type
) {
  const { id } = params;
  const product = await prisma.product.findUnique({
    where: { id },
  });
  return NextResponse.json(product, { status: 200 });
}

// -----------------
// UPDATE Single Product
// -----------------
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const formData = await request.formData();

    // Extract form data
    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;
    const price = formData.get("price") as string;
    const quantity = formData.get("quantity") as string | null;
    const category = formData.get("category") as string | null;
    const discount = formData.get("discount") as string | null;
    const isActive = formData.get("isActive") === "true";
    const sizes = formData.getAll("sizes") as string[];
    const colors = formData.getAll("colors") as string[];
    const file = formData.get("image") as File | null;

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    let imageUrl = existingProduct.imageUrl;
    let cloudinaryId = existingProduct.cloudinaryId;

    // If new image uploaded → replace old one
    if (file) {
      // Delete old image if exists
      if (cloudinaryId) {
        await cloudinary.uploader.destroy(cloudinaryId);
      }

      // Use your uploadToCloudinary function
      const uploadResult: UploadApiResponse = await uploadToCloudinary(file);
      imageUrl = uploadResult.secure_url;
      cloudinaryId = uploadResult.public_id;
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : existingProduct.price,
        quantity: quantity ? parseInt(quantity) : existingProduct.quantity,
        category,
        discount: discount ? parseFloat(discount) : existingProduct.discount,
        isActive,
        sizes: sizes.length > 0 ? sizes : existingProduct.sizes,
        colors: colors.length > 0 ? colors : existingProduct.colors,
        imageUrl,
        cloudinaryId,
      },
    });

    return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}

// -----------------
// DELETE Single Product
// -----------------
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } } // updated type
) {
  const { id } = params;

  // Check existence
  const existingProduct = await prisma.product.findUnique({ where: { id } });
  if (!existingProduct) {
    return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
  }

  // Delete from Cloudinary if exists
  if (existingProduct.cloudinaryId) {
    await cloudinary.uploader.destroy(existingProduct.cloudinaryId);
  }

  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ success: true }, { status: 200 });
}
