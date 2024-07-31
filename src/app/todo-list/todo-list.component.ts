import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Todo, TodoService } from '../todo.service';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TodoItemComponent],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})

// --------------------------------------------

export class TodoListComponent implements OnInit {
  todoForm: FormGroup;
  todos: Todo [] = [];


// ============================
  // fb: form builder
  constructor(private fb: FormBuilder, private todoService: TodoService) {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required]]
    });

  }
// ============================
  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todos = this.todoService.getTodos();
  }

  addTask(): void { // ****
    if (this.todoForm.valid) {
      const title = this.todoForm.get('title')?.value;
      const id=0;
      this.todoService.addTodo(title,id);
      this.loadTodos(); // update list..
    }
  }

  deleteTodo(i: number): void {
    debugger
      this.todoService.deleteTodo(i);
      this.loadTodos();
    
  }
}
