import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { TodoReminder } from '../interfaces/todo.reminder';
import { ServiceURL } from '../shared/serviceURL';


@Injectable({
  providedIn: 'root',
})
export class TodoReminderService {
  todoRemindersURL: string = ServiceURL.todoRemindersURL;

  deleteTodoReminder(todoReminder: TodoReminder): Observable<any> {
    return this.http.delete(`${this.todoRemindersURL}${todoReminder.id}/`);
  }

  constructor(private http: HttpClient) {}

  fetchTodoReminders(): Observable<TodoReminder[]> {
    return this.http.get<TodoReminder[]>(this.todoRemindersURL);
  }
}
