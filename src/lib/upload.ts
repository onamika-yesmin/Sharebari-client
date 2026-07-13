export async function uploadAvatar(file: File) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Image upload is not configured. Add Cloudinary cloud name and unsigned upload preset.");
  }

  const body = new FormData();
  body.set("file", file);
  body.set("upload_preset", uploadPreset);
  body.set("folder", "sharebari/avatars");

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body,
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error?.message || "Could not upload image");
  }

  return String(payload.secure_url || "");
}
