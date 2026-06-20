<template>
  <div class="min-h-screen bg-gray-950 flex items-center justify-center">
    <div class="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md">
      <h1 class="text-4xl font-bold text-white text-center mb-2">BeatFund</h1>
      <p class="text-gray-400 text-center mb-8">Create your account</p>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <input v-model="form.username" type="text" placeholder="Username" required
          class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white" />
        
        <input v-model="form.email" type="email" placeholder="Email" required
          class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white" />
        
        <input v-model="form.password" type="password" placeholder="Password" required
          class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white" />
        
        <input v-model="form.full_name" type="text" placeholder="Full Name" required
          class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white" />
        
        <input v-model="form.country" type="text" placeholder="Country" 
          class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white" />

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-semibold text-white"
        >
          {{ loading ? 'Creating Account...' : 'Register' }}
        </button>
      </form>

      <p class="text-center text-gray-400 mt-6">
        Already have an account? 
        <router-link to="/login" class="text-purple-400 hover:underline">Login</router-link>
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

const form = ref({
  username: '',
  email: '',
  password: '',
  full_name: '',
  country: ''
});

const loading = ref(false);

const handleRegister = async () => {
  loading.value = true;
  try {
    await authStore.register(form.value);
    alert('Registration successful! Please login.');
    router.push('/login');
  } catch (err) {
    alert('Registration failed: ' + (err.response?.data?.message || err.message));
  } finally {
    loading.value = false;
  }
};
</script>