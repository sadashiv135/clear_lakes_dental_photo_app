<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const email = ref("");
const password = ref("");
const isRegister = ref(false);
const loading = ref(false);
const errorMessage = ref("");

// If already logged in, redirect to gallery
watchEffect(() => {
  if (user.value) {
    navigateTo("/");
  }
});

async function submit() {
  loading.value = true;
  errorMessage.value = "";

  try {
    if (isRegister.value) {
      // Sign up
      const { error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      });
      if (error) throw error;

      // Log in right after sign up
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      });
      if (loginError) throw loginError;
    } else {
      // Log in
      const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      });
      if (error) throw error;
    }

    await navigateTo("/");
  } catch (err: any) {
    console.error(err);
    errorMessage.value = err.message || "Authentication failed.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="min-h-screen flex items-center justify-center">
    <div class="border rounded-md p-6 w-full max-w-md space-y-4">
      <h1 class="text-xl font-bold text-center">
        {{ isRegister ? "Create account" : "Log in" }}
      </h1>

      <form class="space-y-3" @submit.prevent="submit">
        <div>
          <label class="block mb-1 text-sm">Email</label>
          <input
            v-model="email"
            type="email"
            class="w-full border px-2 py-1"
            required
          />
        </div>
        <div>
          <label class="block mb-1 text-sm">Password</label>
          <input
            v-model="password"
            type="password"
            class="w-full border px-2 py-1"
            required
          />
        </div>

        <p v-if="errorMessage" class="text-red-600 text-sm">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full border px-4 py-2 mt-2"
        >
          {{ loading ? "Please wait..." : (isRegister ? "Register" : "Log in") }}
        </button>
      </form>

      <button class="text-sm underline w-full" @click="isRegister = !isRegister">
        {{ isRegister ? "Have an account? Log in" : "New user? Create an account" }}
      </button>
    </div>
  </main>
</template>
