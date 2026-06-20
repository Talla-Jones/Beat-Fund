<template>
  <div class="min-h-screen bg-gray-950 flex items-center justify-center">
    <div class="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md">
      <h1 class="text-4xl font-bold text-white text-center mb-2">BeatFund</h1>
      <p class="text-gray-400 text-center mb-8">Login to your account</p>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <input
            v-model="email"
            type="email"
            placeholder="Email address"
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
            required
          />
        </div>
        <div>
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
            required
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-semibold text-white transition"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <p class="text-center text-gray-400 mt-6">
        Don't have an account? 
        <router-link to="/register" class="text-purple-400 hover:underline">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  try {
    await authStore.login(email.value, password.value);
    router.push('/projects');
  } catch (err) {
    alert('Login failed: ' + (err.response?.data?.message || err.message));
  } finally {
    loading.value = false;
  }
};
</script>