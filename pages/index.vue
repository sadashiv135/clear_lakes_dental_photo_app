<script setup lang="ts">
type PhotoItem = {
  name: string;
  url: string;
};

const { data: photos, pending, error, refresh } = await useFetch<PhotoItem[]>(
  "/api/photos/list"
);

// Logout function
const supabase = useSupabaseClient();

async function logout() {
  await supabase.auth.signOut();
  navigateTo("/login");
}
</script>

<template>
  <Header />

  <main class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Welcome Section -->
    <section class="max-w-4xl mx-auto px-4 py-16 text-center">
      <h2 class="text-4xl font-bold text-gray-900 mb-4">Welcome Back</h2>
      <p class="text-lg text-gray-600">
        Manage your photo library for Clear Lakes Dental
      </p>
    </section>

    <!-- Main Features Grid -->
    <section class="max-w-5xl mx-auto px-4 pb-20">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Feature 1: Gallery -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-center">
            <div class="text-5xl mb-2">🖼️</div>
            <h3 class="text-xl font-bold text-white">Photo Gallery</h3>
          </div>
          <div class="p-6 space-y-4">
            <p class="text-gray-600 text-sm">
              View, manage, and organize all your uploaded photos in one beautiful place.
            </p>
            <a 
              href="/gallery" 
              class="block w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold text-center"
            >
              Open Gallery
            </a>
          </div>
        </div>

        <!-- Feature 2: Upload -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          <div class="bg-gradient-to-r from-green-500 to-green-600 p-6 text-center">
            <div class="text-5xl mb-2">📤</div>
            <h3 class="text-xl font-bold text-white">Upload Photo</h3>
          </div>
          <div class="p-6 space-y-4">
            <p class="text-gray-600 text-sm">
              Add new photos to your library. Quick, easy, and instant.
            </p>
            <a 
              href="/upload" 
              class="block w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold text-center"
            >
              Upload Now
            </a>
          </div>
        </div>

        <!-- Feature 3: Logout -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          <div class="bg-gradient-to-r from-red-500 to-red-600 p-6 text-center">
            <div class="text-5xl mb-2">🚪</div>
            <h3 class="text-xl font-bold text-white">Logout</h3>
          </div>
          <div class="p-6 space-y-4">
            <p class="text-gray-600 text-sm">
              End your session securely. You'll need to log in again.
            </p>
            <button 
              @click="logout"
              class="w-full px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold text-center"
            >
              Logout
            </button>
          </div>
        </div>

      </div>
    </section>
  </main>
</template>
