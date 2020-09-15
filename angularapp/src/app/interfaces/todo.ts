export interface Todo {
  id?: number;
  title: string;
  description: string;
  done: boolean;
  reminder_datetime?: string;
}
