import { Injectable } from '@angular/core';

export interface Todo {
  title: string;
  id: number;
  isComplete: boolean;
}

@Injectable({
  providedIn: 'root'
})

// =================================
export class TodoService {
  private todos: Todo[] = []; // -- holds the todos..

  getTask(): Todo[] {
    return this.todos;
  }

  addTask(title: string, id: number): void {
    this.todos.push({ title, id, isComplete: false });

  }

  deleteTask(i: number): void {
    this.todos.splice(i, 1);
  }

  isCompletion(i: number): void {
    this.todos[i].isComplete = !this.todos[i].isComplete;
  }


}
