<template>
  <div class="max-w-2xl mx-auto px-6 py-12">
    <h1 class="text-4xl font-bold mb-8">Create New Project</h1>

    <form @submit.prevent="handleSubmit" class="space-y-6 bg-gray-900 p-8 rounded-3xl">
      <div>
        <label class="block text-gray-400 mb-2">Project Title</label>
        <input
          v-model="form.title"
          type="text"
          required
          class="w-full px-5 py-4 bg-gray-800 border border-gray-700 rounded-2xl text-white focus:outline-none focus:border-purple-500"
          placeholder="e.g. My Debut Afrobeats Album"
        />
      </div>

      <div>
        <label class="block text-gray-400 mb-2">Description</label>
        <textarea
          v-model="form.description"
          rows="6"
          required
          class="w-full px-5 py-4 bg-gray-800 border border-gray-700 rounded-2xl text-white focus:outline-none focus:border-purple-500"
          placeholder="Tell people about your project..."
        ></textarea>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div>
          <label class="block text-gray-400 mb-2">Goal Amount (₦)</label>
          <input
            v-model="form.goal_amount"
            type="number"
            required
            class="w-full px-5 py-4 bg-gray-800 border border-gray-700 rounded-2xl text-white focus:outline-none focus:border-purple-500"
            placeholder="500000"
          />
        </div>
        <div>
          <label class="block text-gray-400 mb-2">Deadline</label>
          <input
            v-model="form.deadline"
            type="date"
            required
            class="w-full px-5 py-4 bg-gray-800 border border-gray-700 rounded-2xl text-white focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-2xl font-semibold text-lg transition"
      >
        {{ loading ? 'Creating Project...' : 'Create Project' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();

const form = ref({
  title: '',
  description: '',
  goal_amount: '',
  deadline: ''
});

const loading = ref(false);

const handleSubmit = async () => {
  loading.value = true;
  try {
    await api.post('/projects', form.value);
    alert('Project created successfully!');
    router.push('/projects');
  } catch (err) {
    alert('Failed to create project: ' + (err.response?.data?.message || err.message));
  } finally {
    loading.value = false;
  }
};
</script>