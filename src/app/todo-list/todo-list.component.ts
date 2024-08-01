import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Todo, TodoService } from '../todo.service';
import { TodoItemComponent } from '../todo-item/todo-item.component';
// import { FormsModule } from '@angular/forms';
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
  todos: Todo[] = [];


  // ============================
  // fb: form builder
  constructor(private fb: FormBuilder, private todoService: TodoService) {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required]]
    });

  }
  // ============================
  ngOnInit(): void {
    this.loadTasks();
  }
  saveTasksToLocalStorage(): void {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }
  
  loadTasks(): void {
    this.todos = this.todoService.getTask();
  }

  addTask(): void { // ****
    if (this.todoForm.valid) {
      const title = this.todoForm.get('title')?.value;
      const id = 0;
      this.todoService.addTask(title, id);
      this.todoForm.reset();
      this.loadTasks(); // update list..
    }
  }

  deleteTask(i: number): void {
    if (confirm('Are you sure you want to delete it??')) {

      this.todoService.deleteTask(i);
      this.loadTasks();
    }
  }

  setCompletionStatus(i: number): void {
    this.todoService.setCompletionStatus(i);
    this.loadTasks();
  }


}

