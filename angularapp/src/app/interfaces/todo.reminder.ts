import { Todo } from './todo';

export interface TodoReminder {
  id: number;
  todo: Todo;
  created_datetime: string;
}
