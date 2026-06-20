<template>
  <div class="max-w-7xl mx-auto px-6 py-10">
    <div class="grid grid-cols-1 sm:flex justify-between items-center mb-10">
      <h1 class="text-4xl font-bold">All Projects</h1>
      <router-link 
        to="/projects/create" 
        class="bg-purple-600 hover:bg-purple-700 px-6 py-3 mt-4 sm:mt-0 rounded-2xl font-medium flex items-center gap-2">
        + Create New Project
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-20 text-xl">Loading amazing projects...</div>
    
    <div v-else-if="projects.length === 0" class="text-center py-20">
      <p class="text-2xl text-gray-400">No projects yet. Be the first to create one!</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="project in projects" 
        :key="project.id"
        class="bg-gray-900 rounded-3xl overflow-hidden hover:scale-105 transition-all duration-300 border border-gray-800 hover:border-purple-500"
      >
        <!-- Thumbnail -->
        <div class="h-52 bg-gradient-to-br from-purple-900 to-gray-800 flex items-center justify-center text-7xl">
          🎵
        </div>

        <div class="p-6">
          <h3 class="text-2xl font-semibold mb-3 line-clamp-2">{{ project.title }}</h3>
          
          <p class="text-gray-400 line-clamp-3 mb-6 h-20">
            {{ project.description }}
          </p>

          <!-- Progress -->
          <div class="mb-5">
            <div class="flex justify-between text-sm mb-1">
              <span class="font-medium text-purple-400">
                {{ Number(project.current_amount).toLocaleString() }} FCFA
              </span>
              <span class="text-gray-500">
                {{ Number(project.goal_amount).toLocaleString() }} FCFA
              </span>
            </div>
            <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                class="h-full bg-purple-600 rounded-full transition-all"
                :style="{ width: progressPercentage(project) + '%' }">
              </div>
            </div>
          </div>

          <!-- Creator -->
          <div class="flex justify-between items-center pt-4 border-t border-gray-800">
            <router-link 
              :to="`/profile/${project.user_id}`"
              class="flex items-center gap-2 text-purple-400 hover:text-purple-300 hover:underline font-medium"
            >
              @{{ project.username }}
            </router-link>
            
            <span class="text-xs text-gray-500">{{ project.status || 'active' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const projects = ref([]);
const loading = ref(true);

const fetchProjects = async () => {
  try {
    const res = await api.get('/projects');
    projects.value = res.data;
  } catch (err) {
    console.error('Failed to fetch projects:', err);
  } finally {
    loading.value = false;
  }
};

const progressPercentage = (project) => {
  if (!project.goal_amount) return 0;
  return Math.min(Math.round((project.current_amount / project.goal_amount) * 100), 100);
};

onMounted(fetchProjects);
</script>