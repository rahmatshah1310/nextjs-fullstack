import { prisma } from "@/db.server";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({ where: { id } });
  return NextResponse.json(customer, { status: 200 });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const status = formData.get("status") as string;
    const phone = formData.get("phone") as string | null;
    const address = formData.get("address") as string | null;
    const file = formData.get("profileImage") as File | null;

    if (status && !["active", "inactive", "blocked"].includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status value" }, { status: 400 });
    }

    const existingCustomer = await prisma.customer.findUnique({ where: { id } });
    if (!existingCustomer) {
      return NextResponse.json({ success: false, message: "Customer not found" }, { status: 404 });
    }

    let imageUrl = existingCustomer.profileImageUrl;
    let cloudinaryId = existingCustomer.cloudinaryId;

    // If new image uploaded → replace
    if (file) {
      // remove old image if exists
      if (cloudinaryId) {
        await cloudinary.uploader.destroy(cloudinaryId);
      }

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

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: { name, email, phone, address, status, profileImageUrl: imageUrl, cloudinaryId },
    });

    return NextResponse.json({ success: true, customer: updatedCustomer }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({ where: { id } });

  if (customer?.cloudinaryId) {
    await cloudinary.uploader.destroy(customer.cloudinaryId);
  }

  await prisma.customer.delete({ where: { id } });
  return NextResponse.json({ success: true }, { status: 200 });
}
