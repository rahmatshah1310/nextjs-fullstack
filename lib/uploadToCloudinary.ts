import cloudinary from "./cloudinary";
import { UploadApiResponse } from "cloudinary";

export async function uploadToCloudinary(file: File): Promise<UploadApiResponse> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "products" }, (err, result) => {
        if (err) reject(err);
        else resolve(result!);
      })
      .end(buffer);
  });
}
