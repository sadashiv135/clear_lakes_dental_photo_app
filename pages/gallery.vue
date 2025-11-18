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

// Modal state
const selectedPhoto = ref<PhotoItem | null>(null);

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

// Close modal on escape key
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    selectedPhoto.value = null;
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<template>
  <Header />

  <main class="max-w-7xl mx-auto px-4 py-8">
    <section class="flex items-center justify-between mb-8">
      <div>
        <button
          class="text-xs text-blue-600 hover:text-blue-800 mb-2 inline-flex items-center gap-1"
          @click="navigateTo('/')"
        >
          ← Back to Home
        </button>
        <h2 class="text-3xl font-bold text-gray-900">Photo Gallery</h2>
        <p class="text-sm text-gray-600 mt-1">
          Browse and manage uploaded photos. Click any photo to view it in full size.
        </p>
      </div>

      <button 
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        @click="refresh"
      >
        🔄 Refresh
      </button>
    </section>

    <section v-if="pending" class="text-center py-12">
      <p class="text-gray-600">Loading photos...</p>
    </section>

    <section v-else-if="error" class="text-center py-12">
      <p class="text-red-600">
        Failed to load photos: {{ (error as any).message || error }}
      </p>
    </section>

    <section v-else>
      <div v-if="!photos || photos.length === 0" class="text-center py-12">
        <p class="text-gray-600">
          No photos yet. Use "Upload Photo" on the home page to add one.
        </p>
      </div>

      <div v-else class="photo-grid">
        <div
          v-for="photo in photos"
          :key="photo.name"
          class="photo-card"
        >
          <div class="photo-image-wrapper">
            <img
              :src="photo.url"
              :alt="photo.name"
              class="photo-image cursor-pointer"
              @click="selectedPhoto = photo"
            />
            <div class="overlay-actions">
              <button class="view-btn" @click="selectedPhoto = photo">
                👁️ View
              </button>
            </div>
          </div>
          
          <div class="photo-info">
            <p class="photo-name" :title="photo.name">
              {{ photo.name }}
            </p>

            <div class="photo-actions">
              <button
                class="action-btn delete-btn"
                @click="deletePhoto(photo.name)"
                title="Delete this photo"
              >
                🗑️ Delete
              </button>
              
              <label class="action-btn replace-btn" title="Replace with a new photo">
                ✏️ Replace
                <input
                  type="file"
                  accept="image/*"
                  @change="(e) => replacePhoto(photo.name, e)"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Modal for viewing full-size photo -->
  <div v-if="selectedPhoto" class="modal-overlay" @click="selectedPhoto = null">
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="selectedPhoto = null">
        ✕
      </button>
      
      <div class="modal-image-container">
        <img
          :src="selectedPhoto.url"
          :alt="selectedPhoto.name"
          class="modal-image"
        />
      </div>
      
      <div class="modal-footer">
        <p class="modal-filename">{{ selectedPhoto.name }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}

.photo-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.photo-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.photo-image-wrapper {
  position: relative;
  overflow: hidden;
  background: #f3f4f6;
  height: 220px;
  width: 100%;
}

.photo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  display: block;
}

.photo-card:hover .photo-image {
  transform: scale(1.08);
}

.overlay-actions {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.photo-card:hover .overlay-actions {
  opacity: 1;
}

.view-btn {
  background: white;
  color: #1f2937;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.view-btn:hover {
  background: #f3f4f6;
  transform: scale(1.05);
}

.photo-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex-grow: 1;
}

.photo-name {
  font-size: 0.85rem;
  color: #374151;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.photo-actions {
  display: flex;
  gap: 0.5rem;
  flex-direction: row;
}

.action-btn {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.75rem;
  transition: all 0.2s ease;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.replace-btn {
  background: #dbeafe;
  color: #1e40af;
}

.replace-btn:hover {
  background: #bfdbfe;
}

.replace-btn input {
  display: none;
}

.delete-btn {
  background: #fee2e2;
  color: #dc2626;
}

.delete-btn:hover {
  background: #fecaca;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  position: relative;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  max-width: 90vw;
  max-height: 90vh;
  animation: slideUp 0.3s ease;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.3);
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: scale(1.1);
}

.modal-image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  max-height: 70vh;
}

.modal-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
}

.modal-footer {
  padding: 1rem;
  background: white;
  border-top: 1px solid #e5e7eb;
  text-align: center;
}

.modal-filename {
  margin: 0;
  font-size: 0.9rem;
  color: #6b7280;
  word-break: break-all;
}
</style>
