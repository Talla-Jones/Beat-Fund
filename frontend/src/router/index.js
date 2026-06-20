import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/HomeView.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/LoginView.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/RegisterView.vue')
    },
    {
        path: '/projects',
        name: 'Projects',
        component: () => import('../views/ProjectsView.vue')
    },
    {
        path: '/projects/create',
        name: 'CreateProject',
        component: () => import('../views/CreateProjectView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/profile/:userId',
        name: 'Profile',
        component: () => import('../views/ProfileView.vue')
    },

    {
        path: '/messages/:conversationId',
        name: 'Messages',
        component: () => import('../views/MessagesView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/conversations',
        name: 'Conversations',
        component: () => import('../views/ConversationsView.vue'),
        meta: { requiresAuth: true }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Navigation Guard
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login');
    } else {
        next();
    }
});

export default router;