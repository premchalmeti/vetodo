import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs/operators';

import { TodoReminder } from '../../interfaces/todo.reminder';
import { TodoReminders } from '../../mock/todo.reminders';
import { TodoReminderService } from 'src/app/services/todo-reminder.service';
import { Todo } from 'src/app/interfaces/todo';
import { AppConstants } from 'src/app/shared/appConstants';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  todoReminders: TodoReminder[] = [];
  title: string = AppConstants.TITLE;

  constructor(
    private authService: AuthService,
    private router: Router,
    private reminderService: TodoReminderService,
    private webSocketService: WebsocketService
  ) {}

  prependNewReminder(reminder: TodoReminder) {
    this.todoReminders.unshift(reminder);
  }

  ngOnInit(): void {
    this.fetchReminders();
    this.webSocketService.subject.subscribe((ntf) => {
      let ntf_data = JSON.parse(ntf.data);
      console.log(ntf_data);
      this.prependNewReminder(ntf_data.reminder);
    });
  }

  logout(): void {
    this.authService.logout().subscribe((response) => {
      if (response.ok) {
        this.router.navigate(['login']);
      }
    });
  }

  fetchReminders(): void {
    this.reminderService.fetchTodoReminders().subscribe((todoReminders) => {
      this.todoReminders = todoReminders;
    });
  }

  deleteReminder(todoReminder: TodoReminder): void {
    this.reminderService
      .deleteTodoReminder(todoReminder)
      .subscribe((response) => {
        if (response.ok) {
          this.todoReminders = this.todoReminders.filter(
            (t) => t !== todoReminder
          );

          // announce reminder removed to todo components
          this.reminderService.announceTodoReminderRemoved(todoReminder.todo);
        }
      });
  }
}
