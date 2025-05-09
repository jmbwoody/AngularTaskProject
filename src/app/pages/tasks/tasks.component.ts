import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { FilterTasksPipe } from '../../pipes/filter-tasks.pipe';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    CardModule,
    DialogModule,
    FilterTasksPipe
  ],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent {
  tasks: Task[] = [];
  newTask: Task = {
    id: '',
    title: '',
    description: '',
    completed: false
  };
  editingTask: Task | null = null;
  showDialog = false;
  draggedTask: Task | null = null;

  constructor(private taskService: TaskService) {
    this.tasks = this.taskService.getTasks();
  }

  addTask() {
    if (this.newTask.title.trim()) {
      this.tasks = this.taskService.addTask({ ...this.newTask });
      this.newTask = {
        id: '',
        title: '',
        description: '',
        completed: false
      };
    }
  }

  toggleTaskCompletion(task: Task) {
    task.completed = !task.completed;
    this.tasks = this.taskService.updateTask(task);
  }

  editTask(task: Task) {
    this.editingTask = { ...task };
    this.showDialog = true;
  }

  saveEditedTask() {
    if (this.editingTask && this.editingTask.title.trim()) {
      this.tasks = this.taskService.updateTask(this.editingTask);
      this.showDialog = false;
      this.editingTask = null;
    }
  }

  deleteTask(task: Task) {
    this.tasks = this.taskService.deleteTask(task);
  }

  onDragStart(event: DragEvent, task: Task) {
    this.draggedTask = task;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    const target = event.currentTarget as HTMLElement;
    target.classList.add('drag-over');
  }

  onDragLeave(event: DragEvent) {
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
  }

  onDrop(event: DragEvent, isDone: boolean) {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over');

    if (this.draggedTask) {
      const index = this.tasks.findIndex(t => t.id === this.draggedTask!.id);
      if (index !== -1) {
        this.tasks[index].completed = isDone;
        this.tasks = this.taskService.updateTask(this.tasks[index]);
      }
      this.draggedTask = null;
    }
  }
} 