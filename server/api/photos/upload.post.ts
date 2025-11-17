import { serverSupabaseServiceRole } from "#supabase/server";

type PhotoItem = {
  name: string;
  url: string;
};

export default defineEventHandler(async (event) => {
  // use service-role client → bypasses RLS on storage.objects
  const client = await serverSupabaseServiceRole(event);

  const formData = await readMultipartFormData(event);
  if (!formData) {
    throw createError({
      statusCode: 400,
      statusMessage: "No form data",
    });
  }

  const filePart = formData.find((part) => part.name === "file");

  if (!filePart || !filePart.filename || !filePart.data) {
    throw createError({
      statusCode: 400,
      statusMessage: "No file uploaded",
    });
  }

  const fileExt = filePart.filename.split(".").pop() || "jpg";
  const fileName = `${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}.${fileExt}`;

  const { error: uploadError } = await client.storage
    .from("Pictures")
    .upload(fileName, filePart.data, {
      contentType: filePart.type || "image/*",
    });

  if (uploadError) {
    throw createError({
      statusCode: 500,
      statusMessage: uploadError.message,
    });
  }

  const { data: publicData } = client.storage
    .from("Pictures")
    .getPublicUrl(fileName);

  const photo: PhotoItem = {
    name: fileName,
    url: publicData.publicUrl,
  };

  return photo;
});
