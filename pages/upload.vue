<script setup lang="ts">
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const uploading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

// When user selects a file
function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] || null;

  // Reset everything first
  errorMessage.value = "";
  successMessage.value = "";
  previewUrl.value = null;
  selectedFile.value = null;

  if (!file) return;

  // Strict validation: ensure the file is an actual image
  if (!file.type.startsWith("image/")) {
    errorMessage.value = "Please select an image file (JPG, JPEG, PNG, etc.).";
    return;
  }

  selectedFile.value = file;
  previewUrl.value = URL.createObjectURL(file);
}


// Clear selected file + preview (but stay on page)
function clearSelection() {
  selectedFile.value = null;
  previewUrl.value = null;
  errorMessage.value = "";
  successMessage.value = "";
}

// Upload to our server API, then go to gallery
async function uploadPhoto() {
  errorMessage.value = "";
  successMessage.value = "";

  if (!selectedFile.value) {
    errorMessage.value = "Please choose an image first.";
    return;
  }

  uploading.value = true;
  try {
    const formData = new FormData();
    formData.append("file", selectedFile.value);

    await $fetch("/api/photos/upload", {
      method: "POST",
      body: formData,
    });

    successMessage.value =
      "Photo uploaded successfully. Redirecting to gallery...";

    setTimeout(() => {
      navigateTo("/gallery");
    }, 600);
  } catch (err: any) {
    console.error(err);
    errorMessage.value =
      err?.data?.statusMessage || "Failed to upload photo. Please try again.";
  } finally {
    uploading.value = false;
  }
}
</script>

<template>
  <Header />

  <main class="max-w-xl mx-auto px-6 py-10 space-y-6">
    <!-- Back to home -->
    <button
      class="text-xs text-gray-600 underline"
      @click="navigateTo('/')"
    >
      ← Back to Home
    </button>

    <section>
      <h2 class="text-xl font-semibold mb-1">Upload Photo</h2>
      <p class="text-sm text-gray-600">
        Select an image to add it to the Clear Lakes Dental photo library.
      </p>
    </section>

    <section class="space-y-4 border rounded-xl p-4 bg-white shadow-sm">
      <!-- File picker -->
      <div class="space-y-2">
        <label class="block text-sm font-medium">Choose image</label>
        <input
          type="file"
          accept="image/*"
          @change="onFileChange"
          class="block w-full text-sm"
        />
        <p class="text-xs text-gray-500">
          Supported: common image formats (JPG, PNG, etc).
        </p>
      </div>

      <!-- Preview -->
      <div v-if="previewUrl" class="space-y-2">
        <p class="text-sm font-medium">Preview</p>
        <div class="border rounded-lg overflow-hidden max-h-64">
          <img
            :src="previewUrl"
            alt="Preview"
            class="w-full h-64 object-cover"
          />
        </div>
      </div>

      <!-- Messages -->
      <p v-if="errorMessage" class="text-sm text-red-600">
        {{ errorMessage }}
      </p>
      <p v-if="successMessage" class="text-sm text-green-600">
        {{ successMessage }}
      </p>

      <!-- Actions -->
      <div class="flex justify-between items-center pt-2">
        <button
          type="button"
          class="text-sm underline"
          @click="clearSelection"
          :disabled="uploading"
        >
          Clear selection
        </button>

        <button
          type="button"
          :disabled="uploading"
          class="text-sm font-medium border rounded-full px-4 py-1.5 disabled:opacity-60"
          @click="uploadPhoto"
        >
          {{ uploading ? "Uploading..." : "Upload" }}
        </button>
      </div>
    </section>
  </main>
</template>
