import type { Route } from "./+types/api.upload";
import { uploadImageToCloudinary, getUploadSignature, isCloudinaryConfigured } from "~/lib/cloudinary.server";

export async function loader() {
  const signatureData = getUploadSignature();
  return Response.json({
    configured: isCloudinaryConfigured,
    signatureData,
  });
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();
    const { image, folder } = body;

    if (!image) {
      return Response.json({ error: "No image payload provided" }, { status: 400 });
    }

    const uploadResult = await uploadImageToCloudinary(image, folder || "zabbro/products");

    return Response.json({
      success: true,
      url: uploadResult.secureUrl,
      publicId: uploadResult.publicId,
    });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return Response.json(
      { error: error.message || "Failed to process image upload" },
      { status: 500 }
    );
  }
}
