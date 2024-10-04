<template>
  <div class="task-manager mt-8 flex flex-col gap-4 max-w-[800px] w-[90%] md:w-[90%] lg:w-full m-auto fade-in-up">
    <h1 class="task-title mb-3 text-center fade-down text-gray-500 text-[1.6rem] md:text-3xl lg:text-4xl">Gerenciamento
      de Tarefas</h1>
    <div class="task-form flex flex-col gap-2 p-4 border rounded-lg bg-white shadow-md">
      <input v-model="currentTask.title" type="text" placeholder="Título da tarefa"
        class="task-input p-2 border rounded-lg">
      <textarea v-model="currentTask.description" placeholder="Descrição da tarefa"
        class="task-input p-2 border rounded-lg"></textarea>
      <el-button @click="saveTask" class="self-start bg-blue-500 text-white">{{ isEditing ? 'Atualizar Tarefa' :
        'Adicionar Tarefa' }}</el-button>
    </div>

    <div v-if="isMobile">
      <TransitionGroup name="slide-fade" tag="div">
        <div v-for="task in tasks" :key="task.id"
          class="task-item p-4 flex-col items-center rounded-lg justify-between shadow-md border mb-4">
          <div class="task-details flex flex-row text-end justify-between">
            <span class="task-title text-md text-start items-end">{{ task.title }}</span>
            <small>{{ formatMobileDate(task.createdAt) }}</small>
          </div>
          <div class="flex flex-row justify-between mt-3">
            <div class="flex flex-col max-w-56">
              <span class="task-status">Status: <small class="text-sm text-gray-700">{{ task.status }}</small></span>
              <span class="task-description mt-1">Descrição: <small class="text-sm text-gray-700">{{ task.description }}</small></span>
              <small v-if="task.updatedAt" class="block text-gray-400">
                Última atualização: {{ formatMobileDate(task.updatedAt) }}
              </small>
            </div>
            <div class="flex flex-col gap-1 items-end">
              <el-button @click="editTask(task)" icon circle class="edit-button">
                <el-icon>
                  <Edit />
                </el-icon>
              </el-button>
              <el-button @click="toggleStatus(task)" icon circle
                :class="task.status === 'Pendente' ? 'status-button-incomplete' : 'status-button-complete'">
                <el-icon v-if="task.status === 'Pendente'">
                  <CloseBold />
                </el-icon>
                <el-icon v-else>
                  <Check />
                </el-icon>
              </el-button>
              <el-button @click="deleteTask(task.id)" icon circle class="delete-button">
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
    <!-- Modelo web -->
    <div v-else>
      <TransitionGroup name="slide-fade" tag="div">
        <div v-for="task in tasks" :key="task.id"
          class="task-item p-4 flex-col items-center rounded-lg justify-between shadow-md border mb-4">
          <div class="task-details flex flex-row text-center justify-between">
            <span class="task-title text-start">{{ task.title }}</span>
            <small>{{ formatDate(task.createdAt) }}</small>
          </div>
          <div class="flex flex-row justify-between mt-3">
            <div class="flex flex-col">
              <span class="task-status">Status: <small class="text-sm text-gray-700">{{ task.status }}</small></span>
              <span class="task-description mt-1">Descrição: <small class="text-sm text-gray-700">{{ task.description }}</small></span>
              <small v-if="task.updatedAt" class="block text-gray-400">
                Última atualização: {{ formatDate(task.updatedAt) }}
              </small>
            </div>
            <div class="task-actions flex gap-0 items-center">
              <el-button @click="editTask(task)" icon circle class="edit-button">
                <el-icon>
                  <Edit />
                </el-icon>
              </el-button>
              <el-button @click="toggleStatus(task)" icon circle
                :class="task.status === 'Concluída' ? 'status-button-incomplete' : 'status-button-complete'">
                <el-icon v-if="task.status === 'Concluída'">
                  <CloseBold />
                </el-icon>
                <el-icon v-else>
                  <Check />
                </el-icon>
              </el-button>
              <el-button @click="deleteTask(task.id)" icon circle class="delete-button">
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import { Delete, Edit, Check, CloseBold } from '@element-plus/icons-vue';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export default defineComponent({
  components: {
    Delete,
    Edit,
    Check,
    CloseBold
  },
  setup() {
    const tasks = ref<Task[]>([]);
    const currentTask = reactive<Task>({
      id: '',
      title: '',
      description: '',
      status: 'Pendente',
      createdAt: null,
      updatedAt: null,
    });
    const isEditing = ref(false);
    const user = auth.currentUser;

    const fetchTasks = async () => {
      if (user) {
        const tasksRef = collection(db, 'users', user.uid, 'tasks');
        const querySnapshot = await getDocs(tasksRef);

        tasks.value = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt ? data.createdAt.toDate() : null,
            updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
          } as Task;
        });
      }
    };

    const saveTask = async () => {
      if (!currentTask.title || !currentTask.description) {
        alert('Tanto o título quanto a descrição são obrigatórios');
        return;
      }

      const now = new Date();

      if (isEditing.value) {
        const taskRef = doc(db, 'users', user!.uid, 'tasks', currentTask.id);
        await updateDoc(taskRef, {
          title: currentTask.title,
          description: currentTask.description,
          status: currentTask.status,
          updatedAt: now,
        });
        isEditing.value = false;
      } else {
        await addDoc(collection(db, 'users', user!.uid, 'tasks'), {
          title: currentTask.title,
          description: currentTask.description,
          status: 'pendente',
          createdAt: now,
          updatedAt: now,
        });
      }

      resetCurrentTask();
      await fetchTasks();
    };

    const editTask = (task: Task) => {
      Object.assign(currentTask, task);
      isEditing.value = true;
    };

    const deleteTask = async (taskId: string) => {
      const taskRef = doc(db, 'users', user!.uid, 'tasks', taskId);
      await deleteDoc(taskRef);
      await fetchTasks(); // Recarregar tarefas após exclusão
    };

    const toggleStatus = async (task: Task) => {
      const taskRef = doc(db, 'users', user!.uid, 'tasks', task.id);
      const newStatus = task.status === 'Concluída' ? 'Pendente' : 'Concluída';
      await updateDoc(taskRef, { status: newStatus });
      await fetchTasks(); // Recarregar tarefas após alteração de status
    };

    const resetCurrentTask = () => {
      currentTask.id = '';
      currentTask.title = '';
      currentTask.description = '';
      currentTask.status = 'Pendente';
      currentTask.createdAt = null;
    };

    const formatDate = (date: Date | null) => {
      return date
        ? new Date(date).toLocaleDateString('pt-BR', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }) +
        ' às ' +
        new Date(date).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })
        : '';
    };

    const formatMobileDate = (date: Date | null) => {
      return date
        ? new Date(date).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
        : '';
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

    onMounted(fetchTasks);

    return { tasks, currentTask, saveTask, editTask, deleteTask, toggleStatus, isEditing, formatDate, isMobile, formatMobileDate };
  }
});
</script>

<style scoped>
.task-item {
  background-color: #e6f2ff;
  border: 1px solid #cce5ff;
}

.task-details {
  border-radius: var(--el-border-radius-base);
  display: flex;
  align-items: center; 
  justify-content: space-between;
  width: 100%; 
}

.task-title {
  font-weight: bold;
  font-family: 'Inter', sans-serif;
}

.delete-button {
  color: red;
}

.edit-button {
  color: cadetblue;
  margin: 0 0 0 12px;
}

.status-button {
  color: green;
}

.status-button-complete {
  color: green;
}

.status-button-incomplete {
  color: red;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

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


.fade-down {
  animation: fadeDown 0.5s ease-in-out;
}

@keyframes fadeDown {
  0% {
    opacity: 0;
    transform: translateY(-50px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
