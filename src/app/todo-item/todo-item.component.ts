import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
})

export class TodoItemComponent {

  @Input() todo!: { title: string, id: number, is_complete: boolean };

  // -----------------

  @Output() delete = new EventEmitter<void>();

  // -----------------
  @Output() completionStatus = new EventEmitter<{ id: number, is_complete: boolean }>();

  onCheckboxChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.completionStatus.emit({ id: this.todo.id, is_complete: target.checked });

  }
  
}
