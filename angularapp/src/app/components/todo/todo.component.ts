import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Todo } from 'src/app/interfaces/todo';
import { TodoService } from 'src/app/services/todo.service';
import { TodoDialogComponent } from '../todo-dialog/todo-dialog.component';
import { DatetimePickerDialogComponent } from '../datetime-picker-dialog/datetime-picker-dialog.component';
import { TodoReminderService } from 'src/app/services/todo-reminder.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit {
  @Input() todo: Todo;
  @Output() remove: EventEmitter<Todo> = new EventEmitter();

  constructor(
    private todoService: TodoService,
    public todoEditDialog: MatDialog,
    private todoReminderService: TodoReminderService
  ) {}

  ngOnInit(): void {
    this.todoReminderService.publishTodoReminderRemoved$.subscribe(
      (todo) => {
        if(todo === this.todo) {}
        this.todo.reminder_datetime = null;
      }
    );
  }

  openEditTodoDialog(): void {
    let todoForUpdate = this.todoService.getTodoForUpdate(this.todo);
    const todoDialog = this.todoEditDialog.open(TodoDialogComponent, {
      width: '500px',
      data: { todo: todoForUpdate },
    });

    todoDialog.afterClosed().subscribe((data) => {
      if (!data) return;
      console.log(`New Todo Added: ${JSON.stringify(data.todo)}`);
      this.update(data.todo);
    });
  }

  openTodoReminderDialog(): void {
    const reminderDialog = this.todoEditDialog.open(
      DatetimePickerDialogComponent,
      {
        width: '500px',
        data: {},
      }
    );

    reminderDialog.afterClosed().subscribe((reminderDateTimeMomentObject) => {
      if (!reminderDateTimeMomentObject) return;
      reminderDateTimeMomentObject.seconds(0);
      console.log(
        `Reminder Added: ${JSON.stringify(reminderDateTimeMomentObject)}`
      );
      this.addReminder(reminderDateTimeMomentObject);
    });
  }

  update(updatedTodo: Todo) {
    this.todoService.updateTodo(updatedTodo).subscribe(
      (response) => {
        if (response.ok) {
          this.todo = updatedTodo;
        } else {
          console.log(response.err_msg || 'Failed to update Task');
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  delete() {
    // add confirm dialog here
    this.todoService.deleteTodo(this.todo).subscribe(
      (response) => {
        if (response.status === 204) {
          // notify parent delete
          this.remove.emit(this.todo);
        } else {
          console.log((response || {}).err_msg || 'Failed to delete Task');
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  setDoneStatus() {
    this.todoService.setDoneStatus(this.todo).subscribe(
      (response) => {
        if (response.ok) {
        } else {
          this.todo.done = !this.todo.done;
          console.log(response.err_msg || 'Failed to update Task Status');
        }
      },
      (error) => {
        this.todo.done = !this.todo.done;
        console.error(error);
      }
    );
  }

  addReminder(reminderDateTime: Date) {
    this.todoService
      .addReminder(this.todo, reminderDateTime)
      .subscribe((response) => {
        if (response.ok) {
          this.todo.reminder_datetime = String(reminderDateTime);
        }
      });
  }
}
