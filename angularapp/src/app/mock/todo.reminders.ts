import { TodoReminder } from '../interfaces/todo.reminder';

export const TodoReminders: TodoReminder[] = [
  {
    id: 1,
    todo: {
      id: 1,
      title: 'Verificient Assignment',
      description: 'Complete Angular Todos App By Sunday',
      done: false,
    },
    created_datetime: new Date().toISOString(),
  },
  {
    id: 2,
    todo: {
      id: 2,
      title: 'Delete Confirmations / Warnings',
      description: 'Add delete confirmation on Task delete',
      done: false,
    },
    created_datetime: new Date().toISOString(),
  },
];
