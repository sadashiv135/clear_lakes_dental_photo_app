<script setup lang="ts">
const selectedFiles = ref<File[]>([]);
const previewUrls = ref<string[]>([]);
const uploading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

// When user selects files
function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files || []);

  // Reset everything first
  errorMessage.value = "";
  successMessage.value = "";
  previewUrls.value = [];
  selectedFiles.value = [];

  if (files.length === 0) return;

  // Validate all files are images
  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      errorMessage.value = "Please select only image files (JPG, JPEG, PNG, etc.).";
      return;
    }
  }

  selectedFiles.value = files;
  previewUrls.value = files.map(file => URL.createObjectURL(file));
}

function clearSelection() {
  selectedFiles.value = [];
  previewUrls.value = [];
  errorMessage.value = "";
  successMessage.value = "";
}

// Remove a specific file from selection
function removeFile(index: number) {
  selectedFiles.value.splice(index, 1);
  previewUrls.value.splice(index, 1);
}

// Upload all selected files to our server API
async function uploadPhotos() {
  errorMessage.value = "";
  successMessage.value = "";

  if (selectedFiles.value.length === 0) {
    errorMessage.value = "Please choose at least one image.";
    return;
  }

  uploading.value = true;
  try {
    // Upload each file
    for (const file of selectedFiles.value) {
      const formData = new FormData();
      formData.append("file", file);

      await $fetch("/api/photos/upload", {
        method: "POST",
        body: formData,
      });
    }

    const count = selectedFiles.value.length;
    successMessage.value =
      count === 1
        ? "Photo uploaded successfully. Redirecting to gallery..."
        : `${count} photos uploaded successfully. Redirecting to gallery...`;

    setTimeout(() => {
      navigateTo("/gallery");
    }, 600);
  } catch (err: any) {
    console.error(err);
    errorMessage.value =
      err?.data?.statusMessage || "Failed to upload photos. Please try again.";
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
            Choose Images
          </label>
          <div class="relative">
            <input
              type="file"
              accept="image/*"
              multiple
              @change="onFileChange"
              class="hidden"
              id="file-input"
            />
            <label 
              for="file-input"
              class="block w-full px-4 py-3 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors text-center text-sm font-medium text-blue-700"
            >
              Click to select images
            </label>
          </div>
          <p class="text-xs text-gray-500">
            Supported: JPG, JPEG, PNG, GIF, WebP (Max 5MB each). Select multiple files to upload at once.
          </p>
        </div>

        <!-- Preview Grid -->
        <div v-if="previewUrls.length > 0" class="space-y-3">
          <p class="text-sm font-semibold text-gray-900">Selected ({{ previewUrls.length }})</p>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div v-for="(url, index) in previewUrls" :key="index" class="relative group">
              <div class="overflow-hidden rounded-lg bg-gray-100 aspect-square">
                <img
                  :src="url"
                  :alt="`Preview ${index + 1}`"
                  class="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                @click="removeFile(index)"
                class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                title="Remove this file"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <!-- Messages -->
        <div v-if="errorMessage || successMessage" class="space-y-2">
          <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-700">{{ errorMessage }}</p>
          </div>
          <div v-if="successMessage" class="p-3 bg-green-50 border border-green-200 rounded-lg">
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
            Clear All
          </button>

          <button
            type="button"
            :disabled="selectedFiles.length === 0 || uploading"
            class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
            @click="uploadPhotos"
          >
            {{ uploading ? "Uploading..." : `Upload (${selectedFiles.length})` }}
          </button>
        </div>
      </div>
    </section>

    <!-- Info Box -->
    <div class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <p class="text-sm text-blue-900">
        <strong>Tip:</strong> Upload high-quality photos. They will appear in the Photo Gallery immediately.
      </p>
    </div>
  </main>
</template>
