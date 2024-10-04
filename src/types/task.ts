export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}
