import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

// import { TodoListComponent } from './todo-list/todo-list.component';
// import { TodoItemComponent } from './todo-item/todo-item.component';
import { TodoService } from './todo.service';
import {FormsModule} from '@angular/forms'; 
export const appConfig: ApplicationConfig = {
  providers:
    [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(), TodoService
    ]




};
