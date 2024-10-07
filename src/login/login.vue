<template>
  <div class="flex min-h-full flex-col justify-center items-center fade-in-up px-6 py-12 lg:px-8">
    <el-card class="w-full max-w-md shadow-md">
      <div class="text-center mb-4 mt-4">
        <h2 class="text-2xl font-bold leading-9 tracking-tight text-[#4a90e2]">Faça seu Login</h2>
      </div>

      <el-form @submit.prevent="login" label-position="top" class="space-y-6">
        <div class="font-semibold text-gray-900">
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900 mb-2">Email</label>
          <el-input v-model="email" id="email" type="email" placeholder="Digite seu email" class="w-full"></el-input>
        </div>

        <el-form-item class="font-semibold text-gray-900">
          <div class="flex items-center justify-between w-full mb-2">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Senha</label>
            <a href="#" @click="openResetPasswordDialog"
              class="text-sm font-semibold text-[#4a90e2] hover:text-[#357ABD]" style="text-decoration: none;">
              Esqueceu sua senha?
            </a>
          </div>
          <el-input v-model="password" id="password" type="password" placeholder="Digite sua senha"
            :show-password="true" class="w-full"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="w-full" native-type="submit">
            Entrar
          </el-button>
        </el-form-item>
      </el-form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Não tem uma conta?
        <router-link to="/register" class="font-semibold text-[#4a90e2] hover:text-[#357ABD]">Cadastre-se</router-link>
      </p>
    </el-card>

    <el-dialog title="Recuperar Senha" v-model="resetDialogVisible" :width="isMobile ? '90%' : '30%'">
      <div class="flex flex-col gap-4">
        <el-input v-model="resetEmail" placeholder="Digite seu email para recuperar a senha"></el-input>
        <div class="justify-between flex w-full flex-row-reverse">
          <span slot="footer" class="dialog-footer">
            <el-button @click="resetDialogVisible = false">Cancelar</el-button>
            <el-button type="primary" @click="handlePasswordReset">Enviar</el-button>
          </span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import { auth } from '../firebase/config';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { user } from '../stores/auth';

export default defineComponent({
  setup() {
    const email = ref('');
    const password = ref('');
    const resetEmail = ref('');
    const resetDialogVisible = ref(false);
    const router = useRouter();

    const login = async () => {
      try {
        const result = await signInWithEmailAndPassword(auth, email.value, password.value);
        user.value = result.user;
        sessionStorage.setItem('isLoggedIn', 'true');

        ElMessage({
          message: 'Você entrou com sucesso!',
          type: 'success',
        });

        router.push('/app');
      } catch (err) {
        if (err instanceof Error) {
          ElMessage.error('Erro: Senha ou email incorretos. Tente novamente.');
        }
      }
    };

    const openResetPasswordDialog = () => {
      resetDialogVisible.value = true;
    };

    const handlePasswordReset = async () => {
      if (!resetEmail.value) {
        ElMessage.warning('Por favor, insira um email válido.');
        return;
      }

      try {
        await sendPasswordResetEmail(auth, resetEmail.value);
        ElMessage.success('Email de recuperação enviado com sucesso!');
        resetDialogVisible.value = false;
      } catch (error) {
        ElMessage.error('Erro ao enviar email de recuperação. Tente novamente.');
        console.error("Erro ao recuperar senha:", error);
      }
    };

    const isMobile = ref(false);

    const checkIsMobile = () => {
      isMobile.value = window.innerWidth <= 768;
    };

    onMounted(() => {
      checkIsMobile();
      window.addEventListener('resize', checkIsMobile);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', checkIsMobile);
    });
    return { email, password, login, resetEmail, resetDialogVisible, openResetPasswordDialog, handlePasswordReset, isMobile };
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
