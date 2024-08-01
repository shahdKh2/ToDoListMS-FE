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

  @Input() todo!: { title: string, id: number, isComplete: boolean };
  // -----------------

  @Output() delete = new EventEmitter<void>();

  // -----------------

  @Output() completionStatus = new EventEmitter<boolean>();
  

  
}
