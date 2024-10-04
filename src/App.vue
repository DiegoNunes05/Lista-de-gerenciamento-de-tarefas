<template>
  <div id="app" v-if="isAuthChecked">
    <!-- Só renderizamos a NavBar e o conteúdo após a verificação -->
    <NavBar v-if="isLoggedIn" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import { computed, onMounted, ref } from 'vue';
import { auth, user } from './stores/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'vue-router';

// Computamos se o usuário está logado com base no estado
const isLoggedIn = computed(() => !!user.value);

// Criamos uma flag para garantir que o estado foi verificado
const isAuthChecked = ref(false);

// Precisamos do roteador para redirecionar
const router = useRouter();

// No onMounted, verificamos o estado de autenticação
onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      user.value = currentUser;
    } else {
      user.value = null;
      router.push('/login'); // Redireciona para login se não autenticado
    }
    // Indicamos que a autenticação foi verificada
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
