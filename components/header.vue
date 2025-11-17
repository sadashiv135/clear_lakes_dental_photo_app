<template>
  <header class="bg-white shadow-sm">
    <div
      class="max-w-6xl mx-auto flex items-center justify-between px-6 py-3"
    >
      <!-- Logo only -->
      <img
        src="/full_logo.png"
        alt="Clear Lakes Dental"
        class="h-12 w-auto object-contain"
      />

      <!-- Navigation only on home -->
      <nav v-if="route.path === '/'" class="flex items-center gap-3">
        <button
          class="text-sm font-medium border rounded-full px-3 py-1 hover:bg-[#a5dcb0] hover:text-white transition"
          @click="navigateTo('/gallery')"
        >
          Photo Gallery
        </button>

        <button
          class="text-sm font-medium border rounded-full px-3 py-1 hover:bg-[#9ad7db] hover:text-white transition"
          @click="navigateTo('/upload')"
        >
          Upload Photo
        </button>

        <button
          class="text-sm font-medium border rounded-full px-3 py-1 border-red-300 text-red-600 hover:bg-red-500 hover:text-white transition"
          @click="logout"
        >
          Logout
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const route = useRoute();

async function logout() {
  await supabase.auth.signOut();
  navigateTo("/login");
}
</script>
