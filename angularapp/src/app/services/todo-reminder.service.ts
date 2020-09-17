import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { TodoReminder } from '../interfaces/todo.reminder';
import { ServiceURL } from '../shared/serviceURL';
import { Todo } from '../interfaces/todo';


@Injectable({
  providedIn: 'root',
})
export class TodoReminderService {
  todoRemindersURL: string = ServiceURL.todoRemindersURL;
  
  // Observable todo sources
  private publishTodoReminderRemoved = new Subject<Todo>();

  // Observable todo streams   
  publishTodoReminderRemoved$ = this.publishTodoReminderRemoved.asObservable();

  deleteTodoReminder(todoReminder: TodoReminder): Observable<any> {
    return this.http.delete(`${this.todoRemindersURL}${todoReminder.id}/`);
  }

  constructor(private http: HttpClient) {}

  fetchTodoReminders(): Observable<TodoReminder[]> {
    return this.http.get<TodoReminder[]>(this.todoRemindersURL);
  }

  announceTodoReminderRemoved(todo: Todo){
    this.publishTodoReminderRemoved.next(todo);
  }

}
