import { serverSupabaseServiceRole } from "#supabase/server";

type PhotoItem = {
  name: string;
  url: string;
};

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseServiceRole(event);

  const { data, error } = await client.storage.from("Pictures").list("", {
    limit: 100,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }

  const photos: PhotoItem[] =
    data?.map((file) => {
      const { data: publicData } = client.storage
        .from("Pictures")
        .getPublicUrl(file.name);

      return {
        name: file.name,
        url: `${publicData.publicUrl}?v=${Date.now()}`,
      };
    }) ?? [];

  return photos;
});
