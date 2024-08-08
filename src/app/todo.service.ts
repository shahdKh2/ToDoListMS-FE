import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Todo {
  title: string;
  id: number;
  is_complete: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:8080/api/v1/tasks';
  private usedIds: Set<number> = new Set();


  // -----------------------------------------

  constructor(private http: HttpClient) { }
  // -----------------------------------------

  private generateId(): number {
    for (let id = 1; id <= 100; id++) {
      if (!this.usedIds.has(id)) {
        this.usedIds.add(id);
        return id;
      }
    }
    throw new Error('ID Not Valid');
  }

  // -----------------------------------------

  getTask(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.apiUrl}/getTasks`);
  }

  // -----------------------------------------

  addTask(title: string): Observable<void> {
    const newTodo = { id: this.generateId(), title, is_complete: false };
    return this.http.post<void>(`${this.apiUrl}/saveTask`, newTodo)
      .pipe(
        catchError(this.handleError<void>('addTask'))
      );
  }
  // -----------------------------------------

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteTask/${id}`);
  }
  // -----------------------------------------


  setCompletionStatus(id: number, is_complete: boolean): Observable<Todo> {//* 
    return this.http.put<Todo>(`${this.apiUrl}/updateTask/${id}`, { is_complete });
    }


  // -----------------------------------------


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
