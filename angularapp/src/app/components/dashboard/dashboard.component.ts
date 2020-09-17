import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { Todo } from '../../interfaces/todo';
import { TodoService } from '../../services/todo.service';
import { AuthService } from '../../services/auth.service';
import { TodoDialogComponent } from '../todo-dialog/todo-dialog.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  todos: Todo[];

  constructor(
    public authService: AuthService,
    private todoService: TodoService,
    public todoDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.todoService.fetchTodos().subscribe((todos) => {
      this.todos = todos;
    });
  }

  addNewTodo(newTodo: Todo): void {
    this.todoService.createTodo(newTodo).subscribe((response) => {
      if (response.ok) {
        newTodo.id = response.todo_id;
        this.todos.push(newTodo);
      }
    });
  }

  openNewTodoDialog(): void {
    let newTodo: Todo = this.todoService.getNewTodoObj();
    const todoDialogRef = this.todoDialog.open(TodoDialogComponent, {
      width: '500px',
      data: { todo: newTodo },
    });

    todoDialogRef.afterClosed().subscribe((data) => {
      if (!data) return;
      console.log(`New Todo Added: ${JSON.stringify(data.todo)}`);
      this.addNewTodo(data.todo);
    });
  }

  removeTodo(deletedTodo: Todo): void {
    this.todos = this.todos.filter((t) => t !== deletedTodo);
  }
}
