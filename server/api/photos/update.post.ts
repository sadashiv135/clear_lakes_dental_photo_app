import { serverSupabaseServiceRole } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseServiceRole(event);

  const formData = await readMultipartFormData(event);
  if (!formData) {
    throw createError({
      statusCode: 400,
      statusMessage: "No form data",
    });
  }

  const filePart = formData.find((part) => part.name === "file");
  const oldNamePart = formData.find((part) => part.name === "oldName");

  if (!filePart || !filePart.data || !oldNamePart || !oldNamePart.data) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing file or oldName",
    });
  }

  const oldName = oldNamePart.data.toString("utf-8");

  const { error: uploadError } = await client.storage
    .from("Pictures")
    .upload(oldName, filePart.data, {
      upsert: true, // overwrite existing
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
    .getPublicUrl(oldName);

  return {
    name: oldName,
    url: publicData.publicUrl,
  };
});
