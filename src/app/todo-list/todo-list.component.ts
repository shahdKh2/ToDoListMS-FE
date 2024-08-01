import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Todo, TodoService } from '../todo.service';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TodoItemComponent, FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})

// --------------------------------------------

export class TodoListComponent implements OnInit {

  todoForm: FormGroup;
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  searchQuery: string = '';
  showModal: boolean = false;
  modalTitle: string = '';
  modalMessage: string = '';
  taskToAdd: string = '';

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
    this.filteredTodos = this.todos;
  }

  addTask(): void { // ****
    if (this.todoForm.valid) {
      const title = this.todoForm.get('title')?.value;
      const id = new Date().getTime(); // To get a unique id each time..
      this.todoService.addTask(title, id);
      this.todoForm.reset();
      this.loadTasks(); // update list..
    }
  }


  deleteTask(i: number): void {
    if (confirm('Are you sure you want to delete This Task?')) {

      this.todoService.deleteTask(i);
      this.loadTasks();
    }
  }

  setCompletionStatus(i: number): void {
    this.todoService.setCompletionStatus(i);
    // this.todoForm.reset();
    this.loadTasks();
  }

  filterTasks(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredTodos = this.todos.filter(todo => 
      todo.title.toLowerCase().includes(query)
    );

    if (this.filteredTodos.length === 0) {
      this.modalTitle = 'Task Not Found';
      this.modalMessage = 'Task not found. Do you want to add this task?';
      this.showModal = true;
      this.taskToAdd = this.searchQuery;
    }

  }

  confirmAction(): void {
    if (this.taskToAdd) {
      const id = new Date().getTime();
      this.todoService.addTask(this.taskToAdd, id);
      this.searchQuery = '';
      this.loadTasks();
      this.taskToAdd = '';
    }
    this.closeModal();
  }

  closeModal(): void {
    this.showModal = false;
    this.taskToAdd = '';
  }


  refreshTasks(): void {
    this.searchQuery = ''; // Reset search query
    this.loadTasks();
  }
}

