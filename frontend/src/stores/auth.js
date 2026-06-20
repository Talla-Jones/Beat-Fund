import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token
    },

    actions: {
        async login(email, password) {
            const res = await api.post('/auth/login', { email, password });
            this.token = res.data.token;
            this.user = res.data.user;
            localStorage.setItem('token', this.token);
            return res.data;
        },

        async register(userData) {
            const res = await api.post('/auth/register', userData);
            return res.data;
        },

        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
        }
    }
});