import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { Task } from '../types/task';

export const useTasks = () => {

  const saveTask = async (task: Task) => {
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        ...task,
        userId: auth.currentUser?.uid,
        createdAt: new Date(),
      });
      console.log("Tarefa adicionada com ID: ", docRef.id);
    } catch (e) {
      console.error("Erro ao adicionar tarefa: ", e);
    }
  };

  return { saveTask };
};
