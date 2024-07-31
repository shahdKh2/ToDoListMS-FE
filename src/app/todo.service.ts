import { Injectable } from '@angular/core';

export interface Todo {
  title: string;
  id:number;
}

@Injectable({
  providedIn: 'root'
})


export class TodoService {
  private todos: Todo[] = []; // -- holds the todos..

  getTodos(): Todo[] {
    return this.todos;
  }

  addTodo(title: string, id:number): void {
    this.todos.push({ title, id });

  }

  deleteTodo(index: number): void {
    this.todos.splice(index, 1);
  }

}
