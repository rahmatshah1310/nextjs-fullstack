import { prisma } from "@/db.server";
import cloudinary from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";

// Get all customers
export async function GET() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
  });
  return new Response(JSON.stringify(customers), { status: 200 });
}

// Create customer
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const status = formData.get("status") as string;
    const phone = formData.get("phone") as string | null;
    const address = formData.get("address") as string | null;
    const file = formData.get("profileImage") as File | null;

    if (!["active", "inactive", "blocked"].includes(status)) {
      return new Response(JSON.stringify({ success: false, message: "Invalid status value" }), { status: 400 });
    }

    let imageUrl = null;
    let cloudinaryId = null;

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadRes = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "customers" }, (err, result) => {
            if (err) reject(err);
            else resolve(result!);
          })
          .end(buffer);
      });

      imageUrl = uploadRes.secure_url;
      cloudinaryId = uploadRes.public_id;
    }

    const customer = await prisma.customer.create({
      data: { name, email, status, phone, address, profileImageUrl: imageUrl, cloudinaryId },
    });

    return new Response(JSON.stringify({ success: true, customer }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: (err as Error).message }), { status: 500 });
  }
}
