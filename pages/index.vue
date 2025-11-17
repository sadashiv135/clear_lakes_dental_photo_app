<script setup lang="ts">
type PhotoItem = {
  name: string;
  url: string;
};

const { data: photos, pending, error, refresh } = await useFetch<PhotoItem[]>(
  "/api/photos/list"
);
</script>

<template>
  <Header />

  <main class="max-w-4xl mx-auto px-6 py-12 space-y-4">
    <h2 class="text-2xl font-semibold mb-2">Welcome</h2>
    <p class="text-sm text-gray-700">
      Use the navigation above to manage photos for Clear Lakes Dental.
    </p>
    <ul class="list-disc list-inside text-sm text-gray-700 space-y-1">
      <li><strong>Photo Gallery</strong> – view all uploaded images.</li>
      <li><strong>Upload Photo</strong> – add a new photo to storage.</li>
      <li><strong>Logout</strong> – end your session safely.</li>
    </ul>
  </main>
</template>
