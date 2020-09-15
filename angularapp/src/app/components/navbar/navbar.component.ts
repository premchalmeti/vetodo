import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

import { TodoReminder } from '../../interfaces/todo.reminder';
import { TodoReminders } from '../../mock/todo.reminders';
import { TodoReminderService } from 'src/app/services/todo-reminder.service';
import { Todo } from 'src/app/interfaces/todo';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Input() title: string;
  todoReminders: TodoReminder[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private reminderService: TodoReminderService
  ) {}

  ngOnInit(): void {
    this.fetchReminders();
  }

  logout(): void {
    this.authService.logout().subscribe((response) => {
      if (response.ok) {
        this.router.navigate(['login']);
      }
    });
  }

  fetchReminders(): void {
    this.reminderService.fetchTodoReminders().subscribe(
      (todoReminders) => {
        this.todoReminders = todoReminders;
      }
    )
  }

  deleteReminder(todoReminder: TodoReminder): void {
    this.reminderService.deleteTodoReminder(todoReminder).subscribe(
      (response) => {
        if(response.ok)
          this.todoReminders = this.todoReminders.filter(t => t !== todoReminder);
      }
    )
  }
}
