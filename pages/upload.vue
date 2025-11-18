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

  if (!file.type.startsWith("image/")) {
    errorMessage.value = "Please select an image file (JPG, JPEG, PNG, etc.).";
    return;
  }

  selectedFile.value = file;
  previewUrl.value = URL.createObjectURL(file);
}

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

  <main class="max-w-2xl mx-auto px-4 py-12">
    <button
      class="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center gap-1 text-sm font-medium"
      @click="navigateTo('/')"
    >
      ← Back to Home
    </button>

    <!-- Header -->
    <section class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Upload Photo</h2>
      <p class="text-gray-600">
        Add a new photo to the Clear Lakes Dental photo library.
      </p>
    </section>

    <!-- Upload Card -->
    <section class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div class="p-8 space-y-6">
        <!-- File picker -->
        <div class="space-y-3">
          <label class="block text-sm font-semibold text-gray-900">
            📷 Choose Image
          </label>
          <div class="relative">
            <input
              type="file"
              accept="image/*"
              @change="onFileChange"
              class="hidden"
              id="file-input"
            />
            <label 
              for="file-input"
              class="block w-full px-4 py-3 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors text-center text-sm font-medium text-blue-700"
            >
              Click to select or drag file here
            </label>
          </div>
          <p class="text-xs text-gray-500">
            Supported: JPG, JPEG, PNG, GIF, WebP (Max 5MB)
          </p>
        </div>

        <!-- Preview -->
        <div v-if="previewUrl" class="space-y-3">
          <p class="text-sm font-semibold text-gray-900">Preview</p>
          <div class="overflow-hidden rounded-lg bg-gray-100 h-64">
            <img
              :src="previewUrl"
              alt="Preview"
              class="w-full h-full object-contain"
            />
          </div>
        </div>

        <!-- Messages -->
        <div v-if="errorMessage || successMessage" class="space-y-2">
          <div v-if="errorMessage" class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <span class="text-xl">⚠️</span>
            <p class="text-sm text-red-700">{{ errorMessage }}</p>
          </div>
          <div v-if="successMessage" class="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <span class="text-xl">✅</span>
            <p class="text-sm text-green-700">{{ successMessage }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-between items-center pt-4 border-t border-gray-100">
          <button
            type="button"
            class="text-gray-600 hover:text-gray-900 text-sm font-medium"
            @click="clearSelection"
            :disabled="uploading"
          >
            Clear
          </button>

          <button
            type="button"
            :disabled="!selectedFile || uploading"
            class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
            @click="uploadPhoto"
          >
            {{ uploading ? "⏳ Uploading..." : "📤 Upload Photo" }}
          </button>
        </div>
      </div>
    </section>

    <!-- Info Box -->
    <div class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <p class="text-sm text-blue-900">
        <strong>💡 Tip:</strong> Upload high-quality photos. They will appear in the Photo Gallery immediately.
      </p>
    </div>
  </main>
</template>
