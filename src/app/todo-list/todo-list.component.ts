import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Todo, TodoService } from '../todo.service';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TodoItemComponent, FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit, OnDestroy {

  todoForm: FormGroup;
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  searchQuery: string = '';
  showModal: boolean = false;
  modalTitle: string = '';
  modalMessage: string = '';
  taskToAdd: string = '';
  private destroy$ = new Subject<void>();
  // -----------------------------------------

  constructor(private fb: FormBuilder, private todoService: TodoService) {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required]]
    });
  }

  // -----------------------------------------

  ngOnInit(): void {
    this.loadTasks();
  }
  // -----------------------------------------

  loadTasks(): void {
    this.todoService.getTask().pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      {
        next: (todos) => {
          // debugger
          console.log('Tasks loaded:', todos);
          this.todos = todos;
          this.filteredTodos = this.todos;
          console.log('Tasks loaded:', this.todos);

        },
        error: (error) => {
          console.error('Error loading tasks:', error);
        }
      });
  }
  // -----------------------------------------

  addTask(): void {
    if (this.todoForm.valid) {
      const title = this.todoForm.get('title')?.value;
      this.todoService.addTask(title).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.todoForm.reset();
          this.loadTasks();
        },
        error: (error) => {
          console.error('Error adding task:', error);
        }
      });
    }
  }
  // -----------------------------------------

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.todoService.deleteTask(id).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        }
      });
    }
  }

  // -----------------------------------------

  setCompletionStatus(id: number, isComplete: boolean): void { //*
    const todo = this.todos.find(t => t.id === id);
    this.todoService.setCompletionStatus(id, isComplete).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {

        // console.log(`Task status updated for id=${todo.id}`);
        // console.log(`**After update: id=${todo.id}, title=${todo.title}, isComplete=${todo.is_complete}`);
        // this.loadTasks()
      },
      error: (error) => {
        console.error('Updating task failed:', error);
      }
    });
  }

  onCheckboxChange(id: number, event: Event, todo: Todo): void { //*
    console.log(todo.is_complete + " :before");

    todo.is_complete = !todo.is_complete

    this.setCompletionStatus(id, todo.is_complete);
    console.log(todo.is_complete + " :after");
  }

  //------------------------------

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
  // -----------------------------------------

  confirmAction(): void {
    if (this.taskToAdd) {
      this.todoService.addTask(this.taskToAdd).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.searchQuery = '';
          this.loadTasks();
          this.taskToAdd = '';
        },
        error: (error) => {
          console.error('error :', error);
        }
      });
    }
    this.closeModal();
  }
  // -----------------------------------------

  closeModal(): void {
    this.showModal = false;
    this.taskToAdd = '';
  }
  // -----------------------------------------

  refreshTasks(): void {
    this.searchQuery = ''; // Reset search query
    this.loadTasks();
  }
  // -----------------------------------------

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
