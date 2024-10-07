<template>
  <div id="app" v-if="isAuthChecked">
    <NavBar v-if="isLoggedIn && !isOnLoginPage" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { auth, user } from './stores/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { useRoute, useRouter } from 'vue-router';

const isLoggedIn = computed(() => !!user.value);
const isAuthChecked = ref(false);
const isOnLoginPage = computed(() => route.path === '/login' || route.path === '/register');
const router = useRouter();
const route = useRoute();

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      user.value = currentUser;
    } else {
      user.value = null;
      router.push('/login');
    }
    isAuthChecked.value = true;
  });
});
</script>

<style scoped>
#app {
  background: linear-gradient(to bottom, #add8e6 15%, white 35%);
  min-height: 100vh;
}
</style>
