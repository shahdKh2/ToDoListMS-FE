import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../todo.service';


@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
})

export class TodoItemComponent {
  @Input() todos: Todo[] = [];
  @Output() deleteTaskEvent = new EventEmitter<number>();
  @Output() toggleCompletionStatusEvent = new EventEmitter<{ id: number, isComplete: boolean }>();

  onCheckboxChange(id: number, isComplete: boolean): void {
 
    this.toggleCompletionStatusEvent.emit({ id, isComplete: !isComplete });
  }

  deleteTask(id: number): void {
    this.deleteTaskEvent.emit(id);
  }}
