import { ref, Ref } from 'vue';
import { auth } from '../firebase/config'; 
import { User, signInWithEmailAndPassword, signOut } from 'firebase/auth'; 

const user: Ref<User | null> = ref(null);

// Função de login usando email e senha
const login = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    user.value = result.user;
    console.log("Usuário logado:", user.value);
  } catch (err) {
    if (err instanceof Error) {
      console.error("Erro ao fazer login:", err.message);
    } else {
      console.error('Erro desconhecido ao fazer login');
    }
  }
};

// Função de logout
const logout = async () => {
  try {
    await signOut(auth);
    user.value = null;
    console.log("Usuário desconectado");
  } catch (err) {
    if (err instanceof Error) {
      console.error("Erro ao fazer logout:", err.message);
    } else {
      console.error('Erro desconhecido ao fazer logout');
    }
  }
};

// Exporta as variáveis e funções
export { auth, user, login, logout };
