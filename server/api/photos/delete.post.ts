import { serverSupabaseServiceRole } from "#supabase/server";

type DeleteBody = {
  name: string;
};

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseServiceRole(event);
  const body = await readBody<DeleteBody>(event);

  if (!body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing file name",
    });
  }

  const { error } = await client.storage
    .from("Pictures")
    .remove([body.name]);

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }

  return { success: true };
});
