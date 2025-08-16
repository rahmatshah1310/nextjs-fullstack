import { prisma } from "@/db.server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Get all customers
export async function GET() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
  });
  return new Response(JSON.stringify(customers), { status: 200 });
}

// ✅ Create customer
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const status = formData.get("status") as string;
    const file = formData.get("profileImage") as File | null;

    if (!["active", "inactive", "blocked"].includes(status)) {
      return new Response(JSON.stringify({ success: false, message: "Invalid status value" }), { status: 400 });
    }

    let imageUrl = null;
    let cloudinaryId = null;

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadRes = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "customers" }, (err, result) => {
            if (err) reject(err);
            resolve(result);
          })
          .end(buffer);
      });

      imageUrl = uploadRes.secure_url;
      cloudinaryId = uploadRes.public_id;
    }

    const customer = await prisma.customer.create({
      data: { name, email, status, profileImageUrl: imageUrl, cloudinaryId },
    });

    return new Response(JSON.stringify({ success: true, customer }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: (err as Error).message }), { status: 500 });
  }
}
