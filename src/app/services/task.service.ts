import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: any[] = [];

  constructor() {
    this.loadTasks();
  }

  loadTasks(): void {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    }
  }

  getTasks(): any[] {
    return this.tasks;
  }

  addTask(task: any): void {
    this.tasks.push(task);
    this.saveTasks();
  }

  deleteTask(index: number): void {
    this.tasks.splice(index, 1);
    this.saveTasks();
  }

  updateTask(index: number, updatedTask: any): void {
    this.tasks[index] = updatedTask;
    this.saveTasks();
  }

  public saveTasks(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
} 