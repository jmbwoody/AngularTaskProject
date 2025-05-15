import { Component, OnInit } from '@angular/core';
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
export class TasksComponent implements OnInit {
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

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.tasks = [...this.taskService.getTasks()];
  }

  addTask(): void {
    if (this.newTask.title.trim()) {
      const taskWithId = {
        ...this.newTask,
        id: Date.now().toString(),
        completed: false
      };
      this.taskService.addTask(taskWithId);
      this.newTask = {
        id: '',
        title: '',
        description: '',
        completed: false
      };
      this.tasks = [...this.taskService.getTasks()];
    }
  }

  toggleTaskCompletion(task: Task) {
    task.completed = !task.completed;
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.taskService.updateTask(index, task);
      this.tasks = [...this.taskService.getTasks()];
    }
  }

  editTask(task: Task) {
    this.editingTask = { ...task };
    this.showDialog = true;
  }

  saveEditedTask() {
    if (this.editingTask && this.editingTask.title.trim()) {
      const index = this.tasks.findIndex(t => t.id === this.editingTask!.id);
      if (index !== -1) {
        this.taskService.updateTask(index, this.editingTask);
        this.tasks = [...this.taskService.getTasks()];
      }
      this.showDialog = false;
      this.editingTask = null;
    }
  }

  deleteTask(task: Task) {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.taskService.deleteTask(index);
      this.tasks = [...this.taskService.getTasks()];
    }
  }

  onDragStart(event: DragEvent, task: Task, index: number) {
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
        this.taskService.updateTask(index, this.tasks[index]);
        this.tasks = [...this.taskService.getTasks()];
      }
      this.draggedTask = null;
    }
  }
} 