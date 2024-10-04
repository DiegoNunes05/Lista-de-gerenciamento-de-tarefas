<template>
  <div class="flex min-h-full flex-col justify-center items-center fade-in-up px-6 py-12 lg:px-8">
    <div class="flex flex-col border rounded-md shadow-md w-full max-w-md px-8 py-8 bg-white"> 
      <div class="sm:mx-auto sm:w-full sm:max-w-lg">
        <h2 class="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-[#4a90e2]">Cadastre-se</h2>
      </div>

      <div class="mt-5 sm:mx-auto sm:w-full sm:max-w-lg">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Name</label>
            <div class="mt-2">
              <input v-model="name" id="name" name="name" type="text" autocomplete="name" required class="block pl-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
            <div class="mt-2">
              <input v-model="email" id="email" name="email" type="email" autocomplete="email" required class="block pl-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Senha</label>
            </div>
            <div class="mt-2">
              <input v-model="password" id="password" name="password" type="password" autocomplete="current-password" required class="block pl-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            </div>
          </div>

          <div>
            <button type="submit" class="flex w-full justify-center rounded-md bg-[#4a90e2] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#357ABD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#357ABD]">
              Entrar
            </button>
          </div>
        </form>
        <p class="mt-10 text-center text-sm text-gray-500">
          Já tem uma conta?
        <router-link to="/login" class="font-semibold text-[#4a90e2] hover:text-[#357ABD]">Fazer login</router-link>
      </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { auth, db } from '../firebase/config'; 
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const router = useRouter();

    const handleRegister = async () => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        
        console.log("Usuário registrado com sucesso", userCredential.user);

        if (userCredential.user) {
        await updateProfile(userCredential.user, {
            displayName: name.value,
        });
        console.log("Perfil do usuário atualizado com sucesso.");
        }

        await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: name.value,
        email: email.value,
        createdAt: new Date(),
        });
        
        console.log("Dados salvos no Firestore com sucesso.");
        router.push('/app');
        } catch (error) {
            console.error("Erro ao se registrar:", error);
            alert("Erro ao se Registrar, tente novamente");
        }
    };

    return { name, email, password, handleRegister };
  },
});
</script>

<style>
  .fade-in-up {
  animation: fadeInUp 0.5s ease-in-out;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>
