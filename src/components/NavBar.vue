<template>
  <nav class="!bg-transparent border-b-[1px]">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="flex flex-1 items-center justify-start">
          <div class="flex flex-shrink-0 items-center ml-3 md:ml-0 lg:ml-0">
            <el-icon size="25" color="white">
              <Tickets />
            </el-icon>
          </div>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <span class="text-white mr-4">Bem-vindo, {{ displayName }}!</span>
          <el-dropdown>
            <button
              class="custom-button-logout flex items-center rounded-full bg-transparent border p-2 text-gray-400 hover:text-white"
            >
              <span class="sr-only">Menu</span>
              <el-icon>
                <Menu />
              </el-icon>
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click.native="handleLogout">
                  Sair
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <div class="sm:hidden" id="mobile-menu">
      <div class="space-y-1 px-2 pt-2">
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { user, logout } from '../stores/auth';
import { useRouter } from 'vue-router';
import { Tickets, Menu } from '@element-plus/icons-vue';

export default defineComponent({
  setup() {
    const router = useRouter();

    const displayName = computed(() => user.value?.displayName || 'Usuário');

    const handleLogout = async () => {
      await logout();
      router.push('/login');
    };

    return { displayName, handleLogout };
  }
});
</script>

<style scoped>
nav {
  background-color: #2d3748; 
}

img {
  max-height: 100%; 
}

.custom-button-logout{
  outline: none;
  box-shadow: none;
}
</style>
