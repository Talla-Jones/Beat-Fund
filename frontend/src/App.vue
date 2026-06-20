```vue
<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <!-- Navbar -->
    <nav class="relative bg-gray-900 border-b border-gray-800 z-50">
      <div
        class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center"
      >
        <!-- Logo -->
        <h1 class="text-2xl font-bold text-purple-500">
          BeatFund
        </h1>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center gap-6">
          <router-link
            to="/projects"
            class="hover:text-purple-400 transition"
          >
            Projects
          </router-link>

          <router-link
            to="/conversations"
            class="hover:text-purple-400 transition"
          >
            Messages
          </router-link>

          <template v-if="authStore.isAuthenticated">
            <router-link
              to="/projects/create"
              class="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-lg text-sm font-medium transition"
            >
              Create Project
            </router-link>

            <button
              @click="logout"
              class="text-gray-400 hover:text-white transition"
            >
              Logout
            </button>
          </template>

          <template v-else>
            <router-link
              to="/login"
              class="hover:text-purple-400 transition"
            >
              Login
            </router-link>

            <router-link
              to="/register"
              class="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-lg text-sm font-medium transition"
            >
              Register
            </router-link>
          </template>
        </div>

        <!-- Mobile Hamburger -->
        <button
          @click="mobileMenu = !mobileMenu"
          class="md:hidden text-white"
        >
          <svg
            v-if="!mobileMenu"
            xmlns="http://www.w3.org/2000/svg"
            class="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>

          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Dropdown -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="mobileMenu"
          class="absolute top-full left-0 right-0 md:hidden bg-gray-900 border-t border-gray-800 shadow-2xl z-50"
        >
          <div class="flex flex-col gap-4 p-6">
            <router-link
              to="/projects"
              class="hover:text-purple-400"
              @click="mobileMenu = false"
            >
              Projects
            </router-link>

            <router-link
              to="/conversations"
              class="hover:text-purple-400"
              @click="mobileMenu = false"
            >
              Messages
            </router-link>

            <template v-if="authStore.isAuthenticated">
              <router-link
                to="/projects/create"
                class="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-center"
                @click="mobileMenu = false"
              >
                Create Project
              </router-link>

              <button
                @click="mobileLogout"
                class="text-left text-gray-400 hover:text-white"
              >
                Logout
              </button>
            </template>

            <template v-else>
              <router-link
                to="/login"
                class="hover:text-purple-400"
                @click="mobileMenu = false"
              >
                Login
              </router-link>

              <router-link
                to="/register"
                class="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-center"
                @click="mobileMenu = false"
              >
                Register
              </router-link>
            </template>
          </div>
        </div>
      </transition>
    </nav>

    <!-- Router View -->
    <router-view />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "./stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const mobileMenu = ref(false);

const logout = () => {
  authStore.logout();
  router.push("/login");
};

const mobileLogout = () => {
  mobileMenu.value = false;
  logout();
};
</script>
```
