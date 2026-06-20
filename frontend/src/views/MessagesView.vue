<template>
  <div class="max-w-5xl mx-auto h-screen flex flex-col bg-gray-950">
    <!-- Header -->
    <div class="bg-gray-900 border-b border-gray-800 p-4 flex items-center gap-4">
      <button @click="$router.back()" class="text-gray-400 hover:text-white text-xl">
        ←
      </button>
      <div>
        <h2 class="font-semibold text-xl">@{{ otherUser }}</h2>
        <p class="text-green-500 text-sm flex items-center gap-1">
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Online
        </p>
      </div>
    </div>

    <!-- Messages Area -->
    <div id="chat-container" class="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-950">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="isMyMessage(msg) ? 'flex justify-end' : 'flex justify-start'"
      >
        <div
          :class="
            isMyMessage(msg)
              ? 'bg-purple-600 text-white rounded-3xl rounded-br-none max-w-[70%]'
              : 'bg-gray-800 text-white rounded-3xl rounded-bl-none max-w-[70%]'
          "
        >
          <div class="px-5 py-3">
            <p class="text-[17px] leading-relaxed">
              {{ msg.message_text }}
            </p>

            <p class="text-xs opacity-75 mt-1 text-right">
              {{ formatTime(msg.created_at || Date.now()) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="bg-gray-900 p-5 border-t border-gray-800">
      <form @submit.prevent="sendMessage" class="flex gap-3">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Type your message..."
          class="flex-1 bg-gray-800 border border-gray-700 rounded-3xl px-6 py-4 text-white focus:outline-none focus:border-purple-500 placeholder-gray-500"
        />

        <button
          type="submit"
          :disabled="!newMessage.trim()"
          class="bg-purple-600 hover:bg-purple-700 px-10 rounded-3xl font-semibold transition disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';
import { io } from 'socket.io-client';

const route = useRoute();
const conversationId = ref(route.params.conversationId);

const messages = ref([]);
const newMessage = ref('');
const currentUserId = ref(null);
const otherUser = ref('Artist');
const socket = ref(null);

const fetchMessages = async () => {
  try {
    const res = await api.get(`/messages/${conversationId.value}`);
    messages.value = res.data || [];
    scrollToBottom();
  } catch (err) {
    console.error(err);
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;

  // Store input text in a variable
  const messageText = newMessage.value.trim();

  // Create a temporary message that appears immediately
  const tempMessage = {
    id: `temp-${Date.now()}`,
    sender_id: String(currentUserId.value),
    conversation_id: String(conversationId.value),
    message_text: messageText,
    created_at: new Date().toISOString()
  };

  // Show instantly
  messages.value.push(tempMessage);
  scrollToBottom();

  // Clear input
  newMessage.value = '';

  try {
    const res = await api.post('/messages', {
      conversation_id: conversationId.value,
      message_text: messageText
    });

    // Replace temporary message with real DB message
    const index = messages.value.findIndex(
      m => m.id === tempMessage.id
    );

    if (index !== -1 && res.data) {
      messages.value.splice(index, 1, res.data);
    }
  } catch (err) {
    console.error(err);

    // Remove message if sending failed
    messages.value = messages.value.filter(
      m => m.id !== tempMessage.id
    );
  }
};

const isMyMessage = (msg) => {
  return String(msg.sender_id) === String(currentUserId.value);
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const scrollToBottom = () => {
  setTimeout(() => {
    const container = document.getElementById('chat-container');

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, 50);
};

onMounted(() => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      currentUserId.value = String(payload.id);
    } catch (err) {
      console.error(err);
    }
  }

  fetchMessages();

  socket.value = io('http://localhost:5000');

  socket.value.emit(
    'joinConversation',
    conversationId.value
  );

  socket.value.on('newMessage', (data) => {
    if (
      String(data.conversation_id) !==
      String(conversationId.value)
    ) {
      return;
    }

    const exists = messages.value.some(
      m => String(m.id) === String(data.id)
    );

    if (!exists) {
      messages.value.push(data);
      scrollToBottom();
    }
  });
});

onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect();
  }
});
</script>