<template>
  <div class="flex min-h-full flex-col justify-center items-center fade-in-up px-6 py-12 lg:px-8">
    <el-card class="w-full max-w-md shadow-md">
      <div class="text-center mb-4 mt-4">
        <h2 class="text-2xl font-bold leading-9 tracking-tight text-[#4a90e2]">Cadastre-se</h2>
      </div>

      <el-form @submit.prevent="handleRegister" label-position="top" class="space-y-6">
        <el-form-item label="Nome" required class="font-semibold text-gray-900">
          <el-input v-model="name" placeholder="Digite seu nome"></el-input>
        </el-form-item>

        <el-form-item label="Email" required class="font-semibold text-gray-900">
          <el-input v-model="email" type="email" placeholder="Digite seu email"></el-input>
        </el-form-item>

        <el-form-item label="Senha" required class="font-semibold text-gray-900">
          <el-input v-model="password" type="password" placeholder="Digite sua senha" show-password></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="w-full" native-type="submit">
            Entrar
          </el-button>
        </el-form-item>
      </el-form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Já tem uma conta?
        <router-link to="/login" class="font-semibold text-[#4a90e2] hover:text-[#357ABD]">Fazer login</router-link>
      </p>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

export default defineComponent({
  setup() {
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const router = useRouter();

    const handleRegister = async () => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);

        if (userCredential.user) {
          await updateProfile(userCredential.user, {
            displayName: name.value,
          });
        }

        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          name: name.value,
          email: email.value,
          createdAt: new Date(),
        });

        ElMessage({
          message: 'Você se registrou com sucesso!',
          type: 'success',
        });

        router.push('/app');
      } catch (error) {
        ElMessage.error('Erro ao se registrar. Tente novamente.');
        console.error("Erro ao se registrar:", error);
      }
    };

    return { name, email, password, handleRegister };
  },
});
</script>

<style scoped>
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
