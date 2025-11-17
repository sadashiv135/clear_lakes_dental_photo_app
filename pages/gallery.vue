<script setup lang="ts">
type PhotoItem = {
  name: string;
  url: string;
};

// Load photos
const {
  data: photos,
  pending,
  error,
  refresh,
} = await useFetch<PhotoItem[]>("/api/photos/list");

// Delete photo
async function deletePhoto(name: string) {
  const ok = confirm("Are you sure you want to delete this photo?");
  if (!ok) return;

  try {
    await $fetch("/api/photos/delete", {
      method: "POST",
      body: { name },
    });
    await refresh();
  } catch (err) {
    console.error(err);
    alert("Failed to delete photo.");
  }
}

// Replace / update photo (upload new file over same name)
async function replacePhoto(name: string, event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];
  const formData = new FormData();
  formData.append("oldName", name);
  formData.append("file", file);

  try {
    await $fetch("/api/photos/update", {
      method: "POST",
      body: formData as any,
    });
    await refresh();
  } catch (err) {
    console.error(err);
    alert("Failed to update photo.");
  } finally {
    // reset input so the same file can be chosen again if needed
    input.value = "";
  }
}
</script>

<template>
  <Header />

  <main class="max-w-6xl mx-auto px-6 py-8 space-y-6">
    <section class="flex items-center justify-between">
  <div>
    <button
      class="text-xs text-gray-600 underline mb-1"
      @click="navigateTo('/')"
    >
      ← Back to Home
    </button>
    <h2 class="text-xl font-semibold">Photo Gallery</h2>
    <p class="text-sm text-gray-600">
      Browse and manage uploaded photos.
    </p>
  </div>

  <button class="text-sm underline" @click="refresh">
    Refresh
  </button>
</section>

    <section v-if="pending">
      <p>Loading photos...</p>
    </section>

    <section v-else-if="error">
      <p class="text-red-600">
        Failed to load photos:
        {{ (error as any).message || error }}
      </p>
    </section>

    <section v-else>
      <div v-if="!photos || photos.length === 0">
        <p class="text-sm text-gray-600">
          No photos yet. Use “Upload Photo” on the home page to add one.
        </p>
      </div>

      <div
        v-else
        class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <figure
          v-for="photo in photos"
          :key="photo.name"
          class="bg-white rounded-xl shadow-sm overflow-hidden border flex flex-col"
        >
          <img
            :src="photo.url"
            :alt="photo.name"
            class="w-full h-48 object-cover"
          />
          <figcaption class="px-3 py-2 text-xs text-gray-500 break-all">
            {{ photo.name }}
          </figcaption>

          <div
            class="px-3 pb-3 pt-1 flex items-center justify-between text-xs"
          >
            <button
              class="text-red-600 underline"
              @click="deletePhoto(photo.name)"
            >
              Delete
            </button>

            <label class="text-blue-600 underline cursor-pointer">
              Replace
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="(e) => replacePhoto(photo.name, e)"
              />
            </label>
          </div>
        </figure>
      </div>
    </section>
  </main>
</template>
