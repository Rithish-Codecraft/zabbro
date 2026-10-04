import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

/**
 * Upload an image buffer or base64 string to Cloudinary
 */
export async function uploadImageToCloudinary(
  fileData: string,
  folder: string = "zabbro/products"
): Promise<{ url: string; publicId: string; secureUrl: string }> {
  if (!isCloudinaryConfigured) {
    console.warn("Cloudinary not configured. Returning original file data or fallback URL.");
    // In dev without keys, pass through the provided data or fallback
    return {
      url: fileData.startsWith("http") ? fileData : "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
      publicId: "mock-" + Date.now(),
      secureUrl: fileData.startsWith("http") ? fileData : "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
    };
  }

  try {
    const result = await cloudinary.uploader.upload(fileData, {
      folder,
      resource_type: "image",
      transformation: [
        { quality: "auto:best" },
        { fetch_format: "auto" }
      ],
    });

    return {
      url: result.url,
      publicId: result.public_id,
      secureUrl: result.secure_url,
    };
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new Error("Failed to upload image to Cloudinary.");
  }
}

/**
 * Generate client-side signature for direct browser-to-Cloudinary uploads
 */
export function getUploadSignature(folder: string = "zabbro/products") {
  if (!isCloudinaryConfigured) {
    return null;
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
    },
    apiSecret!
  );

  return {
    timestamp,
    signature,
    apiKey,
    cloudName,
    folder,
  };
}
