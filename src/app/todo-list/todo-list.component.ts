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

  constructor(private fb: FormBuilder, private todoService: TodoService, private cdr: ChangeDetectorRef) {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.todoService.getTask().pipe(takeUntil(this.destroy$)).subscribe({
      next: (todos) => {
        this.todos = todos;
        this.filteredTodos = this.todos;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
      }
    });
  }

  addTask(): void {
    if (this.todoForm.valid) {
      const title = this.todoForm.get('title')?.value;
      this.todoService.addTask(title).pipe(takeUntil(this.destroy$)).subscribe({
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

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.todoService.deleteTask(id).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        }
      });
    }
  }

  toggleCompletionStatus(event: { id: number, isComplete: boolean }): void {
    this.todoService.setCompletionStatus(event.id, event.isComplete).pipe(takeUntil(this.destroy$)).subscribe({
      next: (updatedTask) => {
        const index = this.todos.findIndex(todo => todo.id === updatedTask.id);
        if (index > -1) {
          this.todos[index].is_complete = updatedTask.is_complete;
          this.filteredTodos = [...this.todos];
          this.cdr.detectChanges();
          this.loadTasks();
        }
      },
      error: (error) => {
        console.error('Updating task failed:', error);
      }
    });
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
      this.todoService.addTask(this.taskToAdd).pipe(takeUntil(this.destroy$)).subscribe({
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

  closeModal(): void {
    this.showModal = false;
    this.taskToAdd = '';
  }

  refreshTasks(): void {
    this.searchQuery = '';
    this.loadTasks();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
