export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
}

export async function uploadToCloudinary(
  file: Blob | File,
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResponse> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  // Fallback to COUDINARY_UPLOAD_PRESET as in .env file
  const uploadPreset = process.env.COUDINARY_UPLOAD_PRESET || "ishakbuilds";

  if (!cloudName) {
    throw new Error("Missing Cloudinary Cloud Name in environment variables (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME).");
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (err) {
          reject(new Error("Failed to parse Cloudinary response."));
        }
      } else {
        reject(new Error(`Cloudinary upload failed: ${xhr.statusText || xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during Cloudinary upload."));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    xhr.send(formData);
  });
}
