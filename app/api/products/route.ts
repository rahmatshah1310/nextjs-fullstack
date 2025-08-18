import { prisma } from "@/db.server";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";

// -----------------
// GET All Products
// -----------------
export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return new Response(JSON.stringify(products), { status: 200 });
}

// -----------------
// CREATE Product
// -----------------
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;
    const price = formData.get("price") as string;
    const quantity = formData.get("quantity") as string | null;
    const category = formData.get("category") as string | null;
    const discount = formData.get("discount") as string | null;
    const isActive = formData.get("isActive") === "true";
    const sizes = formData.getAll("sizes") as string[];
    const colors = formData.getAll("colors") as string[];

    const fileData = formData.get("image");
    const file = fileData instanceof File ? fileData : null;

    // Validation
    if (!name || !price) {
      return new Response(JSON.stringify({ success: false, error: "Name and Price are required" }), { status: 400 });
    }

    const priceValue = Number(price);
    if (isNaN(priceValue)) {
      return new Response(JSON.stringify({ success: false, error: "Invalid price" }), { status: 400 });
    }

    let imageUrl: string | null = null;
    let cloudinaryId: string | null = null;

    if (file) {
      const uploadRes = await uploadToCloudinary(file);
      imageUrl = uploadRes.secure_url;
      cloudinaryId = uploadRes.public_id;
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: priceValue,
        quantity: quantity ? parseInt(quantity) : 0,
        category,
        discount: discount ? parseFloat(discount) : null,
        isActive,
        sizes,
        colors,
        imageUrl,
        cloudinaryId,
      },
    });

    return new Response(JSON.stringify({ success: true, data: product }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: (err as Error).message }), { status: 500 });
  }
}
