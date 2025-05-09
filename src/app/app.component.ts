import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService } from './services/task.service';
import { Task } from './models/task.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  todoTasks: Task[] = [];
  doneTasks: Task[] = [];
  newTaskTitle = '';
  newTaskDescription = '';
  editingTask: Task | null = null;

  constructor(private taskService: TaskService) {
    this.taskService.getTasks().subscribe(tasks => {
      this.todoTasks = tasks.filter(task => task.status === 'todo');
      this.doneTasks = tasks.filter(task => task.status === 'done');
    });
  }

  addTask() {
    if (this.newTaskTitle.trim()) {
      this.taskService.addTask({
        title: this.newTaskTitle,
        description: this.newTaskDescription,
        status: 'todo'
      });
      this.newTaskTitle = '';
      this.newTaskDescription = '';
    }
  }

  startEditing(task: Task) {
    this.editingTask = { ...task };
  }

  saveEdit() {
    if (this.editingTask) {
      this.taskService.updateTask(this.editingTask);
      this.editingTask = null;
    }
  }

  cancelEdit() {
    this.editingTask = null;
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id);
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const task = event.container.data[event.currentIndex];
      task.status = event.container.id === 'doneList' ? 'done' : 'todo';
      this.taskService.updateTask(task);
    }
  }
} 