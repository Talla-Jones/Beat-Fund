<template>
  <div class="max-w-4xl mx-auto py-10 px-6">
    <h1 class="text-4xl font-bold mb-8">Messages</h1>

    <div v-if="loading" class="text-center py-20">Loading conversations...</div>

    <div v-else-if="conversations.length === 0" class="text-center py-20 text-gray-400">
      <p class="text-2xl">No conversations yet</p>
      <p class="mt-3">Start messaging artists from their profile</p>
    </div>

    <div v-else class="space-y-3">
      <router-link
        v-for="conv in conversations"
        :key="conv.id"
        :to="`/messages/${conv.id}`"
        class="block bg-gray-900 hover:bg-gray-800 rounded-3xl p-5 transition flex gap-4 items-center"
      >
        <div class="w-14 h-14 bg-gray-700 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl">
          👤
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between">
            <h3 class="font-semibold text-lg">@{{ conv.other_user }}</h3>
            <span class="text-xs text-gray-500">{{ formatDate(conv.created_at) }}</span>
          </div>
          <p class="text-gray-400 text-sm truncate">{{ conv.last_message || "Start chatting" }}</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const conversations = ref([]);
const loading = ref(true);

const fetchConversations = async () => {
  try {
    const res = await api.get('/conversations');
    conversations.value = res.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' });
};

onMounted(fetchConversations);
</script>