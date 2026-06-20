<template>
  <div class="max-w-4xl mx-auto px-6 py-10">
    <div v-if="loading" class="text-center py-20 text-xl">Loading profile...</div>
    
    <div v-else-if="profile" class="bg-gray-900 rounded-3xl p-10">
      <div class="flex flex-col md:flex-row gap-10 items-start">
        <div class="w-48 h-48 bg-gray-700 rounded-3xl flex-shrink-0 flex items-center justify-center text-8xl">
          👤
        </div>

        <div class="flex-1">
          <h1 class="text-4xl font-bold">{{ profile.full_name || profile.username }}</h1>
          <p class="text-purple-400 text-2xl">@{{ profile.username }}</p>
          <p class="text-gray-400 mt-1">{{ profile.country }}</p>

          <div v-if="profile.bio" class="mt-8 text-gray-300 text-lg leading-relaxed">
            {{ profile.bio }}
          </div>

          <button 
            @click="startConversation"
            class="mt-10 bg-purple-600 hover:bg-purple-700 px-10 py-4 rounded-2xl font-semibold text-lg flex items-center gap-3 transition">
            💬 Message Artist
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';

const route = useRoute();
const router = useRouter();
const profile = ref(null);
const loading = ref(true);

const fetchUserProfile = async () => {
  const userId = route.params.userId;
  try {
    const res = await api.get(`/users/${userId}`);
    profile.value = res.data;
  } catch (err) {
    console.error(err);
    alert("Could not load this user's profile");
  } finally {
    loading.value = false;
  }
};

const startConversation = async () => {
  if (!profile.value) return;

  try {
    const res = await api.post('/conversations', {
      user2_id: profile.value.id
    });
    alert('Conversation started successfully!');
    router.push(`/messages/${res.data.id}`);
  } catch (err) {
    alert('Failed to start conversation: ' + (err.response?.data?.message || 'Unknown error'));
  }
};

onMounted(fetchUserProfile);
</script>